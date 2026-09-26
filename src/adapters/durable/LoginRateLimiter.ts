import { DurableObject } from 'cloudflare:workers'
import type { Env } from 'src/env'

interface Attempts {
	count: number
	firstAttemptAt: number
}

const STORAGE_KEY = 'attempts'

export class LoginRateLimiter extends DurableObject<Env> {
	async tryAcquire(
		maxAttempts: number,
		windowSeconds: number
	): Promise<boolean> {
		const now = Date.now()
		const data = await this.ctx.storage.get<Attempts>(STORAGE_KEY)

		if (!data || now - data.firstAttemptAt > windowSeconds * 1000) {
			await this.ctx.storage.put(STORAGE_KEY, {
				count: 1,
				firstAttemptAt: now
			})

			return true
		}

		if (data.count >= maxAttempts) return false

		await this.ctx.storage.put(STORAGE_KEY, {
			count: data.count + 1,
			firstAttemptAt: data.firstAttemptAt
		})

		return true
	}

	async reset(): Promise<void> {
		await this.ctx.storage.delete(STORAGE_KEY)
	}
}
