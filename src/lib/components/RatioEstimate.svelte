<script lang="ts">
    import { date, dateOnly } from "$utils/types.js";
    import type { RegressionResult } from "$lib/server/backend.server";
    import SelfAnchor from "./SelfAnchor.svelte";

    const cache = new Map<number, RegressionResult>();

    let percentage = $state(50);
    let estimate = $state<RegressionResult | undefined>();
    let reached = $derived(estimate.was_reached);
    let loading = $state(false);
    let failed = $state(false);

    const estimatedDate = $derived(
        estimate ? dateOnly(estimate.estimated_timestamp) : "",
    );
    const stablePercentage = $derived(100 - percentage);

    $effect(() => {
        const selectedPercentage = percentage;
        const cached = cache.get(selectedPercentage);

        if (cached) {
            estimate = cached;
            loading = false;
            failed = false;
            return;
        }

        loading = true;
        failed = false;

        const controller = new AbortController();
        const timeout = setTimeout(async () => {
            try {
                const response = await fetch(
                    `/api/graphs/ratio_estimate/${selectedPercentage}`,
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    throw new Error("ratio estimate request failed");
                }

                const result = (await response.json()) as RegressionResult;
                cache.set(selectedPercentage, result);

                if (!controller.signal.aborted) {
                    estimate = result;
                    failed = false;
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    failed = true;
                }
            } finally {
                if (!controller.signal.aborted) {
                    loading = false;
                }
            }
        }, 50);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    });
</script>

<section class="estimate">
    <SelfAnchor anchor="regression">
        <h2>Daily average ratio estimate</h2>
    </SelfAnchor>
    <label>
        Target lazer ratio: {percentage}%
        <div class="slider" style="--stable: {percentage}%">
            <div class="bar-container">
                <div class="stable-bar"></div>
            </div>
            <input
                bind:value={percentage}
                min="1"
                max="100"
                step="1"
                type="range"
            />
        </div>
    </label>
    <div class="subscripts">
        <div>lazer: {percentage}%</div>
        <div>stable: {stablePercentage}%</div>
    </div>
    <p>
        {#if failed}
            Could not load estimate.
        {:else if loading && !estimate}
            Loading estimate...
        {:else if estimate && reached}
            Reached on: {estimatedDate}
        {:else}
            Estimated date: {estimatedDate}
        {/if}
    </p>
</section>

<style>
    .estimate {
        margin: 2rem auto;
        max-width: 700px;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .slider {
        position: relative;
    }

    .bar-container {
        background-color: #66ccff;
        border-radius: 10px;
        height: 20px;
        overflow: hidden;
        width: 100%;
    }

    .stable-bar {
        --slant: 3px;
        background-color: #ff66aa;
        height: 100%;
        position: relative;
        width: max(0px, calc(var(--stable) - var(--slant)));
    }

    .stable-bar::after {
        background-color: #ff66aa;
        clip-path: polygon(0 0, 0% 100%, 100% 0);
        content: "";
        height: 100%;
        position: absolute;
        right: calc(var(--slant) * -2);
        top: 0;
        width: calc(var(--slant) * 2);
    }

    input {
        appearance: none;
        background: transparent;
        height: 20px;
        inset: 0;
        margin: 0;
        opacity: 1;
        position: absolute;
        width: 100%;
    }

    input::-webkit-slider-runnable-track {
        background: transparent;
    }

    input::-moz-range-track {
        background: transparent;
    }

    input::-webkit-slider-thumb {
        appearance: none;
        background: #31748f;
        border: 2px solid white;
        border-radius: 50%;
        height: 24px;
        opacity: 0;
        width: 24px;
    }

    input::-moz-range-thumb {
        background: #31748f;
        border: 2px solid white;
        border-radius: 50%;
        height: 20px;
        opacity: 0;
        width: 20px;
    }

    .slider:hover input::-webkit-slider-thumb,
    input:focus-visible::-webkit-slider-thumb {
        opacity: 1;
    }

    .slider:hover input::-moz-range-thumb,
    input:focus-visible::-moz-range-thumb {
        opacity: 1;
    }

    .subscripts {
        display: flex;
        flex-direction: row;
        font-size: 0.9rem;
        justify-content: space-between;
        padding: 0 0.5rem;
    }
</style>
