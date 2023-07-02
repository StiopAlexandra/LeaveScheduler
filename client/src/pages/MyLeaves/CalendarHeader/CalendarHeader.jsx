import { useQuery } from '@apollo/client';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, IconButton, styled, Typography } from '@mui/material';
import { getYear } from 'date-fns';
import { compareAsc } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import GetLeaveTypes from '../../../data/queries/GetLeaveTypes';

import PendingRequestTable from './PendingRequestTable/PendingRequestTable';
import UserLeavesTable from './UserLeavesTable';

const PREFIX = 'LeavesHeader';
const classes = {
  year: `${PREFIX}-year`,
  row: `${PREFIX}-rox`,
  grid: `${PREFIX}-grid`,
  table: `${PREFIX}-table`,
  pendingTable: `${PREFIX}-pendingTable`,
  chart: `${PREFIX}-chart`
};

const StyledHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  [`& .${classes.row}`]: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  [`& .${classes.grid}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme?.spacing(3.5),
    [theme?.breakpoints.up('md')]: {
      padding: theme?.spacing(4, 3)
    },
    [theme?.breakpoints.down('md')]: {
      padding: theme?.spacing(3, 1)
    }
  },
  [`& .${classes.table}`]: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    [theme?.breakpoints.up('md')]: {
      width: '715px'
    },
    [theme?.breakpoints.down('md')]: {
      width: '100%'
    }
  },
  [`& .${classes.pendingTable}`]: {
    [theme?.breakpoints.up('md')]: {
      width: '815px'
    },
    [theme?.breakpoints.down('md')]: {
      width: '100%'
    },
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [`& .${classes.chart}`]: {},
  [`& .${classes.year}`]: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    [theme?.breakpoints.up('sm')]: {
      marginRight: '53px'
    }
  }
}));

const CalendarHeader = ({ calendarRef, onShowAdd, userLeaves, requests, refetch }) => {
  const { t } = useTranslation();

  const [date, setDate] = useState(calendarRef.current?.getApi().getDate());

  useEffect(() => {
    const calApi = calendarRef.current?.getApi();

    if (calApi) {
      setDate(calApi.getDate());
    }
  }, [calendarRef]);

  const currentYearRequests = requests.filter(
    ({ startDate }) => getYear(date) === getYear(new Date(startDate))
  );
  const currentYearUserLeaves = userLeaves.filter(
    ({ startDate }) => getYear(date) === getYear(new Date(startDate))
  );
  const pastUserLeaves = currentYearUserLeaves.filter(
    ({ startDate, endDate }) =>
      compareAsc(new Date(startDate), new Date()) < 0 &&
      compareAsc(new Date(endDate), new Date()) < 0
  );
  const upcomingUserLeaves = currentYearUserLeaves.filter(
    ({ startDate, endDate }) =>
      compareAsc(new Date(startDate), new Date()) >= 0 ||
      compareAsc(new Date(endDate), new Date()) >= 0
  );

  const handleDateChange = (direction) => {
    const calApi = calendarRef.current?.getApi();
    if (calApi) {
      if (direction === 'prev') {
        calApi.prev();
      } else if (direction === 'next') {
        calApi.next();
      } else {
        calApi.today();
      }

      setDate(calApi.getDate());
    }
  };

  return (
    <StyledHeader>
      <div className={classes.row}>
        <Button color={'primary'} variant={'contained'} onClick={onShowAdd}>
          {t('Send Request')}
        </Button>
        <div className={classes.year}>
          <IconButton data-trackid="prev-button" onClick={() => handleDateChange('prev')}>
            <ArrowBackOutlinedIcon />
          </IconButton>
          <Typography variant={'h4'}>{`${getYear(date)}`}</Typography>
          <IconButton data-trackid="next-button" onClick={() => handleDateChange('next')}>
            <ArrowForwardIcon />
          </IconButton>
        </div>
        <Button
          color={'primary'}
          variant={'outlined'}
          data-trackid="today-button"
          onClick={() => handleDateChange('today')}>
          {t('today')}
        </Button>
      </div>
      <div className={classes.grid}>
        <div className={classes.pendingTable}>
          <Typography align={'center'} variant={'h5'} sx={{ paddingBottom: '25px' }}>
            {t('Pending for review')}
          </Typography>
          <PendingRequestTable
            userLeaves={userLeaves}
            requests={currentYearRequests}
            refetch={refetch}
          />
        </div>
        <div className={classes.table}>
          <Typography align={'center'} variant={'h5'} sx={{ paddingBottom: '25px' }}>
            {t('Current & Upcoming Leaves')}
          </Typography>
          <UserLeavesTable userLeaves={upcomingUserLeaves} />
        </div>
        <div className={classes.table}>
          <Typography align={'center'} variant={'h5'} sx={{ paddingBottom: '25px' }}>
            {t('Past Leaves')}
          </Typography>
          <UserLeavesTable userLeaves={pastUserLeaves} />
        </div>
      </div>
    </StyledHeader>
  );
};

export default CalendarHeader;
