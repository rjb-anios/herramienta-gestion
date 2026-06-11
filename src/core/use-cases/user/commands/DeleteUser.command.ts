import type { DeleteUserResponse } from '@core/entities/User'
import type { UserRepo } from '@core/ports/UserRepo'

export class DeleteUserCommand {
	constructor(private readonly userRepo: UserRepo) {}

	async execute(id: string): Promise<DeleteUserResponse> {
		const userData = await this.userRepo.existsById(id)

		if (!userData) return { type: 'UserNotExists' }
		return await this.userRepo.deleteUser(id)
	}
}
