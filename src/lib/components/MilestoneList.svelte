<script lang="ts">
    import Milestone from "./Milestone.svelte";

    const reached = [
        { date: 1706562000000, milestone: "pp release" },
        { date: 1721854800000, milestone: "Daily challenges" },
        { date: 1740430800000, milestone: "Beatmap submission" },
        { date: 1747170000000, milestone: "Satori GC" },
        { date: 1749070800000, milestone: "Song select v2" },
        { date: 1761685200000, milestone: "WASAPI improvements" },
        { date: 1776459600000, milestone: "Ranked play" },
    ];

    const tba = [
        "New score multipliers",
        "Results screen v2",
        "Majority on lazer",
        "Real-time diffcalc",
        "OWC on lazer",
        "App store release",
        "Stable deprecated",
    ];
</script>

<div>
    <h2>Cool milestones</h2>
    <div class="card-container">
        {#each reached as _, i}
            <Milestone row={i + 1} date={reached[i].date}
                >{reached[i].milestone}</Milestone
            >
            <Milestone row={i + 1} date={null}>{tba[i]}</Milestone>
        {/each}
    </div>
</div>

<style>
    .card-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 1rem;
        row-gap: 1rem;
        max-width: 700px;
        margin: auto;
    }
</style>
