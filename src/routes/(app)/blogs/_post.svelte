<script lang="ts">
	import { goto } from '$app/navigation';
	export let title;
	export let date;
</script>

<article>
	<div class="mx-auto mb-10 flex items-center justify-between px-6 sm:max-w-[65ch]">
		<p class="text-[15px] text-zinc-500">{date}</p>

		<button
			type="button"
			onclick={() => goto('/blogs')}
			class="w-[100px] rounded-xl bg-zinc-200 p-[6px] text-[15px] font-medium transition-all hover:bg-indigo-700 hover:text-white"
		>
			Geri
		</button>
	</div>

	<div class="mx-auto px-6 sm:max-w-[65ch]">
		<h1 class="zilla-slab-semibold text-[32px] leading-8 tracking-tight">
			{title}
		</h1>
	</div>

	<slot />
</article>
