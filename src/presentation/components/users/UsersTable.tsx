import type { User } from '@core/entities/User'
import Back from '@presentation/components/reusables/Back'
import DeleteModal from '@presentation/components/reusables/DeleteModal'
import Dots from '@presentation/components/reusables/Dots'
import type { FC, PropsWithChildren } from 'hono/jsx'

const UsersTable: FC<PropsWithChildren<{ arrUser: User[] }>> = async ({
	children,
	arrUser
}) => {
	return await (
		<div class='flex flex-col gap-10 h-full w-full mx-auto pb-12 overflow-auto'>
			<Back
				route='users'
				title='Usuarios'
			/>
			{children}
			<table class='text-3xl min-w-[890px] w-auto max-w-[1440px] mx-auto'>
				<thead class='w-full border-b p-3'>
					<tr class='h-[40px]'>
						<th class='w-2/6 border-x'>Usuario</th>
						<th class='w-2/6 border-x'>Nombre</th>
						<th class='w-1/6 border-x'>Rol</th>
						<th class='w-1/6 border-x'>Opción</th>
					</tr>
				</thead>
				<tbody class='w-full text-center p-3'>
					{arrUser.map(async e => {
						return await (
							<tr class='h-[40px]'>
								<td class='w-2/6 border-x truncate'>{e.username}</td>
								<td class='w-2/6 border-x truncate'>{e.name}</td>
								<td class='w-1/6 border-x truncate'>
									{e.role === 'A' ? 'Administrador' : 'Usuario'}
								</td>
								<td class='w-1/6 border-x truncate'>
									<Dots id={e.id} />
									<ul
										class='dropdown dropdown-center dropdown-top menu w-fit text-2xl p-3 bg-base-100 border shadow-sm'
										id={e.id}
										popover='auto'
									>
										<li class='cursor-pointer'>
											<a href={`/dashboard/users/all/edit/${e.id}`}>Editar</a>
										</li>
										<li class='cursor-pointer'>
											<button
												data-dialog-id={`${e.id}-usr26`}
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
										id={`${e.id}-usr26`}
									>
										<DeleteModal
											id={e.id}
											name={e.name}
											route='users/all'
										/>
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
