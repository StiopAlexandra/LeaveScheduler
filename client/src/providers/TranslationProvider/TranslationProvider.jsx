import React, {useContext, useEffect} from 'react'
import i18n from '../../i18n'
import { I18nextProvider } from 'react-i18next'
import ConfigsContext from "../../contexts/ConfigsContext";

const TranslationProvider = ({ children }) => {
    const {lng} = useContext(ConfigsContext);
    useEffect(() => {
        i18n.changeLanguage(lng);
    }, [lng, i18n]);

    return <I18nextProvider i18n={ i18n }>{children}</I18nextProvider>
}

export default TranslationProvider
