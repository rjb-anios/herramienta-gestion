import type {
	AddOrDeleteClientResponse,
	Client,
	FindClientResponse
} from '@core/entities/Client'
import type {
	AddOrDeleteMachineResponse,
	FindMachineResponse,
	Machine
} from '@core/entities/Machine'
import type {
	AddTechnicianResponse,
	FindTechnicianResponse,
	Technician
} from '@core/entities/Technician'
import type {
	EditUserResponse,
	RegisterUserData,
	RegisterUserResponse
} from '@core/entities/User'
import type {
	AddVisitResponse,
	EditVisitRequest,
	EditVisitResponse,
	Visit
} from '@core/entities/Visit'
import { AddClientCommand } from '@core/use-cases/client/commands/AddClient.command'
import { DeleteClientCommand } from '@core/use-cases/client/commands/DeleteClient.command'
import { EditClientCommand } from '@core/use-cases/client/commands/EditClient.command'
import { AssignMachineCommand } from '@core/use-cases/machine/commands/AssignMachine.command'
import { DeleteMachineCommand } from '@core/use-cases/machine/commands/DeleteMachine.command'
import { EditMachineCommand } from '@core/use-cases/machine/commands/EditMachine.command'
import { RegMachineCommand } from '@core/use-cases/machine/commands/RegMachine.command'
import { AddTechnicianCommand } from '@core/use-cases/technician/commands/AddTechnician.command'
import { EditTechnicianCommand } from '@core/use-cases/technician/commands/EditTechnician.command'
import { EditUserCommand } from '@core/use-cases/user/commands/EditUser.command'
import { RefreshSessionCommand } from '@core/use-cases/user/commands/RefreshSession.command'
import { RegisterUserCommand } from '@core/use-cases/user/commands/RegisterUser.command'
import { AddVisitCommand } from '@core/use-cases/visits/commands/AddVisit.command'
import { EditVisitCommand } from '@core/use-cases/visits/commands/EditVisit.command'
import { describe, expect, it, vi } from 'vitest'
import {
	createClientRepo,
	createMachineRepo,
	createPasswordHasher,
	createTechnicianRepo,
	createTokenManager,
	createUserRepo,
	createVisitRepo
} from './helpers'

const client: Client = {
	contact: 'Ana Diaz',
	email: 'ana@test.com',
	id: 'c1',
	name: 'Hospital Central',
	phone: '999111222'
}

const machine: Machine = {
	id: 'm1',
	id_client: null,
	manufacturer: '3M',
	model: 'Littmann 3200',
	serial_number: 'SN-1'
}

const technician: Technician = {
	active: true,
	email: 'tec@test.com',
	id: 't1',
	initials: 'TT',
	name: 'Tec Uno',
	phone: '999111222'
}

describe('AddClientCommand', () => {
	it('rechaza nombres duplicados', async () => {
		const repo = createClientRepo({
			existsByName: vi.fn(async (_name: string) => true)
		})

		const res = await new AddClientCommand(repo).execute({
			contact: client.contact,
			email: client.email,
			name: client.name,
			phone: client.phone
		})

		expect(res.type).toBe('Error')
	})

	it('registra el cliente con un id generado', async () => {
		const addClient = vi.fn(
			async (_data: Client): Promise<AddOrDeleteClientResponse> => ({
				type: 'Success'
			})
		)
		const repo = createClientRepo({
			addClient,
			existsByName: vi.fn(async (_name: string) => false)
		})

		const res = await new AddClientCommand(repo).execute({
			contact: client.contact,
			email: client.email,
			name: client.name,
			phone: client.phone
		})

		expect(res).toEqual({ type: 'Success' })
		expect(addClient.mock.calls[0][0].id).toMatch(/^[0-9a-f-]{36}$/)
	})
})

describe('EditClientCommand', () => {
	const data = {
		contact: 'Contacto Nuevo',
		id: client.id,
		name: 'Hospital Nuevo',
		prevContact: client.contact,
		prevEmail: client.email,
		prevName: client.name,
		prevPhone: client.phone
	}

	it('rechaza clientes inexistentes', async () => {
		const repo = createClientRepo({
			findClient: vi.fn(
				async (_id: string): Promise<FindClientResponse> => ({
					type: 'NotExists'
				})
			)
		})

		const res = await new EditClientCommand(repo).execute(data)

		expect(res).toEqual({ message: 'El cliente no existe', type: 'Error' })
	})

	it('rechaza nombres ya usados por otro cliente', async () => {
		const repo = createClientRepo({
			existsByName: vi.fn(async (_name: string) => true),
			findClient: vi.fn(
				async (_id: string): Promise<FindClientResponse> => ({
					client,
					type: 'Exist'
				})
			)
		})

		const res = await new EditClientCommand(repo).execute(data)

		expect(res.type).toBe('Error')
	})

	it('no actualiza cuando no hay cambios', async () => {
		const editClient = vi.fn()
		const repo = createClientRepo({
			editClient,
			findClient: vi.fn(
				async (_id: string): Promise<FindClientResponse> => ({
					client,
					type: 'Exist'
				})
			)
		})

		const res = await new EditClientCommand(repo).execute({
			id: client.id,
			prevContact: client.contact,
			prevEmail: client.email,
			prevName: client.name,
			prevPhone: client.phone
		})

		expect(res).toEqual({ type: 'NoHasChanges' })
		expect(editClient).not.toHaveBeenCalled()
	})

	it('actualiza cuando hay cambios válidos', async () => {
		const editClient = vi.fn(async () => ({ type: 'Success' }) as const)
		const repo = createClientRepo({
			editClient,
			existsByName: vi.fn(async (_name: string) => false),
			findClient: vi.fn(
				async (_id: string): Promise<FindClientResponse> => ({
					client,
					type: 'Exist'
				})
			)
		})

		const res = await new EditClientCommand(repo).execute(data)

		expect(res).toEqual({ type: 'Success' })
		expect(editClient).toHaveBeenCalledTimes(1)
	})
})

describe('RegMachineCommand', () => {
	it('rechaza seriales duplicados', async () => {
		const repo = createMachineRepo({
			existsBySerialNumber: vi.fn(async (_serial: string) => true)
		})

		const res = await new RegMachineCommand(repo).execute({
			manufacturer: machine.manufacturer,
			model: machine.model,
			serial_number: machine.serial_number
		})

		expect(res.type).toBe('Error')
	})

	it('registra un equipo en depósito', async () => {
		const regMachine = vi.fn(
			async (_data: Machine): Promise<AddOrDeleteMachineResponse> => ({
				type: 'Success'
			})
		)
		const repo = createMachineRepo({
			existsBySerialNumber: vi.fn(async (_serial: string) => false),
			regMachine
		})

		const res = await new RegMachineCommand(repo).execute({
			manufacturer: machine.manufacturer,
			model: machine.model,
			serial_number: machine.serial_number
		})

		expect(res).toEqual({ type: 'Success' })
		expect(regMachine.mock.calls[0][0].id_client).toBeNull()
	})
})

describe('EditMachineCommand', () => {
	const data = {
		id: machine.id,
		manufacturer: 'Philips',
		prevManufacturer: machine.manufacturer,
		prevModel: machine.model,
		prevSerial_number: machine.serial_number
	}

	it('rechaza equipos inexistentes', async () => {
		const repo = createMachineRepo({
			findMachine: vi.fn(
				async (_id: string): Promise<FindMachineResponse> => ({
					type: 'NotExists'
				})
			)
		})

		const res = await new EditMachineCommand(repo).execute(data)

		expect(res.type).toBe('Error')
	})

	it('rechaza seriales duplicados', async () => {
		const repo = createMachineRepo({
			existsBySerialNumber: vi.fn(async (_serial: string) => true),
			findMachine: vi.fn(
				async (_id: string): Promise<FindMachineResponse> => ({
					machine,
					type: 'Success'
				})
			)
		})

		const res = await new EditMachineCommand(repo).execute({
			...data,
			serial_number: 'SN-2'
		})

		expect(res.type).toBe('Error')
	})

	it('actualiza cuando hay cambios válidos', async () => {
		const editMachine = vi.fn(async () => ({ type: 'Success' }) as const)
		const repo = createMachineRepo({
			editMachine,
			findMachine: vi.fn(
				async (_id: string): Promise<FindMachineResponse> => ({
					machine,
					type: 'Success'
				})
			)
		})

		const res = await new EditMachineCommand(repo).execute(data)

		expect(res).toEqual({ type: 'Success' })
		expect(editMachine).toHaveBeenCalledTimes(1)
	})
})

describe('AssignMachineCommand', () => {
	it('rechaza equipos inexistentes', async () => {
		const repo = createMachineRepo({
			findMachine: vi.fn(
				async (_id: string): Promise<FindMachineResponse> => ({
					type: 'NotExists'
				})
			)
		})

		const res = await new AssignMachineCommand(
			repo,
			createClientRepo()
		).execute('m1', 'c1')

		expect(res.type).toBe('Error')
	})

	it('rechaza clientes inexistentes', async () => {
		const repo = createMachineRepo({
			findMachine: vi.fn(
				async (_id: string): Promise<FindMachineResponse> => ({
					machine,
					type: 'Success'
				})
			)
		})
		const clientRepo = createClientRepo({
			findClient: vi.fn(
				async (_id: string): Promise<FindClientResponse> => ({
					type: 'NotExists'
				})
			)
		})

		const res = await new AssignMachineCommand(repo, clientRepo).execute(
			'm1',
			'c1'
		)

		expect(res).toEqual({ message: 'El cliente no existe', type: 'Error' })
	})

	it('asigna el equipo a un cliente existente', async () => {
		const assignToClient = vi.fn(
			async (
				_machineId: string,
				_clientId: string
			): Promise<AddOrDeleteMachineResponse> => ({ type: 'Success' })
		)
		const repo = createMachineRepo({
			assignToClient,
			findMachine: vi.fn(
				async (_id: string): Promise<FindMachineResponse> => ({
					machine,
					type: 'Success'
				})
			)
		})
		const clientRepo = createClientRepo({
			findClient: vi.fn(
				async (_id: string): Promise<FindClientResponse> => ({
					client,
					type: 'Exist'
				})
			)
		})

		const res = await new AssignMachineCommand(repo, clientRepo).execute(
			'm1',
			'c1'
		)

		expect(res).toEqual({ type: 'Success' })
		expect(assignToClient).toHaveBeenCalledWith('m1', 'c1')
	})
})

describe('AddTechnicianCommand', () => {
	it('rechaza iniciales en uso', async () => {
		const repo = createTechnicianRepo({
			existsByInitials: vi.fn(async (_initials: string) => true)
		})

		const res = await new AddTechnicianCommand(repo).execute({
			active: true,
			email: technician.email,
			initials: technician.initials,
			name: technician.name,
			phone: technician.phone
		})

		expect(res).toEqual({ type: 'InitialsInUse' })
	})

	it('registra un técnico nuevo', async () => {
		const addTechnician = vi.fn(
			async (_data: Technician): Promise<AddTechnicianResponse> => ({
				type: 'Success'
			})
		)
		const repo = createTechnicianRepo({
			addTechnician,
			existsByInitials: vi.fn(async (_initials: string) => false)
		})

		const res = await new AddTechnicianCommand(repo).execute({
			active: true,
			email: technician.email,
			initials: technician.initials,
			name: technician.name,
			phone: technician.phone
		})

		expect(res).toEqual({ type: 'Success' })
		expect(addTechnician).toHaveBeenCalledTimes(1)
	})
})

describe('EditTechnicianCommand', () => {
	const data = {
		email: 'nuevo@test.com',
		id: technician.id,
		prevEmail: technician.email,
		prevInitials: technician.initials,
		prevName: technician.name,
		prevPhone: technician.phone
	}

	it('rechaza técnicos inexistentes', async () => {
		const repo = createTechnicianRepo({
			findById: vi.fn(
				async (_id: string): Promise<FindTechnicianResponse> => ({
					type: 'NotExists'
				})
			)
		})

		const res = await new EditTechnicianCommand(repo).execute(data)

		expect(res.type).toBe('Error')
	})

	it('rechaza iniciales duplicadas', async () => {
		const repo = createTechnicianRepo({
			existsByInitials: vi.fn(async (_initials: string) => true),
			findById: vi.fn(
				async (_id: string): Promise<FindTechnicianResponse> => ({
					technician: [technician],
					type: 'Success'
				})
			)
		})

		const res = await new EditTechnicianCommand(repo).execute({
			...data,
			initials: 'TN'
		})

		expect(res.type).toBe('Error')
	})

	it('actualiza cuando hay cambios válidos', async () => {
		const editTechnician = vi.fn(async () => ({ type: 'Success' }) as const)
		const repo = createTechnicianRepo({
			editTechnician,
			findById: vi.fn(
				async (_id: string): Promise<FindTechnicianResponse> => ({
					technician: [technician],
					type: 'Success'
				})
			)
		})

		const res = await new EditTechnicianCommand(repo).execute(data)

		expect(res).toEqual({ type: 'Success' })
		expect(editTechnician).toHaveBeenCalledTimes(1)
	})
})

describe('DeleteClientCommand', () => {
	it('rechaza clientes inexistentes', async () => {
		const repo = createClientRepo({
			findClient: vi.fn(
				async (_id: string): Promise<FindClientResponse> => ({
					type: 'NotExists'
				})
			)
		})

		const res = await new DeleteClientCommand(repo).execute('c1')

		expect(res.type).toBe('Error')
	})

	it('no elimina clientes con visitas', async () => {
		const repo = createClientRepo({
			findClient: vi.fn(
				async (_id: string): Promise<FindClientResponse> => ({
					client,
					type: 'Exist'
				})
			),
			hasVisits: vi.fn(async (_id: string) => true)
		})

		const res = await new DeleteClientCommand(repo).execute('c1')

		expect(res.type).toBe('Error')
	})

	it('no elimina clientes con equipos', async () => {
		const repo = createClientRepo({
			findClient: vi.fn(
				async (_id: string): Promise<FindClientResponse> => ({
					client,
					type: 'Exist'
				})
			),
			hasMachines: vi.fn(async (_id: string) => true),
			hasVisits: vi.fn(async (_id: string) => false)
		})

		const res = await new DeleteClientCommand(repo).execute('c1')

		expect(res.type).toBe('Error')
	})

	it('elimina cuando no tiene dependencias', async () => {
		const deleteClient = vi.fn(
			async (_id: string): Promise<AddOrDeleteClientResponse> => ({
				type: 'Success'
			})
		)
		const repo = createClientRepo({
			deleteClient,
			findClient: vi.fn(
				async (_id: string): Promise<FindClientResponse> => ({
					client,
					type: 'Exist'
				})
			),
			hasMachines: vi.fn(async (_id: string) => false),
			hasVisits: vi.fn(async (_id: string) => false)
		})

		const res = await new DeleteClientCommand(repo).execute('c1')

		expect(res).toEqual({ type: 'Success' })
		expect(deleteClient).toHaveBeenCalledWith('c1')
	})
})

describe('DeleteMachineCommand', () => {
	it('no elimina equipos intervenidos en visitas', async () => {
		const repo = createMachineRepo({
			findMachine: vi.fn(
				async (_id: string): Promise<FindMachineResponse> => ({
					machine,
					type: 'Success'
				})
			),
			hasVisits: vi.fn(async (_id: string) => true)
		})

		const res = await new DeleteMachineCommand(repo).execute('m1')

		expect(res.type).toBe('Error')
	})
})

describe('RegisterUserCommand', () => {
	const registerData = {
		confirmPassword: 'clave1234',
		name: 'Usuario Uno',
		password: 'clave1234',
		role: 'A' as const,
		username: 'usuario1'
	}

	it('rechaza usuarios existentes', async () => {
		const repo = createUserRepo({
			existsByUsername: vi.fn(async (_username: string) => true)
		})

		const res = await new RegisterUserCommand(
			repo,
			createPasswordHasher()
		).execute(registerData)

		expect(res).toEqual({ type: 'UserAlreadyExists' })
	})

	it('rechaza contraseñas que no coinciden', async () => {
		const repo = createUserRepo({
			existsByUsername: vi.fn(async (_username: string) => false)
		})

		const res = await new RegisterUserCommand(
			repo,
			createPasswordHasher()
		).execute({ ...registerData, confirmPassword: 'otra12345' })

		expect(res).toEqual({ type: 'PasswordsDoNotMatch' })
	})

	it('hashea la contraseña y registra el usuario', async () => {
		const hash = vi.fn(async (_password: string) => 'hashed')
		const register = vi.fn(
			async (_data: RegisterUserData): Promise<RegisterUserResponse> => ({
				type: 'Success'
			})
		)
		const repo = createUserRepo({
			existsByUsername: vi.fn(async (_username: string) => false),
			register
		})

		const res = await new RegisterUserCommand(
			repo,
			createPasswordHasher({ hash })
		).execute(registerData)

		expect(res).toEqual({ type: 'Success' })
		expect(hash).toHaveBeenCalledWith('clave1234')
		expect(register.mock.calls[0][0].password).toBe('hashed')
	})
})

describe('EditUserCommand', () => {
	const base = {
		id: 'u1',
		prevName: 'Usuario Uno',
		prevRole: 'u' as const,
		prevUsername: 'usuario1'
	}

	it('rechaza usuarios inexistentes', async () => {
		const repo = createUserRepo({
			existsById: vi.fn(async (_id: string) => false)
		})

		const res = await new EditUserCommand(repo, createPasswordHasher()).execute(
			{ ...base, name: 'Nombre Nuevo' }
		)

		expect(res).toEqual({ message: 'El usuario no existe', type: 'Error' })
	})

	it('revoca sesiones al cambiar el rol', async () => {
		const deleteRefreshTokensByUser = vi.fn(
			async (_userId: string) => undefined
		)
		const repo = createUserRepo({
			deleteRefreshTokensByUser,
			editUser: vi.fn(
				async (): Promise<EditUserResponse> => ({ type: 'Success' })
			),
			existsById: vi.fn(async (_id: string) => true)
		})

		const res = await new EditUserCommand(repo, createPasswordHasher()).execute(
			{ ...base, role: 'A' }
		)

		expect(res).toEqual({ type: 'Success' })
		expect(deleteRefreshTokensByUser).toHaveBeenCalledWith('u1')
	})

	it('no revoca sesiones al cambiar solo el nombre', async () => {
		const deleteRefreshTokensByUser = vi.fn(
			async (_userId: string) => undefined
		)
		const repo = createUserRepo({
			deleteRefreshTokensByUser,
			editUser: vi.fn(
				async (): Promise<EditUserResponse> => ({ type: 'Success' })
			),
			existsById: vi.fn(async (_id: string) => true)
		})

		const res = await new EditUserCommand(repo, createPasswordHasher()).execute(
			{ ...base, name: 'Nombre Nuevo' }
		)

		expect(res).toEqual({ type: 'Success' })
		expect(deleteRefreshTokensByUser).not.toHaveBeenCalled()
	})

	it('hashea y revoca sesiones al cambiar la contraseña', async () => {
		const hash = vi.fn(async (_password: string) => 'hashed')
		const deleteRefreshTokensByUser = vi.fn(
			async (_userId: string) => undefined
		)
		const repo = createUserRepo({
			deleteRefreshTokensByUser,
			editUser: vi.fn(
				async (): Promise<EditUserResponse> => ({ type: 'Success' })
			),
			existsById: vi.fn(async (_id: string) => true)
		})

		const res = await new EditUserCommand(
			repo,
			createPasswordHasher({ hash })
		).execute({ ...base, password: 'nueva12345' })

		expect(res).toEqual({ type: 'Success' })
		expect(hash).toHaveBeenCalledWith('nueva12345')
		expect(deleteRefreshTokensByUser).toHaveBeenCalledWith('u1')
	})

	it('rechaza usuarios ya usados al cambiar el username', async () => {
		const repo = createUserRepo({
			editUser: vi.fn(
				async (): Promise<EditUserResponse> => ({ type: 'Success' })
			),
			existsById: vi.fn(async (_id: string) => true),
			existsByUsername: vi.fn(async (_username: string) => true)
		})

		const res = await new EditUserCommand(repo, createPasswordHasher()).execute(
			{ ...base, username: 'usuario2' }
		)

		expect(res).toEqual({ type: 'UserAlreadyExists' })
	})
})

describe('RefreshSessionCommand', () => {
	const user = { id: 'u1', name: 'Usuario Uno', role: 'u' as const }

	it('devuelve null si el token ya fue usado', async () => {
		const repo = createUserRepo({
			deleteRefreshToken: vi.fn(async (_tokenId: string) => false)
		})

		const res = await new RefreshSessionCommand(
			repo,
			createTokenManager()
		).execute('rft-1', user)

		expect(res).toBeNull()
	})

	it('rota el par de tokens cuando el token está vigente', async () => {
		const saveRefreshToken = vi.fn(async () => undefined)
		const repo = createUserRepo({
			deleteRefreshToken: vi.fn(async (_tokenId: string) => true),
			saveRefreshToken
		})
		const tokenManager = createTokenManager({
			generateAccessToken: vi.fn(async _payload => 'ac-nuevo'),
			generateRefreshToken: vi.fn(async _payload => ({
				created: '2026-09-20T00:00:00.000Z',
				expiry: '2026-10-05T00:00:00.000Z',
				idRFT: 'rft-2',
				token: 'rf-nuevo'
			}))
		})

		const res = await new RefreshSessionCommand(repo, tokenManager).execute(
			'rft-1',
			user
		)

		expect(res).toEqual({
			expRYF: '2026-10-05T00:00:00.000Z',
			newAcToken: 'ac-nuevo',
			newRfToken: 'rf-nuevo'
		})
		expect(saveRefreshToken).toHaveBeenCalledTimes(1)
	})
})

describe('AddVisitCommand', () => {
	it('genera un id para la visita', async () => {
		const addVisit = vi.fn(
			async (_visit: Visit): Promise<AddVisitResponse> => ({
				type: 'Success'
			})
		)
		const repo = createVisitRepo({ addVisit })

		const res = await new AddVisitCommand(repo).execute({
			client_signature: '',
			client_signer: 'Ana',
			concept: 'otro',
			date: '2026-09-20',
			future: undefined,
			hours: 1,
			id_client: 'c1',
			id_machine: [],
			id_technicians: ['t1'],
			register_description: 'Descripcion de registro',
			sector: undefined,
			task_description: undefined,
			technician_signature: ''
		})

		expect(res).toEqual({ type: 'Success' })
		expect(addVisit.mock.calls[0][0].id).toMatch(/^[0-9a-f-]{36}$/)
	})
})

describe('EditVisitCommand', () => {
	it('no actualiza cuando no hay cambios', async () => {
		const editVisit = vi.fn()
		const repo = createVisitRepo({ editVisit })

		const res = await new EditVisitCommand(repo).execute({
			future: 'Futuro previo',
			id: 'v1',
			prevFuture: 'Futuro previo',
			prevSector: 'Sector previo',
			prevTaskDescription: 'Tareas previas',
			sector: 'Sector previo',
			task_description: 'Tareas previas'
		})

		expect(res).toEqual({ type: 'NoHasChanges' })
		expect(editVisit).not.toHaveBeenCalled()
	})

	it('actualiza solo los campos modificados', async () => {
		const editVisit = vi.fn(
			async (_data: EditVisitRequest): Promise<EditVisitResponse> => ({
				type: 'Success'
			})
		)
		const repo = createVisitRepo({ editVisit })

		const res = await new EditVisitCommand(repo).execute({
			id: 'v1',
			prevFuture: 'Futuro previo',
			prevSector: 'Sector previo',
			prevTaskDescription: 'Tareas previas',
			task_description: 'Tareas nuevas'
		})

		expect(res).toEqual({ type: 'Success' })
		expect(editVisit.mock.calls[0][0].task_description).toBe('Tareas nuevas')
		expect(editVisit.mock.calls[0][0].future).toBeUndefined()
	})
})
