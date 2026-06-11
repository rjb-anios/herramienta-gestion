import type { FC } from 'hono/jsx'

const LoginLayout: FC = async props => {
	return await (
		<section class='h-full w-full flex flex-col-reverse'>
			<form
				class='w-fit h-fit m-auto flex flex-col text-3xl gap-9'
				method='post'
			>
				<input
					autocomplete='on'
					class='h-[45px] w-[300px] border-b-2 px-[10px] outline-none mx-auto'
					maxlength={16}
					minlength={5}
					name='username'
					placeholder='Usuario (ej. juanperez1)'
					required
					type='text'
				/>
				<input
					class='h-[45px] w-[300px] border-b-2 px-[10px] outline-none mx-auto'
					maxlength={16}
					minlength={8}
					name='password'
					placeholder='Contraseña'
					required
					type='password'
				/>
				<button
					class='h-[40px] w-[150px] p-2 border mx-auto hover:cursor-pointer'
					type='submit'
				>
					Iniciar sesión
				</button>
				{props.children}
			</form>
		</section>
	)
}

export default LoginLayout
