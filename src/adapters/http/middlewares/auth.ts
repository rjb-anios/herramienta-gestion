import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import type { Env } from 'src/env'

const auth = createMiddleware<Env>(async (c, next) => {
	const tokenManager = c.get('tokenManager')
	const cookieService = c.get('cookieService')

	const deleteAllCookies = () => {
		c.header('Set-Cookie', cookieService.deleteCookie('ac_token'), {
			append: true
		})
		c.header('Set-Cookie', cookieService.deleteCookie('rf_token'), {
			append: true
		})
	}

	const acToken = getCookie(c, 'ac_token')

	if (acToken) {
		const user = await tokenManager.verifyAccessToken(acToken)
		if (user) {
			c.set('jwtPayload', user)
			return await next()
		}
	}

	const rfToken = getCookie(c, 'rf_token')

	if (!rfToken) {
		return c.redirect('/', 303)
	}

	const rfPayload = await tokenManager.verifyRefreshToken(rfToken)

	if (!rfPayload) {
		deleteAllCookies()
		return c.redirect('/', 303)
	}

	const {
		queries: { findToken },
		commands: { refreshSession }
	} = c.get('userCases')

	const tokenInDB = await findToken.execute(rfPayload.idRFT)

	if (!tokenInDB) {
		deleteAllCookies()
		return c.redirect('/', 303)
	}

	const tokens = await refreshSession.execute(rfPayload.idRFT, {
		id: rfPayload.id,
		name: rfPayload.name,
		role: rfPayload.role
	})

	if (!tokens) {
		deleteAllCookies()
		return c.redirect('/', 303)
	}

	const acCookie = cookieService.generateCookie('ac_token', tokens.newAcToken, {
		maxAge: 60 * 15
	})

	const rfCookie = cookieService.generateCookie('rf_token', tokens.newRfToken, {
		expires: new Date(tokens.expRYF),
		maxAge: 60 * 60 * 24 * 15
	})

	c.header('Set-Cookie', acCookie, { append: true })
	c.header('Set-Cookie', rfCookie, { append: true })

	c.set('jwtPayload', {
		id: rfPayload.id,
		name: rfPayload.name,
		role: rfPayload.role
	})

	return await next()
})

export default auth
