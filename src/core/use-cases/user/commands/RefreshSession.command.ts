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
		// 1. Delete the old refresh token
		await this.userRepo.deleteRefreshToken(oldTokenId)

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
