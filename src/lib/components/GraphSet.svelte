<script lang="ts">
    import ComparisonGraph from "$components/ComparisonGraph.svelte";
    import RatioGraph from "$components/RatioGraph.svelte";

    let {
        comparison,
        comparison_name,
        ratio,
        ratio_name,
    }: {
        comparison: {
            timestamp: number[];
            stable: number[];
            lazer: number[];
            sum: number[];
        };
        comparison_name: string;
        ratio: { timestamp: number[]; ratio: number[] };
        ratio_name: string;
    } = $props();
</script>

<div class="graph-box">
    <ComparisonGraph
        timestamps={comparison.timestamp}
        stable={comparison.stable}
        lazer={comparison.lazer}
        sum={comparison.sum}
        name={comparison_name}
    />
    <RatioGraph
        timestamps={ratio.timestamp}
        values={ratio.ratio}
        name={ratio_name}
    />
</div>

<style>
    .graph-box {
        display: flex;
    }
    @media (max-width: 1599px) {
        .graph-box {
            flex-direction: column;
        }
    }

    @media (min-width: 1600px) {
        .graph-box {
            flex-direction: row;
        }
    }
</style>
