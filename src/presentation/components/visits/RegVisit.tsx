import type { Client } from '@core/entities/Client'
import type { Machine } from '@core/entities/Machine'
import type { Technician } from '@core/entities/Technician'
import { CONCEPT_VALUES, VISIT_CONCEPTS } from '@core/entities/Visit'
import { fetchWithCache } from '@presentation/cache'
import Back from '@presentation/components/reusables/Back'
import { API } from '@presentation/config'
import type { Child } from 'hono/jsx'
import { useState } from 'hono/jsx'
import type { JSX } from 'hono/jsx/jsx-runtime'

interface RegVisitProps {
	arrClient: Client[]
	arrTech: Technician[]
	children?: Child
}

const RegVisit = ({
	arrClient = [],
	arrTech = [],
	children
}: RegVisitProps): JSX.Element => {
	const [machines, setMachines] = useState<Machine[]>([])

	const [concept, setConcept] = useState<string>('')

	const equipmentRequired =
		concept === 'mantec' || concept === 'sertec' || concept === 'inst'

	const loadMachines = async (id: string) => {
		if (!id) {
			setMachines([])
			return
		}

		try {
			const data = await fetchWithCache<Machine[]>(API.clientEquipment(id))
			setMachines(data)
		} catch (error) {
			console.error('Error buscando máquinas: ', error)
		}
	}

	return (
		<>
			<Back
				route='service'
				title='Registrar visita'
			/>
			<form
				class='min-w-[300px] w-full max-w-[500px] h-fit m-auto flex flex-col gap-5'
				method='post'
			>
				{children}

				{/* Campo de fecha */}

				<input
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					name='date'
					placeholder='Fecha (ej. DD/MM/AAAA)'
					required
					type='date'
				/>

				{/* Selección de cliente */}

				<select
					class='select text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					name='client'
					onChange={e => loadMachines((e.target as HTMLSelectElement).value)}
				>
					<option value=''>Seleccione un cliente</option>
					{arrClient.map(e => (
						<option
							key={e.id}
							value={e.id}
						>
							{e.name}
						</option>
					))}
				</select>

				{/* Concepto de visita */}

				<select
					class='select text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					name='concept'
					onChange={e => setConcept((e.target as HTMLSelectElement).value)}
				>
					<option value=''>Seleccione concepto</option>
					{CONCEPT_VALUES.map(key => (
						<option value={key}>{VISIT_CONCEPTS[key].label}</option>
					))}
				</select>

				{/* Selección de equipo de cliente */}

				{equipmentRequired && (
					<div class='min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'>
						<p class='text-gray-500 mb-2'>Equipos intervenidos:</p>
						<div class='bg-base-100 max-h-[140px] overflow-y-auto flex flex-col gap-2 p-2'>
							{machines.length === 0 ? (
								<span class='text-2xl text-gray-500 italic'>
									No tiene equipos registrados
								</span>
							) : (
								machines.map(m => (
									<label
										class='label h-[35px] flex items-center gap-2 cursor-pointer hover:bg-base-200 p-1 transition-colors rounded-lg'
										key={m.id}
									>
										<input
											class='checkbox checkbox-lg'
											name='machine'
											type='checkbox'
											value={m.id}
										/>
										<span class='truncate'>
											{m.model} - {m.serial_number}
										</span>
									</label>
								))
							)}
						</div>
					</div>
				)}

			{/* Selección de técnico */}

				<div class='min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'>
					<p class='text-gray-500 mb-2'>Técnicos participantes:</p>
					<div class='bg-base-100 max-h-[200px] overflow-y-auto flex flex-col gap-2 p-2'>
						{arrTech.map((e, idx) => (
							<label
								class='label h-[35px] flex items-center gap-2 cursor-pointer hover:bg-base-200 p-1 transition-colors rounded-lg'
								key={e.id}
							>
								<input
									class='checkbox checkbox-lg'
									defaultChecked={idx === 0}
									name='technician'
									type='checkbox'
									value={e.id}
								/>
								<span class='truncate'>{e.name}</span>
							</label>
						))}
					</div>
				</div>

				{/* Descripción de visita realizada*/}

				<textarea
					class='textarea wrap-break-word whitespace-pre-wrap overflow-y-auto text-3xl h-[150px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate resize-none'
					maxlength={650}
					minlength={6}
					name='description'
					placeholder='Descripción de la visita'
					required
					wrap='soft'
				></textarea>

				{/* Tareas a futuro */}

				<textarea
					class='textarea wrap-break-word whitespace-pre-wrap overflow-y-auto text-3xl h-[150px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate resize-none'
					maxlength={650}
					minlength={6}
					name='future'
					placeholder='Tareas a futuro (opcional)'
					wrap='soft'
				></textarea>

				{/* Selección de horas de visita */}

				<input
					class='input validator text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					max={12}
					min={1}
					name='hours'
					placeholder='Horas dedicadas'
					required
					step={1}
					type='number'
				/>

				{/* Botón registrar visita */}

				<button
					class='h-[40px] w-[150px] p-2 border mx-auto hover:cursor-pointer'
					type='submit'
				>
					Registrar
				</button>
			</form>
		</>
	)
}

export default RegVisit
