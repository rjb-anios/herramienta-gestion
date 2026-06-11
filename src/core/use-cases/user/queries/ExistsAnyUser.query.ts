import type { UserRepo } from '@core/ports/UserRepo'

export class ExistsAnyUserQuery {
	constructor(private readonly userRepo: UserRepo) {}

	async execute(): Promise<boolean> {
		return await this.userRepo.existsAnyUser()
	}
}
