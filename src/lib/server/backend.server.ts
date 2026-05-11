import { env } from "$env/dynamic/private";

const Url = env._URL ?? "http://127.0.0.1:6727";
const SECOND = 1000;
const MINUTE = 60 * SECOND;

export const VIEW_DEPENDENCY = "app:home-view";
export const VIEW_CACHE_CONTROL =
    "public, max-age=60, s-maxage=300, stale-while-revalidate=300";

export type SinglePointResponse = {
    timestamp: number;
    stable: number;
    lazer: number;
    sum: number;
    ratio: number;
};

export type PointLineResponse = {
    timestamp: number[];
    stable: number[];
    lazer: number[];
    sum: number[];
    ratio: number[];
};

type LoadFetch = typeof fetch;

type CacheEntry<T> = {
    expires: number;
    promise?: Promise<T>;
    value?: T;
};

const cache = new Map<string, CacheEntry<unknown>>();

async function cached<T>(
    key: string,
    ttl: number,
    loader: () => Promise<T>,
): Promise<T> {
    const now = Date.now();
    const existing = cache.get(key) as CacheEntry<T> | undefined;

    if (existing?.value && existing.expires > now) {
        return existing.value;
    }

    if (existing?.promise) {
        return existing.promise;
    }

    const promise = loader()
        .then((value) => {
            cache.set(key, { value, expires: Date.now() + ttl });
            return value;
        })
        .catch((error) => {
            if (existing?.value) {
                cache.set(key, {
                    value: existing.value,
                    expires: Date.now() + Math.min(ttl, MINUTE),
                });
                return existing.value;
            }

            cache.delete(key);
            throw error;
        });

    cache.set(key, {
        value: existing?.value,
        expires: existing?.expires ?? 0,
        promise,
    });

    return promise;
}

async function getJson<T>(fetch: LoadFetch, path: string): Promise<T> {
    const response = await fetch(`${Url}${path}`);

    if (!response.ok) {
        throw new Error(` request failed: ${path} ${response.status}`);
    }

    return response.json() as Promise<T>;
}

function normalizeSinglePoint(
    response: SinglePointResponse,
): SinglePointResponse {
    return {
        ...response,
    };
}

function normalizePointLine(response: PointLineResponse): PointLineResponse {
    return {
        ...response,
        ratio: response.ratio.map((ratio) => ratio * 100),
    };
}

export async function getCurrent(fetch: LoadFetch) {
    return cached("bars:current", 5 * MINUTE, async () =>
        normalizeSinglePoint(
            await getJson<SinglePointResponse>(fetch, "/api/bars/current"),
        ),
    );
}

export async function getPeakUsers(fetch: LoadFetch) {
    return cached("bars:peak_users", 5 * MINUTE, async () =>
        normalizeSinglePoint(
            await getJson<SinglePointResponse>(fetch, "/api/bars/peak_users"),
        ),
    );
}

export async function getPeakRatio(fetch: LoadFetch) {
    return cached("bars:peak_ratio", 5 * MINUTE, async () =>
        normalizeSinglePoint(
            await getJson<SinglePointResponse>(fetch, "/api/bars/peak_ratio"),
        ),
    );
}

export async function getPeakPercentile(fetch: LoadFetch) {
    return cached("bars:peak_percentile", 5 * MINUTE, async () =>
        normalizeSinglePoint(
            await getJson<SinglePointResponse>(
                fetch,
                "/api/bars/peak_percentile",
            ),
        ),
    );
}

export async function getDayGraph(fetch: LoadFetch) {
    return cached("graphs:day", 5 * MINUTE, async () =>
        normalizePointLine(
            await getJson<PointLineResponse>(fetch, "/api/graphs/day"),
        ),
    );
}

export async function getHistoryGraph(fetch: LoadFetch) {
    return cached("graphs:history", 60 * MINUTE, async () =>
        normalizePointLine(
            await getJson<PointLineResponse>(fetch, "/api/graphs/history"),
        ),
    );
}

export async function getHomeView(fetch: LoadFetch) {
    return cached("view:home", 5 * MINUTE, async () => {
        const [changelogs, peak, peakRel, nearPeak, dayGraph, historyGraph] =
            await Promise.all([
                getCurrent(fetch),
                getPeakUsers(fetch),
                getPeakRatio(fetch),
                getPeakPercentile(fetch),
                getDayGraph(fetch),
                getHistoryGraph(fetch),
            ]);

        return {
            changelogs,
            peak,
            peakRel,
            nearPeak,
            userCountData: dayGraph,
            historicUserCount: historyGraph,
        };
    });
}
