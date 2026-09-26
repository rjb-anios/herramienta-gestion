import type {
	EditClientRequest,
	EditClientResponse
} from '@core/entities/Client'
import type { ClientRepo } from '@core/ports/ClientRepo'
import { mergeClientData } from '@core/use-cases/client/mergeClientData'

export class EditClientCommand {
	constructor(private readonly clientsRepo: ClientRepo) {}

	async execute(data: EditClientRequest): Promise<EditClientResponse> {
		const client = await this.clientsRepo.findClient(data.id)

		if (client.type === 'NotExists') {
			return { message: 'El cliente no existe', type: 'Error' }
		}

		if (client.type === 'Error') {
			return { message: client.message, type: 'Error' }
		}

		if (
			data.name !== undefined &&
			data.name !== '' &&
			data.name !== data.prevName
		) {
			const nameExists = await this.clientsRepo.existsByName(data.name)

			if (nameExists) {
				return {
					message: 'Ya existe un cliente con ese nombre',
					type: 'Error'
				}
			}
		}

		const { hasChanges, data: mergedData } = mergeClientData(data)

		if (!hasChanges) {
			return { type: 'NoHasChanges' }
		}

		return await this.clientsRepo.editClient(mergedData)
	}
}
