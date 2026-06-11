import type { MachineWithClientName } from '@core/entities/Machine'
import type { FC, PropsWithChildren } from 'hono/jsx'

const MachinesTable: FC<
	PropsWithChildren<{ arrMachine: MachineWithClientName[] }>
> = async ({ children, arrMachine }) => {
	return await (
		<div class='flex flex-col gap-10 h-full w-full mx-auto pb-12 overflow-auto'>
			<div class='flex flex-col gap-4'>
				<a href='/dashboard/clients'>🡨 Volver</a>
				<h2 class='w-fit h-fit text-4xl'>Equipos</h2>
			</div>
			{children}
			<table class='text-3xl min-w-[890px] w-auto max-w-[1440px] mx-auto'>
				<thead class='w-full border-b p-3'>
					<tr class='h-[40px]'>
						<th class='w-4/12 border-x'>Cliente</th>
						<th class='w-2/12 border-x'>Fabricante</th>
						<th class='w-2/12 border-x'>Modelo</th>
						<th class='w-1/12 border-x'>Serial</th>
						<th class='w-3/12 border-x'>Opción</th>
					</tr>
				</thead>
				<tbody class='w-full text-center p-3'>
					{arrMachine.map(async e => {
						return await (
							<tr class='h-[40px]'>
								<td class='w-4/12 border-x truncate px-[10px]'>{e.client}</td>
								<td class='w-2/12 border-x truncate px-[10px]'>
									{e.manufacturer}
								</td>
								<td class='w-2/12 border-x truncate px-[10px]'>{e.model}</td>
								<td class='w-1/12 border-x truncate px-[10px]'>
									{e.serial_number}
								</td>
								<td class='w-3/12 border-x'>
									<p class='mx-[15px] inline-block'>
										<a href={`/dashboard/clients/equipment/edit/${e.id}`}>
											Editar
										</a>
									</p>
									<p class='mx-[15px] inline-block'>
										<button
											onclick={`document.getElementById('${e.id}').showModal()`}
											type='button'
										>
											Eliminar
										</button>
									</p>
								</td>
								<td>
									<dialog
										class='backdrop:bg-black/50 m-auto'
										id={e.id}
									>
										<div class='flex flex-col w-[320px] items-center justify-center m-auto border p-8 gap-8'>
											<h3 class='text-3xl w-fit mx-auto text-center'>
												¿Estás seguro que deseas eliminar el equipo{' '}
												<b>{e.model}</b>, serial: <b>{e.serial_number}</b> del
												cliente <b>{e.client}</b>?
											</h3>
											<div class='flex gap-10 text-3xl justify-center'>
												<form
													action={`/dashboard/clients/equipment/delete/${e.id}`}
													method='post'
												>
													<button
														class='text-red-700'
														type='submit'
													>
														Eliminar
													</button>
												</form>
												<form method='dialog'>
													<button type='submit'>Cerrar</button>
												</form>
											</div>
										</div>
									</dialog>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

export default MachinesTable
