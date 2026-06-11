import type { FindUserResponse } from '@core/entities/User'
import type { UserRepo } from '@core/ports/UserRepo'

export class FindUserQuery {
	constructor(private readonly userRepo: UserRepo) {}

	async execute(id: string): Promise<FindUserResponse> {
		return await this.userRepo.findUser(id)
	}
}
