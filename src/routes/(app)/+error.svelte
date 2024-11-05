<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="mt-20 box-border flex flex-col items-center justify-center overflow-hidden p-10">
	<h1 class="text-[70px] font-semibold">404</h1>

	<p class="mt-10">Səhifə mövcud deyil</p>

	<button
		type="button"
		onclick={() => goto('/')}
		class="group mt-10 flex items-center justify-center gap-2 rounded-xl bg-zinc-200 px-5 py-2 text-[15px] transition-all hover:bg-indigo-700 hover:text-white"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-5 stroke-zinc-600 transition-all group-hover:stroke-white"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
			/>
		</svg>

		Geri qayıt</button
	>
</div>
