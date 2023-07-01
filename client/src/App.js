import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CalendarViewMonthOutlinedIcon from '@mui/icons-material/CalendarViewMonthOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import React, { useContext, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import UserContext from './contexts/UserContext';
import HomeLayout from './layouts/HomeLayout';
import Company from './pages/Company';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Employee from './pages/Employees/Employee';
import ForgotPassword from './pages/ForgotPassword';
import MyLeaves from './pages/MyLeaves';
import Reports from './pages/Reports';
import Requests from './pages/Requests';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import TeamScheduling from './pages/TeamScheduling';
import { getPageRoutePath } from './utils/path';

const employeePages = [
  { name: 'Dashboard', Page: Dashboard, icon: <HomeOutlined /> },
  { name: 'My Leaves', Page: MyLeaves, icon: <EventAvailableOutlinedIcon /> },
  { name: 'Team Scheduling', Page: TeamScheduling, icon: <CalendarViewMonthOutlinedIcon /> }
];

const adminPages = [
  ...employeePages,
  { name: 'Employees', Page: Employees, icon: <PeopleAltOutlinedIcon /> },
  { name: 'Requests', Page: Requests, icon: <PendingActionsOutlinedIcon /> },
  { name: 'Reports', Page: Reports, icon: <AssessmentOutlinedIcon /> },
  { name: 'Company', Page: Company, icon: <BusinessOutlinedIcon /> }
];

const App = () => {
  const context = useContext(UserContext);
  const id = context?.user?._id;

  const pages = useMemo(() => {
    return context?.user?.manager ? adminPages : employeePages;
  }, [context?.user?.manager]);

  return (
    <Routes>
      <Route path="/" element={<HomeLayout pages={pages} />}>
        {pages.map(({ name, Page }, index) => {
          return <Route path={getPageRoutePath({ name })} element={<Page id={id} />} key={index} />;
        })}
        <Route path="/employees/:id/:type" element={<Employee />} />
        <Route path="/company/:type" element={<Company />} />
        <Route path="/requests/:type" element={<Requests id={id} />} />
        <Route path="/team-scheduling/:type" element={<TeamScheduling />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/settings" element={<Settings id={id} />} />
      </Route>
      <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
