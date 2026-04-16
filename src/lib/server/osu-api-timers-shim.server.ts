// Filthy FILTHY workaround to something caused by Deno and Node
// timeout APIs clashing. I just pray it doesn't matter much but
// it's in osu!api
if (typeof Deno !== "undefined") {
    const numberProto = Number.prototype as Number & {
        ref?: () => Number;
        unref?: () => Number;
        hasRef?: () => true;
    };

    numberProto.ref ??= function () {
        return this;
    };

    numberProto.unref ??= function () {
        return this;
    };

    numberProto.hasRef ??= function () {
        return true as const;
    };
}
