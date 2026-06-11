import { HonoCookieService } from '@adapters/external/cookiesTools'
import { JwtTokenManager } from '@adapters/external/tokenTools'
import { createMiddleware } from 'hono/factory'
import type { Env } from 'src/env'

const injectExternalServices = createMiddleware<Env>(async (c, next) => {
	c.set('tokenManager', new JwtTokenManager())
	c.set('cookieService', new HonoCookieService())
	await next()
})

export default injectExternalServices
