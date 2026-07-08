import type { Role } from '@core/entities/Role'
import { ROLES } from '@core/entities/Role'
import type { FC } from 'hono/jsx'

const VisitsLayout: FC<{ role: Role }> = ({ role }) => {
	const userLevel = ROLES[role].level

	return (
		<>
			<div class='flex flex-col gap-12'>
				<ul class='flex flex-col gap-4 mr-auto'>
					<h3 class='w-fit h-fit text-4xl'>Visitas</h3>
					<li class='w-fit h-fit'>
						<a href='/dashboard/service/visits/all'>Consultar visitas</a>
					</li>
					{userLevel >= ROLES.t.level && (
						<li class='w-fit h-fit'>
							<a href='/dashboard/service/visits/register'>Registrar visita</a>
						</li>
					)}
				</ul>
				<ul class='flex flex-col gap-4 mr-auto text-gray-500'>
					<h3 class='w-fit h-fit text-4xl'>Gastos (En desarrollo)</h3>
					<li class='w-fit h-fit'>
						<p>Consultar gastos</p>
					</li>
					<li class='w-fit h-fit'>
						<p>Registrar gasto</p>
					</li>
				</ul>
				<ul class='flex flex-col gap-4 mr-auto'>
					<h3 class='w-fit h-fit text-4xl'>Técnicos</h3>
					<li class='w-fit h-fit'>
						<a href='/dashboard/service/technicians/all'>Consultar técnicos</a>
					</li>
					{userLevel >= ROLES.A.level && (
						<li class='w-fit h-fit'>
							<a href='/dashboard/service/technicians/register'>
								Registrar técnico
							</a>
						</li>
					)}
				</ul>
			</div>
		</>
	)
}

export default VisitsLayout
