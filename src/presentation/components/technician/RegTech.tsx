import Back from '@presentation/components/reusables/Back'
import type { FC } from 'hono/jsx'

const RegTech: FC = async props => {
	return await (
		<>
			<Back
				route='service'
				title='Registrar técnico'
			/>
			<form
				class='min-w-[300px] w-full max-w-[500px] h-fit m-auto flex flex-col gap-5'
				method='post'
			>
				{props.children}
				<input
					autocomplete='off'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					maxlength={30}
					minlength={4}
					name='name'
					placeholder='Nombre (ej. Juan Pérez)'
					required
					type='text'
				/>
				<input
					autocomplete='off'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					maxlength={3}
					minlength={2}
					name='initials'
					placeholder='Iniciales (ej. JP)'
					required
					type='text'
				/>
				<input
					autocomplete='off'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					name='email'
					placeholder='Email (ej. tech@email.com)'
					required
					type='email'
				/>
				<input
					autocomplete='off'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					maxlength={8}
					minlength={8}
					name='phone'
					placeholder='Teléfono (ej. 99000001)'
					required
					type='tel'
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
