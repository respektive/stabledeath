import { getLastWeek } from "$lib/server/api.server";
import { log } from "$utils/logs";
import { json } from "@sveltejs/kit";

export async function GET() {
    log("Received API request");
    return json(await getLastWeek());
}
