import type { Technician } from '@core/entities/Technician'
import Back from '@presentation/components/reusables/Back'
import type { FC, PropsWithChildren } from 'hono/jsx'

const EditTechnicianForm: FC<PropsWithChildren<{ data: Technician }>> = async ({
	children,
	data
}) => {
	return await (
		<>
			<Back
				route='service/technicians/all'
				title='Editar técnico'
			/>
			<form
				action={`/dashboard/service/technicians/all/edit/${data.id}`}
				class='min-w-[300px] w-full max-w-[500px] h-fit m-auto flex flex-col gap-5'
				id='editTech'
				method='post'
			>
				<input
					autocomplete='off'
					class='hidden'
					hidden
					name='id'
					readonly
					required
					tabindex={-1}
					type='text'
					value={data.id}
				/>
				<label class='flex flex-col'>
					Nombre de técnico actual
					<input
						autocomplete='off'
						class='h-[45px] min-w-[300px] w-full max-w-[500px] border-t px-[10px] outline-none mx-auto read-only:text-gray-600 truncate'
						maxlength={30}
						minlength={4}
						name='prevName'
						placeholder='Nombre (ej. Juan Pérez)'
						readonly
						required
						tabindex={-1}
						type='text'
						value={data.name}
					/>
				</label>
				<input
					autocomplete='on'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					maxlength={30}
					minlength={4}
					name='name'
					placeholder='Nuevo nombre (ej. Pedro Pérez)'
					type='text'
				/>
				<label class='flex flex-col'>
					Iniciales actuales
					<input
						autocomplete='off'
						class='h-[45px] min-w-[300px] w-full max-w-[500px] border-t px-[10px] outline-none mx-auto read-only:text-gray-600 truncate'
						maxlength={3}
						minlength={2}
						name='prevInitials'
						placeholder='Iniciales (ej. JP)'
						readonly
						required
						tabindex={-1}
						type='text'
						value={data.initials}
					/>
				</label>
				<input
					autocomplete='on'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					maxlength={3}
					minlength={2}
					name='initials'
					placeholder='Nuevas iniciales (ej. PP)'
					type='text'
				/>
				{children}
				<button
					class='h-[40px] w-[150px] p-2 border mx-auto hover:cursor-pointer'
					form='editTech'
					type='submit'
				>
					Guardar
				</button>
			</form>
		</>
	)
}

export default EditTechnicianForm
