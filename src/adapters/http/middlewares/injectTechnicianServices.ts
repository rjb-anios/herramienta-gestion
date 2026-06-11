import { D1TechnicianRepo } from '@adapters/db/D1TechnicianRepo'
import * as schema from '@adapters/db/SchemaD1'
import { AddTechnicianCommand } from '@core/use-cases/technician/commands/AddTechnician.command'
import { DeleteTechnicianCommand } from '@core/use-cases/technician/commands/DeleteTechnician.command'
import { EditTechnicianCommand } from '@core/use-cases/technician/commands/EditTechnician.command'
import {
	FindAllTechniciansQuery,
	FindTechnicianByIdQuery
} from '@core/use-cases/technician/queries/FindTechnician.query'
import { drizzle } from 'drizzle-orm/d1'
import { createMiddleware } from 'hono/factory'
import type { Env } from 'src/env'

const injectTechnicianServices = createMiddleware<Env>(async (c, next) => {
	const db = drizzle(c.env.DB, { schema })
	const technicianRepo = new D1TechnicianRepo(db)

	c.set('technicianCases', {
		commands: {
			addTechnician: new AddTechnicianCommand(technicianRepo),
			deleteTechnician: new DeleteTechnicianCommand(technicianRepo),
			editTechnician: new EditTechnicianCommand(technicianRepo)
		},
		queries: {
			findAllTechnicians: new FindAllTechniciansQuery(technicianRepo),
			findTechnicianById: new FindTechnicianByIdQuery(technicianRepo)
		}
	})

	await next()
})

export default injectTechnicianServices
