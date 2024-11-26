<script lang="ts">
	import { page } from '$app/stores';
	import '../../app.css';

	let { children } = $props();

	let activeRoute: string = $state($page.url.pathname);

	function changeRoute(route: string): void {
		activeRoute = route;
	}

	$effect(() => {
		if ($page.url.pathname.startsWith('/blogs')) {
			activeRoute = '/blogs';
		}

		if ($page.url.pathname === '/') {
			activeRoute = '/';
		}
	});

	const copyRight: string = `Bahlul Hasanli ${String.fromCharCode(169)} ${new Date().getFullYear()}`;
</script>

<header>
	<div class="mb-5 flex h-[45px] items-center justify-center border-b bg-white">
		<div class="inter-mono-semibold">hasan</div>
		<div class="inter-mono-italic">lee</div>
	</div>

	<div class="mx-auto px-6 sm:max-w-[65ch]">
		<div class="mt-10 flex gap-5">
			<a
				href="/"
				onclick={() => changeRoute('/')}
				class={`inter-mono-regular text-gray-600 transition-all hover:text-indigo-600 ${
					activeRoute === '/' ? 'text-indigo-600' : ''
				}`}>Haqqımda</a
			>
			<a
				href="/blogs"
				onclick={() => changeRoute('/blogs')}
				class={`inter-mono-regular text-gray-600 transition-all hover:text-indigo-600 ${
					activeRoute === '/blogs' ? 'text-indigo-600' : ''
				}`}>Bloglarım</a
			>
			<a
				href="/projects"
				onclick={() => changeRoute('/projects')}
				class={`inter-mono-regular text-gray-600 transition-all hover:text-indigo-600 ${
					activeRoute === '/projects' ? 'text-indigo-600' : ''
				}`}>İşlərim</a
			>
			<a
				href="/links"
				onclick={() => changeRoute('/links')}
				class={`inter-mono-regular text-gray-600 transition-all hover:text-indigo-600 ${
					activeRoute === '/links' ? 'text-indigo-600' : ''
				}`}>Linklərim</a
			>
		</div>
		<div class="wave-separator mt-2"></div>
	</div>
</header>
<main class="mt-10 sm:mt-20">
	{@render children()}

	<!-- <div class="mx-auto mt-10 px-6 sm:mt-24 sm:max-w-[100ch]">image</div> -->
</main>

<footer class="mx-auto mt-20 px-6 sm:max-w-[65ch]">
	<div class="text-[15px] text-zinc-400">
		{copyRight}. Developed with {String.fromCharCode(0x2764)}
		<a
			href="https://svelte.dev"
			target="_blank"
			class="underline decoration-wavy transition-all hover:text-indigo-500">SvelteKit</a
		>
	</div>
</footer>
