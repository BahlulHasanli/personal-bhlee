import { json } from '@sveltejs/kit';
import crypto from 'crypto';
import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

interface Post {
	title: string;
	date: string;
	category: string;
	slug: string;
	published: boolean;
}

async function getPosts() {
	let posts: Post[] = [];

	const paths = import.meta.glob('/src/posts/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>;
			const post = { ...metadata, slug };

			post.published && posts.push(post);
		}
	}

	// Tarixə görə sırala
	posts = posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);

	return posts;
}

export async function GET({ url }) {
	try {
		const category = url.searchParams.get('category');

		if (category) {
			const posts = await getPosts();
			const filteredPosts = posts.filter((post) => post.category === category);

			return json({
				isSuccess: true,
				posts: filteredPosts
			});
		} else {
			return json({
				isSuccess: true,
				posts: await getPosts()
			});
		}
	} catch (error) {
		return json({
			isSuccess: false,
			message: 'Error fetching posts',
			error: error instanceof Error ? error.message : 'Unknown error'
		});
	}
}

export async function POST({ request }) {
	try {
		const currentFilePath = fileURLToPath(import.meta.url);
		const currentDir = dirname(currentFilePath);
		const postsDir = join(dirname(dirname(dirname(currentDir))), 'posts');

		const res = await request.json();

		const fileName = `post-${crypto.randomUUID()}.md`;

		// Dizin kontrolü ve oluşturma
		await fs.mkdir(postsDir, { recursive: true });

		// Dosyayı kaydet
		await fs.writeFile(join(postsDir, fileName), res.html);

		return json({
			success: true,
			message: 'Post created successfully',
			data: {
				fileName,
				category: res.category
			}
		});
	} catch (error) {
		return json({
			success: false,
			message: 'Error creating post',
			error: error instanceof Error ? error.message : 'Unknown error'
		});
	}
}
