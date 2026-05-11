import {
    getHomeView,
    VIEW_CACHE_CONTROL,
    VIEW_DEPENDENCY,
} from "$lib/server/backend.server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ depends, fetch, setHeaders }) => {
    depends(VIEW_DEPENDENCY);
    setHeaders({
        "cache-control": VIEW_CACHE_CONTROL,
    });

    return getHomeView(fetch);
};
