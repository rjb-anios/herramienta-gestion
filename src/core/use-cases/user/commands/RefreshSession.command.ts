import type { TokenManager, TokenPayload } from '@core/ports/TokenManager'
import type { UserRepo } from '@core/ports/UserRepo'

export class RefreshSessionCommand {
	constructor(
		private readonly userRepo: UserRepo,
		private readonly tokenManager: TokenManager
	) {}

	async execute(
		oldTokenId: string,
		user: TokenPayload
	): Promise<{
		newAcToken: string
		newRfToken: string
		expRYF: string
	} | null> {
		// 1. Revocar el token viejo de forma atómica (un solo uso):
		// si otro request ya lo usó, no se emite un nuevo par
		const revoked = await this.userRepo.deleteRefreshToken(oldTokenId)

		if (!revoked) return null

		// 2. Generate a new refresh token
		const newRefreshToken = await this.tokenManager.generateRefreshToken(user)

		// 3. Save the new refresh token
		await this.userRepo.saveRefreshToken({
			created: newRefreshToken.created,
			expiry: newRefreshToken.expiry,
			token: newRefreshToken.token,
			tokenId: newRefreshToken.idRFT,
			userId: user.id
		})

		// 4. Generate a new access token
		const newAcToken = await this.tokenManager.generateAccessToken(user)

		// 5. Return new tokens
		return {
			expRYF: newRefreshToken.expiry,
			newAcToken,
			newRfToken: newRefreshToken.token
		}
	}
}
