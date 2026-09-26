export const API = {
	clientEquipment: (clientId: string) =>
		`/dashboard/clients/equipment/${clientId}/all`,
	visitsByYear: (year: number) => `/dashboard/service/visits/all/${year}`
} as const
