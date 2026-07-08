import type { FindTechnicianResponse } from '@core/entities/Technician'
import type { TechnicianRepo } from '@core/ports/TechnicianRepo'

export class FindActiveTechniciansQuery {
	constructor(private readonly technicianRepo: TechnicianRepo) {}

	async execute(): Promise<FindTechnicianResponse> {
		return await this.technicianRepo.findActive()
	}
}
