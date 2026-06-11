const BASE_URL = import.meta.env.DEV
	? 'http://localhost:5173'
	: 'https://herramienta.gestionzp.workers.dev'

export const API = {
	clientEquipment: (clientId: string) =>
		`${BASE_URL}/dashboard/clients/equipment/${clientId}/all`,
	visitsByYear: (year: number) =>
		`${BASE_URL}/dashboard/service/visits/all/${year}`
} as const
