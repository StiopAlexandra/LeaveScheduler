import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import ApolloClientProvider from '../providers/ApolloClientProvider';
import ConfigsProvider from '../providers/ConfigsProvider';
import ErrorHandlerProvider from '../providers/ErrorHandlerProvider';
import LocalizationProvider from '../providers/LocalizationProvider';
import ThemeProvider from '../providers/ThemeProvider';
import TranslationProvider from '../providers/TranslationProvider';
import UserProvider from '../providers/UserProvider';
import history from '../utils/history';

const withProviders = (Component) => {
  const AppProviders = ({ appConfigs }) => {
    const { httpEndPoint, wsEndPoint, authToken, authUser, ...componentProps } = appConfigs;

    return (
      <React.StrictMode>
        <ConfigsProvider appConfigs={appConfigs}>
          <TranslationProvider>
            <ThemeProvider>
              <ErrorHandlerProvider>
                <ApolloClientProvider
                  wsEndPoint={wsEndPoint}
                  httpEndPoint={httpEndPoint}
                  authToken={authToken}>
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
    );
  };

  return AppProviders;
};

export default withProviders;
