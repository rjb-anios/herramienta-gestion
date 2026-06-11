import type { FC, PropsWithChildren } from 'hono/jsx'

const RegMachine: FC<PropsWithChildren> = async ({ children }) => {
	return await (
		<>
			<div class='flex flex-col gap-4'>
				<a href='/dashboard/warehouse'>🡨 Volver</a>
				<h2 class='w-fit h-fit text-4xl'>Ingresar equipo al depósito</h2>
			</div>
			<form
				class='min-w-[300px] w-full max-w-[500px] h-fit m-auto flex flex-col gap-7'
				method='post'
			>
				{children}
				<input
					autocomplete='on'
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
					maxlength={40}
					minlength={4}
					name='manufacturer'
					placeholder='Fabricante (ej. Endoclear)'
					required
					type='text'
				/>
				<input
					autocomplete='on'
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
					maxlength={16}
					minlength={4}
					name='model'
					placeholder='Modelo (ej. CP200)'
					required
					type='text'
				/>
				<input
					autocomplete='off'
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
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
