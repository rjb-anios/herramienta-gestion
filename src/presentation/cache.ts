const cache = new Map<string, unknown>()

export async function fetchWithCache<T>(url: string): Promise<T> {
	const cached = cache.get(url)
	if (cached !== undefined) {
		return cached as T
	}

	const data = await fetch(url).then(r => r.json<T>())
	cache.set(url, data)
	return data
}
