import type { VisitToDisplay } from '@core/entities/Visit'
import { VISIT_CONCEPTS } from '@core/entities/Visit'
import Back from '@presentation/components/reusables/Back'
import dayjs from 'dayjs'
import type { FC, PropsWithChildren } from 'hono/jsx'

const EditVisitForm: FC<PropsWithChildren<{ visit: VisitToDisplay }>> = async ({
	children,
	visit
}) => {
	return await (
		<>
			<Back
				route='service/visits/all'
				title='Editar visita'
			/>
			<div class='flex flex-col gap-2 w-fit mx-auto text-3xl'>
				<p>
					{dayjs(visit.date).format('DD/MM/YYYY')} - {visit.client}
				</p>
				<p class='text-3xl'>
					{VISIT_CONCEPTS[visit.concept]?.label ?? visit.concept} -&nbsp;
					{visit.hours}h - {visit.technicians.join(' / ')}
				</p>
				<ul class='list text-3xl'>
					{visit.machines.map(m => (
						<li class='list-row list-disc p-0'>
							{m.model} - {m.serial_number}
						</li>
					))}
				</ul>
			</div>
			<form
				action={`/dashboard/service/visits/all/${dayjs(visit.date).format('YYYY')}/edit/${visit.id}`}
				class='min-w-[300px] w-full max-w-[500px] h-fit m-auto flex flex-col gap-5'
				method='post'
			>
				<input
					hidden
					name='id'
					readonly
					value={visit.id}
				/>
				<label class='flex flex-col'>
					Descripción
					<textarea
						class='textarea wrap-break-word whitespace-pre-wrap overflow-y-auto text-3xl h-[150px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate resize-none'
						maxlength={650}
						minlength={6}
						name='description'
						required
						wrap='soft'
					>
						{visit.description}
					</textarea>
				</label>
				{visit.future && (
					<label class='flex flex-col'>
						Tareas a futuro
						<textarea
							class='textarea wrap-break-word whitespace-pre-wrap overflow-y-auto text-3xl h-[150px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate resize-none'
							maxlength={650}
							minlength={6}
							name='future'
							wrap='soft'
						>
							{visit.future}
						</textarea>
					</label>
				)}
				{children}
				<button
					class='h-[40px] w-[150px] p-2 border mx-auto hover:cursor-pointer'
					type='submit'
				>
					Guardar
				</button>
			</form>
		</>
	)
}

export default EditVisitForm
