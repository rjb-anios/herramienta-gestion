import type { Child, FC } from 'hono/jsx'

const RegUserLayout: FC<{
	children?: Child
	hideRole: boolean
}> = async props => {
	return (
		<>
			<div class='flex flex-col gap-4'>
				<a href='/dashboard/users'>🡨 Volver</a>
				<h2 class='w-fit h-fit text-4xl'>Registrar usuario</h2>
			</div>
			<form
				class='min-w-[300px] w-full max-w-[500px] h-fit m-auto flex flex-col gap-7'
				method='post'
			>
				{props.children}
				<input
					autocomplete='off'
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
					maxlength={16}
					minlength={5}
					name='username'
					placeholder='Usuario (ej. juanperez1)'
					required
					type='text'
				/>
				<input
					autocomplete='off'
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
					maxlength={30}
					minlength={4}
					name='name'
					placeholder='Nombre (ej. Juan Perez)'
					required
					type='text'
				/>
				<input
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
					maxlength={16}
					minlength={8}
					name='password'
					placeholder='Contraseña'
					required
					type='password'
				/>
				<input
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
					maxlength={16}
					minlength={8}
					name='confirmPassword'
					placeholder='Confirme contraseña'
					required
					type='password'
				/>
				{props.hideRole ? (
					<input
						name='role'
						type='hidden'
						value='A'
					/>
				) : (
					<select
						class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
						id='role-select'
						name='role'
					>
						<option value=''>Seleccione rol</option>
						<option value='A'>Administrador</option>
						<option value='u'>Usuario</option>
					</select>
				)}
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

const RegUser: FC<{
	children?: Child
	hideRole: boolean
}> = async props => {
	const layout = (
		<RegUserLayout hideRole={props.hideRole}>{props.children}</RegUserLayout>
	)

	if (props.hideRole) {
		return await (
			<div class='p-8 text-3xl flex flex-col justify-center w-full h-full'>
				{layout}
			</div>
		)
	}

	return await layout
}

export default RegUser
