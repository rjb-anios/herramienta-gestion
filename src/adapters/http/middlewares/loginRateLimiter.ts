import { createMiddleware } from 'hono/factory'
import type { Env } from 'src/env'

const MAX_ATTEMPTS = 5
const WINDOW_TTL = 900

export const loginRateLimiter = createMiddleware<Env>(async (c, next) => {
	const ip =
		c.req.header('cf-connecting-ip') ||
		c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
		'unknown'

	const key = `rate-limit:login:${ip}`

	const attempts = await c.env.KV.get(key)

	if (attempts && Number(attempts) >= MAX_ATTEMPTS) {
		return c.text('Demasiados intentos. Intente más tarde.', 429)
	}

	await next()

	if (c.res.status === 303) {
		await c.env.KV.delete(key).catch(() => {})
	} else {
		const nextCount = attempts ? Number(attempts) + 1 : 1
		await c.env.KV.put(key, String(nextCount), {
			expirationTtl: WINDOW_TTL
		})
	}
})
