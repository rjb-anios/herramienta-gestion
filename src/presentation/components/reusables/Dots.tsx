import type { FC, PropsWithChildren } from 'hono/jsx'

const Dots: FC<
	PropsWithChildren<{ id?: string; dialogId?: string }>
> = ({ id, dialogId }) => {
	return (
		<button
			class='btn outline-none shadow-none cursor-pointer'
			data-dialog-id={dialogId ?? undefined}
			popovertarget={dialogId ? undefined : id}
			type='button'
		>
			<svg
				aria-label='Opciones | Detalles'
				class='mx-auto size-12'
				fill='currentColor'
				viewBox='0 0 16 16'
			>
				<path d='M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3' />
			</svg>
		</button>
	)
}

export default Dots
