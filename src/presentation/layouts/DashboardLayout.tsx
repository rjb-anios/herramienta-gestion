import type { Role } from '@core/entities/Role'
import { ROLES } from '@core/entities/Role'
import type { FC, PropsWithChildren } from 'hono/jsx'

const roleLabel: Record<Role, string> = {
	A: 'Administrador',
	u: 'Usuario'
}

const DashboardLayout: FC<
	PropsWithChildren<{ role: Role; name: string }>
> = async ({ children, role, name }) => {
	return await (
		<>
			<div class='flex justify-between items-center h-[35px] px-10 pb-[7.5px] text-xl max-[490px]:text-lg'>
				<span class='truncate'>
					{name} · <i>{roleLabel[role]}</i>
				</span>
			</div>
			<nav class='flex h-[45px] border-y text-4xl max-[660px]:text-3xl max-[490px]:text-2xl max-[380px]:text-xl px-10'>
				<ul class='w-fit flex gap-10 max-[660px]:gap-5 max-[490px]:gap-2 m-auto'>
					<a
						class='w-fit flex text-center'
						href='/dashboard/service'
					>
						Servicio técnico
					</a>
					|
					<a
						class='w-fit flex text-center'
						href='/dashboard/clients'
					>
						Clientes
					</a>
					|
					<a
						class='w-fit flex text-center'
						href='/dashboard/warehouse'
					>
						Depósito
					</a>
					{ROLES[role] >= ROLES.A && (
						<>
							|
							<a
								class='w-fit flex text-center'
								href='/dashboard/users'
							>
								Usuarios
							</a>
						</>
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
