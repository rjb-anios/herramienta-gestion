import RegVisit from '@presentation/components/visits/RegVisit'
import VisitsTable from '@presentation/components/visits/VisitsTable'
import { render } from 'hono/jsx/dom'

const COMPONENTS: Record<string, any> = {
	RegVisit,
	VisitsTable
}

const islands = document.querySelectorAll('.hono-island')

const hydrate = (): void => {
	islands.forEach(root => {
		if (!(root instanceof HTMLElement)) return

		const name = root.dataset.component
		const rawProps = root.dataset.props

		if (name !== undefined && name in COMPONENTS) {
			const Component = COMPONENTS[name]
			const props = JSON.parse(rawProps ?? '{}')

			render(<Component {...props} />, root)
		}
	})
}

document.addEventListener('click', (e: MouseEvent) => {
	const target = (e.target as HTMLElement).closest('[data-dialog-id]')
	if (!target) return

	const dialogId = target.getAttribute('data-dialog-id')
	if (!dialogId) return

	const dialog = document.getElementById(dialogId)
	if (dialog instanceof HTMLDialogElement) {
		dialog.showModal()
	}
})

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', hydrate)
} else {
	hydrate()
}
