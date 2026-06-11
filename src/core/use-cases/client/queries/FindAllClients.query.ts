import type { FindAllClientsResponse } from '@core/entities/Client'
import type { ClientRepo } from '@core/ports/ClientRepo'

export class FindAllClientsQuery {
	constructor(private readonly clientsRepo: ClientRepo) {}

	async execute(): Promise<FindAllClientsResponse> {
		return await this.clientsRepo.findAllClients()
	}
}
