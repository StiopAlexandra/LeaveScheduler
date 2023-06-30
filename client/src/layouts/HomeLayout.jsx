import { styled } from '@mui/material';
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import useOpenState from '../hooks/useOpenState';
import { isAuthenticated } from '../utils/isAuthenticated';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const Main = styled('div')(({ theme }) => ({
  //flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  width: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  padding: theme.spacing(8.4, 1, 2),
  background: theme.palette.background.paper,
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const HomeLayout = ({ pages }) => {
  const { open, onShow, onClose } = useOpenState();
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <StyledRoot>
      <Header onShow={onShow} />
      <Sidebar pages={pages} open={open} onClose={onClose} />
      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  );
};

export default HomeLayout;
