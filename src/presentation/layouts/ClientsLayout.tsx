import type { FC } from 'hono/jsx'

const ClientsLayout: FC = () => {
	return (
		<>
			<div class='flex flex-col gap-12'>
				<ul class='flex flex-col gap-4 mr-auto'>
					<h3 class='w-fit h-fit text-4xl'>Clientes</h3>
					<li class='w-fit h-fit'>
						<a href='/dashboard/clients/all'>Consultar clientes</a>
					</li>
					<li class='w-fit h-fit'>
						<a href='/dashboard/clients/register'>Registrar cliente</a>
					</li>
				</ul>
				<ul class='flex flex-col gap-4 mr-auto'>
					<h3 class='w-fit h-fit text-4xl'>Equipos</h3>
					<li class='w-fit h-fit'>
						<a href='/dashboard/clients/equipment/all'>
							Consultar equipos asignados
						</a>
					</li>
					<li class='w-fit h-fit'>
						<a href='/dashboard/clients/equipment/assign'>
							Asignar equipo a cliente
						</a>
					</li>
				</ul>
			</div>
		</>
	)
}

export default ClientsLayout
