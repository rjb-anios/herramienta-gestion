import type { VisitToDisplay } from '@core/entities/Visit'
import { VISIT_CONCEPTS } from '@core/entities/Visit'
import CloseCross from '@presentation/components/reusables/CloseCross'
import dayjs from 'dayjs'
import type { JSX } from 'hono/jsx/jsx-runtime'

interface VisitDetailProps {
	visit: VisitToDisplay
}

const VisitDetail = ({ visit }: VisitDetailProps): JSX.Element => {
	return (
		<dialog
			class='backdrop:bg-black/50 m-auto'
			id={visit.id}
		>
			<div class='relative w-full'>
				<form
					class='absolute top-12 right-11 flex'
					method='dialog'
				>
					<button
						class='w-fit m-auto'
						type='submit'
					>
						<CloseCross />
					</button>
				</form>
				<div class='flex flex-col justify-items-start text-3xl m-auto border p-12 gap-4'>
					<div class='w-10/12 flex flex-wrap gap-x-14 gap-y-4'>
						<div class='w-fit flex flex-col gap-2'>
							<h3 class='w-fit'>
								<strong>Fecha</strong>
							</h3>
							<h4>{dayjs(visit.date).format('DD-MM-YYYY')}</h4>
						</div>
						<div class='w-fit flex flex-col gap-2'>
							<h3 class='w-fit'>
								<strong>Cliente</strong>
							</h3>
							<h4>{visit.client}</h4>
						</div>
						<div class='w-fit flex flex-col gap-2'>
							<h3 class='w-fit'>
								<strong>Concepto</strong>
							</h3>
							<h4>{VISIT_CONCEPTS[visit.concept]?.label ?? visit.concept}</h4>
						</div>
						<div class='w-fit flex flex-col gap-2'>
							<h3 class='w-fit'>
								<strong>Técnico(s)</strong>
							</h3>
							<h4>{visit.technicians.join(' / ')}</h4>
						</div>
						<div class='w-fit flex flex-col gap-2'>
							<h3 class='w-fit'>
								<strong>Horas</strong>
							</h3>
							<h4>{visit.hours}</h4>
						</div>
					</div>
					{visit.machines.length > 0 && (
						<div class='w-fit flex flex-col gap-2'>
							<h3 class='w-fit'>
								<strong>Máquinas</strong>
							</h3>
							<ul class='w-fit list-disc list-inside justify-items-start flex flex-col gap-1.5'>
								{visit.machines.map(m => (
									<li class='w-fit'>
										{m.model} - {m.serial_number}
									</li>
								))}
							</ul>
						</div>
					)}
					<div class='w-fit flex flex-col gap-2'>
						<h3 class='w-fit'>
							<strong>Descripción</strong>
						</h3>
						<p class='w-fit text-justify'>{visit.description}</p>
					</div>
					{visit.future !== '' && (
						<div class='w-fit flex flex-col gap-2'>
							<h3 class='w-fit'>
								<strong>Tareas a futuro</strong>
							</h3>
							<p class='w-fit text-justify'>{visit.future}</p>
						</div>
					)}
				</div>
			</div>
		</dialog>
	)
}

export default VisitDetail
