<script lang="ts">
    let { anchor, children }: { anchor: string; children: any } = $props();

    let copied = false;
    async function handleClick(event) {
        event.preventDefault();

        const url = `${window.location.origin}${window.location.pathname}#${anchor}`;

        try {
            await navigator.clipboard.writeText(url);
            copied = true;
            setTimeout(() => (copied = false), 1000);
        } catch {
            const tmp = document.createElement("textarea");
            tmp.value = url;
            document.body.appendChild(tmp);
            tmp.select();
            document.execCommand("copy");
            document.body.removeChild(tmp);
        }
    }
</script>

<div id={anchor}>
    <a href="#{anchor}" class="anchor-link" onclick={handleClick}>
        {@render children()}
    </a>
</div>

<style>
    .anchor-link {
        color: inherit;
        text-decoration: none;
        cursor: pointer;
    }

    .anchor-link:visited,
    .anchor-link:hover,
    .anchor-link:active {
        color: inherit;
        text-decoration: none;
    }

    .anchor-link.copied::after {
        content: " (copied)";
        font-size: 0.8em;
    }
</style>
