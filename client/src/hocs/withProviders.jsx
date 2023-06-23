import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import ThemeProvider from '../providers/ThemeProvider'
import TranslationProvider from '../providers/TranslationProvider'
import ApolloClientProvider from "../providers/ApolloClientProvider";
import ConfigsProvider from "../providers/ConfigsProvider";
import ErrorHandlerProvider from "../providers/ErrorHandlerProvider";
import UserProvider from "../providers/UserProvider";
import history from "../utils/history";
import LocalizationProvider from "../providers/LocalizationProvider";

const withProviders = (Component) => {
    const AppProviders = ({appConfigs}) => {
        const {
            httpEndPoint,
            authToken,
            authUser,
            ...componentProps
        } = appConfigs

        return (
            <React.StrictMode>
                <ConfigsProvider appConfigs={appConfigs}>
                    <TranslationProvider>
                        <ThemeProvider>
                            <ErrorHandlerProvider>
                                <ApolloClientProvider httpEndPoint={httpEndPoint} authToken={authToken}>
                                    <Router history={history}>
                                        <UserProvider authToken={authToken} authUser={authUser}>
                                            <LocalizationProvider>
                                                <Component {...componentProps} />
                                            </LocalizationProvider>
                                        </UserProvider>
                                    </Router>
                                </ApolloClientProvider>
                            </ErrorHandlerProvider>
                        </ThemeProvider>
                    </TranslationProvider>
                </ConfigsProvider>
            </React.StrictMode>
        )
    }

    return AppProviders
}

export default withProviders
