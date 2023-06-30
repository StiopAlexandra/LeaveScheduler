import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { isAuthenticated } from '../utils/isAuthenticated';

const RootLayout = () => {
  const location = useLocation();

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RootLayout;
