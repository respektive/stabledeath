import type uPlot from "uplot";

export const dateTimeSettings = [
    [3600 * 24 * 365, "{YYYY}", null, null, null, null, null, null, 1],
    [3600 * 24 * 28, "{MMM}", "\n{YYYY}", null, null, null, null, null, 1],
    [3600 * 24, "{D}/{M}", "\n{YYYY}", null, null, null, null, null, 1],
    [3600, "{h}{aa}", "\n{D}/{M}/{YY}", null, "\n{D}/{M}", null, null, null, 1],
    [
        60,
        "{h}:{mm}{aa}",
        "\n{D}/{M}/{YY}",
        null,
        "\n{D}/{M}",
        null,
        null,
        null,
        1,
    ],
    [
        1,
        ":{ss}",
        "\n{D}/{M}/{YY} {h}:{mm}{aa}",
        null,
        "\n{D}/{M} {h}:{mm}{aa}",
        null,
        "\n{h}:{mm}{aa}",
        null,
        1,
    ],
    [
        0.001,
        ":{ss}.{fff}",
        "\n{D}/{M}/{YY} {h}:{mm}{aa}",
        null,
        "\n{D}/{M} {h}:{mm}{aa}",
        null,
        "\n{h}:{mm}{aa}",
        null,
        1,
    ],
];
// Rosé Pine Dawn (light) / Rosé Pine (dark)
export function getColors() {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return dark
        ? {
              text: "#e0def4", // text
              grid: "#26233a", // overlay
              border: "#403d52", // highlight med
          }
        : {
              text: "#575279", // text
              grid: "#f2e9e1", // overlay
              border: "#dfdad9", // highlight med
          };
}

export function makeUserCountOptions(
    width: number,
    id: string,
    title: string,
): uPlot.Options {
    const c = getColors();

    return {
        title: title,
        id: id,
        width: width,
        height: 380,
        scales: {
            y: { min: 0, max: 15000 },
        },
        series: [
            {},
            { label: "stable", stroke: "#66ccff", width: 2, spanGaps: false },
            { label: "lazer", stroke: "#ff66aa", width: 2, spanGaps: false },
        ],
        axes: [
            {
                stroke: c.text,
                grid: { stroke: c.grid },
                ticks: { stroke: c.border },
                values: dateTimeSettings,
            },
            {
                stroke: c.text,
                grid: { stroke: c.grid },
                ticks: { stroke: c.border },
            },
        ],
    };
}

export function makeUserRatioOptions(
    width: number,
    id: string,
    title: string,
): uPlot.Options {
    const c = getColors();

    return {
        title: title,
        id: id,
        width: width,
        height: 380,
        scales: {
            y: { min: 0, max: 100 },
        },
        series: [{}, { label: "lazer%", stroke: "#ff66aa", width: 2 }],
        axes: [
            {
                stroke: c.text,
                grid: { stroke: c.grid },
                ticks: { stroke: c.border },
                values: dateTimeSettings,
            },
            {
                stroke: c.text,
                grid: { stroke: c.grid },
                ticks: { stroke: c.border },
                values: (_u, vals) =>
                    vals.map((v) => (v != null ? `${v.toFixed(1)}%` : "")),
            },
        ],
    };
}
