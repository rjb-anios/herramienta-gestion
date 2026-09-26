import type { AddOrDeleteMachineResponse } from '@core/entities/Machine'
import type { ClientRepo } from '@core/ports/ClientRepo'
import type { MachineRepo } from '@core/ports/MachineRepo'

export class AssignMachineCommand {
	constructor(
		private readonly machineRepo: MachineRepo,
		private readonly clientRepo: ClientRepo
	) {}

	async execute(
		machineId: string,
		clientId: string
	): Promise<AddOrDeleteMachineResponse> {
		const machine = await this.machineRepo.findMachine(machineId)
		if (machine.type === 'NotExists') {
			return { message: 'El equipo no existe', type: 'Error' }
		}
		if (machine.type === 'Error') {
			return machine
		}

		const client = await this.clientRepo.findClient(clientId)
		if (client.type === 'NotExists') {
			return { message: 'El cliente no existe', type: 'Error' }
		}
		if (client.type === 'Error') {
			return { message: client.message, type: 'Error' }
		}

		return await this.machineRepo.assignToClient(machineId, clientId)
	}
}
