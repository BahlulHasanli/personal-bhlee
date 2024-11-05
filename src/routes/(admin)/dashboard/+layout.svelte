<script lang="ts">
	import { goto } from '$app/navigation';
	let { children } = $props();

	const menuItems = [
		{
			id: 1,
			title: 'Əsas səhifə',
			link: ''
		},
		{
			id: 2,
			title: 'Haqqımda',
			link: 'about'
		},
		{
			id: 3,
			title: 'Bloglarım',
			link: 'blogs'
		},
		{
			id: 4,
			title: 'İşlərim',
			link: 'works'
		},
		{
			id: 5,
			title: 'İzlədiyim filmlər',
			link: 'movies'
		},
		{
			id: 6,
			title: 'Linklərim',
			link: 'links'
		}
	];
</script>

<div class="min-h-screen">
	<!-- Header -->
	<header class="border-b border-zinc-200 px-6 py-8">
		<nav class="mx-auto max-w-3xl">
			<ul class="flex gap-8">
				{#each menuItems as item}
					<li>
						<button
							type="button"
							class="text-gray-600 hover:text-black"
							onclick={() => goto(`/dashboard/${item.link}`)}
						>
							{item.title}
						</button>
					</li>
				{/each}
			</ul>
		</nav>
	</header>

	<!-- Main Content -->
	{@render children()}
</div>
