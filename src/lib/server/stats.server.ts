import { OSU_API_CLIENT_ID, OSU_API_CLIENT_SECRET } from "$env/static/private";
import { measurementsTable } from "$lib/db/schema";
import { createClient } from "@libsql/client/sqlite3";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { int, sqliteTable } from "drizzle-orm/sqlite-core";
const dbclient = createClient({
    url: "file:timeseries.db",
});

const db = drizzle(dbclient);

const client_id = parseInt(OSU_API_CLIENT_ID);
const client_secret = OSU_API_CLIENT_SECRET;

import * as osu from "osu-api-v2-js";
const client = await osu.API.createAsync(client_id, client_secret);
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
                setTimeout(() => reject(new Error("Request timed out")), ms),
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
    let changelogs;
    try {
        changelogs = await client.getChangelogStreams();
    } catch {
        return null;
    }
    const stable =
        (changelogs.find((i) => i.name == "stable40")?.user_count ?? 0) +
        (changelogs.find((i) => i.name == "cuttingedge")?.user_count ?? 0);

    const lazer =
        (changelogs.find((i) => i.name == "lazer")?.user_count ?? 0) +
        (changelogs.find((i) => i.name == "tachyon")?.user_count ?? 0);

    await db.insert(measurementsTable).values({
        timestamp: timestamp,
        stable: stable,
        lazer: lazer,
    });
    return { timestamp: timestamp, stable: stable, lazer: lazer };
}

export async function getLazerAbsolutePeak() {
    const result = await db
        .select()
        .from(measurementsTable)
        .where(
            sql`${measurementsTable.lazer} = (SELECT MAX(${measurementsTable.lazer}) FROM ${measurementsTable})`,
        );

    const peakLazer = result[0];
    return peakLazer;
}

export async function getLazerRelativePeak() {
    const result = await db
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
