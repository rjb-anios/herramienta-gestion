import type { ClientRepo } from '@core/ports/ClientRepo'
import type { MachineRepo } from '@core/ports/MachineRepo'
import type { PasswordHasher } from '@core/ports/PasswordHasher'
import type { TechnicianRepo } from '@core/ports/TechnicianRepo'
import type { TokenManager } from '@core/ports/TokenManager'
import type { UserRepo } from '@core/ports/UserRepo'
import type { VisitRepo } from '@core/ports/VisitRepo'
import { vi } from 'vitest'

export function createClientRepo(
	overrides: Partial<ClientRepo> = {}
): ClientRepo {
	return {
		addClient: vi.fn(),
		deleteClient: vi.fn(),
		editClient: vi.fn(),
		existsAnyClient: vi.fn(),
		existsByName: vi.fn(),
		findAllClients: vi.fn(),
		findClient: vi.fn(),
		hasMachines: vi.fn(),
		hasVisits: vi.fn(),
		...overrides
	}
}

export function createMachineRepo(
	overrides: Partial<MachineRepo> = {}
): MachineRepo {
	return {
		assignToClient: vi.fn(),
		deleteMachine: vi.fn(),
		editMachine: vi.fn(),
		existsAnyMachine: vi.fn(),
		existsBySerialNumber: vi.fn(),
		findAllMachinesByClient: vi.fn(),
		findAllMachinesWithClientName: vi.fn(),
		findAllWarehouse: vi.fn(),
		findMachine: vi.fn(),
		hasVisits: vi.fn(),
		regMachine: vi.fn(),
		unassignFromClient: vi.fn(),
		...overrides
	}
}

export function createTechnicianRepo(
	overrides: Partial<TechnicianRepo> = {}
): TechnicianRepo {
	return {
		addTechnician: vi.fn(),
		editTechnician: vi.fn(),
		existsByInitials: vi.fn(),
		findActive: vi.fn(),
		findAll: vi.fn(),
		findById: vi.fn(),
		toggleActive: vi.fn(),
		...overrides
	}
}

export function createUserRepo(overrides: Partial<UserRepo> = {}): UserRepo {
	return {
		deleteRefreshToken: vi.fn(),
		deleteRefreshTokensByUser: vi.fn(),
		deleteUser: vi.fn(),
		editUser: vi.fn(),
		existsAnyUser: vi.fn(),
		existsById: vi.fn(),
		existsByUsername: vi.fn(),
		findAllUsers: vi.fn(),
		findPrivateByUsername: vi.fn(),
		findToken: vi.fn(),
		findUser: vi.fn(),
		register: vi.fn(),
		saveRefreshToken: vi.fn(),
		...overrides
	}
}

export function createPasswordHasher(
	overrides: Partial<PasswordHasher> = {}
): PasswordHasher {
	return {
		compare: vi.fn(),
		hash: vi.fn(),
		...overrides
	}
}

export function createTokenManager(
	overrides: Partial<TokenManager> = {}
): TokenManager {
	return {
		generateAccessToken: vi.fn(),
		generateRefreshToken: vi.fn(),
		verifyAccessToken: vi.fn(),
		verifyRefreshToken: vi.fn(),
		...overrides
	}
}

export function createVisitRepo(overrides: Partial<VisitRepo> = {}): VisitRepo {
	return {
		addVisit: vi.fn(),
		editVisit: vi.fn(),
		findVisitById: vi.fn(),
		findVisits: vi.fn(),
		findVisitToPrint: vi.fn(),
		getAvailableYears: vi.fn(),
		...overrides
	}
}
