import { ROLES } from '@core/entities/Role'
import { createMiddleware } from 'hono/factory'
import type { Env } from 'src/env'

export const requireMinLevel = (minLevel: number) =>
	createMiddleware<Env>(async (c, next) => {
		const { role } = c.get('jwtPayload')
		const userLevel = ROLES[role]

		if (userLevel < minLevel) {
			return c.text('No autorizado', 403)
		}

		await next()
	})
