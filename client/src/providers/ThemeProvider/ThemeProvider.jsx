import { CssBaseline } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import React, { useContext } from 'react';

import ConfigsContext from '../../contexts/ConfigsContext';
import GlobalStyles from '../../theme/globalStyles';
import getTheme from '../../theme/themeDefault';
const ThemeProvider = ({ children }) => {
  const { mode } = useContext(ConfigsContext);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeProvider;
