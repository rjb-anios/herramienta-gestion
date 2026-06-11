import { D1ClientRepo } from '@adapters/db/D1ClientRepo'
import * as schema from '@adapters/db/SchemaD1'
import { AddClientCommand } from '@core/use-cases/client/commands/AddClient.command'
import { DeleteClientCommand } from '@core/use-cases/client/commands/DeleteClient.command'
import { EditClientCommand } from '@core/use-cases/client/commands/EditClient.command'
import { ExistsAnyClientQuery } from '@core/use-cases/client/queries/ExistsAnyClient.query'
import { FindAllClientsQuery } from '@core/use-cases/client/queries/FindAllClients.query'
import { FindClientQuery } from '@core/use-cases/client/queries/FindClient.query'
import { drizzle } from 'drizzle-orm/d1'
import { createMiddleware } from 'hono/factory'
import type { Env } from 'src/env'

const injectClientServices = createMiddleware<Env>(async (c, next) => {
	const db = drizzle(c.env.DB, { schema })
	const clientRepo = new D1ClientRepo(db)

	c.set('clientCases', {
		commands: {
			addClient: new AddClientCommand(clientRepo),
			deleteClient: new DeleteClientCommand(clientRepo),
			editClient: new EditClientCommand(clientRepo)
		},
		queries: {
			existsAnyClient: new ExistsAnyClientQuery(clientRepo),
			findAllClients: new FindAllClientsQuery(clientRepo),
			findClient: new FindClientQuery(clientRepo)
		}
	})

	await next()
})

export default injectClientServices
