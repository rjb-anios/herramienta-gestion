import type { Machine } from '@core/entities/Machine'
import Back from '@presentation/components/reusables/Back'
import Dots from '@presentation/components/reusables/Dots'
import type { FC, PropsWithChildren } from 'hono/jsx'

const WarehouseMachinesTable: FC<
	PropsWithChildren<{ arrMachine: Machine[] }>
> = async ({ children, arrMachine }) => {
	return await (
		<div class='flex flex-col gap-10 h-full w-full mx-auto pb-12 overflow-auto'>
			<Back
				route='warehouse'
				title='Equipos'
			/>
			{children}
			<table class='text-3xl min-w-[890px] w-auto max-w-[1440px] mx-auto'>
				<thead class='w-full border-b p-3'>
					<tr class='h-[40px]'>
						<th class='w-4/12 border-x'>Fabricante</th>
						<th class='w-3/12 border-x'>Modelo</th>
						<th class='w-4/12 border-x'>Número de serie</th>
						<th class='w-1/12 border-x'>Opción</th>
					</tr>
				</thead>
				<tbody class='w-full text-center p-3'>
					{arrMachine.map(m => (
						<tr class='h-[40px]'>
							<td class='w-4/12 border-x truncate'>{m.manufacturer}</td>
							<td class='w-3/12 border-x truncate'>{m.model}</td>
							<td class='w-4/12 border-x truncate'>{m.serial_number}</td>
							<td class='w-1/12 border-x'>
								<Dots id={m.id} />
								<ul
									class='dropdown dropdown-center dropdown-top menu w-fit text-2xl p-3 bg-base-100 border shadow-sm'
									id={m.id}
									popover='auto'
								>
									<li class='cursor-pointer'>
										<a href={`/dashboard/warehouse/all/edit/${m.id}`}>Editar</a>
									</li>
									<li class='cursor-pointer'>
										<button
											onclick={`document.getElementById('${m.id}-mach26').showModal();`}
											type='button'
										>
											Eliminar
										</button>
									</li>
								</ul>
							</td>
							<td>
								<dialog
									class='backdrop:bg-black/50 m-auto'
									id={`${m.id}-mach26`}
								>
									<div class='flex flex-col w-[320px] items-center justify-center m-auto border p-8 gap-8'>
										<h3 class='text-3xl w-fit mx-auto text-center'>
											¿Estás seguro que deseas eliminar el equipo{' '}
											<b>{m.model}</b>, serial: <b>{m.serial_number}</b>?
										</h3>
										<div class='flex gap-10 text-3xl justify-center'>
											<form
												action={`/dashboard/warehouse/all/delete/${m.id}`}
												method='post'
											>
												<button
													class='text-red-700 cursor-pointer'
													type='submit'
												>
													Eliminar
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
					))}
				</tbody>
			</table>
		</div>
	)
}

export default WarehouseMachinesTable
