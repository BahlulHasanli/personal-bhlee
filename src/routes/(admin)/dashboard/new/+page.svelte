<script lang="ts">
	import { goto } from '$app/navigation';
	import { Image as ImageIcon, Link, MoveDown, MoveUp, Save, Trash2, Type } from 'lucide-svelte';
	import { onMount } from 'svelte';

	// Types
	interface ContentBlock {
		id: string;
		type: 'text' | 'bigImage' | 'smallImage';
		content: string;
		imageUrl?: string;
	}

	interface BlogPost {
		title: string;
		date: string;
		blocks: ContentBlock[];
	}

	interface ContentBlock {
		id: string;
		type: 'text' | 'bigImage' | 'smallImage';
		content: string;
		imageUrl?: string;
		isLoading?: boolean;
	}

	// State variables
	let title = $state('');
	let category = $state('');

	const categories = ['Technology', 'Travel', 'Food', 'Lifestyle', 'Personal', 'Other'];

	let urlImageError = $state(false);
	let urlImageLoaded = $state(false);
	let imageUrl = $state('');

	let showImageModal = $state(false); // İlk modal (seçim)
	let showUploadModal = $state(false); // URL yükləmə modalı
	let showSizeModal = $state(false); // Ölçü seçim modalı
	let uploadType = $state<'file' | 'url'>('file');

	// URL validation funksiyası
	const isValidImageUrl = (url: string) => {
		try {
			const parsedUrl = new URL(url);
			const pathname = parsedUrl.pathname.toLowerCase();
			const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

			// URL-in path hissəsində hər hansı bir şəkil formatı varmı yoxlayır
			return imageExtensions.some((ext) => pathname.includes(ext));
		} catch {
			return false;
		}
	};

	let contentBlocks = $state<ContentBlock[]>([]);

	let previewImage = $state<string | null>(null);

	let selectedFile: File | null = null;

	let titleInput = $state<HTMLDivElement | null>(null);

	let imageInput = $state<HTMLInputElement | null>(null);

	// URL input handler
	const handleUrlInput = (event: Event) => {
		const input = event.target as HTMLInputElement;
		imageUrl = input.value.trim();

		urlImageError = false;
		urlImageLoaded = false;

		if (imageUrl && !isValidImageUrl(imageUrl)) {
			urlImageError = true;
		}
	};

	let date = new Date().toLocaleDateString('az-AZ', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});

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

		setTimeout(() => {
			const contentEditableDIV = document.querySelector(
				`div[data-block-id="${newId}"]`
			) as HTMLDivElement;

			if (contentEditableDIV) {
				contentEditableDIV.focus();
			}
		}, 0);
	};

	const handleContentUpdate = (event: Event, blockId: string) => {
		try {
			const div = event.target as HTMLDivElement;
			if (!div) return;

			// Get text content safely
			let cleanContent = div.textContent || '';

			// Normalize whitespace while preserving intentional line breaks
			cleanContent = cleanContent
				.split('\n') // Split into lines
				.map((line) => line.trim()) // Trim each line
				.filter((line) => line) // Remove empty lines
				.join('\n'); // Rejoin with single line breaks

			// Update state immutably
			contentBlocks = contentBlocks.map((block) =>
				block.id === blockId ? { ...block, content: cleanContent } : block
			);

			// Update display safely using textContent
			div.textContent = cleanContent;
		} catch (error) {
			console.error('Error updating content:', error);
			// Optionally add error handling UI feedback
		}
	};

	const cleanPaste = (e: ClipboardEvent, blockId: string) => {
		e.preventDefault();

		let text = e.clipboardData?.getData('text/plain') || '';

		// Metni temizle
		text = text
			.replace(/(\r\n|\n|\r)/gm, ' ') // Satır sonlarını boşluğa çevir
			.replace(/\s+/g, ' ') // Birden fazla boşluğu teke indir
			.trim(); // Baş ve sondaki boşlukları temizle

		// Temiz metni ekle
		document.execCommand('insertText', false, text);

		// İçeriği güncelle
		const div = e.target as HTMLDivElement;
		contentBlocks = contentBlocks.map((block) =>
			block.id === blockId ? { ...block, content: text } : block
		);
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
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const addImageBlock = (type: 'bigImage' | 'smallImage') => {
		if (uploadType === 'file' && previewImage) {
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
		} else if (uploadType === 'url' && imageUrl && urlImageLoaded) {
			contentBlocks = [
				...contentBlocks,
				{
					id: crypto.randomUUID(),
					type,
					content: '',
					imageUrl: imageUrl,
					isLoading: false
				}
			];
		}

		closeImageModal();
	};

	const closeImageModal = () => {
		showImageModal = false;
		showUploadModal = false;
		showSizeModal = false;
		previewImage = null;
		selectedFile = null;
		imageUrl = '';
		urlImageLoaded = false;
		urlImageError = false;
		uploadType = 'file';

		if (imageInput) {
			imageInput.value = '';
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

	const handleSave = async () => {
		if (!category) {
			alert('Bölmə seçin');

			return;
		}

		const htmlString = getBlocksAsString();

		const response = await fetch('/api/posts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				html: htmlString
			})
		});
	};

	const getBlocksAsString = () => {
		const titleTemplate = (titl: any) => `---
title: '${title}' 
date: '${new Date().toISOString().split('T')[0]}'
published: true,
category: '${category}' 
---\n\n`;

		const textBlockTemplate = (content: any) => `
<!-- Big Text paragraph -->
<div class="mx-auto px-6 sm:max-w-[65ch]">
    <p class="my-10 break-words text-[14px] tracking-tight">
        ${content}
    </p> 
</div>\n`;

		const bigImageTemplate = (block: any) => `
<!-- Big screen image -->
<div class="my-10 h-[calc(100vh-23.0625rem)] w-full overflow-hidden">
    <img
        src="${block.imageUrl}"
        alt="${block.id}"
        class="h-full w-full object-cover object-top"
    />
</div>
${
	block.content
		? `<div class="mx-auto px-6 sm:max-w-[65ch]">
    <p class="text-[12px] text-zinc-500 mt-2 mb-10">
        ${block.content} 
    </p>
</div>\n`
		: ''
}\n`;

		const smallImageTemplate = (block: any) => `
<!-- Small screen image -->
<div class="mx-auto px-6 sm:max-w-[65ch]">
    <img
        src="${block.imageUrl}"
        alt="${block.id}"
    />
    ${
			block.content
				? `<p class="text-[12px] text-zinc-500 mt-2">
        ${block.content}
    </p>`
				: ''
		}
</div>\n`;

		// String oluşturma
		let contentString = titleTemplate(title);

		// İçerik bloklarını dönüştürme
		contentBlocks.forEach((block) => {
			const templates = {
				text: () => textBlockTemplate(block.content),
				bigImage: () => bigImageTemplate(block),
				smallImage: () => smallImageTemplate(block)
			};

			if (templates[block.type]) {
				contentString += templates[block.type]();
			}
		});

		return contentString;
	};
</script>

<article>
	<!-- Header -->
	<div class="mx-auto mb-10 mt-10 flex items-center justify-between pb-5 sm:max-w-[65ch]">
		<p class="text-[15px] text-zinc-500">{date}</p>
		<div class="flex items-center gap-3">
			<select
				bind:value={category}
				class="cursor-pointer rounded-md border border-zinc-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
			>
				<option value="">Bölmə</option>
				{#each categories as cat}
					<option value={cat}>{cat}</option>
				{/each}
			</select>
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
	<div class="mx-auto sm:max-w-[65ch]">
		<div
			bind:this={titleInput}
			contenteditable="true"
			role="textbox"
			aria-label="Başlık"
			bind:innerHTML={title}
			placeholder="Başlıq..."
			onpaste={(e: any) => {
				e.preventDefault();

				let text = e.clipboardData?.getData('text/plain') || '';

				// Metni temizle
				text = text
					.replace(/(\r\n|\n|\r)/gm, ' ') // Satır sonlarını boşluğa çevir
					.replace(/\s+/g, ' ') // Birden fazla boşluğu teke indir
					.trim(); // Baş ve sondaki boşlukları temizle

				// Temiz metni ekle
				const selection: any = window.getSelection();
				if (!selection.rangeCount) return;

				selection.deleteFromDocument();
				selection.getRangeAt(0).insertNode(document.createTextNode(text));

				// // İçeriği güncelle
				// return e.target as HTMLDivElement;
			}}
			oninput={(e: any) => (title = e.target.innerHTML)}
			class="mb-5 w-full rounded-md border-none bg-transparent bg-white p-3 text-[25px] font-semibold leading-8 tracking-tight outline-none empty:before:text-zinc-400 empty:before:content-[attr(placeholder)] focus:ring-0"
		></div>
	</div>

	<!-- Dynamic Content Blocks -->
	{#each contentBlocks as block, index}
		{#if block.type === 'text'}
			<div class="mx-auto sm:max-w-[65ch]">
				<!-- Panel ve text block arasındaki boşluğu kapsayacak bir wrapper -->
				<div class="group relative">
					<div
						class="absolute -left-16 top-0 z-20 h-full w-[calc(100%+64px)] opacity-0 transition-opacity group-hover:opacity-100"
					>
						<div class="absolute flex flex-col gap-2 rounded-lg bg-white p-1 backdrop-blur-sm">
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
					<div
						data-block-id={block.id}
						contenteditable="true"
						role="textbox"
						aria-label="Mətn"
						placeholder="Məzmunu buraya yazın..."
						onpaste={(e: any) => {
							e.preventDefault();

							let text = e.clipboardData?.getData('text/plain') || '';

							// Metni temizle
							text = text
								.replace(/(\r\n|\n|\r)/gm, ' ') // Satır sonlarını boşluğa çevir
								.replace(/\s+/g, ' ') // Birden fazla boşluğu teke indir
								.trim(); // Baş ve sondaki boşlukları temizle

							// Temiz metni ekle
							const selection: any = window.getSelection();
							if (!selection.rangeCount) return;

							selection.deleteFromDocument();
							selection.getRangeAt(0).insertNode(document.createTextNode(text));

							// // İçeriği güncelle
							// return e.target as HTMLDivElement;
						}}
						oninput={(e) => handleContentUpdate(e, block.id)}
						class="relative z-30 mb-5 w-full rounded-md border-none bg-transparent bg-white p-3 text-[14px] tracking-tight outline-none empty:before:text-zinc-400 empty:before:content-[attr(placeholder)] focus:ring-0"
					></div>
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
					<div class="relative z-40 mx-auto -mt-6 mb-5 px-6 sm:max-w-[65ch]">
						<input
							type="text"
							bind:value={block.content}
							placeholder="Şəkil haqqında məlumat..."
							class="w-full rounded-md border-none bg-transparent text-[12px] tracking-tight text-zinc-500 outline-none focus:ring-0"
						/>
					</div>
				{/if}
			</div>
		{:else if block.type === 'smallImage'}
			<div class="mx-auto sm:max-w-[65ch]">
				<div class="group relative">
					<div
						class="absolute -left-16 top-0 z-20 h-full w-[calc(100%+64px)] opacity-0 transition-opacity group-hover:opacity-100"
					>
						<div class="absolute flex flex-col gap-2 rounded-lg bg-white p-1 backdrop-blur-sm">
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
						<div class="relative z-40">
							<input
								type="text"
								bind:value={block.content}
								placeholder="Şəkil haqqında məlumat..."
								class="mt-2 w-full border-none bg-transparent text-[12px] tracking-tight text-zinc-500 outline-none focus:ring-0"
							/>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	{/each}

	<!-- Editor panel -->
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
			<button
				type="button"
				class="flex items-center gap-2 rounded-xl bg-zinc-100/80 px-4 py-2.5 text-[14px] transition-all hover:bg-zinc-200"
				onclick={() => (showImageModal = true)}
				onkeydown={(e) => e.key === 'Enter' && (showImageModal = true)}
			>
				<ImageIcon size={16} />
				Şəkil əlavə et
			</button>
		</div>
	</div>

	<!-- Şəkil yükləmə tipinin modalı -->
	{#if showImageModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="mx-4 w-full max-w-md rounded-2xl bg-white p-6">
				<h3 class="mb-6 text-center text-lg font-medium">Şəkil əlavə et</h3>

				<div class="flex flex-col gap-4">
					<label
						class="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-100 px-6 py-4 text-[14px] transition-all hover:bg-zinc-200"
					>
						<ImageIcon size={18} />
						Fayldan yüklə
						<input
							bind:this={imageInput}
							type="file"
							class="hidden"
							accept="image/*"
							onchange={(e) => {
								uploadType = 'file';

								handleImageModalOpen(e);

								showImageModal = false;
								showSizeModal = true;
							}}
						/>
					</label>

					<button
						class="flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-6 py-4 text-[14px] transition-all hover:bg-zinc-200"
						onclick={() => {
							uploadType = 'url';
							showUploadModal = true;
							showImageModal = false;
						}}
					>
						<Link size={18} />
						URL-dən yüklə
					</button>

					<button
						class="mt-2 rounded-xl bg-indigo-100 px-4 py-2 text-[14px] text-indigo-500 transition-all hover:bg-indigo-200"
						onclick={closeImageModal}
					>
						İmtina
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- URL-dən şəkil yükləmə modalı -->
	{#if showUploadModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="mx-4 w-full max-w-2xl rounded-2xl bg-white p-6">
				<div class="mb-6">
					<input
						type="url"
						bind:value={imageUrl}
						placeholder="Şəkil URL-ni daxil edin..."
						class="w-full rounded-xl border {urlImageError && imageUrl
							? 'border-red-500'
							: 'border-zinc-200'} px-4 py-2 text-[14px] outline-none focus:border-indigo-600"
						oninput={handleUrlInput}
					/>

					{#if imageUrl && !urlImageError}
						<div class="mt-4 overflow-hidden rounded-xl bg-zinc-100">
							<img
								src={imageUrl}
								alt="URL Preview"
								class="h-64 w-full object-cover"
								onload={() => {
									urlImageLoaded = true;
									showUploadModal = false;
									showSizeModal = true;
								}}
								onerror={() => {
									urlImageError = true;
									urlImageLoaded = false;
								}}
							/>
						</div>
					{/if}

					{#if urlImageError && imageUrl}
						<p class="mt-2 text-[14px] text-red-500">
							Şəkil yüklənmədi. Düzgün şəkil URL-i daxil edin.
						</p>
					{/if}
				</div>

				<div class="flex justify-end gap-4">
					<button
						type="button"
						onclick={closeImageModal}
						class="rounded-xl bg-indigo-100 px-4 py-2 text-[14px] text-indigo-500 transition-colors hover:bg-indigo-200"
					>
						İmtina
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Ölçü seçimi modalı -->
	{#if showSizeModal && (previewImage || (imageUrl && urlImageLoaded))}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="mx-4 w-full max-w-2xl rounded-2xl bg-white p-6">
				<!-- Şəkil preview -->
				<div class="mb-6">
					<div class="relative overflow-hidden rounded-xl bg-zinc-100">
						<img
							src={uploadType === 'file' ? previewImage : imageUrl}
							alt="Preview"
							class="h-64 w-full object-cover"
						/>
					</div>
				</div>

				<!-- Ölçü seçimi buttonları -->
				<div class="flex justify-end gap-4">
					<button
						type="button"
						onclick={closeImageModal}
						class="rounded-xl bg-indigo-100 px-4 py-2 text-[14px] text-indigo-500 transition-colors hover:bg-indigo-200"
					>
						İmtina
					</button>
					<button
						type="button"
						onclick={() => addImageBlock('smallImage')}
						class="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-[14px] transition-colors hover:bg-zinc-200"
					>
						<ImageIcon size={16} />
						Kiçik şəkil
					</button>
					<button
						type="button"
						onclick={() => addImageBlock('bigImage')}
						class="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-[14px] transition-colors hover:bg-zinc-200"
					>
						<ImageIcon size={16} />
						Böyük şəkil
					</button>
				</div>
			</div>
		</div>
	{/if}
</article>
