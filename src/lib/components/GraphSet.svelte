<script lang="ts">
    import ComparisonGraph from "$components/ComparisonGraph.svelte";
    import RatioGraph from "$components/RatioGraph.svelte";

    let {
        comparison,
        comparison_name,
        ratio,
        ratio_name,
        is24h,
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
        is24h?: Boolean;
    } = $props();
</script>

<div class="graph-box">
    <ComparisonGraph
        timestamps={comparison.timestamp}
        stable={comparison.stable}
        lazer={comparison.lazer}
        sum={comparison.sum}
        name={comparison_name}
        {is24h}
    />
    <RatioGraph timestamps={ratio.timestamp} values={ratio.ratio} name={ratio_name} {is24h} />
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
