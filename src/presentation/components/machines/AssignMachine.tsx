import type { Client } from '@core/entities/Client'
import type { Machine } from '@core/entities/Machine'
import type { FC, PropsWithChildren } from 'hono/jsx'

const AssignMachine: FC<
	PropsWithChildren<{ arrClient: Client[]; arrMachine: Machine[] }>
> = async ({ arrClient = [], arrMachine = [], children }) => {
	return await (
		<>
			<div class='flex flex-col gap-4'>
				<a href='/dashboard/clients'>🡨 Volver</a>
				<h2 class='w-fit h-fit text-4xl'>Asignar equipo desde depósito</h2>
			</div>
			<form
				class='min-w-[300px] w-full max-w-[500px] h-fit m-auto flex flex-col gap-7'
				method='post'
			>
				{children}
				<select
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
					name='id_client'
					required
				>
					<option value=''>Seleccione un cliente</option>
					{arrClient.map(c => (
						<option value={c.id}>{c.name}</option>
					))}
				</select>
				<select
					class='h-[45px] min-w-[300px] w-full max-w-[500px] border-b-2 px-[10px] outline-none mx-auto truncate'
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
