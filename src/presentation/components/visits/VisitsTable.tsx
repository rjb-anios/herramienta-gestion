import { VISIT_CONCEPTS } from '@core/entities/Visit'
import VisitDetail from '@presentation/components/visits/VisitDetail'
import { useVisits } from '@presentation/hooks/useVisits'
import dayjs from 'dayjs'
import type { Child } from 'hono/jsx'
import { useState } from 'hono/jsx'
import type { JSX } from 'hono/jsx/jsx-runtime'

interface AvailableYears {
	years: number[]
	children?: Child
}

const VisitsTable = ({ children, years = [] }: AvailableYears): JSX.Element => {
	const [selectedYear, setSelectedYear] = useState<number | null>(null)
	const [query, setQuery] = useState('')

	const { visits, isLoading, fetchByYear } = useVisits()

	const handleYearClick = (year: number) => {
		setSelectedYear(year)
		fetchByYear(year)
	}

	const filtered = query
		? visits.filter(
				v =>
					v.client.includes(query) ||
					v.technician.includes(query) ||
					(VISIT_CONCEPTS[v.concept]?.label ?? v.concept).includes(query) ||
					v.description.includes(query)
			)
		: visits

	return (
		<>
			<div
				class='flex w-fit m-0 gap-14'
				id='years'
			>
				{years.map(y => (
					<button
						class='cursor-pointer'
						onClick={() => handleYearClick(y)}
						type='button'
					>
						{y}
					</button>
				))}
			</div>
			<label class='flex flex-col gap-2 w-fit mb-10'>
				Buscar por cliente, técnico, concepto o descripción
				<input
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate pb-2'
					onChange={e => setQuery((e.target as HTMLInputElement).value)}
					placeholder='Distingue mayúsculas de minúsculas'
					type='search'
					value={query}
				/>
			</label>
			<div
				class='flex flex-col gap-10 h-full w-full mx-auto pb-12 overflow-auto'
				id='table-visits'
			>
				{children}
				<table class='text-3xl min-w-[890px] w-full max-w-[1440px] mx-auto'>
					<thead class='w-full border-b p-3'>
						<tr class='h-[40px]'>
							<th class='w-2/6 border-x'>Fecha</th>
							<th class='w-2/6 border-x'>Cliente</th>
							<th class='w-1/6 border-x'>Técnico</th>
							<th class='w-1/6 border-x'>Detalles</th>
						</tr>
					</thead>
					<tbody class='w-full text-center p-3'>
						{!selectedYear ? (
							<tr class='h-[40px]'>
								<td
									class='text-center pt-16'
									colspan={5}
								>
									Seleccione año para obtener visitas
								</td>
							</tr>
						) : isLoading ? (
							<tr class='h-[40px]'>
								<td
									class='text-center pt-16'
									colspan={5}
								>
									Cargando...
								</td>
							</tr>
						) : filtered.length === 0 ? (
							<tr class='h-[40px]'>
								<td
									class='text-center pt-16'
									colspan={5}
								>
									Sin resultados para &quot;{query}&quot;
								</td>
							</tr>
						) : (
							filtered.map(e => (
								<tr class='h-[40px]'>
									<td class='w-2/6 border-x truncate'>
										{dayjs(e.date).format('DD-MM-YYYY')}
									</td>
									<td class='w-2/6 border-x truncate'>{e.client}</td>
									<td class='w-1/6 border-x truncate'>{e.technician}</td>
									<td class='w-1/6 border-x truncate'>
										<svg
											aria-label='Detalles'
											class='mx-auto size-12 cursor-pointer'
											fill='currentColor'
											onclick={`document.getElementById('${e.id}').showModal()`}
											viewBox='0 0 16 16'
										>
											<path d='M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3' />
										</svg>
									</td>
									<td>
										<VisitDetail visit={e} />
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</>
	)
}

export default VisitsTable
