<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { makeUserRatioOptions } from "$lib/utils/graph.ts";
    import { queueRender } from "$utils/renderQueue";
    import uPlot from "uplot";
    import "uplot/dist/uPlot.min.css";

    let {
        timestamps,
        values,
        name,
    }: { timestamps: number[]; values: number[]; name: string } = $props();

    let graphContainer: HTMLDivElement;
    let graphPlot: uPlot | undefined;
    let resizeFrame: number | undefined;
    let lastWidth = 0;
    let mounted = false;
    let queuedRenderCancel: (() => void) | undefined;

    const getData = (): uPlot.AlignedData => [timestamps, values];

    function createPlot() {
        if (!mounted || graphPlot || !graphContainer?.isConnected) {
            return;
        }

        lastWidth = graphContainer.clientWidth;
        graphPlot = new uPlot(
            makeUserRatioOptions(lastWidth, name, name),
            getData(),
            graphContainer,
        );
    }

    function recreatePlot() {
        if (!mounted) {
            return;
        }

        graphPlot?.destroy();
        graphPlot = undefined;
        createPlot();
    }

    function queueResize() {
        if (resizeFrame != null) {
            return;
        }

        resizeFrame = requestAnimationFrame(() => {
            resizeFrame = undefined;

            if (!graphPlot) {
                return;
            }

            const width = graphContainer.clientWidth;
            if (width === 0 || width === lastWidth) {
                return;
            }

            lastWidth = width;
            graphPlot.setSize({ width, height: 400 });
        });
    }

    function queueCreatePlot() {
        queuedRenderCancel?.();
        queuedRenderCancel = queueRender(createPlot);
    }

    $effect(() => {
        if (graphPlot) {
            graphPlot.setData(getData());
        }
    });

    onMount(() => {
        mounted = true;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const onSchemeChange = () => queueRender(recreatePlot);

        mediaQuery.addEventListener("change", onSchemeChange);

        const ro = new ResizeObserver(queueResize);

        ro.observe(graphContainer);

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) {
                    return;
                }

                queueCreatePlot();
                io.disconnect();
            },
            { rootMargin: "300px" },
        );

        io.observe(graphContainer);

        return () => {
            mounted = false;
            queuedRenderCancel?.();
            mediaQuery.removeEventListener("change", onSchemeChange);
            io.disconnect();
            ro.disconnect();

            if (resizeFrame != null) {
                cancelAnimationFrame(resizeFrame);
            }
        };
    });

    onDestroy(() => {
        graphPlot?.destroy();
        graphPlot = undefined;
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
