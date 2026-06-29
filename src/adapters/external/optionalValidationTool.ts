import type { ZodType } from 'zod'
import { z } from 'zod'

export function optionalField<T extends ZodType>(schema: T) {
	return schema.optional().or(z.literal(''))
}

export const uuidSchema = z.uuid()

export const yearSchema = z.string().regex(/^\d{4}$/)

export function isValidUUID(val: string): boolean {
	return uuidSchema.safeParse(val).success
}

export function isValidYear(val: string): boolean {
	return yearSchema.safeParse(val).success
}
