import type { FindVisitsResponse } from '@core/entities/Visit'
import type { VisitRepo } from '@core/ports/VisitRepo'

export class FindVisitsQuery {
	constructor(private readonly visitRepo: VisitRepo) {}

	async execute(year: string): Promise<FindVisitsResponse> {
		return await this.visitRepo.findVisits(year)
	}
}
