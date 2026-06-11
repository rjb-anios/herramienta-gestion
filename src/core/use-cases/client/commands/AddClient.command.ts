import type { AddOrDeleteClientResponse, Client } from '@core/entities/Client'
import type { ClientRepo } from '@core/ports/ClientRepo'

export class AddClientCommand {
	constructor(private readonly clientsRepo: ClientRepo) {}

	async execute(data: Omit<Client, 'id'>): Promise<AddOrDeleteClientResponse> {
		const nameExists = await this.clientsRepo.existsByName(data.name)
		if (nameExists) {
			return { message: 'Ya existe un cliente con ese nombre', type: 'Error' }
		}

		const client: Client = { id: crypto.randomUUID(), ...data }
		return await this.clientsRepo.addClient(client)
	}
}
