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

		if (!hasDescription && !hasFuture) {
			return { type: 'NoHasChanges' }
		}

		return await this.visitRepo.editVisit({
			description: hasDescription ? data.description : undefined,
			future: hasFuture ? data.future : undefined,
			id: data.id,
			prevDescription: data.prevDescription,
			prevFuture: data.prevFuture
		})
	}
}
