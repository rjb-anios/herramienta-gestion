import type { EditVisitRequest, EditVisitResponse } from '@core/entities/Visit'
import type { VisitRepo } from '@core/ports/VisitRepo'
import { mergeVisitData } from '@core/use-cases/visits/mergeVisitData'

export class EditVisitCommand {
	constructor(private readonly visitRepo: VisitRepo) {}

	async execute(data: EditVisitRequest): Promise<EditVisitResponse> {
		const { hasChanges, data: mergedData } = mergeVisitData(data)

		if (!hasChanges) {
			return { type: 'NoHasChanges' }
		}

		return await this.visitRepo.editVisit(mergedData)
	}
}
