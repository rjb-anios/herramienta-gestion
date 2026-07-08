export interface Technician {
	id: string
	name: string
	initials: string
	email: string
	phone: string
	active: boolean
}
export type AddTechnicianResponse =
	| { type: 'Success' }
	| { type: 'InitialsInUse' }
	| { type: 'Error'; message: string }

export interface EditTechnicianRequest {
	id: string
	prevName: string
	name?: string
	prevInitials: string
	initials?: string
	prevEmail: string
	email?: string
	prevPhone: string
	phone?: string
}

export type EditTechnicianResponse =
	| { type: 'Success' }
	| { type: 'NoHasChanges' }
	| { type: 'Error'; message: string }

export type ToggleActiveResponse =
	| { type: 'Success' }
	| { type: 'Error'; message: string }

export type FindTechnicianResponse =
	| { type: 'Success'; technician: Technician[] }
	| { type: 'NotExists' }
	| { type: 'NoHasTechnicians' }
	| { type: 'Error'; message: string }
