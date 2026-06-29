import type { Client } from '@core/entities/Client'
import Back from '@presentation/components/reusables/Back'
import DeleteModal from '@presentation/components/reusables/DeleteModal'
import Dots from '@presentation/components/reusables/Dots'
import type { FC, PropsWithChildren } from 'hono/jsx'

const ClientsTable: FC<PropsWithChildren<{ arrClient: Client[] }>> = async ({
	children,
	arrClient
}) => {
	return await (
		<div class='flex flex-col gap-10 h-full w-full mx-auto pb-12 overflow-auto'>
			<Back
				route='clients'
				title='Clientes'
			/>
			{children}
			<table class='text-3xl min-w-[890px] w-auto max-w-[1440px] mx-auto'>
				<thead class='w-full border-b p-3'>
					<tr class='h-[40px]'>
						<th class='w-4/12 border-x'>Nombre</th>
						<th class='w-3/12 border-x'>Contacto</th>
						<th class='w-1/12 border-x'>Teléfono</th>
						<th class='w-3/12 border-x'>Correo</th>
						<th class='w-1/12 border-x'>Opción</th>
					</tr>
				</thead>
				<tbody class='w-full text-center p-3'>
					{arrClient.map(async e => {
						return await (
							<tr class='h-[40px]'>
								<td class='w-4/12 border-x truncate px-[10px]'>{e.name}</td>
								<td class='w-3/12 border-x truncate px-[10px]'>{e.contact}</td>
								<td class='w-1/12 border-x truncate px-[10px]'>{e.phone}</td>
								<td class='w-3/12 border-x truncate px-[10px]'>{e.email}</td>
								<td class='w-1/12 border-x truncate px-[10px]'>
									<Dots id={e.id} />
									<ul
										class='dropdown dropdown-center dropdown-top menu w-fit text-2xl p-3 bg-base-100 border shadow-sm'
										id={e.id}
										popover='auto'
									>
										<li class='cursor-pointer'>
											<a href={`/dashboard/clients/all/edit/${e.id}`}>Editar</a>
										</li>
										<li class='cursor-pointer'>
											<button
												data-dialog-id={`${e.id}-cl26`}
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
										id={`${e.id}-cl26`}
									>
										<DeleteModal
											id={e.id}
											name={e.name}
											route='clients/all'
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

export default ClientsTable
