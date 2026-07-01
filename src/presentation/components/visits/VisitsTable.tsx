import { VISIT_CONCEPTS } from '@core/entities/Visit'
import Back from '@presentation/components/reusables/Back'
import Dots from '@presentation/components/reusables/Dots'
import VisitDetail from '@presentation/components/visits/VisitDetail'
import { useVisits } from '@presentation/hooks/useVisits'
import dayjs from 'dayjs'
import type { Child } from 'hono/jsx'
import { useState } from 'hono/jsx'
import type { JSX } from 'hono/jsx/jsx-runtime'

const PAGE_SIZE = 20

interface AvailableYears {
	years: number[]
	children?: Child
}

const VisitsTable = ({ children, years = [] }: AvailableYears): JSX.Element => {
	const [selectedYear, setSelectedYear] = useState<number | null>(null)
	const [query, setQuery] = useState('')
	const [page, setPage] = useState(0)

	const { visits, isLoading, fetchByYear } = useVisits()

	const handleYearClick = (year: number) => {
		setSelectedYear(year)
		setPage(0)
		fetchByYear(year)
	}

	const filtered = query
		? visits.filter(
				v =>
					v.client.includes(query) ||
					v.technicians.some(t => t.includes(query)) ||
					(VISIT_CONCEPTS[v.concept]?.label ?? v.concept).includes(query) ||
					v.description.includes(query)
			)
		: visits

	const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
	const start = page * PAGE_SIZE
	const pageItems = filtered.slice(start, start + PAGE_SIZE)

	const handlePrev = () => setPage(p => Math.max(0, p - 1))
	const handleNext = () => setPage(p => Math.min(totalPages - 1, p + 1))

	return (
		<>
			<Back
				route='service'
				title='Visitas'
			/>
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
				<b>Buscar por cliente, técnico, concepto o descripción</b>
				<input
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					onChange={e => {
						setQuery((e.target as HTMLInputElement).value)
						setPage(0)
					}}
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
							<th class='w-1/6 border-x'>Técnico(s)</th>
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
							pageItems.map(e => (
								<tr class='h-[40px]'>
									<td class='w-2/6 border-x truncate'>
										{dayjs(e.date).format('DD-MM-YYYY')}
									</td>
									<td class='w-2/6 border-x truncate'>{e.client}</td>
									<td class='w-1/6 border-x truncate'>
										{e.technicians.join(' / ')}
									</td>
									<td class='w-1/6 border-x truncate'>
										<Dots dialogId={e.id} />
									</td>
									<td>
										<VisitDetail visit={e} />
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
				{totalPages > 1 && (
					<div class='flex justify-center items-center gap-6 text-3xl'>
						<button
							class={`cursor-pointer ${page === 0 ? 'text-gray-400' : ''}`}
							disabled={page === 0}
							onClick={handlePrev}
							type='button'
						>
							◀ Anterior
						</button>
						<span>
							{page + 1} / {totalPages}
						</span>
						<button
							class={`cursor-pointer ${page >= totalPages - 1 ? 'text-gray-400' : ''}`}
							disabled={page >= totalPages - 1}
							onClick={handleNext}
							type='button'
						>
							Siguiente ▶
						</button>
					</div>
				)}
			</div>
		</>
	)
}

export default VisitsTable
