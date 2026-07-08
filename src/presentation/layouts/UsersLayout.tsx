import type { Role } from '@core/entities/Role'
import { ROLES } from '@core/entities/Role'
import type { FC } from 'hono/jsx'

const UsersLayout: FC<{ role: Role }> = ({ role }) => {
	const isAdmin = ROLES[role].level >= ROLES.A.level

	return (
		<>
			<div class='flex flex-col gap-12'>
				<ul class='flex flex-col gap-4 mr-auto'>
					<h3 class='w-fit h-fit text-4xl'>Usuarios</h3>
					<li class='w-fit h-fit'>
						<a href='/dashboard/users/all'>Consultar usuarios</a>
					</li>
					{isAdmin && (
						<li class='w-fit h-fit'>
							<a href='/dashboard/users/register'>Registrar usuario</a>
						</li>
					)}
				</ul>
			</div>
		</>
	)
}

export default UsersLayout
