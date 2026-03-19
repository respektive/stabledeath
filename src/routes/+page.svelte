<script lang="ts">
    import Bars from "$components/Bars.svelte";

    const { data } = $props();

    const changelogs = data.changelogs;
    const peak = data.peak;
    const peakRel = data.peakRel;
</script>

<div class="app">
    <div class="contents">
        <h1>lazer vs stable user counts</h1>
        <div class="bars">
            {#if changelogs}
                <div class="bar">
                    <h3>
                        current (last check was at {new Date(
                            changelogs.timestamp,
                        ).toLocaleString("en-UK")})
                    </h3>
                    <Bars stable={changelogs.stable} lazer={changelogs.lazer} />
                </div>
            {:else}
                <div>uhhh</div>
            {/if}
            {#if peak}
                <div class="bar">
                    <h3>
                        lazer user count peak (at {new Date(peak.timestamp).toLocaleString(
                            "en-UK",
                        )})
                    </h3>
                    <Bars stable={peak.stable} lazer={peak.lazer} />
                </div>
                <div class="bar">
                    <h3>
                        lazer user percentage peak (at {new Date(
                            peakRel.timestamp,
                        ).toLocaleString("en-UK")})
                    </h3>
                    <Bars stable={peakRel.stable} lazer={peakRel.lazer} />
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    :global(*) {
        box-sizing: border-box;
        text-align: center;
    }

    :root {
        overflow: hidden;
    }

    :global(body) {
        margin: 0;
    }

    h1 { text-align: center }
    h3 { margin: 0 }

    .app {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
    }

    .contents {
        width: 100vw;
        max-width: 700px;
        padding: 10px;
    }

    .bars {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    .bar {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media (prefers-color-scheme: light) {
        :root {
            background-color: #f6f6f6;
            color: black;
        }
    }
    @media (prefers-color-scheme: dark) {
        :root {
            background-color: #0b0b0b;
            color: white;
        }
    }
</style>
