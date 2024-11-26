<script lang="ts">
	import { timeAgo } from '$lib/utils';

	const { data } = $props();

	$inspect(data);
</script>

<div class="mx-auto px-6 sm:max-w-[65ch]">
	<div class="space-y-8">
		<ul
			class="flex gap-2 *:cursor-pointer *:rounded-xl *:bg-zinc-200 *:px-4 *:py-2 *:text-[16px] *:text-zinc-500"
		>
			<li class="!bg-zinc-900 !text-white">Qarışıq</li>
			<li class="transition-all hover:bg-zinc-900 hover:text-white">Oyunlar</li>
			<li class="transition-all hover:bg-zinc-900 hover:text-white">Filmlər</li>
		</ul>

		{#if data?.isSuccess}
			{#each data.posts as post}
				<article
					class="flex items-center gap-6 rounded-xl bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-6"
				>
					<div class="grid grid-cols-2 gap-6">
						<div class="h-[100px] !w-[250px] overflow-hidden rounded-2xl bg-slate-400">
							<img
								src="https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/25032568/AW2_10_08_23_002.jpg?quality=90&strip=all&crop=7.8125%2C0%2C84.375%2C100&w=1200"
								alt="alan-wake-2"
								class="h-full w-full object-cover object-top"
							/>
						</div>

						<div class="flex flex-col justify-between">
							<a
								href={`/blogs/${post.slug}`}
								class=" text-zinc-700 underline decoration-wavy transition-all hover:text-indigo-500"
							>
								<h1 class="inter-mono-semibold leading-7 tracking-tighter">
									{post.title}
								</h1>
							</a>

							<div
								class="inter-mono-medium mt-3 flex items-end justify-between text-[13px] text-zinc-400"
							>
								<p class="text-indigo-500">{post.category}</p>
								<p>
									{timeAgo(new Date(post.date))}
								</p>
							</div>
						</div>
					</div>
				</article>
			{/each}
		{:else}
			<div class="text-center">
				<p class="text-[15px] text-zinc-500">Yazı tapılmadı</p>
			</div>
		{/if}

		<div class="flex items-center justify-center">
			<button
				type="button"
				class="group flex w-[200px] items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white p-2 text-[15px] transition-all duration-200 hover:border-indigo-700"
				>Daha çox <svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-4 stroke-zinc-500 transition-all group-hover:stroke-indigo-800"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
					/>
				</svg>
			</button>
		</div>
	</div>
</div>
