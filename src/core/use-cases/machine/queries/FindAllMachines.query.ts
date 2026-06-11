import type {
	FindAllMachinesResponse,
	FindAllMachinesWithClientNameResponse
} from '@core/entities/Machine'
import type { MachineRepo } from '@core/ports/MachineRepo'

export class FindAllMachinesWithClientNameQuery {
	constructor(private readonly machineRepo: MachineRepo) {}

	async execute(): Promise<FindAllMachinesWithClientNameResponse> {
		return await this.machineRepo.findAllMachinesWithClientName()
	}
}

export class FindAllMachinesQuery {
	constructor(private readonly machineRepo: MachineRepo) {}

	async execute(): Promise<FindAllMachinesResponse> {
		return await this.machineRepo.findAllMachines()
	}
}
