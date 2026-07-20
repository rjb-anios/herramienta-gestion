import { PDFDocument } from '@cantoo/pdf-lib'
import { Hono } from 'hono'
import type { Env } from 'src/env'

const prueba = new Hono<Env>()

prueba.get('/', async c => {
	const pdf = await c.env.KV.get('reg07.pdf', 'arrayBuffer')

	if (!pdf) {
		return c.json({ message: 'PDF no encontrado' })
	}

	const document = await PDFDocument.load(pdf)

	const form = document.getForm()

	const technicianName = form.getTextField('nombre_tecnico')
	const technicianData = form.getTextField('email_telefono_tecnico')
	const visitDate = form.getTextField('fecha_visita')
	const description = form.getTextField('descripcion')

	description.enableMultiline()

	visitDate.setFontSize(10)
	technicianName.setFontSize(10)
	technicianData.setFontSize(10)
	description.setFontSize(13)

	technicianName.setText('Técnico')
	technicianData.setText('ejemplo@email.com / 99000011')
	visitDate.setText('20/07/2026')
	description.setText('')

	form.flatten()

	const pdfBytes = await document.save()

	return new Response(pdfBytes as BodyInit, {
		headers: {
			'Content-Disposition': 'inline; filename="prueba.pdf"',
			'Content-Type': 'application/pdf'
		}
	})
})

export default prueba
