<script lang="ts">
    import ComparisonGraph from "$components/ComparisonGraph.svelte";
    import RatioGraph from "$components/RatioGraph.svelte";

    let {
        comparison,
        comparison_name,
        ratio,
        ratio_name,
    }: {
        comparison: { timestamps: number[]; stable: number[]; lazer: number[] };
        comparison_name: string;
        ratio: { timestamps: number[]; ratio: number[] };
        ratio_name: string;
    } = $props();
</script>

<div class="graph-box">
    <ComparisonGraph
        timestamps={comparison.timestamps}
        stable={comparison.stable}
        lazer={comparison.lazer}
        name={comparison_name}
    />
    <RatioGraph
        timestamps={ratio.timestamps}
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
