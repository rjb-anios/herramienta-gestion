import { isValidUUID } from '@adapters/external/optionalValidationTool'
import {
	editUserValidator,
	regUserValidator
} from '@adapters/http/middlewares/userFormsValidator'
import Back from '@presentation/components/reusables/Back'
import EditUserForm from '@presentation/components/users/EditUserForm'
import RegUser from '@presentation/components/users/RegUser'
import UsersTable from '@presentation/components/users/UsersTable'
import { Hono } from 'hono'
import type { Env } from 'src/env'

const users = new Hono<Env>()

/// Buscar todos los usuarios del sistema

users.get('/all', async c => {
	const {
		queries: { findAllUsers }
	} = c.get('userCases')

	const res = await findAllUsers.execute()

	if (res.type === 'Error') {
		return await c.render(
			<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
		)
	}

	return await c.render(<UsersTable arrUser={res.users} />)
})

/// Obtiene formulario de registro de usuario

users.get('/register', async c => {
	return await c.render(<RegUser hideRole={false} />)
})

/// Registra usuario

users.post('/register', regUserValidator, async c => {
	const { username, name, password, confirmPassword, role } =
		c.req.valid('form')

	const {
		commands: { register }
	} = c.get('userCases')

	const res = await register.execute({
		confirmPassword,
		name,
		password,
		role,
		username
	})

	if (res.type === 'UserAlreadyExists') {
		return await c.render(
			<RegUser hideRole={false}>
				<p class='w-fit text-3xl mx-auto block'>El usuario ya existe</p>
			</RegUser>
		)
	}

	if (res.type === 'PasswordsDoNotMatch') {
		return await c.render(
			<RegUser hideRole={false}>
				<p class='w-fit text-3xl mx-auto block'>
					Las contraseñas deben coincidir
				</p>
			</RegUser>
		)
	}

	if (res.type === 'Error') {
		return await c.render(
			<RegUser hideRole={false}>
				<p class='w-fit text-3xl mx-auto block'>{res.message}</p>
			</RegUser>
		)
	}

	return await c.render(
		<RegUser hideRole={false}>
			<p class='w-fit text-3xl mx-auto block text-green-900'>
				Se registró al usuario correctamente
			</p>
		</RegUser>
	)
})

/// Obtiene formulario de edición de usuario

users.get('/all/edit/:id', async c => {
	const id = c.req.param('id')

	if (!isValidUUID(id)) {
		return c.redirect('/dashboard/users/all', 303)
	}

	const {
		queries: { findUser }
	} = c.get('userCases')

	const res = await findUser.execute(id)

	if (res.type === 'NotExist') {
		return await c.render(
			<>
				<Back
					route='users/all'
					title='Editar usuario'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					El usuario no existe
				</p>
			</>
		)
	}

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='users/all'
					title='Editar usuario'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	return await c.render(<EditUserForm data={res.user} />)
})

/// Editar usuario

users.post(
	'/all/edit/:id',
	async (c, next) => {
		const id = c.req.param('id')

		if (!isValidUUID(id)) {
			return c.redirect('/dashboard/users/all', 303)
		}

		await next()
	},
	editUserValidator,
	async c => {
		const { prevUsername, username, prevName, name, prevRole, role, password } =
			c.req.valid('form')

		const {
			commands: { editUser }
		} = c.get('userCases')

		const id = c.req.param('id')

		const res = await editUser.execute({
			id,
			name,
			password: password || undefined,
			prevName,
			prevRole,
			prevUsername,
			role,
			username
		})

		if (res.type === 'NoHasChanges') {
			return await c.render(
				<>
					<Back
						route='users/all'
						title='Editar usuario'
					/>
					<p class='w-fit text-3xl m-auto block text-center'>
						No actualizó ningún dato
					</p>
				</>
			)
		}

		if (res.type === 'UserAlreadyExists') {
			return await c.render(
				<>
					<Back
						route='users/all'
						title='Editar usuario'
					/>
					<p class='w-fit text-3xl m-auto block text-center'>
						El usuario ya está en uso
					</p>
				</>
			)
		}

		if (res.type === 'Error') {
			return await c.render(
				<>
					<Back
						route='users/all'
						title='Editar usuario'
					/>
					<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
				</>
			)
		}

		return c.redirect('/dashboard/users/all', 303)
	}
)

/// Eliminar usuario

users.post('/all/delete/:id', async c => {
	const id = c.req.param('id')

	if (!isValidUUID(id)) {
		return c.redirect('/dashboard/users/all', 303)
	}

	const {
		commands: { deleteUser }
	} = c.get('userCases')

	const res = await deleteUser.execute(id)

	if (res.type === 'UserNotExists') {
		return await c.render(
			<>
				<Back
					route='users/all'
					title='Eliminar usuario'
				/>
				<p class='w-fit text-3xl mx-auto block'>
					El usuario que intenta eliminar no existe
				</p>
			</>
		)
	}

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='users/all'
					title='Eliminar usuario'
				/>
				<p class='w-fit text-3xl mx-auto block'>{res.message}</p>
			</>
		)
	}

	return c.redirect('/dashboard/users/all', 303)
})

export default users
