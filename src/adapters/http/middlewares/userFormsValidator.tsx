import { optionalField } from '@adapters/external/optionalValidationTool'
import { zValidator } from '@hono/zod-validator'
import Back from '@presentation/components/reusables/Back'
import RegUser from '@presentation/components/users/RegUser'
import LoginLayout from '@presentation/layouts/LoginLayout'
import z from 'zod'

const regUserSchema = z
	.object({
		confirmPassword: z.string(),
		name: z
			.string()
			.trim()
			.regex(
				/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ ]{2,28}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
				{ error: 'Nombre: verifique números o caracteres especiales' }
			)
			.min(4, { error: 'Nombre debe tener mínimo 4 caracteres' })
			.max(30, { error: 'Nombre debe tener un máximo de 30 caracteres' }),
		password: z
			.string()
			.trim()
			.min(8, { error: 'Contraseña debe tener mínimo 8 caracteres' })
			.max(16, { error: 'Contraseña debe tener máximo 16 caracteres' }),
		role: z.enum(['A', 'u'], { error: 'Rol inválido' }),
		username: z
			.string()
			.trim()
			.regex(/^[a-zñ][a-zñ0-9]{4,16}$/, {
				error: 'Usuario sólo permite letras minúsculas y números'
			})
			.min(4, { error: 'Usuario debe tener mínimo 4 caracteres' })
			.max(16, { error: 'Usuario debe tener un máximo de 16 caracteres' })
	})
	.refine(data => data.password === data.confirmPassword, {
		error: 'Las contraseñas deben coincidir',
		path: ['confirmPassword']
	})

const loginSchema = z.object({
	password: z
		.string()
		.trim()
		.min(8, { error: 'Contraseña debe tener mínimo 8 caracteres' })
		.max(16, { error: 'Contraseña debe tener máximo 16 caracteres' }),
	username: z
		.string()
		.trim()
		.regex(/^[a-zñ][a-zñ0-9]{4,16}$/, {
			error: 'Usuario sólo permite letras minúsculas y números'
		})
		.min(4, { error: 'Usuario debe tener mínimo 5 caracteres' })
		.max(16, { error: 'Usuario debe tener un máximo de 16 caracteres' })
})

const editUserSchema = z
	.object({
		confirmPassword: optionalField(z.string()),
		id: z.uuid(),
		name: optionalField(
			z
				.string({ error: 'Nombre: debe pasar una cadena de texto' })
				.trim()
				.regex(
					/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ ]{2,28}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
					{ error: 'Nombre: verifique números o caracteres especiales' }
				)
		),
		password: optionalField(
			z
				.string()
				.trim()
				.min(8, { error: 'Contraseña debe tener mínimo 8 caracteres' })
				.max(16, { error: 'Contraseña debe tener máximo 16 caracteres' })
		),
		prevName: z
			.string({ error: 'Nombre: debe pasar una cadena de texto' })
			.trim()
			.regex(
				/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ ]{2,28}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
				{ error: 'Nombre: verifique números o caracteres especiales' }
			)
			.min(4, { error: 'Nombre debe tener mínimo 4 caracteres' })
			.max(30, { error: 'Nombre debe tener un máximo de 30 caracteres' }),
		prevRole: z.enum(['A', 'u'], { error: 'Rol inválido' }),
		prevUsername: z
			.string({ error: 'Usuario: debe pasar una cadena de texto' })
			.trim()
			.regex(/^[a-zñ][a-zñ0-9]{4,16}$/, {
				error: 'Usuario sólo permite letras minúsculas y números'
			})
			.min(4, { error: 'Usuario debe tener mínimo 5 caracteres' })
			.max(16, { error: 'Usuario debe tener un máximo de 16 caracteres' }),
		role: z.enum(['A', 'u'], { error: 'Rol inválido' }),
		username: optionalField(
			z
				.string({ error: 'Usuario: debe pasar una cadena de texto' })
				.trim()
				.regex(/^[a-zñ][a-zñ0-9]{4,16}$/, {
					error: 'Usuario sólo permite letras minúsculas y números'
				})
		)
	})
	.refine(data => !data.password || data.password === data.confirmPassword, {
		error: 'Las contraseñas deben coincidir',
		path: ['confirmPassword']
	})

export const regUserValidator = zValidator(
	'form',
	regUserSchema,
	async (result, c) => {
		if (!result.success) {
			console.log(result.data)

			const errorMessages = result.error.issues.map(i => i.message)

			const { queries } = (c as any).get('userCases')
			const hasUsers = await queries.existsAnyUser.execute()

			return await c.render(
				<RegUser hideRole={!hasUsers}>
					{errorMessages.map(text => (
						<p class='w-fit text-3xl m-auto block'>{text}</p>
					))}
				</RegUser>
			)
		}
	}
)

export const loginValidator = zValidator(
	'form',
	loginSchema,
	async (result, c) => {
		if (!result.success) {
			const errorMessages = result.error.issues.map(i => i.message)

			return await c.render(
				<LoginLayout>
					{errorMessages.map(text => (
						<p class='w-fit text-3xl m-auto block'>{text}</p>
					))}
				</LoginLayout>
			)
		}
	}
)

export const editUserValidator = zValidator(
	'form',
	editUserSchema,
	async (result, c) => {
		if (!result.success) {
			const errorMessages = result.error.issues.map(i => i.message)

			return await c.render(
				<>
					<Back
						route='users/all'
						title='Editar usuario'
					/>
					{errorMessages.map(text => (
						<p class='w-fit text-3xl m-auto block my-[10px]'>{text}</p>
					))}
				</>
			)
		}
	}
)
