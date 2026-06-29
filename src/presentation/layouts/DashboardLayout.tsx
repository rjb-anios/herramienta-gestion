import { ROLES } from '@core/entities/Role'
import type { Role } from '@core/entities/Role'
import type { FC, PropsWithChildren } from 'hono/jsx'

const DashboardLayout: FC<PropsWithChildren<{ role: Role }>> = async ({
	children,
	role
}) => {
	return await (
		<>
			<nav class='flex h-[60px] border-b text-4xl max-[650px]:text-3xl max-[420px]:text-2xl p-4 max-[650px]:p-3'>
				<ul class='w-fit flex gap-8 max-[650px]:gap-6 max-[420px]:gap-3 m-auto'>
					<a
						class='w-fit flex text-center'
						href='/dashboard/service'
					>
						Servicio técnico
					</a>
					<a
						class='w-fit flex text-center'
						href='/dashboard/clients'
					>
						Clientes
					</a>
					<a
						class='w-fit flex text-center'
						href='/dashboard/warehouse'
					>
						Depósito
					</a>
					{ROLES[role] >= ROLES.A && (
						<a
							class='w-fit flex text-center'
							href='/dashboard/users'
						>
							Usuarios
						</a>
					)}
				</ul>
			</nav>
			<section class='h-full text-3xl p-10 flex flex-col gap-8 overflow-y-auto'>
				{children}
			</section>
		</>
	)
}

export default DashboardLayout
