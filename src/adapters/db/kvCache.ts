export async function kvCacheGet<T>(
	kv: KVNamespace,
	key: string,
	fetch: () => Promise<T>,
	ttl = 300
): Promise<T> {
	const cached = await kv.get(key)
	if (cached) {
		try {
			return JSON.parse(cached) as T
		} catch {
			await kv.delete(key).catch(() => {})
		}
	}

	const data = await fetch()

	await kv.put(key, JSON.stringify(data), { expirationTtl: ttl })

	return data
}

export async function kvCacheInvalidate(kv: KVNamespace, ...keys: string[]) {
	await Promise.allSettled(keys.map(key => kv.delete(key)))
}
