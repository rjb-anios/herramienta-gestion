import { env } from 'cloudflare:workers'
import { PDFDocument } from '@cantoo/pdf-lib'
import type { VisitToPrint } from '@core/entities/Visit'

export async function generateRegVisitPDF(
	visit: VisitToPrint | null
): Promise<Uint8Array<ArrayBufferLike> | null> {
	if (!visit) return null

	const pdf = await env.KV.get('reg07.pdf', 'arrayBuffer')

	if (!pdf) return null

	const document = await PDFDocument.load(pdf)

	const form = document.getForm()

	const technicianName = form.getTextField('nombre_tecnico')
	const technicianData = form.getTextField('email_telefono_tecnico')
	const visitDate = form.getTextField('fecha_visita')
	const description = form.getTextField('descripcion')
	const allFields = form.getFields()
	const codesMachines = allFields.filter(e => {
		return e.getName().includes('codigo')
	})

	console.log(codesMachines)

	description.enableMultiline()

	visitDate.setFontSize(10)
	technicianName.setFontSize(10)
	technicianData.setFontSize(10)
	description.setFontSize(13)

	technicianName.setText(visit.technicians.map(t => t.name).join(' / '))

	technicianData.setText(
		visit.technicians.map(t => `${t.email} - ${t.phone}`).join(' / ')
	)

	visitDate.setText(visit.date)

	description.setText(visit.register_description)

	form.flatten()

	const pdfBytes = await document.save()
	return pdfBytes
}
