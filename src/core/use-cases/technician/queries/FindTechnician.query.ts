import type { FindTechnicianResponse } from '@core/entities/Technician'
import type { TechnicianRepo } from '@core/ports/TechnicianRepo'

export class FindAllTechniciansQuery {
	constructor(private readonly technicianRepo: TechnicianRepo) {}

	async execute(): Promise<FindTechnicianResponse> {
		return await this.technicianRepo.findAll()
	}
}

export class FindTechnicianByIdQuery {
	constructor(private readonly technicianRepo: TechnicianRepo) {}

	async execute(id: string): Promise<FindTechnicianResponse> {
		return await this.technicianRepo.findById(id)
	}
}
