import type {
	AddVisitResponse,
	EditVisitRequest,
	EditVisitResponse,
	FindVisitsResponse,
	GetAvailableYearsResponse,
	Visit,
	VisitToPrint
} from '@core/entities/Visit'

export interface VisitRepo {
	addVisit: (data: Visit) => Promise<AddVisitResponse>

	editVisit: (data: EditVisitRequest) => Promise<EditVisitResponse>

	getAvailableYears: () => Promise<GetAvailableYearsResponse>

	findVisits: (year: string) => Promise<FindVisitsResponse>

	findVisitById: (id: string) => Promise<FindVisitsResponse>

	findVisitToPrint: (id: string) => Promise<VisitToPrint | null>
}
