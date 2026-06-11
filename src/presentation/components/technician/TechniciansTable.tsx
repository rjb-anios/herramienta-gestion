import type { Technician } from '@core/entities/Technician'
import type { FC, PropsWithChildren } from 'hono/jsx'

const TechniciansTable: FC<
	PropsWithChildren<{ arrTech: Technician[] }>
> = async ({ children, arrTech }) => {
	return await (
		<div class='flex flex-col gap-10 h-full w-full mx-auto pb-12 overflow-auto'>
			<div class='flex flex-col gap-4'>
				<a href='/dashboard/service'>🡨 Volver</a>
				<h2 class='w-fit h-fit text-4xl'>Consultar técnicos</h2>
			</div>
			{children}
			<table class='text-3xl w-full min-w-[890px] max-w-[1440px] mx-auto'>
				<thead class='w-full border-b p-3'>
					<tr class='h-[40px]'>
						<th class='w-5/12 border-x'>Nombre</th>
						<th class='w-3/12 border-x'>Iniciales</th>
						<th class='w-4/12 border-x'>Opción</th>
					</tr>
				</thead>
				<tbody class='w-full text-center p-3'>
					{arrTech.map(async e => {
						return await (
							<tr class='h-[40px]'>
								<td class='w-5/12 border-x truncate px-[10px]'>{e.name}</td>
								<td class='w-3/12 border-x truncate px-[10px]'>{e.initials}</td>
								<td class='w-4/12 border-x truncate px-[10px]'>
									<p class='mx-[15px] inline-block'>
										<a href={`/dashboard/service/technicians/all/edit/${e.id}`}>
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
												¿Estás seguro que deseas eliminar al técnico{' '}
												<b>{e.name}</b>?
											</h3>
											<div class='flex gap-10 text-3xl justify-center'>
												<form
													action={`/dashboard/service/technicians/all/delete/${e.id}`}
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

export default TechniciansTable
