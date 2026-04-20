<script>
    import FooterLink from "./FooterLink.svelte";
    import { env } from "$env/dynamic/public";
</script>

<footer class="footer">
    <FooterLink url="https://github.com/Chiffario" title="github"></FooterLink>
    <FooterLink url="https://osu.ppy.sh/users/11482346" title="osu"
    ></FooterLink>
    <FooterLink url="https://www.donationalerts.com/r/ch1ffaa" title="donations"
    ></FooterLink>
    <span>version: {env.PUBLIC_VERSION}</span>
</footer>

<style>
    .footer {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-around;
    }
</style>
