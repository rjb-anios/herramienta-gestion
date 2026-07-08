import type { Client } from '@core/entities/Client'
import Back from '@presentation/components/reusables/Back'
import type { FC, PropsWithChildren } from 'hono/jsx'

const EditClientForm: FC<PropsWithChildren<{ data: Client }>> = async ({
	children,
	data
}) => {
	return await (
		<>
			<Back
				route='clients/all'
				title='Editar cliente'
			/>
			<form
				action={`/dashboard/clients/all/edit/${data.id}`}
				class='min-w-[300px] w-full max-w-[500px] h-fit m-auto flex flex-col gap-5'
				id='editClient'
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
					Nombre cliente actual
					<input
						autocomplete='off'
						class='h-[45px] min-w-[300px] w-full max-w-[500px] border-t px-[10px] outline-none mx-auto read-only:text-gray-600 truncate'
						maxlength={40}
						minlength={4}
						name='prevName'
						placeholder='Nombre cliente (ej. Hospital XYZ)'
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
					maxlength={40}
					minlength={4}
					name='name'
					placeholder='Nuevo nombre cliente (ej. Hospital ABC)'
					type='text'
				/>
				<label class='flex flex-col'>
					Nombre de contacto actual
					<input
						autocomplete='off'
						class='h-[45px] min-w-[300px] w-full max-w-[500px] border-t px-[10px] outline-none mx-auto read-only:text-gray-600 truncate'
						maxlength={30}
						minlength={4}
						name='prevContact'
						placeholder='Nombre contacto (ej. Maria Pérez)'
						readonly
						required
						tabindex={-1}
						type='text'
						value={data.contact}
					/>
				</label>
				<input
					autocomplete='on'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					maxlength={30}
					minlength={4}
					name='contact'
					placeholder='Nuevo nombre contacto (ej. Carlos Pérez)'
					type='text'
				/>
				<label class='flex flex-col'>
					Teléfono actual
					<input
						autocomplete='off'
						class='h-[45px] min-w-[300px] w-full max-w-[500px] border-t px-[10px] outline-none mx-auto read-only:text-gray-600 truncate'
						maxlength={8}
						minlength={8}
						name='prevPhone'
						placeholder='Teléfono (ej. 96123123)'
						readonly
						required
						tabindex={-1}
						type='text'
						value={data.phone}
					/>
				</label>
				<input
					autocomplete='on'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					maxlength={8}
					minlength={8}
					name='phone'
					placeholder='Nuevo teléfono (ej. 99321321)'
					type='tel'
				/>
				<label class='flex flex-col'>
					Correo actual
					<input
						autocomplete='off'
						class='h-[45px] min-w-[300px] w-full max-w-[500px] border-t px-[10px] outline-none mx-auto read-only:text-gray-600 truncate'
						name='prevEmail'
						placeholder='Email (ej. maria@email.com)'
						readonly
						required
						tabindex={-1}
						type='email'
						value={data.email}
					/>
				</label>
				<input
					autocomplete='on'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					name='email'
					placeholder='Nuevo email (ej. carlos@email.com)'
					type='email'
				/>
				{children}
				<button
					class='h-[40px] w-[150px] p-2 border mx-auto hover:cursor-pointer'
					form='editClient'
					type='submit'
				>
					Guardar
				</button>
			</form>
		</>
	)
}

export default EditClientForm
