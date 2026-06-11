import auth from '@adapters/http/middlewares/auth'
import injectClientServices from '@adapters/http/middlewares/injectClientServices'
import injectExternalServices from '@adapters/http/middlewares/injectExternalServices'
import injectMachineServices from '@adapters/http/middlewares/injectMachineServices'
import injectTechnicianServices from '@adapters/http/middlewares/injectTechnicianServices'
import injectUserServices from '@adapters/http/middlewares/injectUserServices'
import injectVisitServices from '@adapters/http/middlewares/injectVisitServices'
import clients from '@adapters/http/routes/clients'
import dashboard from '@adapters/http/routes/dashboard'
import login from '@adapters/http/routes/login'
import register from '@adapters/http/routes/register'
import service from '@adapters/http/routes/service'
import users from '@adapters/http/routes/users'
import warehouse from '@adapters/http/routes/warehouse'
import NotFound from '@presentation/components/NotFound'
import renderer from '@presentation/renderer'
import { Hono } from 'hono'
import type { Env } from 'src/env'

const app = new Hono<Env>()

app.use(injectExternalServices)
app.use(injectUserServices)
app.use(injectClientServices)
app.use(injectMachineServices)
app.use(injectTechnicianServices)
app.use(injectVisitServices)

app.use(renderer)

app.route('/', login)
app.route('/register', register)

app.use('/dashboard/*', auth)

dashboard.route('/service', service)
dashboard.route('/clients', clients)
dashboard.route('/warehouse', warehouse)
dashboard.route('/users', users)

app.route('/dashboard', dashboard)

app.notFound(async c => {
	return await c.render(<NotFound />)
})

export default app
