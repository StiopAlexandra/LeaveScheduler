import React from 'react'
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { t } = useTranslation();

    return(
        <div>
            {t('Dashboard')}
        </div>
    )
}

export default Dashboard