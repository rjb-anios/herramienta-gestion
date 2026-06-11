export interface Client {
	id: string
	name: string
	contact: string
	phone: string
	email: string
}

export type AddOrDeleteClientResponse =
	| { type: 'Success' }
	| { type: 'Error'; message: string }

export interface EditClientRequest {
	id: string
	prevName: string
	name?: string
	prevContact: string
	contact?: string
	prevPhone: string
	phone?: string
	prevEmail: string
	email?: string
}

export type EditClientResponse =
	| { type: 'Success' }
	| { type: 'NoHasChanges' }
	| { type: 'Error'; message: string }

export type FindClientResponse =
	| { type: 'Exist'; client: Client }
	| { type: 'NotExists' }
	| { type: 'Error'; message: string }

export type FindAllClientsResponse =
	| { type: 'Success'; clients: Client[] }
	| { type: 'Error'; message: string }
