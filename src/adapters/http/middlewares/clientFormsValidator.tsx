import { optionalField } from '@adapters/external/optionalValidationTool'
import { zValidator } from '@hono/zod-validator'
import RegClient from '@presentation/components/clients/RegClient'
import z from 'zod'

const regClientSchema = z.object({
	contact: z
		.string()
		.trim()
		.regex(
			/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ ]{2,28}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
			{ error: 'Contacto: verifique números o caracteres especiales' }
		)
		.min(4, { error: 'Contacto debe tener mínimo 4 caracteres' })
		.max(30, { error: 'Contacto debe tener un máximo de 30 caracteres' }),
	email: z.email().trim(),
	name: z
		.string()
		.trim()
		.regex(
			/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ.\- ]{2,38}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
			{ error: 'Cliente: verifique números o caracteres especiales' }
		)
		.min(4, { error: 'Cliente debe tener mínimo 4 caracteres' })
		.max(40, { error: 'Cliente debe tener un máximo de 40 caracteres' }),
	phone: z
		.string()
		.trim()
		.regex(/^[0-9]{8,9}$/, { error: 'Teléfono: sólo se permiten números' })
		.min(8, { error: 'Teléfono debe tener mínimo 8 caracteres' })
		.max(9, { error: 'Teléfono debe tener un máximo de 9 caracteres' })
})

const editClientSchema = z.object({
	contact: optionalField(
		z
			.string()
			.trim()
			.regex(
				/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ ]{2,28}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
				{ error: 'Contacto: verifique números o caracteres especiales' }
			)
	),
	email: optionalField(z.email().trim()),
	id: z.uuid(),
	name: optionalField(
		z
			.string()
			.trim()
			.regex(
				/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ.\- ]{2,38}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
				{ error: 'Cliente: verifique números o caracteres especiales' }
			)
	),
	phone: optionalField(
		z
			.string()
			.trim()
			.regex(/^[0-9]{8,9}$/, { error: 'Teléfono: sólo se permiten números' })
	),
	prevContact: z
		.string()
		.trim()
		.regex(
			/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ ]{2,28}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
			{ error: 'Contacto: verifique números o caracteres especiales' }
		)
		.min(4, { error: 'Contacto debe tener mínimo 4 caracteres' })
		.max(30, { error: 'Contacto debe tener un máximo de 30 caracteres' }),
	prevEmail: z.email().trim(),
	prevName: z
		.string()
		.trim()
		.regex(
			/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ.\- ]{2,38}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
			{ error: 'Cliente: verifique números o caracteres especiales' }
		)
		.min(4, { error: 'Cliente debe tener mínimo 4 caracteres' })
		.max(40, { error: 'Cliente debe tener un máximo de 40 caracteres' }),
	prevPhone: z
		.string()
		.trim()
		.regex(/^[0-9]{8,9}$/, { error: 'Teléfono: sólo se permiten números' })
		.min(8, { error: 'Teléfono debe tener mínimo 8 caracteres' })
		.max(9, { error: 'Teléfono debe tener un máximo de 9 caracteres' })
})

export const regClientValidator = zValidator(
	'form',
	regClientSchema,
	async (result, c) => {
		if (!result.success) {
			const errorMessages = result.error.issues.map(i => i.message)

			return await c.render(
				<RegClient>
					{errorMessages.map(text => (
						<p class='w-fit text-3xl m-auto block'>{text}</p>
					))}
				</RegClient>
			)
		}
	}
)

export const editClientValidator = zValidator(
	'form',
	editClientSchema,
	async (result, c) => {
		if (!result.success) {
			const errorMessages = result.error.issues.map(i => i.message)

			return await c.render(
				<>
					<div class='flex flex-col gap-4'>
						<a href='/dashboard/clients/all'>🡨 Volver</a>
						<h2 class='w-fit h-fit text-4xl'>Clientes</h2>
					</div>
					{errorMessages.map(text => (
						<p class='w-fit text-3xl m-auto block'>{text}</p>
					))}
				</>
			)
		}
	}
)
