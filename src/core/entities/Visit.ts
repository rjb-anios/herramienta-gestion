import type { MachineToDisplay, MachineToPrintRegVisit } from './Machine'
import type { TechnicianToPrintRegVisit } from './Technician'

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

export interface Visit {
	id: string
	date: string
	id_client: string
	id_technicians: string[]
	id_machine: string[]
	concept: VisitConcepts
	register_description: string
	task_description: string | undefined
	future: string | undefined
	hours: number
	sector: string | undefined
	technician_signature: string
	client_signature: string
	client_signer: string
}

export interface VisitToDisplay {
	id?: string
	date: string
	concept: VisitConcepts
	client: string
	machines: MachineToDisplay[]
	register_description: string
	task_description: string | undefined
	technicians: string[]
	future: string | undefined
	hours: number
	sector: string | undefined
}

export interface VisitToPrint {
	technicians: TechnicianToPrintRegVisit[]
	date: string
	client: string
	sector: string
	contact_client: string
	machines: MachineToPrintRegVisit[]
	register_description: string
	client_signer: string
	technician_signature: string
	client_signature: string
}

export interface EditVisitRequest {
	id: string
	prevTaskDescription: string
	task_description?: string
	prevFuture: string | undefined
	future?: string
	prevSector: string | undefined
	sector?: string
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
