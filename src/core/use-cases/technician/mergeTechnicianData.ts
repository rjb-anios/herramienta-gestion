import type { EditTechnicianRequest } from '@core/entities/Technician'

export interface MergedEditTechnicianData {
	id: string
	prevName: string
	name: string
	prevInitials: string
	initials: string
}

export function mergeTechnicianData(request: EditTechnicianRequest): {
	hasChanges: boolean
	data: MergedEditTechnicianData
} {
	const hasName = request.name !== undefined && request.name !== ''
	const hasInitials = request.initials !== undefined && request.initials !== ''

	if (!hasName && !hasInitials) {
		return {
			data: {
				id: request.id,
				initials: request.prevInitials,
				name: request.prevName,
				prevInitials: request.prevInitials,
				prevName: request.prevName
			},
			hasChanges: false
		}
	}

	return {
		data: {
			id: request.id,
			initials: hasInitials ? request.initials! : request.prevInitials,
			name: hasName ? request.name! : request.prevName,
			prevInitials: request.prevInitials,
			prevName: request.prevName
		},
		hasChanges: true
	}
}
