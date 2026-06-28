import { optionalField } from '@adapters/external/optionalValidationTool'
import { zValidator } from '@hono/zod-validator'
import Back from '@presentation/components/reusables/Back'
import z from 'zod'

const regMachineSchema = z.object({
	manufacturer: z
		.string()
		.trim()
		.regex(
			/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ.\- ]{2,38}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
			{ error: 'Fabricante: verifique números o caracteres especiales' }
		)
		.min(4, { error: 'Fabricante debe tener mínimo 4 caracteres' })
		.max(40, { error: 'Fabricante debe tener un máximo de 40 caracteres' }),
	model: z
		.string()
		.trim()
		.regex(
			/^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9][a-zA-ZñÑáéíóúÁÉÍÓÚ0-9.\-/ ]{2,14}[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9]$/,
			{ error: 'Modelo: verifique números o caracteres especiales' }
		)
		.min(4, { error: 'Modelo debe tener mínimo 4 caracteres' })
		.max(16, { error: 'Modelo debe tener un máximo de 16 caracteres' }),
	serial_number: z
		.string()
		.trim()
		.regex(
			/^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9][a-zA-ZñÑáéíóúÁÉÍÓÚ0-9.\-/ ]{2,14}[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9]$/,
			{ error: 'Serial: verifique números o caracteres especiales' }
		)
		.min(4, { error: 'Serial debe tener mínimo 4 caracteres' })
		.max(16, { error: 'Serial debe tener un máximo de 16 caracteres' })
})

const editMachineSchema = z.object({
	id: z.uuid(),
	manufacturer: optionalField(
		z
			.string()
			.trim()
			.regex(
				/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ.\- ]{2,38}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
				{ error: 'Fabricante: verifique números o caracteres especiales' }
			)
	),
	model: optionalField(
		z
			.string()
			.trim()
			.regex(
				/^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9][a-zA-ZñÑáéíóúÁÉÍÓÚ0-9.\-/ ]{2,14}[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9]$/,
				{ error: 'Modelo: verifique números o caracteres especiales' }
			)
	),
	prevManufacturer: z
		.string()
		.trim()
		.regex(
			/^[a-zA-ZñÑáéíóúÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ.\- ]{2,38}[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/,
			{ error: 'Fabricante: verifique números o caracteres especiales' }
		)
		.min(4, { error: 'Fabricante debe tener mínimo 4 caracteres' })
		.max(40, { error: 'Fabricante debe tener un máximo de 40 caracteres' }),
	prevModel: z
		.string()
		.trim()
		.regex(
			/^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9][a-zA-ZñÑáéíóúÁÉÍÓÚ0-9.\-/ ]{2,14}[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9]$/,
			{ error: 'Modelo: verifique números o caracteres especiales' }
		)
		.min(4, { error: 'Modelo debe tener mínimo 4 caracteres' })
		.max(16, { error: 'Modelo debe tener un máximo de 16 caracteres' }),
	prevSerial_number: z
		.string()
		.trim()
		.regex(
			/^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9][a-zA-ZñÑáéíóúÁÉÍÓÚ0-9.\-/ ]{2,14}[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9]$/,
			{ error: 'Serial: verifique números o caracteres especiales' }
		)
		.min(4, { error: 'Serial debe tener mínimo 4 caracteres' })
		.max(16, { error: 'Serial debe tener un máximo de 16 caracteres' }),
	serial_number: optionalField(
		z
			.string()
			.trim()
			.regex(
				/^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9][a-zA-ZñÑáéíóúÁÉÍÓÚ0-9.\-/ ]{2,14}[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9]$/,
				{ error: 'Serial: verifique números o caracteres especiales' }
			)
	)
})

export const regMachineValidator = zValidator(
	'form',
	regMachineSchema,
	async (result, c) => {
		if (!result.success) {
			const errorMessages = result.error.issues.map(i => i.message)

			return await c.render(
				<>
					<Back
						route='warehouse'
						title='Registrar equipo'
					/>
					{errorMessages.map(text => (
						<p class='w-fit text-3xl m-auto block'>{text}</p>
					))}
				</>
			)
		}
	}
)

export const editMachineValidator = zValidator(
	'form',
	editMachineSchema,
	async (result, c) => {
		if (!result.success) {
			const errorMessages = result.error.issues.map(i => i.message)

			return await c.render(
				<>
					<Back
						route='warehouse/all'
						title='Editar equipo'
					/>
					{errorMessages.map(text => (
						<p class='w-fit text-3xl m-auto block'>{text}</p>
					))}
				</>
			)
		}
	}
)
