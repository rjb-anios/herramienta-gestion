import type { AddOrDeleteMachineResponse } from '@core/entities/Machine'
import type { MachineRepo } from '@core/ports/MachineRepo'

export class DeleteMachineCommand {
	constructor(private readonly machineRepo: MachineRepo) {}

	async execute(id: string): Promise<AddOrDeleteMachineResponse> {
		const machine = await this.machineRepo.findMachine(id)
		if (machine.type === 'NotExists') {
			return { message: 'El equipo no existe', type: 'Error' }
		}
		if (machine.type === 'Error') {
			return machine
		}

		const hasVisits = await this.machineRepo.hasVisits(id)
		if (hasVisits) {
			return {
				message:
					'No se puede eliminar el equipo porque fue intervenido en una visita.',
				type: 'Error'
			}
		}

		return await this.machineRepo.deleteMachine(id)
	}
}
