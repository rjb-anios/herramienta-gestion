import type { FindAllMachinesResponse } from '@core/entities/Machine'
import type { MachineRepo } from '@core/ports/MachineRepo'

export class FindAllMachinesByClientQuery {
	constructor(private readonly machineRepo: MachineRepo) {}

	async execute(id: string): Promise<FindAllMachinesResponse> {
		return await this.machineRepo.findAllMachinesByClient(id)
	}
}
