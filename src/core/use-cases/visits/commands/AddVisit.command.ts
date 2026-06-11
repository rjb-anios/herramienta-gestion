import type { AddVisitResponse, Visit } from '@core/entities/Visit'
import type { VisitRepo } from '@core/ports/VisitRepo'

export class AddVisitCommand {
	constructor(private readonly visitRepo: VisitRepo) {}

	async execute(data: Omit<Visit, 'id'>): Promise<AddVisitResponse> {
		const visit: Visit = { id: crypto.randomUUID(), ...data }
		return await this.visitRepo.addVisit(visit)
	}
}
