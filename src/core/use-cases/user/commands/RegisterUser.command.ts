import type {
	RegisterUserData,
	RegisterUserRequest,
	RegisterUserResponse
} from '@core/entities/User'
import type { PasswordHasher } from '@core/ports/PasswordHasher'
import type { UserRepo } from '@core/ports/UserRepo'

export class RegisterUserCommand {
	constructor(
		private readonly userRepo: UserRepo,
		private readonly passwordHasher: PasswordHasher
	) {}

	async execute(
		data: Omit<RegisterUserRequest, 'id'>
	): Promise<RegisterUserResponse> {
		const userData = await this.userRepo.existsByUsername(data.username)

		if (userData) return { type: 'UserAlreadyExists' }

		if (data.password !== data.confirmPassword)
			return { type: 'PasswordsDoNotMatch' }

		const hashedPassword = await this.passwordHasher.hash(data.password)

		const registerData: RegisterUserData = {
			id: crypto.randomUUID(),
			name: data.name,
			password: hashedPassword,
			role: data.role,
			username: data.username
		}

		return await this.userRepo.register(registerData)
	}
}
