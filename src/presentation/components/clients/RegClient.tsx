import type { FC } from 'hono/jsx'

const RegClient: FC = async props => {
	return await (
		<>
			<div class='flex flex-col gap-4'>
				<a href='/dashboard/clients'>🡨 Volver</a>
				<h2 class='w-fit h-fit text-4xl'>Registrar cliente</h2>
			</div>
			<form
				class='min-w-[300px] w-full max-w-[500px] h-fit m-auto flex flex-col gap-7'
				method='post'
			>
				{props.children}
				<input
					autocomplete='off'
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
					maxlength={40}
					minlength={4}
					name='name'
					placeholder='Nombre cliente (ej. Hospital XYZ)'
					required
					type='text'
				/>
				<input
					autocomplete='off'
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
					maxlength={30}
					minlength={4}
					name='contact'
					placeholder='Nombre contacto (ej. Maria Pérez)'
					required
					type='text'
				/>
				<input
					autocomplete='off'
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
					maxlength={9}
					minlength={8}
					name='phone'
					placeholder='Teléfono (ej. 096123123)'
					required
					type='text'
				/>
				<input
					autocomplete='off'
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
					name='email'
					placeholder='Email (ej. john@email.com)'
					required
					type='email'
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

export default RegClient
