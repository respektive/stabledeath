<script lang="ts">
    const { stable, lazer }: { stable: number; lazer: number } = $props();
    const stable_percentage = $derived(
        stable + lazer > 0
            ? Math.round((stable / (stable + lazer)) * 10000.0) / 100
            : 0,
    );
    const lazer_percentage = $derived(
        Math.round((100.0 - stable_percentage) * 100) / 100,
    );
</script>

<div class="container">
    <div class="bar-container">
        <div class="stable-bar" style="--stable: {stable_percentage}%"></div>
    </div>
    <div class="subscripts">
        <div id="stable">
            stable: {stable} ({stable_percentage}%)
        </div>
        <div id="lazer">
            lazer: {lazer} ({lazer_percentage}%)
        </div>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        width: 100%;
        max-width: 700px;
        height: 50px;
        margin: 20px auto;
    }

    .subscripts {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 0.9rem;
        padding: 0 0.5rem;
    }

    .bar-container {
        width: 100%;
        height: 20px;
        border-radius: 10px;

        background-color: #ff66aa;

        overflow: hidden;
    }

    .stable-bar {
        --slant: 3px;
        position: relative;
        width: calc(var(--stable) - var(--slant));
        height: 100%;

        background-color: #66ccff;
    }

    .stable-bar::after {
        content: "";
        position: absolute;
        top: 0;
        right: calc(var(--slant) * -2);
        width: calc(var(--slant) * 2);
        height: 100%;
        clip-path: polygon(0 0, 0% 100%, 100% 0);
        background-color: #66ccff;
    }
</style>
