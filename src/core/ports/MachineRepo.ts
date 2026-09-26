import type {
	AddOrDeleteMachineResponse,
	EditMachineRequest,
	EditMachineResponse,
	FindAllMachinesResponse,
	FindAllMachinesWithClientNameResponse,
	FindMachineResponse,
	Machine
} from '@core/entities/Machine'

export interface MachineRepo {
	deleteMachine: (id: string) => Promise<AddOrDeleteMachineResponse>

	editMachine: (data: EditMachineRequest) => Promise<EditMachineResponse>

	findMachine: (id: string) => Promise<FindMachineResponse>

	findAllMachinesByClient: (id: string) => Promise<FindAllMachinesResponse>

	findAllMachinesWithClientName: () => Promise<FindAllMachinesWithClientNameResponse>

	existsAnyMachine: () => Promise<boolean>

	existsBySerialNumber: (serial: string) => Promise<boolean>

	hasVisits: (id: string) => Promise<boolean>

	regMachine: (data: Machine) => Promise<AddOrDeleteMachineResponse>

	findAllWarehouse: () => Promise<FindAllMachinesResponse>

	assignToClient: (
		machineId: string,
		clientId: string
	) => Promise<AddOrDeleteMachineResponse>

	unassignFromClient: (machineId: string) => Promise<AddOrDeleteMachineResponse>
}
