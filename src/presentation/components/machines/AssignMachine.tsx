import type { Client } from '@core/entities/Client'
import type { Machine } from '@core/entities/Machine'
import Back from '@presentation/components/reusables/Back'
import type { FC, PropsWithChildren } from 'hono/jsx'

const AssignMachine: FC<
	PropsWithChildren<{ arrClient: Client[]; arrMachine: Machine[] }>
> = async ({ arrClient = [], arrMachine = [], children }) => {
	return await (
		<>
			<Back
				route='clients'
				title='Asignar equipo'
			/>
			<form
				class='min-w-[300px] w-full max-w-[500px] h-fit m-auto flex flex-col gap-5'
				method='post'
			>
				{children}
				<select
					class='select text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					name='id_client'
					required
				>
					<option value=''>Seleccione un cliente</option>
					{arrClient.map(c => (
						<option value={c.id}>{c.name}</option>
					))}
				</select>
				<select
					class='select text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					name='id_machine'
					required
				>
					<option value=''>Seleccione un equipo del depósito</option>
					{arrMachine.map(m => (
						<option value={m.id}>
							{m.manufacturer} {m.model} - {m.serial_number}
						</option>
					))}
				</select>
				<button
					class='h-[40px] w-[150px] p-2 border mx-auto hover:cursor-pointer'
					type='submit'
				>
					Asignar
				</button>
			</form>
		</>
	)
}

export default AssignMachine
