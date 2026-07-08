export const VISIT_CONCEPTS = {
	inst: { label: 'Instalación' },
	mantec: { label: 'Mantenimiento preventivo' },
	otro: { label: 'Otro' },
	relev: { label: 'Relevamiento' },
	sertec: { label: 'Servicio técnico' }
} as const

export type VisitConcepts = keyof typeof VISIT_CONCEPTS

export const CONCEPT_VALUES = Object.keys(VISIT_CONCEPTS) as unknown as [
	VisitConcepts,
	...VisitConcepts[]
]

export interface MachineToDisplay {
	id: string
	model: string
	serial_number: string
}

export interface Visit {
	id: string
	date: string
	id_client: string
	id_technicians: string[]
	id_machine: string[]
	concept: VisitConcepts
	description: string
	future: string | undefined
	hours: number
}

export interface VisitToDisplay {
	id?: string
	date: string
	concept: VisitConcepts
	client: string
	machines: MachineToDisplay[]
	description: string
	technicians: string[]
	future: string | undefined
	hours: number
}

export interface EditVisitRequest {
	id: string
	prevDescription: string
	description?: string
	prevFuture: string | undefined
	future?: string
	prevHours: number
	hours?: number
}

export type EditVisitResponse =
	| { type: 'Success' }
	| { type: 'NoHasChanges' }
	| { type: 'Error'; message: string }

export type AddVisitResponse =
	| { type: 'Success' }
	| { type: 'Error'; message: string }

export type FindVisitsResponse =
	| { type: 'Success'; visits: VisitToDisplay[] }
	| { type: 'NotVisits' }
	| { type: 'Error'; message: string }

export type GetAvailableYearsResponse =
	| { type: 'Success'; years: number[] }
	| { type: 'Error'; message: string }
