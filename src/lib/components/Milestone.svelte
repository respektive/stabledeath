<script lang="ts">
    let { date, children } = $props();
    let displayDate = date ? new Date(date).toLocaleDateString("en-GB") : "TBD";
    let succeeded = date ? true : false;
</script>

<div class="card {succeeded ? 'reached' : 'waiting'}">
    <h4 class="date">{displayDate}</h4>
    <h2>{@render children()}</h2>
</div>

<style>
    .card {
        width: 30%;
        border: 3px solid;
        border-radius: 20px;
        padding: 5px;
    }
    .date {
        color: light-dark(#908caa, black);
    }
    .reached {
        border-color: #88b300;
    }
    .waiting {
        border-color: #ed1221;
    }
    h2,
    h4 {
        margin: 5px;
    }
</style>
