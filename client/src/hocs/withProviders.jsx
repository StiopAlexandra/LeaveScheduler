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
        <ConfigsProvider>
          <TranslationProvider>
            <LocalizationProvider>
              <ThemeProvider>
                <Router history={history}>
                  <ErrorHandlerProvider>
                    <ApolloClientProvider
                      wsEndPoint={wsEndPoint}
                      httpEndPoint={httpEndPoint}
                      authToken={authToken}>
                      <UserProvider authToken={authToken} authUser={authUser}>
                        <Component {...componentProps} />
                      </UserProvider>
                    </ApolloClientProvider>
                  </ErrorHandlerProvider>
                </Router>
              </ThemeProvider>
            </LocalizationProvider>
          </TranslationProvider>
        </ConfigsProvider>
      </React.StrictMode>
    );
  };

  return AppProviders;
};

export default withProviders;
