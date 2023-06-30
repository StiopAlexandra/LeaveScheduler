import React, { Suspense } from 'react';
import { render } from 'react-dom';

import _App from './App';
import { appConfigs } from './config';
import withProviders from './hocs/withProviders';
import { ReactComponent as LogoDark } from './resources/icons/logo-dark.svg';
import { ReactComponent as LogoLight } from './resources/icons/logo-light.svg';

const App = withProviders(_App);

const mode = localStorage.getItem('theme') || 'light';

const rootElement = document.querySelector('#root');
render(
  <Suspense
    fallback={
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        {mode === 'light' ? <LogoLight /> : <LogoDark />}
      </div>
    }>
    <App appConfigs={appConfigs} />
  </Suspense>,
  rootElement
);
