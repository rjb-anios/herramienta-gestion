import type { FindVisitsResponse, VisitToDisplay } from '@core/entities/Visit'
import { fetchWithCache } from '@presentation/cache'
import { API } from '@presentation/config'
import { useState } from 'hono/jsx'

export function useVisits() {
	const [visits, setVisits] = useState<VisitToDisplay[]>([])
	const [isLoading, setIsLoading] = useState(false)

	const fetchByYear = async (year: number) => {
		setIsLoading(true)

		try {
			const data = await fetchWithCache<FindVisitsResponse>(
				API.visitsByYear(year)
			)
			setVisits(data.type === 'Success' ? data.visits : [])
		} catch {
			setVisits([])
		}

		setIsLoading(false)
	}

	return { fetchByYear, isLoading, visits }
}
