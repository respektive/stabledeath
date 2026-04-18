<script lang="ts">
    import Bars from "$components/Bars.svelte";

    const { data } = $props();

    const changelogs = data.changelogs;
    const peak = data.peak;
    const peakRel = data.peakRel;
    const peakNear = data.nearPeak;
</script>

<svelte:head>
    <meta
        property="og:title"
        content="StableDeath - osu lazer user share tracker"
    />
    <meta property="og:type" content="website" />
    {#if changelogs}
        <meta
            property="og:description"
            content="Currently the percentage is {Math.round(
                (changelogs.lazer / (changelogs.stable + changelogs.lazer)) *
                    10000.0,
            ) / 100}%"
        />
    {/if}
</svelte:head>

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
                        lazer user count peak (at {new Date(
                            peak.timestamp,
                        ).toLocaleString("en-UK")})
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
                <div class="bar">
                    <h3>
                        lazer user count peak near highest percentage (at {new Date(
                            peakNear.timestamp,
                        ).toLocaleString("en-UK")})
                    </h3>
                    <Bars stable={peakNear.stable} lazer={peakNear.lazer} />
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap");
    :global(*) {
        box-sizing: border-box;
        text-align: center;
    }

    :root {
        overflow: hidden;
        font-family: "Nunito Sans", sans-serif;
        font-optical-sizing: auto;
        font-style: normal;
        line-height: 1.5;
        font-weight: 600;

        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;
    }

    :global(body) {
        margin: 0;
    }

    h1 {
        text-align: center;
    }
    h3 {
        margin: 0;
    }

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
