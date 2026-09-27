import { readFile } from 'node:fs/promises'
import { fillVisitPDFTemplate } from '@adapters/external/pdfTool'
import { PDFDocument } from '@cantoo/pdf-lib'
import type { VisitToPrint } from '@core/entities/Visit'
import { Encoding, Signature } from 'autopen'
import { describe, expect, it } from 'vitest'

async function loadTemplate(): Promise<ArrayBuffer> {
	const buffer = await readFile(new URL('../public/reg07.pdf', import.meta.url))

	return buffer.buffer.slice(
		buffer.byteOffset,
		buffer.byteOffset + buffer.byteLength
	)
}

function createSignature(): string {
	const signature = new Signature({ canvasHeight: 150, canvasWidth: 500 })

	signature.pushStroke([
		{ x: 20, y: 100 },
		{ x: 80, y: 30 },
		{ x: 160, y: 120 },
		{ x: 280, y: 40 },
		{ x: 420, y: 110 }
	])

	return signature.serializeToString(Encoding.Z85)
}

const visit: VisitToPrint = {
	client: 'Hospital de Prueba',
	client_signature: createSignature(),
	client_signer: 'Maria Lopez',
	contact_client: 'Juan Perez',
	date: '2026-09-20',
	machines: [
		{
			manufacturer: '3M',
			model: 'Littmann 3200',
			serial_number: 'SN-0001'
		},
		{
			manufacturer: 'Philips',
			model: 'PageWriter TC70',
			serial_number: 'SN-0002'
		}
	],
	register_description: 'Mantenimiento preventivo completo del equipo.',
	sector: 'Cardiologia',
	technician_signature: createSignature(),
	technicians: [
		{ email: 'tec1@test.com', name: 'Tec Uno', phone: '999111222' },
		{ email: 'tec2@test.com', name: 'Tec Dos', phone: '999333444' }
	]
}

describe('fillVisitPDFTemplate', () => {
	it('genera un PDF de una página con el formulario aplanado', async () => {
		const pdf = await fillVisitPDFTemplate(visit, await loadTemplate())

		expect(pdf).not.toBeNull()

		const bytes = pdf as Uint8Array
		const header = Buffer.from(bytes.slice(0, 5)).toString('ascii')

		expect(header).toBe('%PDF-')

		const document = await PDFDocument.load(bytes)

		expect(document.getPageCount()).toBe(1)
		expect(document.getForm().getFields()).toHaveLength(0)
	})

	it('incluye las firmas vectoriales', async () => {
		const withSignatures = await fillVisitPDFTemplate(
			visit,
			await loadTemplate()
		)
		const withoutSignatures = await fillVisitPDFTemplate(
			{ ...visit, client_signature: '', technician_signature: '' },
			await loadTemplate()
		)

		expect(withSignatures).not.toBeNull()
		expect(withoutSignatures).not.toBeNull()
		expect((withSignatures as Uint8Array).length).toBeGreaterThan(
			(withoutSignatures as Uint8Array).length
		)
	})

	it('no falla si una firma está corrupta', async () => {
		const pdf = await fillVisitPDFTemplate(
			{ ...visit, technician_signature: 'datos-invalidos' },
			await loadTemplate()
		)

		expect(pdf).not.toBeNull()
	})
})
