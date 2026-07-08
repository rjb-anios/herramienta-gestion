import type { FindVisitsResponse } from '@core/entities/Visit'
import type { VisitRepo } from '@core/ports/VisitRepo'

export class FindVisitByIdQuery {
	constructor(private readonly visitRepo: VisitRepo) {}

	async execute(id: string): Promise<FindVisitsResponse> {
		return await this.visitRepo.findVisitById(id)
	}
}
