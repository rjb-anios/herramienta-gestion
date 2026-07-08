import ClientsLayout from '@presentation/layouts/ClientsLayout'
import DashboardLayout from '@presentation/layouts/DashboardLayout'
import ServiceLayout from '@presentation/layouts/ServiceLayout'
import UsersLayout from '@presentation/layouts/UsersLayout'
import WarehouseLayout from '@presentation/layouts/WareHouseLayout'
import { Hono } from 'hono'
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
import type { Env } from 'src/env'

const dashboard = new Hono<Env>()

dashboard.use(
	jsxRenderer(async ({ children, Layout }) => {
		const c = useRequestContext<Env>()

		const user = c.get('jwtPayload')

		return await (
			<Layout>
				<DashboardLayout
					name={user.name}
					role={user.role}
				>
					{children}
				</DashboardLayout>
			</Layout>
		)
	})
)

dashboard.get('/', async c => {
	return await c.render(
		<p class='text-center'>
			Utilidad para facilitar la gestión de visitas técnicas, clientes y
			equipos.
		</p>
	)
})

dashboard.get('/service', async c => {
	const { role } = c.get('jwtPayload')
	return await c.render(<ServiceLayout role={role} />)
})

dashboard.get('/clients', async c => {
	const { role } = c.get('jwtPayload')
	return await c.render(<ClientsLayout role={role} />)
})

dashboard.get('/warehouse', async c => {
	const { role } = c.get('jwtPayload')
	return await c.render(<WarehouseLayout role={role} />)
})

dashboard.get('/users', async c => {
	const { role } = c.get('jwtPayload')
	return await c.render(<UsersLayout role={role} />)
})

export default dashboard
