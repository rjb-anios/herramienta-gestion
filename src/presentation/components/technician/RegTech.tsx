import type { FC } from 'hono/jsx'

const RegTech: FC = async props => {
	return await (
		<>
			<div class='flex flex-col gap-4'>
				<a href='/dashboard/service'>🡨 Volver</a>
				<h2 class='w-fit h-fit text-4xl'>Registrar técnico</h2>
			</div>
			<form
				class='min-w-[300px] w-full max-w-[500px] h-fit m-auto flex flex-col gap-7'
				method='post'
			>
				{props.children}
				<input
					autocomplete='off'
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
					maxlength={30}
					minlength={4}
					name='name'
					placeholder='Nombre (ej. Juan Pérez)'
					required
					type='text'
				/>
				<input
					autocomplete='off'
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
					maxlength={3}
					minlength={2}
					name='initials'
					placeholder='Iniciales (ej. JP)'
					required
					type='text'
				/>
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

export default RegTech
