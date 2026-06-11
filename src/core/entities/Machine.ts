export interface Machine {
	id: string
	manufacturer: string
	model: string
	serial_number: string
	id_client: string | null
}

export interface MachineWithClientName extends Machine {
	client: string
}

export type AddOrDeleteMachineResponse =
	| { type: 'Success' }
	| { type: 'Error'; message: string }

export type FindMachineResponse =
	| { type: 'Success'; machine: Machine }
	| { type: 'NotExists' }
	| { type: 'Error'; message: string }

export type FindAllMachinesResponse =
	| { type: 'Success'; machines: Machine[] }
	| { type: 'Error'; message: string }

export type FindAllMachinesWithClientNameResponse =
	| { type: 'Success'; machines: MachineWithClientName[] }
	| { type: 'Error'; message: string }

export interface EditMachineRequest {
	id: string
	prevManufacturer: string
	manufacturer?: string
	prevModel: string
	model?: string
	prevSerial_number: string
	serial_number?: string
}

export type EditMachineResponse =
	| { type: 'Success' }
	| { type: 'NoHasChanges' }
	| { type: 'Error'; message: string }
