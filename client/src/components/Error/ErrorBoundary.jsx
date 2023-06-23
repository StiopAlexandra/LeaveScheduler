import { withTranslation } from 'react-i18next'
import React, { Component } from 'react'
import MessageBox from "./MessageBox";
import { Typography } from '@mui/material'

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
		const { t } = this.props

		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<MessageBox
					message={
						<Typography>
							{t('Sorry, something went wrong here!')}
							<br />
							{t('Please try again later.')}
						</Typography>
					}
					onClose={() => this.setState({ hasError: false })}
				/>
			)
		}

		return this.props.children
	}
}

export default withTranslation()(ErrorBoundary)
