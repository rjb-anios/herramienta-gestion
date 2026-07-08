import type { EditVisitRequest, EditVisitResponse } from '@core/entities/Visit'
import type { VisitRepo } from '@core/ports/VisitRepo'

export class EditVisitCommand {
	constructor(private readonly visitRepo: VisitRepo) {}

	async execute(data: EditVisitRequest): Promise<EditVisitResponse> {
		const hasDescription =
			data.description !== undefined &&
			data.description !== data.prevDescription
		const normPrevFuture = data.prevFuture || undefined
		const hasFuture =
			data.future !== undefined && data.future !== normPrevFuture
		const hasHours =
			data.hours !== undefined && Number(data.hours) !== Number(data.prevHours)

		if (!hasDescription && !hasFuture && !hasHours) {
			return { type: 'NoHasChanges' }
		}

		return await this.visitRepo.editVisit({
			description: hasDescription ? data.description : undefined,
			future: hasFuture ? data.future : undefined,
			hours: hasHours ? Number(data.hours) : undefined,
			id: data.id,
			prevDescription: data.prevDescription,
			prevFuture: data.prevFuture,
			prevHours: data.prevHours
		})
	}
}
