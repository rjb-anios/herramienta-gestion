import type {
	EditTechnicianRequest,
	EditTechnicianResponse
} from '@core/entities/Technician'
import type { TechnicianRepo } from '@core/ports/TechnicianRepo'
import { mergeTechnicianData } from '@core/use-cases/technician/mergeTechnicianData'

export class EditTechnicianCommand {
	constructor(private readonly technicianRepo: TechnicianRepo) {}

	async execute(data: EditTechnicianRequest): Promise<EditTechnicianResponse> {
		const { hasChanges, data: mergedData } = mergeTechnicianData(data)

		if (!hasChanges) {
			return { type: 'NoHasChanges' }
		}

		return await this.technicianRepo.editTechnician(mergedData)
	}
}
