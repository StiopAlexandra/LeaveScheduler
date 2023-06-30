import { GlobalStyles as MUIGlobalStyles } from '@mui/material';
import { alpha, useTheme } from '@mui/material';

export default function GlobalStyles() {
  const theme = useTheme();
  const inputGlobalStyles = (
    <MUIGlobalStyles
      styles={{
        '.fc-multimonth-daygrid': {
          background: `${theme.palette.background.default}!important`
        },
        '.fc-multimonth-header': {
          background: `${theme.palette.background.paper}!important`
        },
        '.fc-day-disabled': {
          background: `${theme.palette.background.neutral}!important`
        },
        '.fc-multiMonthYear-view': {
          borderRadius: '10px!important',
          background: `${theme.palette.background.paper}!important`
        },
        '.fc-day-today': {
          backgroundColor: `${alpha(theme.palette.primary.main, 0.4)}!important`
        },
        '.fc-highlight ': {
          backgroundColor: `${alpha(theme.palette.primary.main, 0.16)}!important`
        },
        '*': {
          boxSizing: 'content-box'
        },
        html: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch'
        },
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%'
        },
        '#root': {
          width: '100%',
          height: '100%'
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none'
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none'
            }
          }
        },
        img: {
          display: 'block',
          maxWidth: '100%'
        },
        ul: {
          margin: 0,
          padding: 0
        }
      }}
    />
  );

  return inputGlobalStyles;
}
