import type { FC } from 'hono/jsx'

const WarehouseLayout: FC = () => {
	return (
		<>
			<div class='flex flex-col gap-12'>
				<ul class='flex flex-col gap-4 mr-auto'>
					<h3 class='w-fit h-fit text-4xl'>Equipos</h3>
					<li class='w-fit h-fit'>
						<a href='/dashboard/warehouse/all'>Consultar equipos en depósito</a>
					</li>
					<li class='w-fit h-fit'>
						<a href='/dashboard/warehouse/register'>
							Ingresar equipo a depósito
						</a>
					</li>
				</ul>
			</div>
		</>
	)
}

export default WarehouseLayout
