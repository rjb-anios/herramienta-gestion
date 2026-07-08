import type { EditTechnicianRequest } from '@core/entities/Technician'

export interface MergedEditTechnicianData {
	id: string
	prevName: string
	name: string
	prevInitials: string
	initials: string
	prevEmail: string
	email: string
	prevPhone: string
	phone: string
}

export function mergeTechnicianData(request: EditTechnicianRequest): {
	hasChanges: boolean
	data: MergedEditTechnicianData
} {
	const hasName = request.name !== undefined && request.name !== ''
	const hasInitials = request.initials !== undefined && request.initials !== ''
	const hasEmail = request.email !== undefined && request.email !== ''
	const hasPhone = request.phone !== undefined && request.phone !== ''

	if (!hasName && !hasInitials && !hasEmail && !hasPhone) {
		return {
			data: {
				id: request.id,
				initials: request.prevInitials,
				name: request.prevName,
				prevInitials: request.prevInitials,
				prevName: request.prevName,
				email: request.prevEmail,
				prevEmail: request.prevEmail,
				phone: request.prevPhone,
				prevPhone: request.prevPhone
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
			prevName: request.prevName,
			email: hasEmail ? request.email! : request.prevEmail,
			prevEmail: request.prevEmail,
			phone: hasPhone ? request.phone! : request.prevPhone,
			prevPhone: request.prevPhone
		},
		hasChanges: true
	}
}
