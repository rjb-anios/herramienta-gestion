import type { EditMachineRequest } from '@core/entities/Machine'

export interface MergedEditMachineData {
	id: string
	prevManufacturer: string
	manufacturer: string
	prevModel: string
	model: string
	prevSerial_number: string
	serial_number: string
}

export function mergeMachineData(request: EditMachineRequest): {
	hasChanges: boolean
	data: MergedEditMachineData
} {
	const hasManufacturer =
		request.manufacturer !== undefined && request.manufacturer !== ''
	const hasModel = request.model !== undefined && request.model !== ''
	const hasSerialNumber =
		request.serial_number !== undefined && request.serial_number !== ''

	if (!hasManufacturer && !hasModel && !hasSerialNumber) {
		return {
			data: {
				id: request.id,
				manufacturer: request.prevManufacturer,
				model: request.prevModel,
				prevManufacturer: request.prevManufacturer,
				prevModel: request.prevModel,
				prevSerial_number: request.prevSerial_number,
				serial_number: request.prevSerial_number
			},
			hasChanges: false
		}
	}

	return {
		data: {
			id: request.id,
			manufacturer: hasManufacturer
				? request.manufacturer!
				: request.prevManufacturer,
			model: hasModel ? request.model! : request.prevModel,
			prevManufacturer: request.prevManufacturer,
			prevModel: request.prevModel,
			prevSerial_number: request.prevSerial_number,
			serial_number: hasSerialNumber
				? request.serial_number!
				: request.prevSerial_number
		},
		hasChanges: true
	}
}
