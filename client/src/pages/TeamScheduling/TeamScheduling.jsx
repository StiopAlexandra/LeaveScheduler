import { useQuery } from '@apollo/client';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styled, Tab, Tabs, tabsClasses, Typography, IconButton } from '@mui/material';
import {
  getMonth,
  getDaysInMonth,
  getYear,
  addMonths,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth
} from 'date-fns';
import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link as RouterLink, useParams } from 'react-router-dom';

import GetUsersLeaves from '../../data/queries/GetUsersLeaves';
import { months } from '../../data/static/constants';

import GroupTable from './GroupTable';
import UngroupTable from './UngroupTable';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  [`& .${tabsClasses.flexContainer}`]: {
    [theme?.breakpoints.up('sm')]: {
      gap: theme?.spacing(1.5)
    },
    [theme?.breakpoints.down('sm')]: {
      gap: 0
    }
  }
}));

const StyledTitle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '15px'
}));

const TeamScheduling = () => {
  const [date, setQueryDate] = useState(new Date());
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { type = 'ungroup' } = useParams();

  useEffect(() => {
    navigate('/team-scheduling/ungroup');
  }, []);

  const { data } = useQuery(GetUsersLeaves, {
    fetchPolicy: 'network-only'
  });

  const usersLeaves = data?.getUsers || [];

  const currentYearUserLeaves = usersLeaves.map(({ userLeave, ...rest }) => {
    const userLeaveFiltered = userLeave.filter(
      ({ startDate, status }) =>
        status === 'accepted' &&
        getYear(date) === getYear(new Date(startDate)) &&
        getMonth(date) === getMonth(new Date(startDate))
    );
    return {
      userLeave: userLeaveFiltered,
      ...rest
    };
  });

  const handleDateChange = useCallback(
    (direction) => {
      if (direction === 'prev') {
        setQueryDate((prev) => addMonths(new Date(prev), -1));
      }
      if (direction === 'next') {
        setQueryDate((prev) => addMonths(new Date(prev), 1));
      }
    },
    [setQueryDate]
  );

  const daysOfMounth = eachDayOfInterval({
    start: startOfMonth(new Date(date)),
    end: endOfMonth(new Date(date))
  });

  const days = getDaysInMonth(new Date(date));

  const daysInMonth = Array.from(Array(days + 1).keys());

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <StyledTitle>
        <IconButton data-trackid="prev-button" onClick={() => handleDateChange('prev')}>
          <ArrowBackOutlinedIcon />
        </IconButton>
        <Typography variant={'h4'}>
          {t(`${months[getMonth(date)]}`)} {`${getYear(date)}`}
        </Typography>
        <IconButton data-trackid="next-button" onClick={() => handleDateChange('next')}>
          <ArrowForwardIcon />
        </IconButton>
      </StyledTitle>
      <div style={{ marginTop: '20px' }}>
        <StyledTabs scrollButtons={false} value={type} centered={true}>
          <Tab
            component={RouterLink}
            to={`/team-scheduling/ungroup`}
            label={t('Ungroup')}
            value={'ungroup'}
          />
          <Tab
            component={RouterLink}
            to={`/team-scheduling/group`}
            label={t('Departments')}
            value={'group'}
          />
        </StyledTabs>
        {type === 'group' && (
          <GroupTable
            daysInMonth={daysInMonth}
            daysOfMounth={daysOfMounth}
            currentYearUserLeaves={currentYearUserLeaves}
          />
        )}
        {type === 'ungroup' && (
          <UngroupTable
            daysInMonth={daysInMonth}
            daysOfMounth={daysOfMounth}
            currentYearUserLeaves={currentYearUserLeaves}
          />
        )}
      </div>
    </div>
  );
};

export default TeamScheduling;
