import { D1MachineRepo } from '@adapters/db/D1MachineRepo'
import * as schema from '@adapters/db/SchemaD1'
import { AssignMachineCommand } from '@core/use-cases/machine/commands/AssignMachine.command'
import { DeleteMachineCommand } from '@core/use-cases/machine/commands/DeleteMachine.command'
import { EditMachineCommand } from '@core/use-cases/machine/commands/EditMachine.command'
import { RegMachineCommand } from '@core/use-cases/machine/commands/RegMachine.command'
import { ExistsAnyMachineQuery } from '@core/use-cases/machine/queries/ExistsAnyMachine.query'
import {
	FindAllMachinesQuery,
	FindAllMachinesWithClientNameQuery
} from '@core/use-cases/machine/queries/FindAllMachines.query'
import { FindAllMachinesByClientQuery } from '@core/use-cases/machine/queries/FindAllMachinesByClient.query'
import { FindAllWarehouseMachinesQuery } from '@core/use-cases/machine/queries/FindAllWarehouseMachines.query'
import { FindMachineQuery } from '@core/use-cases/machine/queries/FindMachine.query'
import { drizzle } from 'drizzle-orm/d1'
import { createMiddleware } from 'hono/factory'
import type { Env } from 'src/env'

const injectMachineServices = createMiddleware<Env>(async (c, next) => {
	const db = drizzle(c.env.DB, { schema })
	const machineRepo = new D1MachineRepo(db)

	c.set('machineCases', {
		commands: {
			assignMachine: new AssignMachineCommand(machineRepo),
			deleteMachine: new DeleteMachineCommand(machineRepo),
			editMachine: new EditMachineCommand(machineRepo),
			regMachine: new RegMachineCommand(machineRepo)
		},
		queries: {
			existsAnyMachine: new ExistsAnyMachineQuery(machineRepo),
			findAllMachines: new FindAllMachinesQuery(machineRepo),
			findAllMachinesByClient: new FindAllMachinesByClientQuery(machineRepo),
			findAllMachinesWithClientName: new FindAllMachinesWithClientNameQuery(
				machineRepo
			),
			findAllWarehouseMachines: new FindAllWarehouseMachinesQuery(machineRepo),
			findMachine: new FindMachineQuery(machineRepo)
		}
	})

	await next()
})

export default injectMachineServices
