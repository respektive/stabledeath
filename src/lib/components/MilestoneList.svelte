<script lang="ts">
    import Milestone from "./Milestone.svelte";
</script>

<div>
    <h2>Cool milestones</h2>
    <div class="card-container">
        <Milestone date={1706562000000}>pp release</Milestone>
        <Milestone date={1721854800000}>Daily challenges</Milestone>
        <Milestone date={1740430800000}>Beatmap submission</Milestone>
        <Milestone date={1747170000000}>Satori GC</Milestone>
        <Milestone date={1749070800000}>Song select v2</Milestone>
        <Milestone date={1761685200000}>WASAPI</Milestone>
        <Milestone date={1776459600000}>Ranked play</Milestone>
        <Milestone date={null}>Real-time diffcalc</Milestone>
        <Milestone date={null}>Results screen v2</Milestone>
        <Milestone date={null}>New score multipliers</Milestone>
        <Milestone date={null}>OWC on lazer</Milestone>
        <Milestone date={null}>Majority on lazer</Milestone>
        <Milestone date={null}>App store release</Milestone>
    </div>
</div>

<style>
    .card-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        column-gap: 1rem;
        flex-wrap: wrap;
        max-height: 600px;
        margin: 20px;
    }
</style>
