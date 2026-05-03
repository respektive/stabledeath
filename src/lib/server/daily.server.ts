import { dailyTable } from "$lib/db/schema";
import { ratio, type ChangelogEntry } from "$utils/data";
import type { NonZeroNumber } from "$utils/types";
import { getDb } from "./stats.server";
let latestCheck: NonZeroNumber;

const AUTOUPDATE_TIMEOUT = 1000 * 60 * 24;

export type DailyEntry = {
    timestamps: number[];
    stable: number[];
    lazer: number[];
};

export type DailyRatio = {
    timestamps: number[];
    ratio: number[];
};
let latestHistoricAbsolute: DailyEntry;
let latestHistoricRatio: DailyRatio;

export async function getHistoricData(): Promise<DailyEntry> {
    const db = getDb();

    let values = (await db.select().from(dailyTable)).reduce(
        (init, value) => {
            init.timestamps.push(value.date);
            init.stable.push(value.stable);
            init.lazer.push(value.lazer);
            return init;
        },
        {
            timestamps: [] as number[],
            stable: [] as number[],
            lazer: [] as number[],
        },
    );

    latestHistoricAbsolute = values;
    return values;
}

export async function getHistoricRatio(): Promise<DailyRatio> {
    let values = (await getDb().select().from(dailyTable)).reduce(
        (init, value) => {
            init.timestamps.push(value.date);
            init.ratio.push(ratio(value.stable, value.lazer) * 100.0);
            return init;
        },
        {
            timestamps: [] as number[],
            ratio: [] as number[],
        },
    );

    latestHistoricRatio = values;

    return latestHistoricRatio;
}
