<script lang="ts">
    import { invalidate } from "$app/navigation";
    import BarBlock from "$components/BarBlock.svelte";
    import Footer from "$components/Footer.svelte";
    import MilestoneList from "$components/MilestoneList.svelte";
    import { onMount } from "svelte";
    import GraphSet from "$components/GraphSet.svelte";
    import { date } from "$utils/types.js";

    let { data } = $props();

    const changelogs = $derived(data.changelogs);
    const peak = $derived(data.peak);
    const peakRel = $derived(data.peakRel);
    const nearPeak = $derived(data.nearPeak);
    const userCountData = $derived(data.userCountData);

    const historicCount = $derived(data.historicUserCount);

    onMount(() => {
        const interval = setInterval(() => {
            invalidate("app:home-view");
        }, 300000);

        return () => {
            clearInterval(interval);
        };
    });
    const ratio = $derived(Math.round((changelogs?.ratio ?? 0) * 10000) / 100);

    const areWeYet = () => {
        if (ratio < 50.0) {
            return "Not yet, but we're getting there";
        }
        if (ratio < 75.0) {
            return "The majority is here, but some still remain";
        }
        return "we are officially lazer";
    };

    const opengraphHeader = () => {
        const areWeYet =
            ratio < 50.0 ? "we are not lazer yet" : "we are lazer now";
        const start = `Currently the percentage is ${ratio}%. ${areWeYet}`;
        return start;
    };
</script>

<svelte:head>
    <meta
        property="og:title"
        content="arewelazeryet - osu!lazer user share tracker"
    />
    <meta property="og:type" content="website" />
    {#if changelogs}
        <meta property="og:description" content={opengraphHeader()} />
    {/if}
</svelte:head>

<div class="app">
    <div class="contents">
        <h1 style="margin-bottom: 0">Are we lazer yet?</h1>
        <h2 style="margin-top: 0">{areWeYet()}</h2>
        <div class="bars">
            {#if changelogs}
                <BarBlock stable={changelogs.stable} lazer={changelogs.lazer}>
                    current (as of {date(changelogs.timestamp)})
                </BarBlock>
            {/if}
            {#if peak}
                <BarBlock stable={peak.stable} lazer={peak.lazer}>
                    Highest lazer user count ({date(peak.timestamp)})
                </BarBlock>
                <BarBlock stable={peakRel.stable} lazer={peakRel.lazer}>
                    Highest lazer ratio ({date(peakRel.timestamp)})
                </BarBlock>
                <BarBlock stable={nearPeak.stable} lazer={nearPeak.lazer}>
                    Highest ratio near peak usage ({date(nearPeak.timestamp)})
                </BarBlock>
            {/if}
        </div>
        <MilestoneList />
        <h2>24 hour data</h2>
        <div class="graphs">
            <GraphSet
                comparison={userCountData}
                comparison_name="user counts"
                ratio={userCountData}
                ratio_name="lazer user ratio"
            />

            <h2>Historic usage data</h2>
            <GraphSet
                comparison={historicCount}
                comparison_name="Historic user counts"
                ratio={historicCount}
                ratio_name="Historic lazer%"
            />
        </div>
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
        overflow-x: hidden;
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
        padding: 10px;
    }

    .bars {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    .graphs {
        text-align: center;
    }

    @media (max-width: 1599px) {
        .contents {
            max-width: 700px;
        }
        .graphs {
            width: 100%;
        }
    }

    @media (min-width: 1600px) {
        .contents {
            max-width: 1400px;
        }
        .graphs {
            width: 1400px;
        }
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
