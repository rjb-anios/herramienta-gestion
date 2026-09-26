import type { Client } from '@core/entities/Client'
import type { Machine } from '@core/entities/Machine'
import type { Technician } from '@core/entities/Technician'
import { CONCEPT_VALUES, VISIT_CONCEPTS } from '@core/entities/Visit'
import { fetchWithCache } from '@presentation/cache'
import Back from '@presentation/components/reusables/Back'
import { API } from '@presentation/config'
import { Encoding, Signature } from 'autopen'
import type { Child } from 'hono/jsx'
import { useEffect, useRef, useState } from 'hono/jsx'
import type { JSX } from 'hono/jsx/jsx-runtime'
import SignaturePad from 'signature_pad'

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
	const canvasTechnicianRef = useRef<HTMLCanvasElement>(null)
	const canvasClientRef = useRef<HTMLCanvasElement>(null)

	const padTechnicianRef = useRef<SignaturePad | null>(null)
	const padClientRef = useRef<SignaturePad | null>(null)

	const canvasTechElRef = useRef<HTMLCanvasElement | null>(null)
	const canvasCliElRef = useRef<HTMLCanvasElement | null>(null)

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

	const clearSignature = (s: 't' | 'c') => {
		if (s === 't') {
			padTechnicianRef.current?.clear()
			const input = document.getElementById('technicianSignatureData')
			if (input instanceof HTMLInputElement) input.value = ''
		}

		if (s === 'c') {
			padClientRef.current?.clear()
			const input = document.getElementById('clientSignatureData')
			if (input instanceof HTMLInputElement) input.value = ''
		}
	}

	const initPad = (canvas: HTMLCanvasElement) => {
		const container = canvas.parentElement
		if (!container) return null

		const rect = container.getBoundingClientRect()
		const w = rect.width
		const h = w * (150 / 500)

		canvas.width = w
		canvas.height = h
		canvas.style.width = `${w}px`
		canvas.style.height = `${h}px`

		return new SignaturePad(canvas, {
			backgroundColor: 'white',
			penColor: '#000000',
			throttle: 16
		})
	}

	const setupPads = () => {
		const canvasTech = canvasTechnicianRef.current
		const canvasClient = canvasClientRef.current
		if (!canvasTech || !canvasClient) return false

		if (padTechnicianRef.current) padTechnicianRef.current.off()
		if (padClientRef.current) padClientRef.current.off()

		const padTech = initPad(canvasTech)
		const padCli = initPad(canvasClient)
		if (!padTech || !padCli) return false

		padTechnicianRef.current = padTech
		padClientRef.current = padCli

		const handleTechDraw = () => {
			const pad = padTechnicianRef.current
			const canvas = canvasTechnicianRef.current
			if (!pad || !canvas || pad.isEmpty()) return

			const sigTech = new Signature({
				canvasHeight: canvas.height,
				canvasWidth: canvas.width
			})

			pad.toData().forEach(e => {
				sigTech.pushStroke(e.points)
			})

			const input = document.getElementById(
				'technicianSignatureData'
			) as HTMLInputElement
			if (input) input.value = sigTech.serializeToString(Encoding.Z85)
		}

		const handleClientDraw = () => {
			const pad = padClientRef.current
			const canvas = canvasClientRef.current
			if (!pad || !canvas || pad.isEmpty()) return

			const sigClient = new Signature({
				canvasHeight: canvas.height,
				canvasWidth: canvas.width
			})

			pad.toData().forEach(e => {
				sigClient.pushStroke(e.points)
			})

			const input = document.getElementById(
				'clientSignatureData'
			) as HTMLInputElement
			if (input) input.value = sigClient.serializeToString(Encoding.Z85)
		}

		padTech.addEventListener('endStroke', handleTechDraw)
		padCli.addEventListener('endStroke', handleClientDraw)

		return true
	}

	useEffect(() => {
		setupPads()
		canvasTechElRef.current = canvasTechnicianRef.current
		canvasCliElRef.current = canvasClientRef.current
	}, [])

	useEffect(() => {
		const canvasTech = canvasTechnicianRef.current
		const canvasClient = canvasClientRef.current
		if (!canvasTech || !canvasClient) return

		if (
			canvasTech === canvasTechElRef.current &&
			canvasClient === canvasCliElRef.current
		)
			return

		canvasTechElRef.current = canvasTech
		canvasCliElRef.current = canvasClient

		setupPads()
	})

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

				{/* Sector */}

				<input
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					name='sector'
					placeholder='Sector (ej. Laboratorio) (Opcional)'
					type='text'
				/>

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
											data-manufacturer={m.manufacturer}
											data-model={m.model}
											data-serial={m.serial_number}
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
									data-email={e.email}
									data-name={e.name}
									data-phone={e.phone}
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

				{/* Descripción de registro de visita */}

				<textarea
					class='textarea wrap-break-word whitespace-pre-wrap overflow-y-auto text-3xl h-[150px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate resize-none'
					maxlength={650}
					minlength={6}
					name='register_description'
					placeholder='Descripción registro de visita (Imprimir)'
					required
					wrap='soft'
				></textarea>

				{/* Descripción de tareas realizadas */}

				<textarea
					class='textarea wrap-break-word whitespace-pre-wrap overflow-y-auto text-3xl h-[150px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate resize-none'
					maxlength={650}
					minlength={6}
					name='task_description'
					placeholder='Tareas realizadas (opcional)'
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
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					max={12}
					min={1}
					name='hours'
					placeholder='Horas dedicadas'
					required
					step={1}
					type='number'
				/>

				{/* Firma de técnico */}

				<div class='flex flex-col gap-4'>
					<label for='technicianSignatureData'>Firma técnico:</label>
					<canvas
						class='min-w-[300px] w-full max-w-[500px] h-[150px] border aspect-500/250'
						id='technicianSignature'
						ref={canvasTechnicianRef}
					></canvas>
					<input
						id='technicianSignatureData'
						name='technicianSignature'
						type='hidden'
					/>
					<button
						class='h-[40px] w-[150px] p-2 border hover:cursor-pointer'
						id='clearTechnicianSignature'
						onClick={() => clearSignature('t')}
						type='button'
					>
						Limpiar firma
					</button>
				</div>

				{/* Aclaración de cliente */}

				<input
					autocomplete='off'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					maxlength={30}
					minlength={4}
					name='clientSigner'
					placeholder='Aclaración cliente (Imprimir)'
					required
					type='text'
				/>

				{/* Firma de cliente */}

				<div class='flex flex-col gap-4'>
					<label for='clientSignatureData'>Firma cliente:</label>
					<canvas
						class='min-w-[300px] w-full max-w-[500px] h-[150px] border aspect-500/250'
						id='clientSignature'
						ref={canvasClientRef}
					></canvas>
					<input
						id='clientSignatureData'
						name='clientSignature'
						type='hidden'
					/>
					<button
						class='h-[40px] w-[150px] p-2 border hover:cursor-pointer'
						id='clearClientSignature'
						onClick={() => clearSignature('c')}
						type='button'
					>
						Limpiar firma
					</button>
				</div>

				{/* Botón registrar visita */}

				<div class='flex gap-4'>
					<button
						class='h-[40px] w-[150px] p-2 border mx-auto hover:cursor-pointer text-black bg-emerald-500'
						type='submit'
					>
						Registrar
					</button>
				</div>
			</form>
		</>
	)
}

export default RegVisit
