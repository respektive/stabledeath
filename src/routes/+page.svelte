<script lang="ts">
    import BarBlock from "$components/BarBlock.svelte";
    import Bars from "$components/Bars.svelte";
    import Footer from "$components/Footer.svelte";
    import Graph from "$components/Graph.svelte";
    import Milestone from "$components/Milestone.svelte";
    import MilestoneList from "$components/MilestoneList.svelte";

    const { data } = $props();

    const changelogs = data.changelogs;
    const peak = data.peak;
    const peakRel = data.peakRel;
    const peakNear = data.nearPeak;
    const userCount = data.userCountData;
    const userRatio = data.userRatioData;
    // console.log(data.userCountData);
</script>

<svelte:head>
    <meta
        property="og:title"
        content="arewelazeryet - osu!lazer user share tracker"
    />
    <meta property="og:type" content="website" />
    {#if changelogs}
        <meta
            property="og:description"
            content="Currently the percentage is {Math.round(
                (changelogs.lazer / (changelogs.stable + changelogs.lazer)) *
                    10000.0,
            ) / 100}%\nWe are {() => {
                if (changelogs.lazer < changelogs.stable) {
                    return 'not lazer yet';
                } else {
                    return 'lazer now!';
                }
            }}"
        />
    {/if}
</svelte:head>

<div class="app">
    <div class="contents">
        <h1>lazer vs stable user counts</h1>
        <MilestoneList />
        <div class="bars">
            {#if changelogs}
                <BarBlock stable={changelogs.stable} lazer={changelogs.lazer}>
                    current (last check was at {new Date(
                        changelogs.timestamp,
                    ).toLocaleString("en-UK")})
                </BarBlock>
            {:else}
                <div>uhhh</div>
            {/if}
            {#if peak}
                <BarBlock stable={peak.stable} lazer={peak.lazer}>
                    lazer user count peak (at {new Date(
                        peak.timestamp,
                    ).toLocaleString("en-UK")})
                </BarBlock>
                <BarBlock stable={peakRel.stable} lazer={peakRel.lazer}>
                    lazer user percentage peak (at {new Date(
                        peakRel.timestamp,
                    ).toLocaleString("en-UK")})
                </BarBlock>
                <BarBlock stable={peakNear.stable} lazer={peakNear.lazer}>
                    lazer user count peak near highest percentage (at {new Date(
                        peakNear.timestamp,
                    ).toLocaleString("en-UK")})
                </BarBlock>
            {/if}
        </div>
        <Graph {userCount} {userRatio} />
        <Footer />
    </div>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap");
    :global(*) {
        box-sizing: border-box;
        text-align: center;
    }

    :root {
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

    .app {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        overflow-y: scroll;
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
            background-color: #191724;
            color: #e0def4;
        }
    }
</style>
