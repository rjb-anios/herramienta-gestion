import type { PDFPage, PDFRef } from '@cantoo/pdf-lib'
import { PDFDocument, PDFTextField, rgb } from '@cantoo/pdf-lib'
import type { VisitToPrint } from '@core/entities/Visit'
import { Encoding, Format, Signature } from 'autopen'
import dayjs from 'dayjs'

const SIGNATURE_CANVAS = { canvasHeight: 150, canvasWidth: 500 }
const MAX_MACHINES = 6
const SIGNATURE_BORDER_WIDTH = 1.2

interface SignatureDraw {
	page: PDFPage
	paths: string[]
	rect: { height: number; width: number; x: number; y: number }
	svgHeight: number
	svgWidth: number
}

function getFieldMap(form: ReturnType<PDFDocument['getForm']>) {
	const fieldsByName = new Map<string, PDFTextField[]>()

	for (const field of form.getFields()) {
		if (!(field instanceof PDFTextField)) continue

		const fields = fieldsByName.get(field.getName()) ?? []
		fields.push(field)
		fieldsByName.set(field.getName(), fields)
	}

	return fieldsByName
}

function collectSignatureDraw(
	document: PDFDocument,
	fieldsByName: Map<string, PDFTextField[]>,
	fieldName: string,
	encoded: string
): SignatureDraw | null {
	if (!encoded) return null

	try {
		const signature = Signature.deserializeFromString(
			encoded,
			Encoding.Z85,
			SIGNATURE_CANVAS
		)

		if (signature.isEmpty()) return null

		const svgWidth = SIGNATURE_CANVAS.canvasWidth
		const svgHeight = SIGNATURE_CANVAS.canvasHeight
		const svg = signature.render(Format.SVG, {
			contentFit: true,
			height: svgHeight,
			width: svgWidth
		})

		const paths = [...svg.matchAll(/<path d="([^"]+)"/g)].map(m => m[1])

		if (paths.length === 0) return null

		for (const field of fieldsByName.get(fieldName) ?? []) {
			const widget = field.acroField.getWidgets()[0]
			if (!widget) continue

			const pageRef: PDFRef | undefined = widget.P()
			const page = document
				.getPages()
				.find(candidate => candidate.ref === pageRef)

			if (!page) continue

			return {
				page,
				paths,
				rect: widget.getRectangle(),
				svgHeight,
				svgWidth
			}
		}
	} catch (error) {
		console.error(
			'Firma inválida, se omite en el PDF: ',
			error instanceof Error ? error.message : String(error)
		)
	}

	return null
}

export async function fillVisitPDFTemplate(
	visit: VisitToPrint,
	template: ArrayBuffer
): Promise<Uint8Array | null> {
	const document = await PDFDocument.load(template)
	const form = document.getForm()
	const fieldsByName = getFieldMap(form)

	const setText = (name: string, value: string, fontSize?: number) => {
		for (const field of fieldsByName.get(name) ?? []) {
			if (fontSize !== undefined) field.setFontSize(fontSize)
			field.setText(value)
		}
	}

	const technicianNames = visit.technicians.map(t => t.name).join(' / ')
	const technicianData = visit.technicians
		.map(t => `${t.email} - ${t.phone}`)
		.join(' / ')

	setText('nombre_tecnico', technicianNames, 10)
	setText('email_telefono_tecnico', technicianData, 10)
	setText('fecha_visita', dayjs(visit.date).format('DD/MM/YYYY'), 10)
	setText('nombre_cliente', visit.client, 10)
	setText('sector', visit.sector, 10)
	setText('contacto_cliente', visit.contact_client, 10)

	for (let index = 0; index < MAX_MACHINES; index++) {
		const machine = visit.machines[index]
		if (!machine) continue

		setText(`codigo_${index}`, machine.serial_number, 8)
		setText(`marca_${index}`, machine.manufacturer, 8)
		setText(`modelo_${index}`, machine.model, 8)
	}

	for (const field of fieldsByName.get('descripcion') ?? []) {
		field.enableMultiline()
	}

	setText('descripcion', visit.register_description, 11)
	setText('aclaracion_firmante', visit.client_signer, 10)

	const signatureDraws = [
		collectSignatureDraw(
			document,
			fieldsByName,
			'firma_tecnico',
			visit.technician_signature
		),
		collectSignatureDraw(
			document,
			fieldsByName,
			'firma_cliente',
			visit.client_signature
		)
	].filter((draw): draw is SignatureDraw => draw !== null)

	form.flatten()

	for (const draw of signatureDraws) {
		const scale = Math.min(
			draw.rect.width / draw.svgWidth,
			draw.rect.height / draw.svgHeight
		)
		const x = draw.rect.x + (draw.rect.width - draw.svgWidth * scale) / 2
		const y = draw.rect.y + (draw.rect.height + draw.svgHeight * scale) / 2

		for (const path of draw.paths) {
			draw.page.drawSvgPath(path, {
				borderColor: rgb(0, 0, 0),
				borderWidth: SIGNATURE_BORDER_WIDTH,
				scale,
				x,
				y
			})
		}
	}

	return await document.save()
}
