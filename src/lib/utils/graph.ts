import type { ChartConfiguration } from "chart.js";
import type { AnnotationOptions } from "chartjs-plugin-annotation";

const milestones = [
    { date: "2024-01-29", label: "pp release" },
    { date: "2024-07-24", label: "daily challenges" },
    { date: "2024-10-09", label: "combo scaling removal" },
    { date: "2025-06-04", label: "song select v2" },
    { date: "2025-11-20", label: "updated download page" },
    { date: "2026-04-17", label: "ranked play" },
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

const generateAnnotations = () => {
    const annotations: Record<string, AnnotationOptions> = {};
    for (const milestone of milestones) {
        annotations[`milestone_${milestone.date}`] = {
            type: "line",
            xMin: Date.parse(milestone.date),
            xMax: Date.parse(milestone.date),
            borderColor: "#88b30080",
            borderWidth: 1,
            label: {
                content: milestone.label,
                display: true,
                position: "end",
                backgroundColor: "#26233a",
                borderColor: "#524f67",
                borderWidth: 1,
                font: {
                    size: 10,
                    weight: "normal",
                },
            },
        };
    }

    return annotations;
};

export function makeUserRatioConfiguration(
    timestamps: number[],
    values: number[],
    name: string,
    is24h: Boolean = false,
): ChartConfiguration {
    const colors = getColors();
    const chartTimestamps = timestamps.map((ts) => Math.floor(ts * 1000));

    return {
        type: "line",
        data: {
            labels: chartTimestamps,
            datasets: [
                {
                    label: "lazer%",
                    data: values,
                    borderColor: "#ff66aa",
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "nearest",
                intersect: false,
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: colors.text,
                        font: {
                            size: 14,
                            weight: "bold",
                        },
                    },
                },
                title: {
                    display: true,
                    text: name,
                    color: colors.text,
                    font: {
                        size: 18,
                        weight: "bold",
                    },
                },
                annotation: {
                    annotations: is24h ? {} : generateAnnotations(),
                },
                zoom: {
                    zoom: {
                        drag: {
                            enabled: true,
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                        },
                        pinch: {
                            enabled: true,
                        },
                        mode: "xy",
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: colors.grid,
                        lineWidth: 2,
                        tickColor: colors.border,
                        tickLength: 12,
                    },
                    ticks: {
                        color: colors.text,
                        padding: 5,
                        callback: (value) => `${value}%`,
                    },
                },
                x: {
                    type: "timeseries",
                    time: {
                        unit: is24h ? "hour" : "month",
                        displayFormats: {
                            // @ts-ignore: chart.js types conflict with chartjs-adapter-temporal for some reason
                            hour: { hour: "numeric" },
                        },
                    },
                    grid: {
                        color: colors.grid,
                        lineWidth: 2,
                        tickColor: colors.border,
                    },
                    ticks: {
                        color: colors.text,
                        padding: 5,
                        maxRotation: 0,
                        maxTicksLimit: is24h ? 12 : 9,
                    },
                },
            },
        },
    };
}

export function makeUserCountConfiguration(
    timestamps: number[],
    stable: number[],
    lazer: number[],
    sum: number[],
    name: string,
    is24h: Boolean = false,
): ChartConfiguration {
    const colors = getColors();
    const chartTimestamps = timestamps.map((ts) => Math.floor(ts * 1000));

    return {
        type: "line",
        data: {
            labels: chartTimestamps,
            datasets: [
                {
                    label: "stable",
                    data: stable,
                    borderColor: "#66ccff",
                    borderWidth: 2,
                },
                {
                    label: "lazer",
                    data: lazer,
                    borderColor: "#ff66aa",
                    borderWidth: 2,
                },
                {
                    label: "total",
                    data: sum,
                    borderColor: "#6e6a86",
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "nearest",
                intersect: false,
            },
            elements: {
                point: {
                    radius: 0,
                    hoverRadius: 5,
                },
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: colors.text,
                        font: {
                            size: 14,
                            weight: "bold",
                        },
                    },
                },
                title: {
                    display: true,
                    text: name,
                    color: colors.text,
                    font: {
                        size: 18,
                        weight: "bold",
                    },
                },
                tooltip: {
                    mode: "index",
                },
                annotation: {
                    annotations: is24h ? {} : generateAnnotations(),
                },
                zoom: {
                    zoom: {
                        drag: {
                            enabled: true,
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                        },
                        pinch: {
                            enabled: true,
                        },
                        mode: "xy",
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20000,
                    grid: {
                        color: colors.grid,
                        lineWidth: 2,
                        tickColor: colors.border,
                        tickLength: 12,
                    },
                    ticks: {
                        color: colors.text,
                        padding: 5,
                    },
                },
                x: {
                    type: "timeseries",
                    time: {
                        unit: is24h ? "hour" : "month",
                        displayFormats: {
                            // @ts-ignore: chart.js types conflict with chartjs-adapter-temporal for some reason
                            hour: { hour: "numeric" },
                        },
                    },
                    grid: {
                        color: colors.grid,
                        lineWidth: 2,
                        tickColor: colors.border,
                    },
                    ticks: {
                        color: colors.text,
                        padding: 5,
                        maxRotation: 0,
                        maxTicksLimit: is24h ? 12 : 9,
                    },
                },
            },
        },
    };
}
