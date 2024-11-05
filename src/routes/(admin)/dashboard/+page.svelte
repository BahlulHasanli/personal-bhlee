<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const menuItems = [
		'Əsas səhifə',
		'Haqqımda',
		'Bloglarım',
		'İşlərim',
		'İzlədiyim filmlər',
		'Linklərim'
	];

	const blogs = [
		{
			title: 'TypeScript öyrənmə qeydləri',
			date: '12 Noyabr 2024',
			status: 'draft'
		},
		{
			title: 'React Native ilə başlanğıc',
			date: '5 Noyabr 2024',
			status: 'published'
		},
		{
			title: 'Node.js məsləhətləri',
			date: '1 Noyabr 2024',
			status: 'published'
		}
	];

	function handleNewBlog() {
		goto(`${$page.url.pathname}/new`);
	}
</script>

<div class="min-h-screen bg-white">
	<!-- Header -->
	<header class="border-b border-gray-100 px-6 py-8">
		<nav class="mx-auto max-w-3xl">
			<ul class="flex gap-8">
				{#each menuItems as item}
					<li>
						<button class="text-gray-600 hover:text-black">
							{item}
						</button>
					</li>
				{/each}
			</ul>
		</nav>
	</header>

	<!-- Main Content -->
	<main class="mx-auto max-w-3xl py-12">
		<div class="mb-12">
			<div class="space-y-8">
				<div class="flex items-center justify-between">
					<h2>Bloglar</h2>
					<button
						class="rounded border border-gray-200 px-4 py-2 hover:bg-gray-50"
						onclick={handleNewBlog}
					>
						Yeni blog
					</button>
				</div>

				<div class="space-y-4">
					{#each blogs as blog}
						<div class="flex items-center justify-between border-b border-gray-100 py-4">
							<div>
								<h3 class="mb-1">{blog.title}</h3>
								<p class="text-sm text-gray-500">{blog.date}</p>
							</div>
							<div class="flex gap-4">
								<span
									class="text-sm {blog.status === 'published'
										? 'rounded-full p-2 text-green-600'
										: 'rounded-full p-2  text-zinc-700'}"
								>
									{blog.status}
								</span>
								<button class="text-sm text-gray-500 hover:text-sky-600">Düzəlt</button>
								<button class="text-sm text-gray-500 hover:text-red-600">Sil</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</main>
</div>
