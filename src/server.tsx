import auth from '@adapters/http/middlewares/auth'
import injectServices from '@adapters/http/middlewares/injectServices'
import clients from '@adapters/http/routes/clients'
import dashboard from '@adapters/http/routes/dashboard'
import login from '@adapters/http/routes/login'
import register from '@adapters/http/routes/register'
import service from '@adapters/http/routes/service'
import users from '@adapters/http/routes/users'
import warehouse from '@adapters/http/routes/warehouse'
import { ROLES } from '@core/entities/Role'
import NotFound from '@presentation/components/reusables/NotFound'
import renderer from '@presentation/renderer'
import { createMiddleware } from 'hono/factory'
import { Hono } from 'hono'
import type { Env } from 'src/env'

const requireMinLevel = (minLevel: number) =>
	createMiddleware<Env>(async (c, next) => {
		const { role } = c.get('jwtPayload')
		if (ROLES[role].level < minLevel) return c.text('No autorizado', 403)
		await next()
	})

const app = new Hono<Env>()

app.use('*', async (c, next) => {
	c.header('X-Content-Type-Options', 'nosniff')
	c.header('X-Frame-Options', 'DENY')
	c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
	c.header(
		'Content-Security-Policy',
		"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
	)
	await next()
})

app.use(injectServices)

app.use(renderer)

app.route('/', login)
app.route('/register', register)

app.use('/dashboard/*', auth)

app.on('POST', '/dashboard/*', async (c, next) => {
	const { role } = c.get('jwtPayload')
	const path = c.req.path
		const userLevel = ROLES[role].level

	if (
		path.startsWith('/dashboard/service/visits/') ||
		path.startsWith('/dashboard/clients/equipment/')
	) {
		if (userLevel >= ROLES.t.level) return await next()
	} else {
		if (userLevel >= ROLES.A.level) return await next()
	}

	return c.text('No autorizado', 403)
})

dashboard.route('/service', service)
dashboard.route('/clients', clients)
dashboard.route('/warehouse', warehouse)
dashboard.route('/users', users)

app.route('/dashboard', dashboard)

app.notFound(async c => {
	return await c.render(<NotFound />)
})

export default app
