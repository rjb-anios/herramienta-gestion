import type {
	EditTechnicianRequest,
	EditTechnicianResponse
} from '@core/entities/Technician'
import type { TechnicianRepo } from '@core/ports/TechnicianRepo'
import { mergeTechnicianData } from '@core/use-cases/technician/mergeTechnicianData'

export class EditTechnicianCommand {
	constructor(private readonly technicianRepo: TechnicianRepo) {}

	async execute(data: EditTechnicianRequest): Promise<EditTechnicianResponse> {
		const current = await this.technicianRepo.findById(data.id)

		if (current.type === 'NotExists' || current.type === 'NoHasTechnicians') {
			return { message: 'El técnico no existe', type: 'Error' }
		}

		if (current.type === 'Error') {
			return { message: current.message, type: 'Error' }
		}

		if (
			data.initials !== undefined &&
			data.initials !== '' &&
			data.initials !== data.prevInitials
		) {
			const initialsExist = await this.technicianRepo.existsByInitials(
				data.initials
			)

			if (initialsExist) {
				return {
					message: 'Ya existe un técnico con esas iniciales',
					type: 'Error'
				}
			}
		}

		const { hasChanges, data: mergedData } = mergeTechnicianData(data)

		if (!hasChanges) {
			return { type: 'NoHasChanges' }
		}

		return await this.technicianRepo.editTechnician(mergedData)
	}
}
