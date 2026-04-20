import * as osu from "osu-api-v2-js";
import { env } from "$env/dynamic/private";
import { measurementsTable } from "../db/schema.ts";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

let _db: ReturnType<typeof drizzle> | null = null;
// Lazy initialization of the database
function getDb() {
    if (_db) return _db;
    _db = drizzle({
        connection: env.DATABASE_FILE ?? "file:/data/timeseries.db",
    });
    return _db;
}

let apiClientPromise: ReturnType<typeof osu.API.createAsync> | null = null;
function getApiClient() {
    const clientId = Number.parseInt(env.OSU_API_CLIENT_ID ?? "", 10);
    const clientSecret = env.OSU_API_CLIENT_SECRET;

    if (!Number.isFinite(clientId)) {
        throw new Error("Missing OSU_API_CLIENT_ID");
    }

    if (!clientSecret) {
        throw new Error("Missing OSU_API_CLIENT_SECRET");
    }

    apiClientPromise ??= osu.API.createAsync(clientId, clientSecret);
    return apiClientPromise;
}

let latestData: typeof measurementsTable.$inferSelect | null = null;
let latestCheck: number = 0;

setInterval(async () => {
    if (!latestData || latestCheck < Date.now() - 300000) {
        console.log("Triggered an update");
        latestCheck = Date.now();
        latestData = await getChangelogDataApi(latestCheck);
    }
    console.log("automatic update");
}, 150000);

type ChangelogData = {
    timestamp: number;
    stable: number;
    lazer: number;
};

export async function getChangelogData() {
    if (!latestData || latestCheck < Date.now() - 300000) {
        console.log("Triggered an update");
        latestCheck = Date.now();
        let data: ChangelogData | null = null;
        const timeout = (ms: number) =>
            new Promise<never>((_, reject) =>
                setTimeout(
                    () => reject(new Error("Changelog request timed out")),
                    ms,
                ),
            );
        try {
            data = await Promise.race<ChangelogData | null>([
                getChangelogDataApi(latestCheck),
                timeout(1000),
            ]);
        } catch (err) {
            console.log(err);
            return latestData;
        }
        if (data !== null) {
            latestData = data;
        }
    }
    return latestData;
}

export async function getChangelogDataApi(timestamp: number): Promise<{
    timestamp: number;
    stable: number;
    lazer: number;
} | null> {
    let changelogs: Array<{ name: string; user_count: number }> = [];
    try {
        const client = await getApiClient();
        changelogs = await client.getChangelogStreams();
    } catch (err) {
        console.log("Failed to fetch changelog data", err);
        return null;
    }
    const stable =
        (changelogs.find((i) => i.name === "stable40")?.user_count ?? 0) +
        (changelogs.find((i) => i.name === "cuttingedge")?.user_count ?? 0);

    const lazer =
        (changelogs.find((i) => i.name === "lazer")?.user_count ?? 0) +
        (changelogs.find((i) => i.name === "tachyon")?.user_count ?? 0);

    await getDb().insert(measurementsTable).values({
        timestamp: timestamp,
        stable: stable,
        lazer: lazer,
    });
    return { timestamp: timestamp, stable: stable, lazer: lazer };
}

export async function getLazerAbsolutePeak(): Promise<ChangelogData> {
    const result = await getDb()
        .select()
        .from(measurementsTable)
        .where(
            sql`${measurementsTable.lazer} = (SELECT MAX(${measurementsTable.lazer}) FROM ${measurementsTable})`,
        );

    const peakLazer = result[0] as ChangelogData;
    return peakLazer;
}

export async function getLazerRelativePeak() {
    const result = await getDb()
        .select()
        .from(measurementsTable)
        .where(
            sql`(CAST(${measurementsTable.lazer} AS REAL) / (${measurementsTable.stable} + ${measurementsTable.lazer})) = (
              SELECT MAX(CAST(lazer AS REAL) / (stable + lazer))
              FROM ${measurementsTable}
              WHERE (stable + lazer) > 0
            )`,
        );

    const peakLazer = result[0];
    return peakLazer;
}

export async function getLazerPeakNearTopPercentage(): Promise<ChangelogData> {
    const maxPercentageResult = await getDb()
        .select({
            maxPercentage: sql<number>`MAX(CAST(${measurementsTable.lazer} AS REAL) / (${measurementsTable.stable} + ${measurementsTable.lazer}))`,
        })
        .from(measurementsTable)
        .where(
            sql`(${measurementsTable.stable} + ${measurementsTable.lazer}) > 0`,
        );

    const maxPercentage = maxPercentageResult[0].maxPercentage;

    const result = await getDb()
        .select()
        .from(measurementsTable)
        .where(
            sql`(CAST(${measurementsTable.lazer} AS REAL) / (${measurementsTable.stable} + ${measurementsTable.lazer})) >= ${
                maxPercentage - 0.015
            }`,
        )
        .orderBy(sql`${measurementsTable.lazer} DESC`)
        .limit(1);

    const peakLazer = result[0] as ChangelogData;
    return peakLazer;
}

type UserGraph = {
    timestamps: number[];
    stable: number[];
    lazer: number[];
};

type RatioGraph = {
    timestamps: number[];
    ratio: number[];
};

let latestUserGraph: UserGraph | null = null;
let latestRatioGraph: RatioGraph | null = null;

export async function getUserCountGraph(): Promise<UserGraph> {
    if (latestUserGraph && latestCheck > Date.now() - 300000) {
        return latestUserGraph;
    }
    const result = await getDb()
        .select({
            minTimestamp: sql<number>`MIN(${measurementsTable.timestamp})`,
            maxTimestamp: sql<number>`MAX(${measurementsTable.timestamp})`,
        })
        .from(measurementsTable);

    const { minTimestamp, maxTimestamp } = result[0];

    const bucketSize = Math.max(
        300,
        Math.round((maxTimestamp - minTimestamp) / 300),
    );

    const rows = await getDb().all<ChangelogData>(sql`
        WITH bucketed AS (
            SELECT
            timestamp,
            stable,
            lazer,
            CAST(timestamp / ${sql.raw(bucketSize.toString())} AS INTEGER) AS bucket
            FROM measurements
        ),
        bucket_min AS (
            SELECT bucket, MIN(timestamp) AS min_timestamp
            FROM bucketed
            GROUP BY bucket
        )
        SELECT b.timestamp, b.stable, b.lazer
        FROM bucketed b
        JOIN bucket_min bm ON b.bucket = bm.bucket AND b.timestamp = bm.min_timestamp
        ORDER BY b.timestamp
        `);

    latestUserGraph = rows.reduce(
        (acc, d) => {
            acc.timestamps.push(d.timestamp / 1000);
            acc.stable.push(d.stable);
            acc.lazer.push(d.lazer);
            return acc;
        },
        {
            timestamps: [] as number[],
            stable: [] as number[],
            lazer: [] as number[],
        },
    );
    return latestUserGraph;
}

export async function getUserRatioGraph(): Promise<RatioGraph> {
    if (latestRatioGraph && latestCheck > Date.now() - 300000) {
        return latestRatioGraph;
    }
    const result = await getDb()
        .select({
            minTimestamp: sql<number>`MIN(${measurementsTable.timestamp})`,
            maxTimestamp: sql<number>`MAX(${measurementsTable.timestamp})`,
        })
        .from(measurementsTable);

    const { minTimestamp, maxTimestamp } = result[0];

    const bucketSize = Math.max(
        300,
        Math.round((maxTimestamp - minTimestamp) / 300),
    );
    const rows = await getDb().all<{ timestamp: number; ratio: number }>(sql`
      WITH bucketed AS (
        SELECT
          timestamp,
          CAST(lazer AS REAL) / (stable + lazer) AS ratio,
          CAST(timestamp / ${bucketSize} AS INTEGER) AS bucket
        FROM measurements
        WHERE (stable + lazer) > 0
      ),
      bucket_max AS (
        SELECT bucket, MAX(ratio) AS max_ratio
        FROM bucketed
        GROUP BY bucket
      )
      SELECT b.timestamp, b.ratio
      FROM bucketed b
      JOIN bucket_max bm ON b.bucket = bm.bucket AND b.ratio = bm.max_ratio
      ORDER BY b.timestamp`);
    latestRatioGraph = rows.reduce(
        (acc, d) => {
            acc.timestamps.push(d.timestamp / 1000);
            acc.ratio.push(d.ratio * 100);
            return acc;
        },
        { timestamps: [] as number[], ratio: [] as number[] },
    );
    return latestRatioGraph;
}
