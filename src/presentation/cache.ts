const TTL = 120_000

interface CacheEntry<T> {
	data: T
	expiresAt: number
}

const cache = new Map<string, CacheEntry<unknown>>()

export async function fetchWithCache<T>(url: string): Promise<T> {
	const cached = cache.get(url)
	if (cached !== undefined && Date.now() < cached.expiresAt) {
		return cached.data as T
	}

	const data = await fetch(url).then(r => r.json<T>())
	cache.set(url, { data, expiresAt: Date.now() + TTL })
	return data
}
