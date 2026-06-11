import type { AddOrDeleteClientResponse } from '@core/entities/Client'
import type { ClientRepo } from '@core/ports/ClientRepo'

export class DeleteClientCommand {
	constructor(private readonly clientsRepo: ClientRepo) {}

	async execute(id: string): Promise<AddOrDeleteClientResponse> {
		const client = await this.clientsRepo.findClient(id)
		if (client.type === 'NotExists') {
			return { message: 'El cliente no existe', type: 'Error' }
		}
		if (client.type === 'Error') {
			return client
		}

		const hasVisits = await this.clientsRepo.hasVisits(id)
		if (hasVisits) {
			return {
				message:
					'No se puede eliminar el cliente porque tiene visitas asociadas.',
				type: 'Error'
			}
		}

		const hasMachines = await this.clientsRepo.hasMachines(id)
		if (hasMachines) {
			return {
				message:
					'No se puede eliminar el cliente porque tiene equipos registrados. Elimine los equipos e intente nuevamente.',
				type: 'Error'
			}
		}

		return await this.clientsRepo.deleteClient(id)
	}
}
