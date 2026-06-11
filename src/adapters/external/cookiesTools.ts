import type { CookieOptions, CookieService } from '@core/ports/CookieService'
import { generateCookie } from 'hono/cookie'

export class HonoCookieService implements CookieService {
	generateCookie(name: string, value: string, options?: CookieOptions): string {
		return generateCookie(name, value, {
			httpOnly: true,
			path: '/',
			sameSite: 'strict',
			secure: true,
			...options
		})
	}

	deleteCookie(name: string): string {
		return generateCookie(name, '', {
			expires: new Date(1970, 0, 1),
			httpOnly: true,
			maxAge: 0,
			path: '/',
			sameSite: 'strict',
			secure: true
		})
	}
}
