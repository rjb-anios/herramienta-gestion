import type {
	AddTechnicianResponse,
	Technician
} from '@core/entities/Technician'
import type { TechnicianRepo } from '@core/ports/TechnicianRepo'

export class AddTechnicianCommand {
	constructor(private readonly technicianRepo: TechnicianRepo) {}

	async execute(
		technician: Omit<Technician, 'id'>
	): Promise<AddTechnicianResponse> {
		const initialsExist = await this.technicianRepo.existsByInitials(
			technician.initials
		)

		if (initialsExist) {
			return { type: 'InitialsInUse' }
		}

		const newTech: Technician = { id: crypto.randomUUID(), ...technician }
		return await this.technicianRepo.addTechnician(newTech)
	}
}
