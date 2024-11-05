<script lang="ts">
	import { goto } from '$app/navigation';
	import { Image as ImageIcon, MoveDown, MoveUp, Save, Trash2, Type } from 'lucide-svelte';
	import { onMount } from 'svelte';

	interface ContentBlock {
		id: string;
		type: 'text' | 'bigImage' | 'smallImage';
		content: string;
		imageUrl?: string;
		isLoading?: boolean;
	}

	// State variables
	let title = '';

	let contentBlocks: ContentBlock[] = [];

	let showImageModal = false;

	let previewImage: string | null = null;

	let selectedFile: File | null = null;

	let titleInput: HTMLInputElement;

	let imageInput: HTMLInputElement;

	let date = new Date().toLocaleDateString('az-AZ', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});

	// Focus title input on first load
	onMount(() => {
		if (titleInput) {
			titleInput.focus();
		}
	});

	const addTextBlock = () => {
		const newId = crypto.randomUUID();
		contentBlocks = [
			...contentBlocks,
			{
				id: newId,
				type: 'text',
				content: ''
			}
		];

		// Focus on the new textarea after render
		setTimeout(() => {
			const textarea = document.querySelector(
				`textarea[data-block-id="${newId}"]`
			) as HTMLTextAreaElement;

			if (textarea) {
				textarea.focus();
			}
		}, 0);
	};

	const handleImageModalOpen = (e: Event) => {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			selectedFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target?.result) {
					previewImage = e.target.result as string;
					showImageModal = true;
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const closeImageModal = () => {
		showImageModal = false;
		previewImage = null;
		selectedFile = null;

		if (imageInput) {
			imageInput.value = ''; // Reset input value
		}
	};

	const addImageBlock = (type: 'bigImage' | 'smallImage') => {
		if (previewImage) {
			contentBlocks = [
				...contentBlocks,
				{
					id: crypto.randomUUID(),
					type,
					content: '',
					imageUrl: previewImage,
					isLoading: false
				}
			];

			closeImageModal();
		}
	};

	const removeBlock = (id: string) => {
		contentBlocks = contentBlocks.filter((block) => block.id !== id);
	};

	const moveBlockUp = (index: number) => {
		if (index > 0) {
			const newBlocks = [...contentBlocks];
			[newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
			contentBlocks = newBlocks;
		}
	};

	const moveBlockDown = (index: number) => {
		if (index < contentBlocks.length - 1) {
			const newBlocks = [...contentBlocks];
			[newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
			contentBlocks = newBlocks;
		}
	};

	const handleSave = () => {
		console.log({
			title,
			date,
			blocks: contentBlocks
		});
		goto('/blogs');
	};
</script>

<article>
	<!-- Header -->
	<div class="mx-auto mb-10 mt-10 flex items-center justify-between pb-5 sm:max-w-[65ch]">
		<p class="text-[15px] text-zinc-500">{date}</p>

		<div class="flex items-center gap-3">
			<button
				type="button"
				onclick={() => goto('/dashboard')}
				class="rounded-xl bg-zinc-200 p-2 text-[14px] font-medium transition-all hover:bg-zinc-300"
			>
				İmtina
			</button>
			<button
				type="button"
				onclick={handleSave}
				class="flex items-center gap-2 rounded-xl bg-indigo-600 p-2 text-[14px] font-medium text-white transition-all hover:bg-indigo-700"
			>
				<Save size={18} /> Yadda saxla
			</button>
		</div>
	</div>

	<!-- Title Input -->
	<div class="mx-auto px-6 sm:max-w-[65ch]">
		<input
			bind:this={titleInput}
			type="text"
			bind:value={title}
			placeholder="Başlıq..."
			class="mb-5 w-full rounded-md border-none bg-transparent bg-white text-[25px] font-semibold leading-8 tracking-tight outline-none focus:ring-0"
		/>
	</div>

	<!-- Dynamic Content Blocks -->
	{#each contentBlocks as block, index}
		{#if block.type === 'text'}
			<div class="mx-auto px-6 sm:max-w-[65ch]">
				<div class="group relative">
					<!-- Block Controls -->
					<div class="absolute -left-16 top-0 opacity-0 transition-opacity group-hover:opacity-100">
						<div class="flex flex-col gap-2 rounded-lg bg-white p-1 backdrop-blur-sm">
							<button
								type="button"
								onclick={() => moveBlockUp(index)}
								class="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
								disabled={index === 0}
							>
								<MoveUp size={16} />
							</button>
							<button
								type="button"
								onclick={() => moveBlockDown(index)}
								class="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
								disabled={index === contentBlocks.length - 1}
							>
								<MoveDown size={16} />
							</button>
							<button
								type="button"
								onclick={() => removeBlock(block.id)}
								class="rounded-md p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
							>
								<Trash2 size={16} />
							</button>
						</div>
					</div>

					<!-- Text Block -->
					<textarea
						data-block-id={block.id}
						bind:value={block.content}
						placeholder="Məzmunu buraya yazın..."
						class="w-full resize border-none bg-transparent bg-white text-[14px] tracking-tight outline-none focus:ring-0"
						rows="4"
					></textarea>
				</div>
			</div>
		{:else if block.type === 'bigImage'}
			<div class="group relative">
				<div class="my-10 h-[calc(100vh-23.0625rem)] w-full overflow-hidden">
					{#if block.isLoading}
						<div class="flex h-full w-full items-center justify-center bg-zinc-100">
							<div
								class="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-indigo-600"
							></div>
						</div>
					{:else if block.imageUrl}
						<div class="relative h-full">
							<img
								src={block.imageUrl}
								alt={block.id}
								class="h-full w-full object-cover object-top"
							/>

							<!-- Block Controls - Overlay -->
							<div
								class="absolute left-4 top-4 opacity-0 transition-all duration-200 group-hover:opacity-100"
							>
								<div class="flex flex-col gap-2 rounded-xl bg-white p-2 backdrop-blur-sm">
									<button
										type="button"
										onclick={() => moveBlockUp(index)}
										class="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
										disabled={index === 0}
									>
										<MoveUp size={16} />
									</button>
									<button
										type="button"
										onclick={() => moveBlockDown(index)}
										class="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
										disabled={index === contentBlocks.length - 1}
									>
										<MoveDown size={16} />
									</button>
									<button
										type="button"
										onclick={() => removeBlock(block.id)}
										class="rounded-md p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
									>
										<Trash2 size={16} />
									</button>
								</div>
							</div>
						</div>
					{/if}
				</div>

				{#if block.imageUrl}
					<div class="mx-auto -mt-6 mb-5 px-6 sm:max-w-[65ch]">
						<input
							type="text"
							bind:value={block.content}
							placeholder="Şəkil haqqında məlumat..."
							class="w-full rounded-md border-none bg-transparent bg-white text-[12px] tracking-tight text-zinc-500 outline-none focus:ring-0"
						/>
					</div>
				{/if}
			</div>
		{:else if block.type === 'smallImage'}
			<div class="mx-auto px-6 sm:max-w-[65ch]">
				<div class="group relative">
					<!-- Block Controls -->
					<div class="absolute -left-16 top-0 opacity-0 transition-opacity group-hover:opacity-100">
						<div class="flex flex-col gap-2 rounded-lg bg-white/50 p-1 backdrop-blur-sm">
							<button
								type="button"
								onclick={() => moveBlockUp(index)}
								class="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
								disabled={index === 0}
							>
								<MoveUp size={16} />
							</button>
							<button
								type="button"
								onclick={() => moveBlockDown(index)}
								class="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
								disabled={index === contentBlocks.length - 1}
							>
								<MoveDown size={16} />
							</button>
							<button
								type="button"
								onclick={() => removeBlock(block.id)}
								class="rounded-md p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
							>
								<Trash2 size={16} />
							</button>
						</div>
					</div>

					<!-- Small Image Block -->
					<div class="overflow-hidden bg-zinc-100">
						{#if block.isLoading}
							<div class="flex h-48 w-full items-center justify-center">
								<div
									class="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-indigo-600"
								></div>
							</div>
						{:else if block.imageUrl}
							<img src={block.imageUrl} alt={block.id} class="w-full" />
						{/if}
					</div>

					{#if block.imageUrl}
						<input
							type="text"
							bind:value={block.content}
							placeholder="Şəkil haqqında məlumat..."
							class="mt-2 w-full border-none bg-transparent text-[12px] tracking-tight text-zinc-500 outline-none focus:ring-0"
						/>
					{/if}
				</div>
			</div>
		{/if}
	{/each}

	<!-- Fixed Add Block Panel -->
	<div class="fixed right-10 top-1/2 z-40 -translate-y-1/2">
		<div class="flex flex-col gap-3 rounded-2xl bg-white/80 p-3 shadow-lg backdrop-blur-sm">
			<button
				type="button"
				onclick={addTextBlock}
				class="flex items-center gap-2 rounded-xl bg-zinc-100/80 px-4 py-2.5 text-[14px] transition-all hover:bg-zinc-200"
			>
				<Type size={16} />
				Mətn əlavə et
			</button>
			<label
				class="flex cursor-pointer items-center gap-2 rounded-xl bg-zinc-100/80 px-4 py-2.5 text-[14px] transition-all hover:bg-zinc-200"
			>
				<ImageIcon size={16} />
				Şəkil əlavə et
				<input
					bind:this={imageInput}
					type="file"
					class="hidden"
					accept="image/*"
					onchange={handleImageModalOpen}
				/>
			</label>
		</div>
	</div>

	<!-- Image Upload Modal -->
	{#if showImageModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="mx-4 w-full max-w-2xl rounded-2xl bg-white p-6">
				<h3 class="mb-4 text-lg font-medium">Şəkil tipi seçin</h3>

				<!-- Image Preview -->
				<div class="relative mb-6 overflow-hidden rounded-xl bg-zinc-100">
					{#if previewImage}
						<img src={previewImage} alt="Preview" class="h-64 w-full object-cover" />
					{/if}
				</div>

				<!-- Type Selection -->
				<div class="flex justify-end gap-4">
					<button
						type="button"
						onclick={closeImageModal}
						class="rounded-xl bg-zinc-100 px-4 py-2 text-[14px] transition-colors hover:bg-zinc-200"
					>
						İmtina
					</button>
					<button
						type="button"
						onclick={() => addImageBlock('smallImage')}
						class="rounded-xl bg-zinc-100 px-4 py-2 text-[14px] transition-colors hover:bg-zinc-200"
					>
						Kiçik şəkil
					</button>
					<button
						type="button"
						onclick={() => addImageBlock('bigImage')}
						class="rounded-xl bg-indigo-600 px-4 py-2 text-[14px] text-white transition-colors hover:bg-indigo-700"
					>
						Böyük şəkil
					</button>
				</div>
			</div>
		</div>
	{/if}
</article>
