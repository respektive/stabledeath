<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import {
        dateTimeSettings,
        makeUserRatioOptions,
    } from "$lib/utils/graph.ts";
    import uPlot from "uplot";
    import "uplot/dist/uPlot.min.css";

    let { timestamps, values, name } = $props();

    let graphContainer: HTMLDivElement;
    let graphPlot: uPlot;

    onMount(() => {
        graphPlot = new uPlot(
            makeUserRatioOptions(graphContainer.clientWidth, name, name),
            [timestamps, values],
            graphContainer,
        );

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const onSchemeChange = () => {
            graphPlot.destroy();

            graphPlot = new uPlot(
                makeUserRatioOptions(graphContainer.clientWidth, name, name),
                [timestamps, values],
                graphContainer,
            );
        };

        mediaQuery.addEventListener("change", onSchemeChange);

        const ro = new ResizeObserver(() => {
            graphPlot.setSize({
                width: graphContainer.clientWidth,
                height: 400,
            });
        });

        ro.observe(graphContainer);

        return () => {
            mediaQuery.removeEventListener("change", onSchemeChange);
            ro.disconnect();
        };
    });

    onDestroy(() => {
        graphPlot?.destroy();
    });
</script>

<div style="height: 500px; max-width: 700px; width: 100%">
    <div bind:this={graphContainer} style="width: 100%"></div>
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
