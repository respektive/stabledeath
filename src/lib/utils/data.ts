export type ChangelogEntry = {
    name: string;
    user_count: number;
};

type UserCounts = {
    stable: number;
    lazer: number;
};

function findByName(array: ChangelogEntry[], name: string): number {
    return array.find((i) => i.name === name)?.user_count ?? 0;
}

function findStable(array: ChangelogEntry[]): number {
    return findByName(array, "stable40") + findByName(array, "cuttingedge");
}
function findLazer(array: ChangelogEntry[]): number {
    return findByName(array, "lazer") + findByName(array, "tachyon");
}

export function getPlayerCounts(array: ChangelogEntry[]): UserCounts {
    return {
        stable: findStable(array),
        lazer: findLazer(array),
    };
}
export const timeout = (ms: number) =>
    new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Changelog request timed out")), ms),
    );
