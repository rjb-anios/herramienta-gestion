import type { LoginUserRequest, LoginUserResponse } from '@core/entities/User'
import type { PasswordHasher } from '@core/ports/PasswordHasher'
import type { TokenManager } from '@core/ports/TokenManager'
import type { UserRepo } from '@core/ports/UserRepo'

export class LoginUserCommand {
	constructor(
		private readonly userRepo: UserRepo,
		private readonly passwordHasher: PasswordHasher,
		private readonly tokenManager: TokenManager
	) {}

	async execute(data: LoginUserRequest): Promise<LoginUserResponse> {
		// 1. Obtener datos privados del usuario
		const userData = await this.userRepo.findPrivateByUsername(data.username)

		// 2. Verificar existencia
		if (!userData) {
			return { type: 'IncorrectPasswordOrUser' }
		}

		// 3. Verificar contraseña usando el puerto
		const passwordMatch = await this.passwordHasher.compare(
			data.password,
			userData.password
		)

		if (!passwordMatch) {
			return { type: 'IncorrectPasswordOrUser' }
		}

		// 4. Generar refresh token usando el puerto
		const refreshTokenData = await this.tokenManager.generateRefreshToken({
			id: userData.id,
			name: userData.name,
			role: userData.role
		})

		// 5. Guardar refresh token en repositorio
		await this.userRepo.saveRefreshToken({
			created: refreshTokenData.created,
			expiry: refreshTokenData.expiry,
			token: refreshTokenData.token,
			tokenId: refreshTokenData.idRFT,
			userId: userData.id
		})

		// 6. Retornar éxito
		return {
			type: 'Success',
			user: {
				expRTF: refreshTokenData.expiry,
				id: userData.id,
				name: userData.name,
				rfToken: refreshTokenData.token,
				role: userData.role,
				username: userData.username
			}
		}
	}
}
