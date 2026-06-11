import type { DeleteTechnicianResponse } from '@core/entities/Technician'
import type { TechnicianRepo } from '@core/ports/TechnicianRepo'

export class DeleteTechnicianCommand {
	constructor(private readonly technicianRepo: TechnicianRepo) {}

	async execute(id: string): Promise<DeleteTechnicianResponse> {
		const exists = await this.technicianRepo.existsById(id)
		if (!exists) {
			return { type: 'Error', message: 'El técnico no existe' }
		}

		const hasVisits = await this.technicianRepo.hasVisits(id)
		if (hasVisits) {
			return {
				type: 'Error',
				message:
					'No se puede eliminar el técnico porque tiene visitas asociadas. Reasigne las visitas a otro técnico e intente nuevamente.'
			}
		}

		return await this.technicianRepo.deleteTechnician(id)
	}
}
