import type {
	EditClientRequest,
	EditClientResponse
} from '@core/entities/Client'
import type { ClientRepo } from '@core/ports/ClientRepo'
import { mergeClientData } from '@core/use-cases/client/mergeClientData'

export class EditClientCommand {
	constructor(private readonly clientsRepo: ClientRepo) {}

	async execute(data: EditClientRequest): Promise<EditClientResponse> {
		const { hasChanges, data: mergedData } = mergeClientData(data)

		if (!hasChanges) {
			return { type: 'NoHasChanges' }
		}

		return await this.clientsRepo.editClient(mergedData)
	}
}
