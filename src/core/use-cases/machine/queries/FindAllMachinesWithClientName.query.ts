import type { FindAllMachinesWithClientNameResponse } from '@core/entities/Machine'
import type { MachineRepo } from '@core/ports/MachineRepo'

export class FindAllMachinesWithClientNameQuery {
	constructor(private readonly machineRepo: MachineRepo) {}

	async execute(): Promise<FindAllMachinesWithClientNameResponse> {
		return await this.machineRepo.findAllMachinesWithClientName()
	}
}
