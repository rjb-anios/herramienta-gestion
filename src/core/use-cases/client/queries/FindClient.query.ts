import type { FindClientResponse } from '@core/entities/Client'
import type { ClientRepo } from '@core/ports/ClientRepo'

export class FindClientQuery {
	constructor(private readonly clientsRepo: ClientRepo) {}

	async execute(id: string): Promise<FindClientResponse> {
		return await this.clientsRepo.findClient(id)
	}
}
