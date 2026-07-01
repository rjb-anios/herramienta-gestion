const TTL = 300

export async function kvCacheGet<T>(
	kv: KVNamespace,
	key: string,
	fetch: () => Promise<T>
): Promise<T> {
	const cached = await kv.get(key)
	if (cached) return JSON.parse(cached) as T

	const data = await fetch()

	await kv.put(key, JSON.stringify(data), { expirationTtl: TTL })

	return data
}

export async function kvCacheInvalidate(kv: KVNamespace, ...keys: string[]) {
	await Promise.allSettled(keys.map(key => kv.delete(key)))
}
