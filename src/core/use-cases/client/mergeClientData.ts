import type { EditClientRequest } from '@core/entities/Client'

export type MergedEditClientData = {
	id: string
	prevName: string
	name: string
	prevContact: string
	contact: string
	prevPhone: string
	phone: string
	prevEmail: string
	email: string
}

export function mergeClientData(request: EditClientRequest): {
	hasChanges: boolean
	data: MergedEditClientData
} {
	const hasName = request.name !== undefined && request.name !== ''
	const hasContact = request.contact !== undefined && request.contact !== ''
	const hasPhone = request.phone !== undefined && request.phone !== ''
	const hasEmail = request.email !== undefined && request.email !== ''

	if (!hasName && !hasContact && !hasPhone && !hasEmail) {
		return {
			data: {
				contact: request.prevContact,
				email: request.prevEmail,
				id: request.id,
				name: request.prevName,
				phone: request.prevPhone,
				prevContact: request.prevContact,
				prevEmail: request.prevEmail,
				prevName: request.prevName,
				prevPhone: request.prevPhone
			},
			hasChanges: false
		}
	}

	return {
		data: {
			contact: hasContact ? request.contact! : request.prevContact,
			email: hasEmail ? request.email! : request.prevEmail,
			id: request.id,
			name: hasName ? request.name! : request.prevName,
			phone: hasPhone ? request.phone! : request.prevPhone,
			prevContact: request.prevContact,
			prevEmail: request.prevEmail,
			prevName: request.prevName,
			prevPhone: request.prevPhone
		},
		hasChanges: true
	}
}
