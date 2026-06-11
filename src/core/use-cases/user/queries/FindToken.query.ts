import type { TokenData } from '@core/entities/User'
import type { UserRepo } from '@core/ports/UserRepo'

export class FindTokenQuery {
	constructor(private readonly userRepo: UserRepo) {}

	async execute(idRFT: string): Promise<TokenData | null> {
		return await this.userRepo.findToken(idRFT)
	}
}
