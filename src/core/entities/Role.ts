export const ROLES = {
	A: 100,
	u: 10
} as const

export type Role = keyof typeof ROLES
