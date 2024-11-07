<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>{data.meta.title}</title>
</svelte:head>

<svelte:component this={data.content} />
