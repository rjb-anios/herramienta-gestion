import { regUserValidator } from '@adapters/http/middlewares/userFormsValidator'
import RegUser from '@presentation/components/users/RegUser'
import { Hono } from 'hono'
import type { Env } from 'src/env'

const register = new Hono<Env>()

register.get('/', async c => {
	const {
		queries: { existsAnyUser }
	} = c.get('userCases')

	const hasUsers = await existsAnyUser.execute()

	if (hasUsers) {
		return c.redirect('/', 303)
	}

	return await c.render(<RegUser hideRole />)
})

register.post('/', regUserValidator, async c => {
	const {
		queries: { existsAnyUser },
		commands: { register: registerUser }
	} = c.get('userCases')

	const hasUsers = await existsAnyUser.execute()

	if (hasUsers) {
		return c.redirect('/', 303)
	}

	const { username, name, password, confirmPassword } = c.req.valid('form')

	const res = await registerUser.execute({
		confirmPassword,
		name,
		password,
		role: 'A',
		username
	})

	if (res.type === 'Error') {
		return await c.render(
			<RegUser hideRole>
				<p class='w-fit text-3xl m-auto block'>{res.message}</p>
			</RegUser>
		)
	}

	return c.redirect('/', 303)
})

export default register
