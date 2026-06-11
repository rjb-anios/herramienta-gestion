import type {
	AddOrDeleteClientResponse,
	Client,
	EditClientRequest,
	EditClientResponse,
	FindAllClientsResponse,
	FindClientResponse
} from '@core/entities/Client'

import type {
	AddOrDeleteMachineResponse,
	EditMachineRequest,
	EditMachineResponse,
	FindAllMachinesResponse,
	FindAllMachinesWithClientNameResponse,
	FindMachineResponse,
	Machine
} from '@core/entities/Machine'

import type {
	AddTechnicianResponse,
	DeleteTechnicianResponse,
	EditTechnicianRequest,
	EditTechnicianResponse,
	FindTechnicianResponse,
	Technician
} from '@core/entities/Technician'

import type {
	DeleteUserResponse,
	EditUserRequest,
	EditUserResponse,
	FindAllUsersResponse,
	FindUserResponse,
	LoginUserRequest,
	LoginUserResponse,
	RegisterUserRequest,
	RegisterUserResponse,
	TokenData
} from '@core/entities/User'

import type {
	AddVisitResponse,
	FindVisitsResponse,
	GetAvailableYearsResponse,
	Visit
} from '@core/entities/Visit'

import type { CookieService } from '@core/ports/CookieService'

import type { TokenManager } from '@core/ports/TokenManager'

export interface Env {
	Variables: {
		userCases: {
			commands: {
				register: {
					execute(
						data: Omit<RegisterUserRequest, 'id'>
					): Promise<RegisterUserResponse>
				}
				login: { execute(data: LoginUserRequest): Promise<LoginUserResponse> }
				deleteUser: { execute(id: string): Promise<DeleteUserResponse> }
				editUser: { execute(data: EditUserRequest): Promise<EditUserResponse> }
				refreshSession: {
					execute(
						oldTokenId: string,
						user: { id: string; name: string; role: 'A' | 'u' }
					): Promise<{
						newAcToken: string
						newRfToken: string
						expRYF: string
					} | null>
				}
			}
			queries: {
				findUser: { execute(id: string): Promise<FindUserResponse> }
				existsAnyUser: { execute(): Promise<boolean> }
				findAllUsers: { execute(): Promise<FindAllUsersResponse> }
				findToken: { execute(idRFT: string): Promise<TokenData | null> }
			}
		}

		clientCases: {
			commands: {
				addClient: {
					execute(data: Omit<Client, 'id'>): Promise<AddOrDeleteClientResponse>
				}
				deleteClient: {
					execute(id: string): Promise<AddOrDeleteClientResponse>
				}
				editClient: {
					execute(data: EditClientRequest): Promise<EditClientResponse>
				}
			}
			queries: {
				existsAnyClient: { execute(): Promise<boolean> }
				findClient: { execute(id: string): Promise<FindClientResponse> }
				findAllClients: { execute(): Promise<FindAllClientsResponse> }
			}
		}

		machineCases: {
			commands: {
				assignMachine: {
					execute(
						machineId: string,
						clientId: string
					): Promise<AddOrDeleteMachineResponse>
				}
				deleteMachine: {
					execute(id: string): Promise<AddOrDeleteMachineResponse>
				}
				editMachine: {
					execute(data: EditMachineRequest): Promise<EditMachineResponse>
				}
				regMachine: {
					execute(
						data: Omit<Machine, 'id' | 'id_client'>
					): Promise<AddOrDeleteMachineResponse>
				}
			}
			queries: {
				findMachine: { execute(id: string): Promise<FindMachineResponse> }
				findAllMachines: { execute(): Promise<FindAllMachinesResponse> }
				findAllMachinesWithClientName: {
					execute(): Promise<FindAllMachinesWithClientNameResponse>
				}
				existsAnyMachine: { execute(): Promise<boolean> }
				findAllMachinesByClient: {
					execute(id: string): Promise<FindAllMachinesResponse>
				}
				findAllWarehouseMachines: {
					execute(): Promise<FindAllMachinesResponse>
				}
			}
		}

		technicianCases: {
			commands: {
				addTechnician: {
					execute(data: Omit<Technician, 'id'>): Promise<AddTechnicianResponse>
				}
				deleteTechnician: {
					execute(id: string): Promise<DeleteTechnicianResponse>
				}
				editTechnician: {
					execute(data: EditTechnicianRequest): Promise<EditTechnicianResponse>
				}
			}
			queries: {
				findAllTechnicians: { execute(): Promise<FindTechnicianResponse> }
				findTechnicianById: {
					execute(id: string): Promise<FindTechnicianResponse>
				}
			}
		}

		visitCases: {
			commands: {
				addVisit: {
					execute(data: Omit<Visit, 'id'>): Promise<AddVisitResponse>
				}
			}
			queries: {
				getAvailableYears: { execute(): Promise<GetAvailableYearsResponse> }
				findVisits: { execute(year: string): Promise<FindVisitsResponse> }
			}
		}

		tokenManager: TokenManager

		cookieService: CookieService

		jwtPayload: {
			id: string
			name: string
			role: 'A' | 'u'
		}
	}

	Bindings: {
		KV: KVNamespace
		DB: D1Database
		AT_SECRET: SecretsStoreSecret
		RT_SECRET: SecretsStoreSecret
	}
}
