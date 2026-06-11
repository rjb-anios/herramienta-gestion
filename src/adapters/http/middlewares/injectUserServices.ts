import { D1UserRepo } from '@adapters/db/D1UserRepo'
import * as schema from '@adapters/db/SchemaD1'
import { BcryptPasswordHasher } from '@adapters/external/passwordTools'
import { DeleteUserCommand } from '@core/use-cases/user/commands/DeleteUser.command'
import { EditUserCommand } from '@core/use-cases/user/commands/EditUser.command'
import { LoginUserCommand } from '@core/use-cases/user/commands/LoginUser.command'
import { RefreshSessionCommand } from '@core/use-cases/user/commands/RefreshSession.command'
import { RegisterUserCommand } from '@core/use-cases/user/commands/RegisterUser.command'
import { ExistsAnyUserQuery } from '@core/use-cases/user/queries/ExistsAnyUser.query'
import { FindAllUsersQuery } from '@core/use-cases/user/queries/FindAllUsers.query'
import { FindTokenQuery } from '@core/use-cases/user/queries/FindToken.query'
import { FindUserQuery } from '@core/use-cases/user/queries/FindUser.query'
import { drizzle } from 'drizzle-orm/d1'
import { createMiddleware } from 'hono/factory'
import type { Env } from 'src/env'

const injectUserServices = createMiddleware<Env>(async (c, next) => {
	const db = drizzle(c.env.DB, { schema })
	const kv = c.env.KV
	const passwordHasher = new BcryptPasswordHasher()
	const tokenManager = c.get('tokenManager')

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

	await next()
})

export default injectUserServices
