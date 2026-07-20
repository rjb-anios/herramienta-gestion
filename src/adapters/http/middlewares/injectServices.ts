import { D1ClientRepo } from '@adapters/db/D1ClientRepo'
import { D1MachineRepo } from '@adapters/db/D1MachineRepo'
import { D1TechnicianRepo } from '@adapters/db/D1TechnicianRepo'
import { D1UserRepo } from '@adapters/db/D1UserRepo'
import { D1VisitRepo } from '@adapters/db/D1VisitRepo'
import * as schema from '@adapters/db/SchemaD1'
import { HonoCookieService } from '@adapters/external/cookiesTools'
import { BcryptPasswordHasher } from '@adapters/external/passwordTools'
import { JwtTokenManager } from '@adapters/external/tokenTools'
import { AddClientCommand } from '@core/use-cases/client/commands/AddClient.command'
import { DeleteClientCommand } from '@core/use-cases/client/commands/DeleteClient.command'
import { EditClientCommand } from '@core/use-cases/client/commands/EditClient.command'
import { ExistsAnyClientQuery } from '@core/use-cases/client/queries/ExistsAnyClient.query'
import { FindAllClientsQuery } from '@core/use-cases/client/queries/FindAllClients.query'
import { FindClientQuery } from '@core/use-cases/client/queries/FindClient.query'
import { AssignMachineCommand } from '@core/use-cases/machine/commands/AssignMachine.command'
import { DeleteMachineCommand } from '@core/use-cases/machine/commands/DeleteMachine.command'
import { EditMachineCommand } from '@core/use-cases/machine/commands/EditMachine.command'
import { RegMachineCommand } from '@core/use-cases/machine/commands/RegMachine.command'
import { UnassignMachineCommand } from '@core/use-cases/machine/commands/UnassignMachine.command'
import { ExistsAnyMachineQuery } from '@core/use-cases/machine/queries/ExistsAnyMachine.query'
import {
	FindAllMachinesQuery,
	FindAllMachinesWithClientNameQuery
} from '@core/use-cases/machine/queries/FindAllMachines.query'
import { FindAllMachinesByClientQuery } from '@core/use-cases/machine/queries/FindAllMachinesByClient.query'
import { FindAllWarehouseMachinesQuery } from '@core/use-cases/machine/queries/FindAllWarehouseMachines.query'
import { FindMachineQuery } from '@core/use-cases/machine/queries/FindMachine.query'
import { AddTechnicianCommand } from '@core/use-cases/technician/commands/AddTechnician.command'
import { DeactivateTechnicianCommand } from '@core/use-cases/technician/commands/DeactivateTechnician.command'
import { EditTechnicianCommand } from '@core/use-cases/technician/commands/EditTechnician.command'
import { FindActiveTechniciansQuery } from '@core/use-cases/technician/queries/FindActiveTechnicians.query'
import {
	FindAllTechniciansQuery,
	FindTechnicianByIdQuery
} from '@core/use-cases/technician/queries/FindTechnician.query'
import { DeleteUserCommand } from '@core/use-cases/user/commands/DeleteUser.command'
import { EditUserCommand } from '@core/use-cases/user/commands/EditUser.command'
import { LoginUserCommand } from '@core/use-cases/user/commands/LoginUser.command'
import { RefreshSessionCommand } from '@core/use-cases/user/commands/RefreshSession.command'
import { RegisterUserCommand } from '@core/use-cases/user/commands/RegisterUser.command'
import { ExistsAnyUserQuery } from '@core/use-cases/user/queries/ExistsAnyUser.query'
import { FindAllUsersQuery } from '@core/use-cases/user/queries/FindAllUsers.query'
import { FindTokenQuery } from '@core/use-cases/user/queries/FindToken.query'
import { FindUserQuery } from '@core/use-cases/user/queries/FindUser.query'
import { AddVisitCommand } from '@core/use-cases/visits/commands/AddVisit.command'
import { EditVisitCommand } from '@core/use-cases/visits/commands/EditVisit.command'
import { FindVisitByIdQuery } from '@core/use-cases/visits/queries/FindVisitById.query'
import { FindVisitsQuery } from '@core/use-cases/visits/queries/FindVisits.query'
import { GetAvailableYearsQuery } from '@core/use-cases/visits/queries/GetAvailableYears.query'
import { drizzle } from 'drizzle-orm/d1'
import { createMiddleware } from 'hono/factory'
import type { Env } from 'src/env'

const injectServices = createMiddleware<Env>(async (c, next) => {
	const db = drizzle(c.env.DB, { schema })
	const kv = c.env.KV
	const passwordHasher = new BcryptPasswordHasher()
	const tokenManager = new JwtTokenManager()
	const cookieService = new HonoCookieService()

	c.set('tokenManager', tokenManager)
	c.set('cookieService', cookieService)

	const userRepo = new D1UserRepo(db, kv)

	c.set('userCases', {
		commands: {
			deleteUser: new DeleteUserCommand(userRepo),
			editUser: new EditUserCommand(userRepo, passwordHasher),
			login: new LoginUserCommand(userRepo, passwordHasher, tokenManager),
			refreshSession: new RefreshSessionCommand(userRepo, tokenManager),
			register: new RegisterUserCommand(userRepo, passwordHasher)
		},
		queries: {
			existsAnyUser: new ExistsAnyUserQuery(userRepo),
			findAllUsers: new FindAllUsersQuery(userRepo),
			findToken: new FindTokenQuery(userRepo),
			findUser: new FindUserQuery(userRepo)
		}
	})

	const clientRepo = new D1ClientRepo(db, kv)

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

	const machineRepo = new D1MachineRepo(db, kv)

	c.set('machineCases', {
		commands: {
			assignMachine: new AssignMachineCommand(machineRepo),
			deleteMachine: new DeleteMachineCommand(machineRepo),
			editMachine: new EditMachineCommand(machineRepo),
			regMachine: new RegMachineCommand(machineRepo),
			unassignMachine: new UnassignMachineCommand(machineRepo)
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

	const technicianRepo = new D1TechnicianRepo(db, kv)

	c.set('technicianCases', {
		commands: {
			addTechnician: new AddTechnicianCommand(technicianRepo),
			deactivateTechnician: new DeactivateTechnicianCommand(technicianRepo),
			editTechnician: new EditTechnicianCommand(technicianRepo)
		},
		queries: {
			findActiveTechnicians: new FindActiveTechniciansQuery(technicianRepo),
			findAllTechnicians: new FindAllTechniciansQuery(technicianRepo),
			findTechnicianById: new FindTechnicianByIdQuery(technicianRepo)
		}
	})

	const visitRepo = new D1VisitRepo(db)

	c.set('visitCases', {
		commands: {
			addVisit: new AddVisitCommand(visitRepo),
			editVisit: new EditVisitCommand(visitRepo)
		},
		queries: {
			findVisitById: new FindVisitByIdQuery(visitRepo),
			findVisits: new FindVisitsQuery(visitRepo),
			getAvailableYears: new GetAvailableYearsQuery(visitRepo)
		}
	})

	await next()
})

export default injectServices
