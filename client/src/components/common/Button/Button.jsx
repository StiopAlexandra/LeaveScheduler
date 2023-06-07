import { Button as MuiButton, CircularProgress } from '@mui/material'
import clsx from 'clsx'
import * as PropTypes from 'prop-types'
import React, { memo, forwardRef } from 'react'

//import useCountDown from '@/hooks/useCountDown'

const Button = forwardRef((props, ref) => {
	const {
		children,
		loading,
		color,
		disabled,
		countDown = 0,
		sx,
		className,
		...buttonProps
	} = props
	//const timeLeft = useCountDown(countDown)
	const timeLeft = 0

	return (
		<MuiButton
			ref={ref}
			color={color}
			{...buttonProps}
			sx={{
				...sx,
			}}
			className={clsx([
				{
					['loading']: loading,
				},
				className,
			])}
			disabled={disabled || loading || timeLeft > 0}
		>
			{timeLeft ? `${children} (${timeLeft})` : children}
			{loading && (
				<CircularProgress
					size={20}
					color={color}
					sx={{
						position: 'absolute',
						m: 'auto',
						left: 0,
						right: 0,
						top: 0,
						bottom: 0,
					}}
				/>
			)}
		</MuiButton>
	)
})

Button.displayName = 'Button'

Button.propTypes = {
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
	loading: PropTypes.bool,
	disabled: PropTypes.bool,
	countDown: PropTypes.number,
	color: PropTypes.string,
	sx: PropTypes.object,
	className: PropTypes.string,
}

export default memo(Button)
