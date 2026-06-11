import { D1VisitRepo } from '@adapters/db/D1VisitRepo'
import * as schema from '@adapters/db/SchemaD1'
import { AddVisitCommand } from '@core/use-cases/visits/commands/AddVisit.command'
import { FindVisitsQuery } from '@core/use-cases/visits/queries/FindVisits.query'
import { GetAvailableYearsQuery } from '@core/use-cases/visits/queries/GetAvailableYears.query'
import { drizzle } from 'drizzle-orm/d1'
import { createMiddleware } from 'hono/factory'
import type { Env } from 'src/env'

const injectVisitServices = createMiddleware<Env>(async (c, next) => {
	const db = drizzle(c.env.DB, { schema })
	const visitRepo = new D1VisitRepo(db)

	c.set('visitCases', {
		commands: {
			addVisit: new AddVisitCommand(visitRepo)
		},
		queries: {
			findVisits: new FindVisitsQuery(visitRepo),
			getAvailableYears: new GetAvailableYearsQuery(visitRepo)
		}
	})

	await next()
})

export default injectVisitServices
