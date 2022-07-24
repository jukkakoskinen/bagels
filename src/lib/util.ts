export function randomSecret(length: number): string {
	return shuffled([...'0123456789'])
		.slice(0, length)
		.join('');
}

function shuffled<T>(items: T[]): T[] {
	return items
		.map((item) => ({ item, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ item }) => item);
}
