import { GlobalStyles as MUIGlobalStyles } from '@mui/material';
import { lighten, alpha, darken, useTheme } from '@mui/material'

export default function GlobalStyles() {
    const theme = useTheme();
    const inputGlobalStyles = (
        <MUIGlobalStyles
            styles={{
                '.fc-multimonth-daygrid': {
                    background: `${theme.palette.background.default}!important`,
                },
                '.fc-multimonth-header': {
                    background: `${theme.palette.background.paper}!important`,
                },
                '.fc-day-disabled': {
                    background: `${theme.palette.background.neutral}!important`,
                },
                '.fc-multiMonthYear-view': {
                    background: `${theme.palette.background.paper}!important`,
                },
                '.fc-today-button':{
                    marginRight: '30.56px !important',
                    backgroundColor: '#26c644 !important',
                    borderColor: '#26c644 !important',
                    '&:focus': {
                        boxShadow: 'none !important',
                        backgroundColor: `${darken(theme.palette.primary.main, 0.04)}!important`,
                    }
                },
                '.fc-next-button':{
                    '&:focus': {
                        boxShadow: 'none !important',
                    }
                },
                '.fc-prev-button':{
                    '&:focus': {
                        boxShadow: 'none !important',
                    }
                },
                '.fc-day-today':{
                    backgroundColor: `${alpha(theme.palette.primary.main, 0.5)}!important`,
                },
                '.fc-highlight ':{
                    backgroundColor: `${alpha(theme.palette.primary.main, 0.16)}!important`,
                },
                '*': {
                    boxSizing: 'content-box',
                },
                html: {
                    margin: 0,
                    padding: 0,
                    width: '100%',
                    height: '100%',
                    WebkitOverflowScrolling: 'touch',
                },
                body: {
                    margin: 0,
                    padding: 0,
                    width: '100%',
                    height: '100%',
                },
                '#root': {
                    width: '100%',
                    height: '100%',
                },
                input: {
                    '&[type=number]': {
                        MozAppearance: 'textfield',
                        '&::-webkit-outer-spin-button': {
                            margin: 0,
                            WebkitAppearance: 'none',
                        },
                        '&::-webkit-inner-spin-button': {
                            margin: 0,
                            WebkitAppearance: 'none',
                        },
                    },
                },
                img: {
                    display: 'block',
                    maxWidth: '100%',
                },
                ul: {
                    margin: 0,
                    padding: 0,
                },
            }}
        />
    );

    return inputGlobalStyles;
}
