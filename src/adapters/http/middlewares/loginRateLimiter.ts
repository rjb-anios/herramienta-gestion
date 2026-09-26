import { createMiddleware } from 'hono/factory'
import type { Env } from 'src/env'

const MAX_ATTEMPTS = 5
const WINDOW_SECONDS = 900

export const loginRateLimiter = createMiddleware<Env>(async (c, next) => {
	const ip =
		c.req.header('cf-connecting-ip') ||
		c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
		'unknown'

	const limiter = c.env.LOGIN_RATE_LIMITER.get(
		c.env.LOGIN_RATE_LIMITER.idFromName(ip)
	)

	const allowed = await limiter.tryAcquire(MAX_ATTEMPTS, WINDOW_SECONDS)

	if (!allowed) {
		return c.text('Demasiados intentos. Intente más tarde.', 429)
	}

	await next()

	if (c.res.status === 303) {
		await limiter.reset()
	}
})
