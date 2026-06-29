import auth from '@adapters/http/middlewares/auth'
import injectServices from '@adapters/http/middlewares/injectServices'
import { requireMinLevel } from '@adapters/http/middlewares/requireRole'
import { ROLES } from '@core/entities/Role'
import clients from '@adapters/http/routes/clients'
import dashboard from '@adapters/http/routes/dashboard'
import login from '@adapters/http/routes/login'
import register from '@adapters/http/routes/register'
import service from '@adapters/http/routes/service'
import users from '@adapters/http/routes/users'
import warehouse from '@adapters/http/routes/warehouse'
import NotFound from '@presentation/components/reusables/NotFound'
import renderer from '@presentation/renderer'
import { Hono } from 'hono'
import type { Env } from 'src/env'

const app = new Hono<Env>()

app.use('*', async (c, next) => {
	c.header('X-Content-Type-Options', 'nosniff')
	c.header('X-Frame-Options', 'DENY')
	c.header(
		'Strict-Transport-Security',
		'max-age=31536000; includeSubDomains'
	)
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
app.use('/dashboard/users/*', requireMinLevel(ROLES.A))

dashboard.route('/service', service)
dashboard.route('/clients', clients)
dashboard.route('/warehouse', warehouse)
dashboard.route('/users', users)

app.route('/dashboard', dashboard)

app.notFound(async c => {
	return await c.render(<NotFound />)
})

export default app
