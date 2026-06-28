import type { Technician } from '@core/entities/Technician'
import Back from '@presentation/components/reusables/Back'
import DeleteModal from '@presentation/components/reusables/DeleteModal'
import Dots from '@presentation/components/reusables/Dots'
import type { FC, PropsWithChildren } from 'hono/jsx'

const TechniciansTable: FC<
	PropsWithChildren<{ arrTech: Technician[] }>
> = async ({ children, arrTech }) => {
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
						<th class='w-3/6 border-x'>Nombre</th>
						<th class='w-2/6 border-x'>Iniciales</th>
						<th class='w-1/6 border-x'>Opción</th>
					</tr>
				</thead>
				<tbody class='w-full text-center p-3'>
					{arrTech.map(async e => {
						return await (
							<tr class='h-[40px]'>
								<td class='w-3/6 border-x truncate px-[10px]'>{e.name}</td>
								<td class='w-2/6 border-x truncate px-[10px]'>{e.initials}</td>
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
												onclick={`document.getElementById('${e.id}-tec26').showModal();`}
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
										id={`${e.id}-tec26`}
									>
										<DeleteModal
											id={e.id}
											name={e.name}
											route='service/technicians/all'
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

export default TechniciansTable
