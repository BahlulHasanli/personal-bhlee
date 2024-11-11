export async function load() {
	const res = await fetch('/api/posts');

	if (res.ok) {
		return {
			posts: await res.json()
		};
	}
}
