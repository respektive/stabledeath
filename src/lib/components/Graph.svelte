<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import uPlot from "uplot";
    import "uplot/dist/uPlot.min.css";

    let { userCount, userRatio } = $props();

    let userCountContainer: HTMLDivElement;
    let userCountPlot: uPlot;
    let userRatioContainer: HTMLDivElement;
    let userRatioPlot: uPlot;

    // Rosé Pine Dawn (light) / Rosé Pine (dark)
    function getColors() {
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

    function makeCountOptions(width: number): uPlot.Options {
        const c = getColors();
        return {
            title: "user count",
            id: "user_chart",
            width,
            height: 380,
            scales: {
                // Max should be dynamic but that's a problem for covid 2.0
                y: { min: 0, max: 15000 },
            },
            series: [
                {},
                { label: "stable", stroke: "#66ccff", width: 2 },
                { label: "lazer", stroke: "#ff66aa", width: 2 },
            ],
            axes: [
                {
                    stroke: c.text,
                    grid: { stroke: c.grid },
                    ticks: { stroke: c.border },
                },
                {
                    stroke: c.text,
                    grid: { stroke: c.grid },
                    ticks: { stroke: c.border },
                },
            ],
        };
    }

    function makeRatioOptions(width: number): uPlot.Options {
        const c = getColors();
        return {
            title: "user ratio",
            id: "ratio_chart",
            width,
            height: 380,
            scales: {
                y: { min: 0, max: 1 },
            },
            series: [{}, { label: "lazer %", stroke: "#ff66aa", width: 2 }],
            axes: [
                {
                    stroke: c.text,
                    grid: { stroke: c.grid },
                    ticks: { stroke: c.border },
                },
                {
                    stroke: c.text,
                    grid: { stroke: c.grid },
                    ticks: { stroke: c.border },
                    values: (_u, vals) =>
                        vals.map((v) =>
                            v != null ? `${(v * 100).toFixed(1)}%` : "",
                        ),
                },
            ],
        };
    }

    onMount(() => {
        userCountPlot = new uPlot(
            makeCountOptions(userCountContainer.clientWidth),
            [userCount.timestamps, userCount.stable, userCount.lazer],
            userCountContainer,
        );
        userRatioPlot = new uPlot(
            makeRatioOptions(userRatioContainer.clientWidth),
            [userRatio.timestamps, userRatio.ratio],
            userRatioContainer,
        );

        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const onSchemeChange = () => {
            userCountPlot.destroy();
            userRatioPlot.destroy();
            userCountPlot = new uPlot(
                makeCountOptions(userCountContainer.clientWidth),
                [userCount.timestamps, userCount.stable, userCount.lazer],
                userCountContainer,
            );
            userRatioPlot = new uPlot(
                makeRatioOptions(userRatioContainer.clientWidth),
                [userRatio.timestamps, userRatio.ratio],
                userRatioContainer,
            );
        };
        mq.addEventListener("change", onSchemeChange);

        const ro = new ResizeObserver(() => {
            userCountPlot.setSize({
                width: userCountContainer.clientWidth,
                height: 400,
            });
            userRatioPlot.setSize({
                width: userRatioContainer.clientWidth,
                height: 400,
            });
        });
        ro.observe(userCountContainer);
        ro.observe(userRatioContainer);

        return () => {
            mq.removeEventListener("change", onSchemeChange);
            ro.disconnect();
        };
    });

    onDestroy(() => {
        userCountPlot?.destroy();
        userRatioPlot?.destroy();
    });
</script>

<div style="height: 1000px;">
    <div bind:this={userCountContainer} style="width: 100%"></div>
    <div bind:this={userRatioContainer} style="width: 100%"></div>
</div>

<style>
    div :global(.u-legend) {
        color: light-dark(black, "#e0def4");
    }
    div :global(.u-title) {
        color: light-dark(black, "#e0def4");
    }
    div :global(.u-wrap) {
        border: none;
    }
</style>
