import { optionalField } from '@adapters/external/optionalValidationTool'
import { zValidator } from '@hono/zod-validator'
import RegTech from '@presentation/components/technician/RegTech'
import z from 'zod'

const regTechSchema = z.object({
	initials: z
		.string()
		.trim()
		.regex(/^[A-Z]{2,3}$/, {
			error: 'Iniciales: Sólo permite letras mayúsculas'
		})
		.min(2, { error: 'Iniciales debe tener mínimo 2 caracteres' })
		.max(3, { error: 'Iniciales debe tener un máximo de 3 caracteres' }),
	name: z
		.string()
		.trim()
		.regex(
			/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ ]{2,28}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
			{ error: 'Nombre: verifique números o caracteres especiales' }
		)
		.min(4, { error: 'Nombre debe tener mínimo 4 caracteres' })
		.max(30, { error: 'Nombre debe tener un máximo de 30 caracteres' })
})

const editTechSchema = z.object({
	id: z.uuid(),
	initials: optionalField(
		z
			.string()
			.trim()
			.regex(/^[A-Z]{2,3}$/, {
				error: 'Iniciales: Sólo permite letras mayúsculas'
			})
	),
	name: optionalField(
		z
			.string()
			.trim()
			.regex(
				/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ ]{2,28}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
				{ error: 'Nombre: verifique números o caracteres especiales' }
			)
	),
	prevInitials: z
		.string()
		.trim()
		.regex(/^[A-Z]{2,3}$/, {
			error: 'Iniciales: Sólo permite letras mayúsculas'
		})
		.min(2, { error: 'Iniciales debe tener mínimo 2 caracteres' })
		.max(3, { error: 'Iniciales debe tener un máximo de 3 caracteres' }),
	prevName: z
		.string()
		.trim()
		.regex(
			/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ ]{2,28}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
			{ error: 'Nombre: verifique números o caracteres especiales' }
		)
		.min(4, { error: 'Nombre debe tener mínimo 4 caracteres' })
		.max(30, { error: 'Nombre debe tener un máximo de 30 caracteres' })
})

export const regTechValidator = zValidator(
	'form',
	regTechSchema,
	async (result, c) => {
		if (!result.success) {
			const errorMessages = result.error.issues.map(i => i.message)

			return await c.render(
				<RegTech>
					{errorMessages.map(text => (
						<p class='w-fit text-3xl m-auto block'>{text}</p>
					))}
				</RegTech>
			)
		}
	}
)

export const editTechValidator = zValidator(
	'form',
	editTechSchema,
	async (result, c) => {
		if (!result.success) {
			const errorMessages = result.error.issues.map(i => i.message)

			return await c.render(
				<>
					<div class='flex flex-col gap-4'>
						<a href='/dashboard/service/technicians/all'>🡨 Volver</a>
						<h2 class='w-fit h-fit text-4xl'>Editar técnico</h2>
					</div>
					{errorMessages.map(text => (
						<p class='w-fit text-3xl m-auto block'>{text}</p>
					))}
				</>
			)
		}
	}
)
