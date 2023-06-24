import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import ErrorContext from '../../contexts/ErrorContext'
import Alert from "../common/Alert/Alert";


const ApolloErrorHandler = ({ children }) => {
	const { t } = useTranslation()
	const [error, setError] = useState({})
	const { networkError, graphQLErrors = [] } = error
	let errorAlert = null
	let messages = []

	const onClose = useCallback(() => {
		setError({})
	}, [setError])

	const internalErrors = graphQLErrors.filter(
		({ extensions: { code } = {} }) => code === 'INTERNAL_SERVER_ERROR'
	)

	if (internalErrors.length) {
		internalErrors.forEach(({ message }) => {
			messages.push(message)
		})
		errorAlert = <Alert severity={'error'} onClose={onClose} messages={messages} duration={6000}/>
	} else {
		if(networkError || graphQLErrors.length){
			messages.push('An error has occurred. Please try again later.')
			errorAlert = <Alert severity={'error'} onClose={onClose} messages={messages} duration={6000}/>
		}
	}

	return (
		<ErrorContext.Provider value={{ setError, error }}>
			{errorAlert}
			{children}
		</ErrorContext.Provider>
	)
}

export default ApolloErrorHandler
