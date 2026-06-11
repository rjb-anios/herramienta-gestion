import type { ZodType } from 'zod'
import { z } from 'zod'

export function optionalField<T extends ZodType>(schema: T) {
	return schema.optional().or(z.literal(''))
}
