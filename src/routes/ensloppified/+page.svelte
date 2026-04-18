<script lang="ts">
    import SlopBars from "./SlopBars.svelte";

    type RawSnapshot =
        | { timestamp: number; stable: number | null; lazer: number | null }
        | null
        | undefined;
    type SnapshotItem = { timestamp: number; stable: number; lazer: number };
    type SnapshotCard = {
        label: string;
        eyebrow: string;
        description: string;
        item: SnapshotItem;
    };

    let { data } = $props();

    const normalize = (entry: RawSnapshot): SnapshotItem | null =>
        entry && entry.stable !== null && entry.lazer !== null
            ? {
                  timestamp: entry.timestamp,
                  stable: entry.stable,
                  lazer: entry.lazer,
              }
            : null;

    const percent = (stable: number, lazer: number) =>
        Math.round((lazer / (stable + lazer)) * 10000.0) / 100;

    let changelogs = $derived(normalize(data.changelogs));
    let peak = $derived(normalize(data.peak));
    let peakRel = $derived(normalize(data.peakRel));
    let peakNear = $derived(normalize(data.nearPeak));

    let snapshots = $derived.by(() => {
        const cards: SnapshotCard[] = [];

        if (changelogs) {
            cards.push({
                label: "current scrape consensus",
                eyebrow: "fresh intake waveform",
                description:
                    "Latest client totals after telemetry hydration, scrape alignment and ratio normalization.",
                item: changelogs,
            });
        }

        if (peak) {
            cards.push({
                label: "maximum lazer intake cluster",
                eyebrow: "archived surge harvest",
                description:
                    "Highest stored lazer headcount across the retained collection stream.",
                item: peak,
            });
        }

        if (peakRel) {
            cards.push({
                label: "strongest lazer ratio event",
                eyebrow: "relative dominance residue",
                description:
                    "Largest proportional lazer share observed by the ratio extraction stack.",
                item: peakRel,
            });
        }

        if (peakNear) {
            cards.push({
                label: "near-peak convergence slice",
                eyebrow: "proximity capture layer",
                description:
                    "Stored snapshot where lazer count stayed high near the top percentage pocket.",
                item: peakNear,
            });
        }

        return cards;
    });
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
            content="Currently the percentage is {percent(
                changelogs.stable,
                changelogs.lazer,
            )}%"
        />
    {/if}
</svelte:head>

<div class="page-shell">
    <div class="aurora aurora-a"></div>
    <div class="aurora aurora-b"></div>
    <div class="grid-glow"></div>

    <main class="experience">
        <section class="hero glass">
            <div class="hero-copy">
                <div class="pill-row">
                    <span class="pill">telemetry harmonization</span>
                    <span class="pill">scrape resonance</span>
                    <span class="pill">signal compost</span>
                </div>
                <p class="eyebrow">Cross-client telemetry consolidation node</p>
                <h1>lazer vs stable user counts</h1>
                <p class="lede">
                    This page condenses live intake, archive residue and
                    retrospective scrape vapor into one adoption readout.
                    Every panel is stuffed with synthetic telemetry language
                    because osu!lazer is the future of the game.
                </p>
            </div>

            {#if changelogs}
                <div class="hero-stat-panel">
                    <div class="mini-stat">
                        <span>future share</span>
                        <strong
                            >{percent(changelogs.stable, changelogs.lazer)}%</strong
                        >
                    </div>
                    <div class="mini-stat">
                        <span>stable users</span>
                        <strong>{changelogs.stable}</strong>
                    </div>
                    <div class="mini-stat">
                        <span>lazer users</span>
                        <strong>{changelogs.lazer}</strong>
                    </div>
                </div>
            {/if}
        </section>

        {#if snapshots.length}
            <section class="snapshot-grid">
                {#each snapshots as snapshot, index}
                    <article class="snapshot-card glass">
                        <div class="card-topline">
                            <span class="step-chip">Sweep {index + 1}</span>
                            <span class="status-chip">ambient scrape validated</span>
                        </div>

                        <div class="card-copy">
                            <p class="card-eyebrow">{snapshot.eyebrow}</p>
                            <h2>{snapshot.label}</h2>
                            <p class="card-description">{snapshot.description}</p>
                            <p class="timestamp">
                                recorded on {new Date(snapshot.item.timestamp).toLocaleString(
                                    "en-UK",
                                )}
                            </p>
                        </div>

                        <SlopBars
                            stable={snapshot.item.stable}
                            lazer={snapshot.item.lazer}
                        />
                    </article>
                {/each}
            </section>
        {:else}
            <section class="empty-state glass">
                <p>No metrics available. The harvest buffers are currently empty.</p>
            </section>
        {/if}
    </main>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;700&display=swap");

    :global(*) {
        box-sizing: border-box;
    }

    :global(body) {
        margin: 0;
        min-width: 320px;
        background:
            radial-gradient(circle at top, rgba(255, 255, 255, 0.13), transparent 30%),
            linear-gradient(135deg, #070b1d 0%, #120f2f 42%, #1a274d 100%);
        color: #f8fbff;
        font-family: "Outfit", sans-serif;
    }

    :global(:root) {
        color-scheme: dark;
        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;
        overflow-x: hidden;
    }

    .page-shell {
        position: relative;
        min-height: 100vh;
        overflow: clip;
        isolation: isolate;
    }

    .aurora,
    .grid-glow {
        position: absolute;
        inset: auto;
        pointer-events: none;
    }

    .aurora {
        filter: blur(30px);
        opacity: 0.75;
        animation: drift 14s ease-in-out infinite;
    }

    .aurora-a {
        top: -8rem;
        left: -6rem;
        width: 26rem;
        height: 26rem;
        border-radius: 999px;
        background:
            radial-gradient(circle, rgba(95, 212, 255, 0.9), rgba(95, 212, 255, 0) 68%);
    }

    .aurora-b {
        right: -8rem;
        bottom: -10rem;
        width: 32rem;
        height: 32rem;
        border-radius: 999px;
        background:
            radial-gradient(circle, rgba(255, 103, 193, 0.82), rgba(255, 103, 193, 0) 70%);
        animation-delay: -6s;
    }

    .grid-glow {
        inset: 0;
        background:
            linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
        background-size: 36px 36px;
        mask-image: radial-gradient(circle at center, black 42%, transparent 85%);
        opacity: 0.12;
    }

    .experience {
        position: relative;
        z-index: 1;
        width: min(1180px, calc(100vw - 2rem));
        margin: 0 auto;
        padding: 2rem 0 4rem;
    }

    .glass {
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background:
            linear-gradient(180deg, rgba(18, 27, 58, 0.88), rgba(18, 27, 58, 0.68));
        box-shadow:
            0 24px 80px rgba(2, 6, 23, 0.42),
            inset 0 1px 0 rgba(255, 255, 255, 0.28);
        backdrop-filter: blur(22px) saturate(140%);
    }

    .glass::before {
        content: "";
        position: absolute;
        inset: 1px;
        border-radius: inherit;
        background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent 38%);
        pointer-events: none;
    }

    .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
        gap: 1.5rem;
        align-items: end;
        padding: 2rem;
        border-radius: 32px;
        margin-bottom: 1.5rem;
    }

    .pill-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
        margin-bottom: 1rem;
    }

    .pill,
    .step-chip,
    .status-chip {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        padding: 0.45rem 0.9rem;
        min-height: 2rem;
        font-size: 0.74rem;
        line-height: 1;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        background: rgba(255, 255, 255, 0.09);
        transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
    }

    .pill::before,
    .step-chip::before,
    .status-chip::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
            linear-gradient(
                120deg,
                transparent 20%,
                rgba(255, 255, 255, 0.18) 45%,
                transparent 70%
            );
        transform: translateX(-130%);
        transition: transform 260ms ease;
        pointer-events: none;
    }

    .pill:hover,
    .step-chip:hover,
    .status-chip:hover {
        transform: translateY(-2px) scale(1.02);
        border-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 10px 24px rgba(5, 10, 30, 0.28);
    }

    .pill:hover::before,
    .step-chip:hover::before,
    .status-chip:hover::before {
        transform: translateX(130%);
    }

    .pill:nth-child(1):hover {
        background:
            linear-gradient(135deg, rgba(96, 224, 255, 0.26), rgba(255, 255, 255, 0.1));
        box-shadow:
            0 0 0 1px rgba(96, 224, 255, 0.12),
            0 12px 28px rgba(48, 192, 255, 0.22);
    }

    .pill:nth-child(2):hover {
        background:
            linear-gradient(135deg, rgba(255, 120, 196, 0.24), rgba(255, 255, 255, 0.1));
        box-shadow:
            0 0 0 1px rgba(255, 120, 196, 0.12),
            0 12px 28px rgba(255, 92, 176, 0.2);
    }

    .pill:nth-child(3):hover {
        background:
            linear-gradient(135deg, rgba(255, 210, 120, 0.24), rgba(255, 255, 255, 0.1));
        box-shadow:
            0 0 0 1px rgba(255, 210, 120, 0.14),
            0 12px 28px rgba(255, 170, 66, 0.2);
    }

    .eyebrow,
    .card-eyebrow {
        margin: 0;
        font-family: "Space Grotesk", sans-serif;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #9edaff;
        font-size: 0.77rem;
    }

    h1,
    h2,
    .mini-stat strong {
        margin: 0;
        font-family: "Space Grotesk", sans-serif;
        line-height: 0.96;
    }

    h1 {
        font-size: clamp(3.1rem, 7vw, 6.3rem);
        max-width: 10ch;
        line-height: 1.02;
        text-wrap: balance;
        text-shadow: 0 6px 30px rgba(87, 209, 255, 0.28);
    }

    .lede,
    .card-description,
    .timestamp,
    .empty-state p {
        margin: 0;
        color: rgba(244, 247, 255, 0.9);
        line-height: 1.6;
    }

    .lede {
        max-width: 58ch;
        margin-top: 1rem;
        font-size: 1.06rem;
    }

    .hero-stat-panel {
        display: grid;
        gap: 1rem;
        align-self: stretch;
    }

    .mini-stat {
        position: relative;
        padding: 1.15rem 1.2rem;
        border-radius: 24px;
        background:
            linear-gradient(160deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
        border: 1px solid rgba(255, 255, 255, 0.16);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
    }

    .mini-stat span {
        display: block;
        margin-bottom: 0.45rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.72rem;
        color: #c5d0ff;
    }

    .mini-stat strong {
        font-size: clamp(1.6rem, 3vw, 2.4rem);
    }

    .snapshot-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1.25rem;
    }

    .snapshot-card {
        display: grid;
        gap: 1.2rem;
        padding: 1.4rem;
        border-radius: 28px;
        min-height: 100%;
    }

    .card-topline {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 0.8rem;
    }

    .status-chip {
        color: #ffd7f0;
        background:
            linear-gradient(135deg, rgba(255, 111, 181, 0.22), rgba(255, 255, 255, 0.08));
    }

    .status-chip:hover {
        box-shadow:
            0 0 0 1px rgba(255, 143, 206, 0.16),
            0 12px 28px rgba(255, 93, 173, 0.22);
    }

    .step-chip {
        color: #9ce4ff;
        background:
            linear-gradient(135deg, rgba(87, 209, 255, 0.18), rgba(255, 255, 255, 0.08));
    }

    .step-chip:hover {
        box-shadow:
            0 0 0 1px rgba(127, 223, 255, 0.16),
            0 12px 28px rgba(74, 192, 255, 0.22);
    }

    .card-copy {
        display: grid;
        gap: 0.75rem;
    }

    h2 {
        font-size: clamp(1.8rem, 4vw, 2.5rem);
        text-wrap: balance;
    }

    .timestamp {
        font-size: 0.92rem;
        color: #d4dcff;
    }

    .empty-state {
        padding: 2rem;
        border-radius: 28px;
        text-align: center;
    }

    @keyframes drift {
        0%,
        100% {
            transform: translate3d(0, 0, 0) scale(1);
        }
        50% {
            transform: translate3d(1.5rem, -1rem, 0) scale(1.08);
        }
    }

    @media (max-width: 900px) {
        .hero,
        .snapshot-grid {
            grid-template-columns: 1fr;
        }

        .experience {
            width: min(100vw - 1rem, 1180px);
            padding-top: 0.75rem;
        }

        .hero {
            padding: 1.25rem;
        }
    }

    @media (max-width: 640px) {
        h1 {
            font-size: clamp(2.6rem, 15vw, 4.2rem);
        }

        .snapshot-card,
        .mini-stat {
            border-radius: 22px;
        }

        .card-topline {
            justify-content: flex-start;
        }

        .experience {
            padding-bottom: 2.5rem;
        }
    }
</style>
