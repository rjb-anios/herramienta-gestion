import type { GetAvailableYearsResponse } from '@core/entities/Visit'
import type { VisitRepo } from '@core/ports/VisitRepo'

export class GetAvailableYearsQuery {
	constructor(private readonly visitRepo: VisitRepo) {}

	async execute(): Promise<GetAvailableYearsResponse> {
		return await this.visitRepo.getAvailableYears()
	}
}
