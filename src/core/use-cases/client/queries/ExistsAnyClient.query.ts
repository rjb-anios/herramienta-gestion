import type { ClientRepo } from '@core/ports/ClientRepo'

export class ExistsAnyClientQuery {
	constructor(private readonly clientsRepo: ClientRepo) {}

	async execute(): Promise<boolean> {
		return await this.clientsRepo.existsAnyClient()
	}
}
