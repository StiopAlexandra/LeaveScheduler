import React, { useState, useCallback, useMemo } from 'react';

import ConfigsContext from '../../contexts/ConfigsContext';

const ConfigsProvider = ({ children, appConfigs }) => {
  const [companySettings, setCompanySettings] = useState({
    dateFormat: 'd/MM/Y',
    timeFormat: 'h:i a',
    weekStart: 1,
    workingDays: [1, 2, 3, 4, 5]
  });

  const [mode, setMode] = useState(localStorage.getItem('theme') || 'light');

  const [lng, setLng] = useState(localStorage.getItem('lng') || 'en');

  const changeTheme = useCallback(
    (mode) => {
      localStorage.setItem('theme', mode);
      setMode(mode);
    },
    [setMode]
  );

  const changeLng = useCallback(
    (lng) => {
      localStorage.setItem('lng', lng);
      setLng(lng);
    },
    [setLng]
  );

  const contextValue = useMemo(
    () => ({
      ...appConfigs,
      mode,
      changeTheme,
      lng,
      changeLng,
      companySettings,
      setCompanySettings
    }),
    [appConfigs, mode, changeTheme, lng, changeLng, companySettings, setCompanySettings]
  );

  return <ConfigsContext.Provider value={contextValue}>{children}</ConfigsContext.Provider>;
};

export default ConfigsProvider;
