import Back from '@presentation/components/reusables/Back'
import type { FC, PropsWithChildren } from 'hono/jsx'

const RegMachine: FC<PropsWithChildren> = async ({ children }) => {
	return await (
		<>
			<Back
				route='warehouse'
				title='Registrar equipo'
			/>
			<form
				class='min-w-[300px] w-full max-w-[500px] h-fit m-auto flex flex-col gap-5'
				method='post'
			>
				{children}
				<input
					autocomplete='on'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					maxlength={40}
					minlength={4}
					name='manufacturer'
					placeholder='Fabricante (ej. Endoclear)'
					required
					type='text'
				/>
				<input
					autocomplete='on'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					maxlength={16}
					minlength={4}
					name='model'
					placeholder='Modelo (ej. CP200)'
					required
					type='text'
				/>
				<input
					autocomplete='off'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					maxlength={16}
					minlength={4}
					name='serial_number'
					placeholder='Número de serie'
					required
					type='text'
				/>
				<button
					class='h-[40px] w-[150px] p-2 border mx-auto hover:cursor-pointer'
					type='submit'
				>
					Ingresar
				</button>
			</form>
		</>
	)
}

export default RegMachine
