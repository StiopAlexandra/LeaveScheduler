import { Typography } from '@mui/material'
import React, { Component } from 'react'
class ErrorBoundary extends Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError() {
		// Update state so the next render will show the fallback UI.
		return { hasError: true }
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<Typography>
					Sorry, something went wrong here! Please try again later.
				</Typography>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary
