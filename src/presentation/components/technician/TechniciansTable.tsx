import { ROLES, type Role } from '@core/entities/Role'
import type { Technician } from '@core/entities/Technician'
import Back from '@presentation/components/reusables/Back'
import Dots from '@presentation/components/reusables/Dots'
import type { FC, PropsWithChildren } from 'hono/jsx'

const TechniciansTable: FC<
	PropsWithChildren<{ arrTech: Technician[]; role: Role }>
> = async ({ children, arrTech, role }) => {
	return await (
		<div class='flex flex-col gap-10 h-full w-full mx-auto pb-12 overflow-auto'>
			<Back
				route='service'
				title='Técnicos'
			/>
			{children}
			<table class='text-3xl w-full min-w-[890px] max-w-[1440px] mx-auto'>
				<thead class='w-full border-b p-3'>
					<tr class='h-[40px]'>
						<th class='w-3/12 border-x px-[10px]'>Nombre</th>
						<th class='w-1/12 border-x px-[10px]'>Iniciales</th>
						<th class='w-3/12 border-x px-[10px]'>Correo</th>
						<th class='w-2/12 border-x px-[10px]'>Teléfono</th>
						<th class='w-1/12 border-x px-[10px]'>Estado</th>
						{ROLES[role].level >= ROLES.A.level && (
							<th class='w-1/12 border-x px-[10px]'>Opción</th>
						)}
					</tr>
				</thead>
				<tbody class='w-full text-center p-3'>
					{arrTech.map(async e => {
						return await (
							<tr class='h-[40px]'>
								<td class='w-3/12 border-x truncate px-[10px]'>{e.name}</td>
								<td class='w-1/12 border-x truncate px-[10px]'>{e.initials}</td>
								<td class='w-3/12 border-x truncate px-[10px]'>{e.email}</td>
								<td class='w-2/12 border-x truncate px-[10px]'>{e.phone}</td>
								<td class='w-1/12 border-x truncate px-[10px]'>{e.active ? (
										<span class='text-green-700'>Activo</span>
									) : (
										<span class='text-red-700'>Inactivo</span>
									)}
								</td>
								{ROLES[role].level >= ROLES.A.level && (
									<>
										<td class='w-1/6 border-x truncate px-[10px]'>
											<Dots id={e.id} />
											<ul
												class='dropdown dropdown-center dropdown-top menu w-fit text-2xl p-3 bg-base-100 border shadow-sm'
												id={e.id}
												popover='auto'
											>
												<li class='cursor-pointer'>
													<a
														href={`/dashboard/service/technicians/all/edit/${e.id}`}
													>
														Editar
													</a>
												</li>
												<li class='cursor-pointer'>
													<button
														data-dialog-id={`${e.id}-tog26`}
														type='button'
													>
														{e.active ? 'Desactivar' : 'Activar'}
													</button>
												</li>
											</ul>
										</td>
										<td>
											<dialog
												class='backdrop:bg-black/50 m-auto'
												id={`${e.id}-tog26`}
											>
												<div class='flex flex-col text-3xl w-[480px] max-[650px]:text-2xl max-[650px]:w-[300px] items-center justify-center m-auto border p-8 gap-8'>
													<h3 class='w-fit mx-auto text-center'>
														{e.active
															? `¿Desactivar a ${e.name}?`
															: `¿Activar a ${e.name}?`}
													</h3>
													<div class='flex gap-10 justify-center'>
														<form
															action={`/dashboard/service/technicians/all/toggle-active/${e.id}`}
															method='post'
														>
															<button
																class='text-red-700 cursor-pointer'
																type='submit'
															>
																<strong>
																	{e.active ? 'Desactivar' : 'Activar'}
																</strong>
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
									</>
								)}
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

export default TechniciansTable
