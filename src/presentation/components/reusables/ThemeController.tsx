import type { FC } from 'hono/jsx'

const ThemeController: FC = () => {
	return (
		<label class='flex cursor-pointer gap-2 items-center w-fit mr-auto'>
			<svg
				aria-label='sun'
				fill='none'
				height='20'
				stroke='currentColor'
				stroke-linecap='round'
				stroke-linejoin='round'
				stroke-width='2'
				viewBox='0 0 24 24'
				width='20'
				xmlns='http://www.w3.org/2000/svg'
			>
				<circle
					cx='12'
					cy='12'
					r='5'
				/>
				<path d='M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4' />
			</svg>
			<input
				class='toggle w-[25px] h-[10px]'
				onchange="var t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t"
				type='checkbox'
			/>
			<svg
				aria-label='moon'
				fill='none'
				height='20'
				stroke='currentColor'
				stroke-linecap='round'
				stroke-linejoin='round'
				stroke-width='2'
				viewBox='0 0 24 24'
				width='20'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'></path>
			</svg>
		</label>
	)
}

export default ThemeController
