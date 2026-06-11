import type {
	AddOrDeleteClientResponse,
	Client,
	EditClientRequest,
	EditClientResponse,
	FindAllClientsResponse,
	FindClientResponse
} from '@core/entities/Client'

export interface ClientRepo {
	addClient: (data: Client) => Promise<AddOrDeleteClientResponse>

	deleteClient: (id: string) => Promise<AddOrDeleteClientResponse>

	editClient: (data: EditClientRequest) => Promise<EditClientResponse>

	findClient: (id: string) => Promise<FindClientResponse>

	findAllClients: () => Promise<FindAllClientsResponse>

	existsAnyClient: () => Promise<boolean>

	existsByName: (name: string) => Promise<boolean>

	hasVisits: (id: string) => Promise<boolean>

	hasMachines: (id: string) => Promise<boolean>
}
