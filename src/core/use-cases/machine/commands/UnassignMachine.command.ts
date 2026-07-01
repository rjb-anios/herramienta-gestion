import type {
	AddOrDeleteMachineResponse
} from '@core/entities/Machine'
import type { MachineRepo } from '@core/ports/MachineRepo'

export class UnassignMachineCommand {
	constructor(private readonly machineRepo: MachineRepo) {}

	async execute(
		machineId: string
	): Promise<AddOrDeleteMachineResponse> {
		const machine = await this.machineRepo.findMachine(machineId)
		if (machine.type === 'NotExists') {
			return { message: 'El equipo no existe', type: 'Error' }
		}
		if (machine.type === 'Error') {
			return machine
		}

		return await this.machineRepo.unassignFromClient(machineId)
	}
}
