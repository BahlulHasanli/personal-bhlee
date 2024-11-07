import { error } from '@sveltejs/kit';

export async function load({ params }: any) {
	try {
		// Tüm md dosyalarını import et
		const posts = import.meta.glob('/src/posts/*.md');

		// İstenen dosyayı bul
		const post = posts[`/src/posts/${params.slug}.md`];

		if (!post) {
			throw error(404, `Post ${params.slug} not found`);
		}

		const loadedPost: any = await post();

		return {
			content: loadedPost.default,
			meta: loadedPost.metadata
		};
	} catch (e) {
		console.error('Hata:', e);
		throw error(404, `Could not find ${params.slug}`);
	}
}
