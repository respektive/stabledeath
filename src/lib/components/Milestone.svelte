<script lang="ts">
    let { row, date, children } = $props();
    // svelte-ignore state_referenced_locally
    let displayDate = date ? new Date(date).toLocaleDateString("en-GB") : "TBD";
    // svelte-ignore state_referenced_locally
    let succeeded = date ? true : false;
</script>

<div class="card {succeeded ? 'reached' : 'waiting'}" style="grid-row: {row}">
    <h4 class="date">{displayDate}</h4>
    <h2>{@render children()}</h2>
</div>

<style>
    .card {
        border: 3px solid;
        border-radius: 20px;
        padding: 5px;
        overflow: hidden;
        max-width: 350px;
    }
    .date {
        color: light-dark(#908caa, black);
    }
    .reached {
        border-color: #88b300;
        grid-column: 1;
    }
    .waiting {
        border-color: #ed1221;
        grid-column: 2;
    }
    h2,
    h4 {
        margin: 5px;
    }
</style>
