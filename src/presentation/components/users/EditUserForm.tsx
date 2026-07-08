import { ROLES } from '@core/entities/Role'
import type { User } from '@core/entities/User'
import Back from '@presentation/components/reusables/Back'
import type { FC, PropsWithChildren } from 'hono/jsx'

const EditUserForm: FC<PropsWithChildren<{ data: User }>> = async ({
	children,
	data
}) => {
	return await (
		<>
			<Back
				route='users/all'
				title='Editar usuario'
			/>
			<form
				action={`/dashboard/users/all/edit/${data.id}`}
				class='min-w-[300px] w-full max-w-[500px] h-fit m-auto flex flex-col gap-5'
				id='editUser'
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
					Usuario actual
					<input
						autocomplete='off'
						class='h-[45px] min-w-[300px] w-full max-w-[500px] border-t px-[10px] outline-none mx-auto read-only:text-gray-600 truncate'
						maxlength={16}
						minlength={5}
						name='prevUsername'
						placeholder='Usuario (ej. juanperez1)'
						readonly
						required
						tabindex={-1}
						type='text'
						value={data.username}
					/>
				</label>
				<input
					autocomplete='on'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					maxlength={16}
					minlength={5}
					name='username'
					placeholder='Nuevo usuario (ej. juansoto1)'
					type='text'
				/>
				<label class='flex flex-col'>
					Nombre actual
					<input
						autocomplete='off'
						class='h-[45px] min-w-[300px] w-full max-w-[500px] border-t px-[10px] outline-none mx-auto read-only:text-gray-600 truncate'
						maxlength={30}
						minlength={4}
						name='prevName'
						placeholder='Nombre (ej. Juan Perez)'
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
					placeholder='Nuevo nombre (ej. Juan Soto)'
					type='text'
				/>
				<label class='flex flex-col'>
					Rol actual
					<select
						class='select text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] border-t px-[10px] outline-none mx-auto read-only:text-gray-600 truncate'
						disabled
						name='prevRole'
						tabindex={-1}
					>
						<option>{ROLES[data.role].label}</option>
					</select>
				</label>
				<input
					hidden
					name='prevRole'
					readonly
					required
					value={data.role}
				/>
				<select
					class='select text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					name='role'
				>
					<option value=''>Seleccione nuevo rol</option>
					<option value='A'>Administrador</option>
					<option value='t'>Técnico</option>
					<option value='u'>Usuario</option>
				</select>
				<label class='flex flex-col gap-7'>
					Cambiar contraseña (opcional)
					<input
						autocomplete='new-password'
						class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
						maxlength={16}
						minlength={8}
						name='password'
						placeholder='Nueva contraseña'
						type='password'
					/>
					<input
						autocomplete='new-password'
						class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
						maxlength={16}
						minlength={8}
						name='confirmPassword'
						placeholder='Confirme nueva contraseña'
						type='password'
					/>
				</label>
				{children}
				<button
					class='h-[40px] w-[150px] p-2 border mx-auto hover:cursor-pointer'
					form='editUser'
					type='submit'
				>
					Guardar
				</button>
			</form>
		</>
	)
}

export default EditUserForm
