<script lang="ts">
    import Bars from "./Bars.svelte";
    import SelfAnchor from "./SelfAnchor.svelte";

    let { lazer, stable, anchor, children } = $props();
</script>

<div class="bar">
    <SelfAnchor {anchor}>
        <h3>
            {@render children()}
        </h3>
    </SelfAnchor>
    <Bars {stable} {lazer} />
</div>

<style>
    .bar {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: auto;
    }
    h3 {
        margin: 0;
        width: 100%;
    }
</style>
