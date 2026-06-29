import { loginRateLimiter } from '@adapters/http/middlewares/loginRateLimiter'
import { loginValidator } from '@adapters/http/middlewares/userFormsValidator'
import LoginLayout from '@presentation/layouts/LoginLayout'
import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import type { Env } from 'src/env'

const login = new Hono<Env>()

login.get('/', async c => {
	const tokenManager = c.get('tokenManager')

	const acToken = getCookie(c, 'ac_token')
	if (acToken) {
		const user = await tokenManager.verifyAccessToken(acToken)
		if (user) {
			return c.redirect('/dashboard', 303)
		}
	}

	const rfToken = getCookie(c, 'rf_token')
	if (rfToken) {
		const rfPayload = await tokenManager.verifyRefreshToken(rfToken)
		if (rfPayload) {
			const {
				queries: { findToken }
			} = c.get('userCases')
			const tokenInDB = await findToken.execute(rfPayload.idRFT)
			if (tokenInDB) return c.redirect('/dashboard', 303)
		}
	}

	return await c.render(<LoginLayout />)
})

login.post('/', loginRateLimiter, loginValidator, async c => {
	const { username, password } = c.req.valid('form')

	const {
		commands: { login }
	} = c.get('userCases')

	const res = await login.execute({ password, username })

	if (res.type === 'IncorrectPasswordOrUser') {
		return await c.render(
			<LoginLayout>
				<p class='w-fit text-3xl mx-auto block text-center'>
					Verifique datos e intente de nuevo
				</p>
			</LoginLayout>
		)
	}

	if (res.type === 'Error') {
		return await c.render(
			<LoginLayout>
				<p class='w-fit text-3xl mx-auto block text-center'>{res.message}</p>
			</LoginLayout>
		)
	}

	const tokenManager = c.get('tokenManager')

	const cookieService = c.get('cookieService')

	// Generar access token (15 min)
	const acToken = await tokenManager.generateAccessToken({
		id: res.user.id,
		name: res.user.name,
		role: res.user.role
	})

	const acCookie = cookieService.generateCookie('ac_token', acToken, {
		maxAge: 60 * 15
	})

	const rfCookie = cookieService.generateCookie('rf_token', res.user.rfToken, {
		expires: new Date(res.user.expRTF),
		maxAge: 60 * 60 * 24 * 15
	})

	// Establecer cookies
	c.header('Set-Cookie', acCookie, { append: true })

	c.header('Set-Cookie', rfCookie, { append: true })

	return c.redirect('/dashboard', 303)
})

export default login
