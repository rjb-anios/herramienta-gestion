import type { ToggleActiveResponse } from '@core/entities/Technician'
import type { TechnicianRepo } from '@core/ports/TechnicianRepo'

export class DeactivateTechnicianCommand {
	constructor(private readonly technicianRepo: TechnicianRepo) {}

	async execute(id: string): Promise<ToggleActiveResponse> {
		return await this.technicianRepo.toggleActive(id)
	}
}
