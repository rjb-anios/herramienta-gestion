import type { MachineWithClientName } from '@core/entities/Machine'
import Back from '@presentation/components/reusables/Back'
import Dots from '@presentation/components/reusables/Dots'
import type { FC, PropsWithChildren } from 'hono/jsx'

const MachinesTable: FC<
	PropsWithChildren<{ arrMachine: MachineWithClientName[] }>
> = async ({ children, arrMachine }) => {
	return await (
		<div class='flex flex-col gap-10 h-full w-full mx-auto pb-12 overflow-auto'>
			<Back
				route='clients'
				title='Equipos'
			/>
			{children}
			<table class='text-3xl min-w-[890px] w-auto max-w-[1440px] mx-auto'>
				<thead class='w-full border-b p-3'>
					<tr class='h-[40px]'>
						<th class='w-3/12 border-x'>Cliente</th>
						<th class='w-2/12 border-x'>Fabricante</th>
						<th class='w-3/12 border-x'>Modelo</th>
						<th class='w-3/12 border-x'>Serial</th>
						<th class='w-1/12 border-x'>Opción</th>
					</tr>
				</thead>
				<tbody class='w-full text-center p-3'>
					{arrMachine.map(async e => {
						return await (
							<tr class='h-[40px]'>
								<td class='w-3/12 border-x truncate px-[10px]'>{e.client}</td>
								<td class='w-2/12 border-x truncate px-[10px]'>
									{e.manufacturer}
								</td>
								<td class='w-3/12 border-x truncate px-[10px]'>{e.model}</td>
								<td class='w-3/12 border-x truncate px-[10px]'>
									{e.serial_number}
								</td>
								<td class='w-1/12 border-x truncate'>
									<Dots id={e.id} />
									<ul
										class='dropdown dropdown-center dropdown-top menu w-fit text-2xl p-3 bg-base-100 border shadow-sm'
										id={e.id}
										popover='auto'
									>
										<li class='cursor-pointer w-fit'>
											<button
												class='w-c'
												onclick={`document.getElementById('${e.id}-mc26').showModal()`}
												type='button'
											>
												Mover
											</button>
										</li>
									</ul>
								</td>
								<td>
									<dialog
										class='backdrop:bg-black/50 m-auto'
										id={`${e.id}-mc26`}
									>
										<div class='flex flex-col text-3xl w-[480px] max-[650px]:text-2xl max-[650px]:w-[300px] items-center justify-center m-auto border p-8 gap-8'>
											<div class='flex flex-col justify-items-start m-auto gap-4'>
												<p>
													Esta acción implica retirar y mover a depósito el
													equipo:&nbsp;
													<b>{e.model}</b>, serial: <b>{e.serial_number}</b>,
													&nbsp;asignado al cliente: <b>{e.client}</b>
												</p>
												<p>¿Está seguro que desea realizar esta acción?</p>
											</div>
											<div class='flex gap-10 justify-center'>
												<form
												// action={`#`}
												// method='post'
												>
													<button
														class='text-red-700 cursor-pointer'
														disabled
														type='submit'
													>
														<strong>Mover</strong>
													</button>
												</form>
												<form method='dialog'>
													<button
														class='cursor-pointer'
														type='submit'
													>
														Cerrar
													</button>
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
