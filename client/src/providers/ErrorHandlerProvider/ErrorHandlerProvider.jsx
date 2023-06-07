import React from 'react'

import { ErrorBoundary } from '../../components/Error'

const ErrorHandlerProvider = ({ children }) => {
	return (
		<ErrorBoundary>
			{children}
		</ErrorBoundary>
	)
}

export default ErrorHandlerProvider
