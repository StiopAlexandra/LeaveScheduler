import React from 'react'
import { useTranslation } from "react-i18next"

const Settings = () => {
    //“<Trans i18nKey="Drop receipt here <br/>or <u>upload file</u>" components={{ u: <u /> }} />

    const { t, i18n } = useTranslation();

    return(
        <div>
            Settings
        </div>
    )
}

export default Settings