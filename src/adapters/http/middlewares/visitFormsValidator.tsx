import { optionalField } from '@adapters/external/optionalValidationTool'
import { CONCEPT_VALUES } from '@core/entities/Visit'
import { zValidator } from '@hono/zod-validator'
import Back from '@presentation/components/reusables/Back'
import z from 'zod'

const regVisitSchema = z
	.object({
		client: z.uuid(),
		clientSignature: z
			.string()
			.max(200_000, { error: 'Firma de cliente: formato inválido' }),
		clientSigner: z
			.string()
			.trim()
			.regex(
				/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ.\- ]{2,28}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
				{ error: 'Aclaración: verifique números o caracteres especiales' }
			)
			.min(4, { error: 'Aclaración debe tener mínimo 4 caracteres' })
			.max(30, { error: 'Aclaración debe tener un máximo de 30 caracteres' }),
		concept: z.enum(CONCEPT_VALUES, { error: 'Opción inválida' }),
		date: z.iso.date(),
		future: optionalField(
			z
				.string()
				.transform(val => val.replace(/[\r\n]+/g, ' ').trim())
				.refine(
					val =>
						/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º][a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º ]{4,648}[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º]$/.test(
							val
						),
					{
						message:
							'Futuro: Sólo se permiten los caracteres especiales . , " \' () / - : % ; = _ $ ¿ ? # @ º'
					}
				)
				.refine(val => val.length >= 6, {
					message: 'Futuro debe tener mínimo 6 caracteres'
				})
				.refine(val => val.length <= 650, {
					message: 'Futuro debe tener máximo 650 caracteres'
				})
		),
		hours: z
			.string()
			.trim()
			.regex(/^(?:[1-9]|1[0-2])$/, {
				error: 'Horas dedicadas: Sólo puede seleccionar de 1 a 12 horas'
			})
			.min(1, { error: 'Horas debe tener mínimo 1 caracter' })
			.max(2, { error: 'Horas debe tener máximo 2 caracteres' }),
		machine: z.preprocess(val => {
			if (!val) return []
			if (typeof val === 'string') return [val]
			return val
		}, z.array(z.uuid())),
		register_description: z
			.string()
			.transform(val => val.replace(/[\r\n]+/g, ' ').trim())
			.refine(
				val =>
					/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º][a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º ]{4,648}[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º]$/.test(
						val
					),
				{
					message:
						'Descripción de registro: Sólo se permiten los caracteres especiales . , " \' () / - : % ; = _ $ ¿ ? # @ º'
				}
			)
			.refine(val => val.length >= 6, {
				message: 'Descripción de registro debe tener mínimo 6 caracteres'
			})
			.refine(val => val.length <= 650, {
				message: 'Descripción de registro debe tener máximo 650 caracteres'
			}),
		sector: optionalField(
			z
				.string()
				.trim()
				.regex(
					/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ.\- ]{2,18}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
					{
						error: 'Sector: Sólo se permiten los caracteres especiales . -'
					}
				)
		),
		task_description: optionalField(
			z
				.string()
				.transform(val => val.replace(/[\r\n]+/g, ' ').trim())
				.refine(
					val =>
						/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º][a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º ]{4,648}[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º]$/.test(
							val
						),
					{
						message:
							'Descripción de tareas: Sólo se permiten los caracteres especiales . , " \' () / - : % ; = _ $ ¿ ? # @ º'
					}
				)
				.refine(val => val.length >= 6, {
					message: 'Descripción de tareas debe tener mínimo 6 caracteres'
				})
				.refine(val => val.length <= 650, {
					message: 'Descripción de tareas debe tener máximo 650 caracteres'
				})
		),
		technician: z.preprocess(
			val => {
				if (!val) return []
				if (typeof val === 'string') return [val]
				return val
			},
			z
				.array(z.uuid())
				.min(1, { message: 'Debe seleccionar al menos un técnico' })
		),
		technicianSignature: z
			.string()
			.max(200_000, { error: 'Firma de técnico: formato inválido' })
	})
	.superRefine((data, ctx) => {
		const requiresEquipment =
			data.concept === 'mantec' ||
			data.concept === 'sertec' ||
			data.concept === 'inst'

		if (requiresEquipment && data.machine.length === 0) {
			ctx.addIssue({
				code: 'custom',
				message: 'Debe seleccionar al menos un equipo para este concepto',
				path: ['machine']
			})
		}
	})

const editVisitSchema = z.object({
	future: optionalField(
		z
			.string()
			.transform(val => val.replace(/[\r\n]+/g, ' ').trim())
			.refine(
				val =>
					/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º][a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º ]{4,648}[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º]$/.test(
						val
					),
				{
					message:
						'Futuro: Sólo se permiten los caracteres especiales . , " \' () / - : % ; = _ $ ¿ ? # @ º'
				}
			)
			.refine(val => val.length >= 6, {
				message: 'Futuro debe tener mínimo 6 caracteres'
			})
			.refine(val => val.length <= 650, {
				message: 'Futuro debe tener máximo 650 caracteres'
			})
	),
	sector: optionalField(
		z
			.string()
			.trim()
			.regex(
				/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ.\- ]{2,18}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
				{
					error: 'Sector: Sólo se permiten los caracteres especiales . -'
				}
			)
	),
	task_description: optionalField(
		z
			.string()
			.transform(val => val.replace(/[\r\n]+/g, ' ').trim())
			.refine(
				val =>
					/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º][a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º ]{4,648}[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º]$/.test(
						val
					),
				{
					message:
						'Descripción de tareas: Sólo se permiten los caracteres especiales . , " \' () / - : % ; = _ $ ¿ ? # @ º'
				}
			)
			.refine(val => val.length >= 6, {
				message: 'Descripción de tareas debe tener mínimo 6 caracteres'
			})
			.refine(val => val.length <= 650, {
				message: 'Descripción de tareas debe tener máximo 650 caracteres'
			})
	)
})

export const editVisitValidator = zValidator(
	'form',
	editVisitSchema,
	async (result, c) => {
		if (!result.success) {
			const errorMessages = result.error.issues.map(i => i.message)

			return await c.render(
				<>
					<Back
						route='service/visits/all'
						title='Editar visita'
					/>
					{errorMessages.map(text => (
						<p class='w-fit text-3xl m-auto block my-[10px]'>{text}</p>
					))}
				</>
			)
		}
	}
)

export const regVisitValidator = zValidator(
	'form',
	regVisitSchema,
	async (result, c) => {
		if (!result.success) {
			const errorMessages = result.error.issues.map(i => i.message)

			return await c.render(
				<>
					<Back
						route='service'
						title='Registrar visita'
					/>
					{errorMessages.map(text => (
						<p class='w-fit text-3xl m-auto block my-[10px]'>{text}</p>
					))}
				</>
			)
		}
	}
)
