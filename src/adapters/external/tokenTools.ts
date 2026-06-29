import type { Role } from '@core/entities/Role'
import { env } from 'cloudflare:workers'
import type {
	RefreshTokenData,
	TokenManager,
	TokenPayload
} from '@core/ports/TokenManager'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { sign, verify } from 'hono/jwt'
import type { JWTPayload } from 'hono/utils/jwt/types'

dayjs.extend(utc)

interface Payload extends JWTPayload {
	id: string
	name: string
	role: Role
}

export class JwtTokenManager implements TokenManager {
	async generateAccessToken(payload: TokenPayload): Promise<string> {
		return await sign(
			{ exp: dayjs.utc().add(15, 'minutes').unix(), ...payload },
			await env.AT_SECRET.get(),
			'HS512'
		)
	}

	async generateRefreshToken(payload: TokenPayload): Promise<RefreshTokenData> {
		const idRFT = crypto.randomUUID()
		const created = dayjs.utc().format()
		const expiry = dayjs.utc(created).add(15, 'days').format()

		const token = await sign(
			{ exp: dayjs.utc(expiry).unix(), idRFT, ...payload },
			await env.RT_SECRET.get(),
			'HS512'
		)
		return { created, expiry, idRFT, token }
	}

	async verifyAccessToken(tk: string): Promise<TokenPayload | null> {
		try {
			const payload = await verify(tk, await env.AT_SECRET.get(), 'HS512')
			const { id, name, role } = payload as Payload
			return { id, name, role }
		} catch {
			return null
		}
	}

	async verifyRefreshToken(
		tk: string
	): Promise<(TokenPayload & { idRFT: string }) | null> {
		try {
			const payload = await verify(tk, await env.RT_SECRET.get(), 'HS512')
			const { id, name, role, idRFT } = payload as Payload & { idRFT: string }
			return { id, idRFT, name, role }
		} catch {
			return null
		}
	}
}
