import { json } from '@sveltejs/kit';
import crypto from 'crypto';
import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

async function getPosts() {
	let posts: any[] = [];

	const paths = import.meta.glob('/src/posts/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata: any = file.metadata;
			const post = { ...metadata, slug };
			console.log(post);

			post.published && posts.push(post);
		}
	}

	posts = posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);

	return posts;
}

export async function GET() {
	const posts: any = await getPosts();

	console.log(posts);

	if (posts?.length) {
		return json({
			isSuccess: true,
			posts: posts
		});
	}

	return json({
		isSuccess: false,
		message: 'No posts found'
	});
}

export async function POST({ request }) {
	try {
		const currentFilePath = fileURLToPath(import.meta.url);
		const currentDir = dirname(currentFilePath);
		const postsDir = join(dirname(dirname(dirname(currentDir))), 'posts');

		const res = await request.json();

		const fileName = `post-${crypto.randomUUID()}.md`;

		await fs.writeFile(join(postsDir, fileName), res.html);

		return json({ success: true, message: res });
	} catch (error) {
		throw error;
	}
}
