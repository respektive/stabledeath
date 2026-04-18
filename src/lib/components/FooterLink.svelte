<script lang="ts">
    let { url, title } = $props();
</script>

<a href={url}>{title}</a>

<style>
    a {
        text-decoration: none;

        color: #31748f;

        &:visited {
            color: #6e6a86;
        }

        &:hover {
            color: #c4a7e7;
        }
    }
</style>
