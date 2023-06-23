import React from 'react'

import { ApolloErrorHandler, ErrorBoundary } from '../../components/Error'

const ErrorHandlerProvider = ({ children }) => {
	return (
		<ErrorBoundary>
			<ApolloErrorHandler>{children}</ApolloErrorHandler>
		</ErrorBoundary>
	)
}

export default ErrorHandlerProvider
