export async function load() {
	const res = await fetch('http://localhost:5173/api/posts');

	if (res.ok) {
		return await res.json();
	}
}
