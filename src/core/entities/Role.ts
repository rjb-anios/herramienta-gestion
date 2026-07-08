export const ROLES = {
	A: { label: 'Administrador', level: 100 },
	t: { label: 'Técnico', level: 40 },
	u: { label: 'Usuario', level: 10 }
} as const

export type Role = keyof typeof ROLES
