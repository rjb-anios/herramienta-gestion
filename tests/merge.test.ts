import type { Role } from '@core/entities/Role'
import { mergeClientData } from '@core/use-cases/client/mergeClientData'
import { mergeMachineData } from '@core/use-cases/machine/mergeMachineData'
import { mergeTechnicianData } from '@core/use-cases/technician/mergeTechnicianData'
import { mergeUserData } from '@core/use-cases/user/mergeUserData'
import { mergeVisitData } from '@core/use-cases/visits/mergeVisitData'
import { describe, expect, it } from 'vitest'

describe('mergeClientData', () => {
	const base = {
		id: 'c1',
		prevContact: 'Ana Diaz',
		prevEmail: 'ana@test.com',
		prevName: 'Hospital Central',
		prevPhone: '999111222'
	}

	it('no reporta cambios si los valores coinciden con los previos', () => {
		const result = mergeClientData({
			...base,
			contact: base.prevContact,
			email: base.prevEmail,
			name: base.prevName,
			phone: base.prevPhone
		})

		expect(result.hasChanges).toBe(false)
	})

	it('detecta un cambio de nombre', () => {
		const result = mergeClientData({ ...base, name: 'Hospital Nuevo' })

		expect(result.hasChanges).toBe(true)
		expect(result.data.name).toBe('Hospital Nuevo')
		expect(result.data.contact).toBe(base.prevContact)
	})

	it('trata el string vacío como sin cambio', () => {
		const result = mergeClientData({ ...base, name: '' })

		expect(result.hasChanges).toBe(false)
		expect(result.data.name).toBe(base.prevName)
	})
})

describe('mergeMachineData', () => {
	const base = {
		id: 'm1',
		prevManufacturer: '3M',
		prevModel: 'Littmann 3200',
		prevSerial_number: 'SN-1'
	}

	it('no reporta cambios si nada cambió', () => {
		const result = mergeMachineData({
			...base,
			manufacturer: base.prevManufacturer,
			model: base.prevModel,
			serial_number: base.prevSerial_number
		})

		expect(result.hasChanges).toBe(false)
	})

	it('detecta cambio de serial', () => {
		const result = mergeMachineData({ ...base, serial_number: 'SN-2' })

		expect(result.hasChanges).toBe(true)
		expect(result.data.serial_number).toBe('SN-2')
		expect(result.data.model).toBe(base.prevModel)
	})
})

describe('mergeTechnicianData', () => {
	const base = {
		id: 't1',
		prevEmail: 'tec@test.com',
		prevInitials: 'TT',
		prevName: 'Tec Uno',
		prevPhone: '999111222'
	}

	it('no reporta cambios si nada cambió', () => {
		const result = mergeTechnicianData({
			...base,
			email: base.prevEmail,
			initials: base.prevInitials,
			name: base.prevName,
			phone: base.prevPhone
		})

		expect(result.hasChanges).toBe(false)
	})

	it('detecta cambio de iniciales', () => {
		const result = mergeTechnicianData({ ...base, initials: 'TN' })

		expect(result.hasChanges).toBe(true)
		expect(result.data.initials).toBe('TN')
	})
})

describe('mergeUserData', () => {
	const base = {
		id: 'u1',
		prevName: 'Usuario Uno',
		prevRole: 'u' as Role,
		prevUsername: 'usuario1'
	}

	it('no reporta cambios ni username cambiado', () => {
		const result = mergeUserData({
			...base,
			name: base.prevName,
			role: base.prevRole,
			username: base.prevUsername
		})

		expect(result.hasChanges).toBe(false)
		expect(result.usernameChanged).toBe(false)
	})

	it('detecta cambio de rol', () => {
		const result = mergeUserData({ ...base, role: 'A' })

		expect(result.hasChanges).toBe(true)
		expect(result.data.role).toBe('A')
	})

	it('marca usernameChanged solo si cambia el nombre de usuario', () => {
		const result = mergeUserData({ ...base, username: 'usuario2' })

		expect(result.hasChanges).toBe(true)
		expect(result.usernameChanged).toBe(true)
	})
})

describe('mergeVisitData', () => {
	const base = {
		id: 'v1',
		prevFuture: 'Futuro previo',
		prevSector: 'Sector previo',
		prevTaskDescription: 'Tareas previas'
	}

	it('no reporta cambios si todo coincide', () => {
		const result = mergeVisitData({
			...base,
			future: base.prevFuture,
			sector: base.prevSector,
			task_description: base.prevTaskDescription
		})

		expect(result.hasChanges).toBe(false)
	})

	it('permite vaciar la descripción de tareas', () => {
		const result = mergeVisitData({ ...base, task_description: '' })

		expect(result.hasChanges).toBe(true)
		expect(result.data.task_description).toBe('')
	})

	it('detecta cambios de futuro y sector', () => {
		const result = mergeVisitData({ ...base, future: 'Nuevo futuro' })

		expect(result.hasChanges).toBe(true)
		expect(result.data.future).toBe('Nuevo futuro')
		expect(result.data.sector).toBeUndefined()
	})
})
