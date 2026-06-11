export interface CookieOptions {
	httpOnly?: boolean
	secure?: boolean
	sameSite?: 'strict' | 'lax' | 'none'
	path?: string
	maxAge?: number
	expires?: Date
}

export interface CookieService {
	generateCookie(name: string, value: string, options?: CookieOptions): string
	deleteCookie(name: string): string
}
