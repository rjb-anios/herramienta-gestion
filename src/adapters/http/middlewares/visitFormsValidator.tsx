import { optionalField } from '@adapters/external/optionalValidationTool'
import { CONCEPT_VALUES } from '@core/entities/Visit'
import { zValidator } from '@hono/zod-validator'
import Back from '@presentation/components/reusables/Back'
import z from 'zod'

const regVisitSchema = z
	.object({
		client: z.uuid(),
		concept: z.enum(CONCEPT_VALUES, { error: 'Opción inválida' }),
		date: z.iso.date(),
		description: z
			.string()
			.transform(val => val.replace(/[\r\n]+/g, ' ').trim())
			.refine(
				val =>
					/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º][a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º ]{6,650}[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º]$/.test(
						val
					),
				{
					message:
						'Descripción: Sólo se permiten los caracteres especiales . , " \' () / - : % ; = _ $ ¿ ? # @ º'
				}
			)
			.refine(val => val.length >= 6, {
				message: 'Descripción debe tener mínimo 6 caracteres'
			})
			.refine(val => val.length <= 650, {
				message: 'Descripción debe tener máximo 650 caracteres'
			}),
		future: optionalField(
			z
				.string()
				.transform(val => val.replace(/[\r\n]+/g, ' ').trim())
				.refine(
					val =>
						/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º][a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º ]{6,650}[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,"'()/\-:%;=_$¿?#@º]$/.test(
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
		technician: z.uuid()
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
