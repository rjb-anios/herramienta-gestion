import type { User } from '@core/entities/User'
import type { FC, PropsWithChildren } from 'hono/jsx'

const UsersTable: FC<PropsWithChildren<{ arrUser: User[] }>> = async ({
	children,
	arrUser
}) => {
	return await (
		<div class='flex flex-col gap-10 h-full w-full mx-auto pb-12 overflow-auto'>
			<div class='flex flex-col gap-4'>
				<a href='/dashboard/users'>🡨 Volver</a>
				<h2 class='w-fit h-fit text-4xl'>Usuarios</h2>
			</div>
			{children}
			<table class='text-3xl min-w-[890px] w-auto max-w-[1440px] mx-auto'>
				<thead class='w-full border-b p-3'>
					<tr class='h-[40px]'>
						<th class='w-1/6 border-x'>Usuario</th>
						<th class='w-2/6 border-x'>Nombre</th>
						<th class='w-1/6 border-x'>Rol</th>
						<th class='w-2/6 border-x'>Opción</th>
					</tr>
				</thead>
				<tbody class='w-full text-center p-3'>
					{arrUser.map(async e => {
						return await (
							<tr class='h-[40px]'>
								<td class='w-1/6 border-x truncate'>{e.username}</td>
								<td class='w-2/6 border-x truncate'>{e.name}</td>
								<td class='w-1/6 border-x truncate'>
									{e.role === 'A' ? 'Administrador' : 'Usuario'}
								</td>
								<td class='w-2/6 border-x truncate'>
									<p class='mx-[15px] inline-block'>
										<a href={`/dashboard/users/edit/${e.id}`}>Editar</a>
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
												¿Estás seguro que deseas eliminar a <b>{e.name}</b>?
											</h3>
											<div class='flex gap-10 text-3xl justify-center'>
												<form
													action={`/dashboard/users/delete/${e.id}`}
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

export default UsersTable
