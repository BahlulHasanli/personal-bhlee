<script lang="ts">
	import { CornerDownLeft } from 'lucide-svelte';
</script>

<div class="mt-20 box-border flex flex-col items-center justify-center overflow-hidden p-10">
	<h1 class="text-[70px] font-semibold">404</h1>

	<p class="mt-10">Səhifə mövcud deyil</p>

	<button
		type="button"
		onclick={() => history.back()}
		class="group mt-10 flex items-center justify-center gap-2 rounded-xl bg-zinc-200 px-5 py-2 text-[15px] transition-all hover:bg-indigo-700 hover:text-white"
	>
		<CornerDownLeft size={17} />

		Geri qayıt</button
	>
</div>
