import type { FindAllMachinesResponse } from '@core/entities/Machine'
import type { MachineRepo } from '@core/ports/MachineRepo'

export class FindAllWarehouseMachinesQuery {
	constructor(private readonly machineRepo: MachineRepo) {}

	async execute(): Promise<FindAllMachinesResponse> {
		return await this.machineRepo.findAllWarehouse()
	}
}
