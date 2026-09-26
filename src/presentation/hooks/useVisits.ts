import type { FindVisitsResponse, VisitToDisplay } from '@core/entities/Visit'
import { fetchWithCache } from '@presentation/cache'
import { API } from '@presentation/config'
import { useRef, useState } from 'hono/jsx'

export function useVisits() {
	const [visits, setVisits] = useState<VisitToDisplay[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const lastRequestRef = useRef(0)

	const fetchByYear = async (year: number) => {
		const requestId = ++lastRequestRef.current

		setIsLoading(true)

		try {
			const data = await fetchWithCache<FindVisitsResponse>(
				API.visitsByYear(year)
			)

			if (requestId === lastRequestRef.current) {
				setVisits(data.type === 'Success' ? data.visits : [])
			}
		} catch {
			if (requestId === lastRequestRef.current) {
				setVisits([])
			}
		} finally {
			if (requestId === lastRequestRef.current) {
				setIsLoading(false)
			}
		}
	}

	return { fetchByYear, isLoading, visits }
}
