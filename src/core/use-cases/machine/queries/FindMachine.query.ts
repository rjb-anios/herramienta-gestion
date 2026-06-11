import type { FindMachineResponse } from '@core/entities/Machine'
import type { MachineRepo } from '@core/ports/MachineRepo'

export class FindMachineQuery {
	constructor(private readonly machineRepo: MachineRepo) {}

	async execute(id: string): Promise<FindMachineResponse> {
		return await this.machineRepo.findMachine(id)
	}
}
