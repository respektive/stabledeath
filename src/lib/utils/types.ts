declare const nonZeroNumberBrand: unique symbol;
export type NonZeroNumber = number & { [nonZeroNumberBrand]: void };

export function nonZeroNumber(value: number): NonZeroNumber | undefined {
    if (value === 0) {
        return undefined;
    }

    return value as unknown as NonZeroNumber;
}

export function now(): NonZeroNumber {
    return nonZeroNumber(Math.round(Date.now() / 1000)) as NonZeroNumber;
}

export function date(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString("en-UK", {
        timeZone: "UTC",
    });
}
