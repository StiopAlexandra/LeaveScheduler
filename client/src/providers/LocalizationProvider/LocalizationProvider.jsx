import React, {useContext} from 'react'
import ro from 'date-fns/locale/ro';
import enGB from 'date-fns/locale/en-GB';
import {LocalizationProvider as DatePickerProvider} from '@mui/x-date-pickers/LocalizationProvider';

import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import ConfigsContext from "../../contexts/ConfigsContext";

const locales = {'en': enGB, 'ro': ro};

const LocalizationProvider = ({children}) => {
    const {lng} = useContext(ConfigsContext);

    return (
        <DatePickerProvider dateAdapter={AdapterDateFns} adapterLocale={locales[lng]}>
            {children}
        </DatePickerProvider>
    )
}

export default LocalizationProvider
