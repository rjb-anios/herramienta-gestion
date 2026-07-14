import type { EditVisitRequest } from '@core/entities/Visit'

export interface MergedEditVisitData extends EditVisitRequest {}

export function mergeVisitData(request: EditVisitRequest): {
	hasChanges: boolean
	data: MergedEditVisitData
} {
	const hasDescription =
		request.description !== undefined &&
		request.description !== request.prevDescription
	const hasFuture =
		request.future !== undefined && request.future !== request.prevFuture
	const hasSector =
		request.sector !== undefined && request.sector !== request.prevSector

	const data: MergedEditVisitData = {
		description: hasDescription ? request.description! : undefined,
		future: hasFuture ? request.future! : undefined,
		id: request.id,
		prevDescription: request.prevDescription,
		prevFuture: request.prevFuture,
		prevSector: request.prevSector,
		sector: hasSector ? request.sector! : undefined
	}

	return {
		data,
		hasChanges: hasDescription || hasFuture || hasSector
	}
}
