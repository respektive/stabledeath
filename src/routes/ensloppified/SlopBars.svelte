<script lang="ts">
    let { stable, lazer }: { stable: number; lazer: number } = $props();

    let stablePercentage = $derived(
        Math.round((stable / (stable + lazer)) * 10000.0) / 100,
    );
    let lazerPercentage = $derived(
        Math.round((100.0 - stablePercentage) * 100) / 100,
    );
</script>

<div class="module-shell">
    <div class="headline-row">
        <div class="legend stable">
            <span class="legend-dot"></span>
            <span>stable intake pool</span>
        </div>
        <div class="legend lazer">
            <span class="legend-dot"></span>
            <span>lazer future stream</span>
        </div>
    </div>

    <div class="bar-frame">
        <div class="bar-track" style="--stable: {stablePercentage}%">
            <div class="stable-fill" aria-hidden="true">
                <div class="shine"></div>
                <div class="pulse"></div>
            </div>
            <div class="boundary-glow" aria-hidden="true"></div>
        </div>
    </div>

    <div class="stats-grid">
        <div class="stat-card stable-card">
            <span class="stat-label">stable users</span>
            <strong>{stable}</strong>
            <span class="stat-meta">{stablePercentage}% share</span>
        </div>
        <div class="stat-card lazer-card">
            <span class="stat-label">lazer users</span>
            <strong>{lazer}</strong>
            <span class="stat-meta">{lazerPercentage}% share</span>
        </div>
    </div>
</div>

<style>
    .module-shell {
        display: grid;
        gap: 1rem;
        width: 100%;
    }

    .headline-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 0.75rem;
    }

    .legend {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.8rem;
        border-radius: 999px;
        min-height: 2rem;
        font-size: 0.8rem;
        line-height: 1;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(255, 255, 255, 0.08);
    }

    .legend-dot {
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 999px;
        box-shadow: 0 0 18px currentColor;
    }

    .stable {
        color: #91f0ff;
    }

    .lazer {
        color: #ff93d6;
    }

    .stable .legend-dot {
        background: #66deff;
    }

    .lazer .legend-dot {
        background: #ff67c1;
    }

    .bar-frame {
        position: relative;
        padding: 0.7rem;
        border-radius: 24px;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.05));
        border: 1px solid rgba(255, 255, 255, 0.14);
    }

    .bar-track {
        position: relative;
        height: 2.6rem;
        border-radius: 999px;
        overflow: hidden;
        background:
            linear-gradient(90deg, #ff5eb7 0%, #ff8acd 26%, #ff6e9f 100%);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.35),
            inset 0 -6px 18px rgba(84, 11, 51, 0.18);
    }

    .bar-track::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
            repeating-linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.14) 0 12px,
                rgba(255, 255, 255, 0.04) 12px 24px
            );
        mix-blend-mode: screen;
        opacity: 0.55;
    }

    .stable-fill {
        position: relative;
        width: var(--stable);
        max-width: 100%;
        height: 100%;
        border-radius: 999px;
        background:
            linear-gradient(135deg, #9af8ff 0%, #67d6ff 48%, #74e5ff 100%);
        box-shadow:
            0 0 30px rgba(103, 228, 255, 0.36),
            inset 0 1px 0 rgba(255, 255, 255, 0.45);
    }

    .boundary-glow {
        position: absolute;
        top: -25%;
        bottom: -25%;
        left: var(--stable);
        width: 2.4rem;
        transform: translateX(-50%);
        border-radius: 999px;
        background:
            radial-gradient(
                circle at center,
                rgba(255, 255, 255, 0.42) 0%,
                rgba(133, 238, 255, 0.26) 35%,
                rgba(255, 116, 188, 0.14) 58%,
                rgba(255, 116, 188, 0) 76%
            );
        filter: blur(8px);
        opacity: 0.8;
        pointer-events: none;
    }

    .shine,
    .pulse {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    .shine {
        background:
            linear-gradient(110deg, transparent 20%, rgba(255, 255, 255, 0.42) 50%, transparent 80%);
        transform: translateX(-100%);
        animation: sweep 3.2s ease-in-out infinite;
    }

    .pulse {
        background:
            radial-gradient(circle at right center, rgba(255, 255, 255, 0.6), transparent 32%);
        opacity: 0.7;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.85rem;
    }

    .stat-card {
        position: relative;
        display: grid;
        gap: 0.25rem;
        padding: 1rem;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.045));
        overflow: hidden;
    }

    .stat-card::before {
        content: "";
        position: absolute;
        inset: auto -15% -60% auto;
        width: 8rem;
        height: 8rem;
        border-radius: 999px;
        opacity: 0.35;
        filter: blur(16px);
    }

    .stable-card::before {
        background: #66deff;
    }

    .lazer-card::before {
        background: #ff67c1;
    }

    .stat-label,
    .stat-meta {
        position: relative;
        z-index: 1;
    }

    .stat-label {
        text-transform: uppercase;
        letter-spacing: 0.11em;
        font-size: 0.72rem;
        color: #d2dcff;
    }

    strong {
        position: relative;
        z-index: 1;
        font-family: "Space Grotesk", sans-serif;
        font-size: clamp(1.5rem, 3vw, 2.1rem);
        line-height: 1;
    }

    .stat-meta {
        color: rgba(245, 247, 255, 0.9);
        font-size: 0.88rem;
    }

    @keyframes sweep {
        0% {
            transform: translateX(-120%);
        }
        100% {
            transform: translateX(140%);
        }
    }

    @media (max-width: 640px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }

        .bar-track {
            height: 2.2rem;
        }
    }
</style>
