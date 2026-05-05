import { measurementsTable } from "$lib/db/schema";
import { log } from "$utils/logs";
import { now, type NonZeroNumber } from "$utils/types";
import { getDb } from "./stats.server";
import { desc, sql } from "drizzle-orm";

let lastWeek: (typeof measurementsTable.$inferSelect)[];

let lastWeekCheck: NonZeroNumber;
export async function getLastWeek() {
    if (!lastWeekCheck || lastWeekCheck > now() - 30000) {
        log("Updating last week timer");
        lastWeekCheck = now();
        lastWeek = await getDb()
            .select()
            .from(measurementsTable)
            .orderBy(desc(measurementsTable.timestamp))
            .limit(288 * 7);

        log(lastWeek);
    }

    log("Returning value", lastWeek);
    return lastWeek;
}
