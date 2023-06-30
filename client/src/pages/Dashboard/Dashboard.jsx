import { useQuery } from '@apollo/client';
import { styled, Typography, Grid } from '@mui/material';
import { getYear } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';

import GetCompanyLeaves from '../../data/queries/GetCompanyLeaves';
import GetLeaveTypes from '../../data/queries/GetLeaveTypes';
import GetUser from '../../data/queries/GetUser';
import GetUserLeaves from '../../data/queries/GetUserLeaves';
import GetUsersDashboard from '../../data/queries/GetUsersDashboard';

import BirthdayCalendar from './BirthdayCalendar';
import DepartmentChart from './DepartmentChart';
import EmployeeChart from './EmployeeChart';
import HistoryTable from './HistoryTable';
import HolidayChart from './HolidayChart';
import NextLeave from './NextLeave';

const PREFIX = 'Dashboard';
const classes = {
  hello: `${PREFIX}-hello`,
  grid: `${PREFIX}-grid`
};

const StyledContainer = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '35px',
  borderRadius: '10px',
  boxSizing: 'border-box',
  background: theme.palette.background.default,
  [theme?.breakpoints.up('md')]: {
    maxWidth: '1100px',
    padding: '40px 30px'
  },
  [theme?.breakpoints.down('md')]: {
    width: '100%',
    padding: '30px 20px'
  },
  [`& .${classes.hello}`]: {
    background: `${theme.palette.background.paper}`,
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '35px'
  },
  [`& .${classes.grid}`]: {
    [theme?.breakpoints.up('md')]: {
      flexDirection: 'row'
    },
    [theme?.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  }
}));

const Dashboard = ({ id: userId }) => {
  const { t } = useTranslation();

  const { data: dataName } = useQuery(GetUser, {
    variables: {
      id: userId
    },
    fetchPolicy: 'network-only'
  });
  const user = dataName?.getUser;

  const { data: usersData } = useQuery(GetUsersDashboard, {
    fetchPolicy: 'network-only'
  });

  const users = usersData?.getUsers || [];

  const { data } = useQuery(GetLeaveTypes, {
    fetchPolicy: 'network-only'
  });

  const leaveTypes = data?.getLeaveTypes?.filter((item) => item.name !== 'Public Holiday') || [];

  const { data: companyData } = useQuery(GetCompanyLeaves, {
    fetchPolicy: 'network-only'
  });

  const companyLeaves = companyData?.getCompanyLeaves || [];

  const currentYearCompanyLeaves = companyLeaves.filter(
    ({ startDate }) => getYear(new Date()) === getYear(new Date(startDate))
  );

  const { data: userData } = useQuery(GetUserLeaves, {
    variables: {
      filter: {
        user: userId,
        status: 'accepted'
      }
    },
    fetchPolicy: 'network-only'
  });

  const userLeaves = userData?.getUserLeaves || [];

  const currentYearUserLeaves = userLeaves.filter(
    ({ startDate }) => getYear(new Date()) === getYear(new Date(startDate))
  );

  const nextPublicLeave = currentYearCompanyLeaves
    .filter(({ startDate }) => new Date(startDate) > new Date())
    .map((item) => {
      return {
        startDate: item.startDate,
        endDate: item.endDate,
        type: item.leaveType.name,
        color: item.leaveType.color
      };
    });
  const nextUserLeave = currentYearUserLeaves
    .filter(({ startDate }) => new Date(startDate) > new Date())
    .map((item) => {
      return {
        startDate: item.startDate,
        endDate: item.endDate,
        type: item.leaveType.name,
        color: item.leaveType.color
      };
    });

  var nextLeave = [...nextPublicLeave, ...nextUserLeave].sort(function (a, b) {
    return new Date(b.startDate) - new Date(a.startDate);
  });

  const history = [];
  const groupTaken = [];

  currentYearUserLeaves.forEach(({ leaveType, days }) => {
    const { name } = leaveType;
    if (!groupTaken[name]) {
      groupTaken[name] = [];
    }
    groupTaken[name].push({
      days
    });
  });
  leaveTypes.forEach(({ name, allowanceDays, color }) => {
    let taken = 0;
    for (let [key, value] of Object.entries(groupTaken)) {
      if (key === name) {
        taken = value.reduce((acc, { days }) => {
          return acc + days;
        }, 0);
      }
    }
    history.push({
      name,
      color,
      days: taken,
      available: allowanceDays ? allowanceDays - taken : '-',
      allowanceDays: allowanceDays || '-'
    });
  });

  const holiday = history.find((item) => item.name === 'Holiday');

  return (
    <StyledContainer>
      <Grid container spacing={3.5} className={classes.grid}>
        <Grid item xs={12} md={7}>
          <div className={classes.hello}>
            <Typography variant={'h5'} align={'center'}>
              <span>&#128075;</span>
              {' ' + t('Hello') + ', ' + user?.name + '!'}
            </Typography>
          </div>
          <HistoryTable history={history} />
        </Grid>
        <Grid item xs={12} md={5}>
          <HolidayChart holiday={holiday} />
          <NextLeave nextLeave={nextLeave[0]} />
        </Grid>
      </Grid>

      <Grid container spacing={3.5} className={classes.grid}>
        <Grid item xs={12} md={5}>
          <DepartmentChart users={users} />
          <EmployeeChart users={users} />
        </Grid>
        <Grid item xs={12} md={7}>
          <BirthdayCalendar users={users} />
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default Dashboard;
