import type { MachineRepo } from '@core/ports/MachineRepo'

export class ExistsAnyMachineQuery {
	constructor(private readonly machineRepo: MachineRepo) {}

	async execute(): Promise<boolean> {
		return await this.machineRepo.existsAnyMachine()
	}
}
