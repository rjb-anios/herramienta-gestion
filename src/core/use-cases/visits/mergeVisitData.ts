import type { EditVisitRequest } from '@core/entities/Visit'

export interface MergedEditVisitData extends EditVisitRequest {}

export function mergeVisitData(request: EditVisitRequest): {
	hasChanges: boolean
	data: MergedEditVisitData
} {
	const hasTaskDescription =
		request.task_description !== undefined &&
		request.task_description !== request.prevTaskDescription
	const hasFuture =
		request.future !== undefined && request.future !== request.prevFuture
	const hasSector =
		request.sector !== undefined && request.sector !== request.prevSector

	const data: MergedEditVisitData = {
		...request,
		future: hasFuture ? request.future! : undefined,
		sector: hasSector ? request.sector! : undefined,
		task_description: hasTaskDescription ? request.task_description! : undefined
	}

	return {
		data,
		hasChanges: hasTaskDescription || hasFuture || hasSector
	}
}
