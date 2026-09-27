import type { VisitToPrint } from '@core/entities/Visit'
import type { VisitRepo } from '@core/ports/VisitRepo'

export class FindVisitToPrintQuery {
	constructor(private readonly visitRepo: VisitRepo) {}

	async execute(id: string): Promise<VisitToPrint | null> {
		return await this.visitRepo.findVisitToPrint(id)
	}
}
