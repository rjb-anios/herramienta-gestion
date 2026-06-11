import type {
	AddVisitResponse,
	FindVisitsResponse,
	GetAvailableYearsResponse,
	Visit
} from '@core/entities/Visit'

export interface VisitRepo {
	addVisit: (data: Visit) => Promise<AddVisitResponse>

	getAvailableYears: () => Promise<GetAvailableYearsResponse>

	findVisits: (year: string) => Promise<FindVisitsResponse>
}
