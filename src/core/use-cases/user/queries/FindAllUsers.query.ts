import type { FindAllUsersResponse } from '@core/entities/User'
import type { UserRepo } from '@core/ports/UserRepo'

export class FindAllUsersQuery {
	constructor(private readonly userRepo: UserRepo) {}

	async execute(): Promise<FindAllUsersResponse> {
		return await this.userRepo.findAllUsers()
	}
}
