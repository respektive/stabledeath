<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { makeUserCountConfiguration } from "$lib/utils/graph.ts";
    import { queueRender } from "$utils/renderQueue";

    import type { Chart as ChartType } from "chart.js";
    import "chartjs-adapter-temporal/register";

    let Chart: typeof ChartType;

    let {
        timestamps,
        stable,
        lazer,
        sum,
        name,
        is24h,
    }: {
        timestamps: number[];
        stable: number[];
        lazer: number[];
        sum: number[];
        name: string;
        is24h?: Boolean;
    } = $props();

    let chartCanvas: HTMLCanvasElement;
    let graphChart: ChartType | undefined;
    let resizeFrame: number | undefined;
    let lastWidth = 0;
    let mounted = false;
    let queuedRenderCancel: (() => void) | undefined;

    function createPlot() {
        if (!mounted || graphChart || !chartCanvas?.isConnected) {
            return;
        }

        lastWidth = chartCanvas.clientWidth;

        graphChart = new Chart(chartCanvas, makeUserCountConfiguration(timestamps, stable, lazer, sum, name, is24h));
    }

    function handleDoubleclick() {
        graphChart?.resetZoom();
    }

    function recreatePlot() {
        if (!mounted) {
            return;
        }

        graphChart?.destroy();
        graphChart = undefined;
        createPlot();
    }

    function queueResize() {
        if (resizeFrame != null) {
            return;
        }

        resizeFrame = requestAnimationFrame(() => {
            resizeFrame = undefined;

            if (!graphChart) {
                return;
            }

            const width = chartCanvas.clientWidth;
            if (width === 0 || width === lastWidth) {
                return;
            }

            lastWidth = width;
            graphChart.resize(width, 450);
        });
    }

    function queueCreatePlot() {
        queuedRenderCancel?.();
        queuedRenderCancel = queueRender(createPlot);
    }

    $effect(() => {
        if (graphChart) {
            graphChart.data.labels = timestamps;
            graphChart.data.datasets[0].data = lazer;
            graphChart.data.datasets[1].data = stable;
            graphChart.data.datasets[2].data = sum;
            graphChart.update();
        }
    });

    onMount(() => {
        let isCancelled = false;

        let mediaQuery: MediaQueryList | undefined;
        let onSchemeChange: (() => void) | undefined;
        let ro: ResizeObserver | undefined;
        let io: IntersectionObserver | undefined;

        // dynamically import the modules on the client. zoom plugin will not work with ssr for example
        const initChart = async () => {
            const { Chart: ChartModule, registerables } = await import("chart.js");
            const annotationPlugin = (await import("chartjs-plugin-annotation")).default;
            const zoomPlugin = (await import("chartjs-plugin-zoom")).default;

            if (isCancelled) return;

            Chart = ChartModule;
            Chart.register(...registerables, annotationPlugin, zoomPlugin);

            mounted = true;

            mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            onSchemeChange = () => queueRender(recreatePlot);

            mediaQuery.addEventListener("change", onSchemeChange);

            ro = new ResizeObserver(queueResize);

            ro.observe(chartCanvas);

            io = new IntersectionObserver(
                ([entry]) => {
                    if (!entry?.isIntersecting) {
                        return;
                    }

                    queueCreatePlot();
                    io?.disconnect();
                },
                { rootMargin: "300px" },
            );

            io.observe(chartCanvas);
        };

        initChart();

        return () => {
            isCancelled = true;
            mounted = false;
            queuedRenderCancel?.();

            if (mediaQuery && onSchemeChange) {
                mediaQuery.removeEventListener("change", onSchemeChange);
            }

            io?.disconnect();
            ro?.disconnect();

            if (resizeFrame != null) {
                cancelAnimationFrame(resizeFrame);
            }
        };
    });

    onDestroy(() => {
        graphChart?.destroy();
        graphChart = undefined;
    });
</script>

<div style="height: 450px; max-width: 700px; width: 100%">
    <canvas bind:this={chartCanvas} ondblclick={handleDoubleclick} style="width: 100%; height: 100%;"></canvas>
</div>
