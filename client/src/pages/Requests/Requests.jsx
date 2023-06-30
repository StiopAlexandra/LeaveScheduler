import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styled, Tab, Tabs, tabsClasses, Typography, IconButton } from '@mui/material';
import { getYear } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link as RouterLink, useParams } from 'react-router-dom';

import ApprovedRequestsTable from './ApprovedRequestsTable/ApprovedRequestsTable';
import PendingRequestsTable from './PendingRequestsTable/PendingRequestsTable';
import RejectedRequestsTable from './RejectedRequestsTable/RejectedRequestsTable';

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

const Requests = ({ id: userId }) => {
  const navigate = useNavigate();
  const { type = 'pending' } = useParams();
  const { t } = useTranslation();

  const [year, setYear] = useState(getYear(new Date()));

  const handleDateChange = useCallback(
    (direction) => {
      if (direction === 'prev') {
        setYear((prev) => prev - 1);
      }
      if (direction === 'next') {
        setYear((prev) => prev + 1);
      }
    },
    [setYear]
  );

  useEffect(() => {
    navigate('/requests/pending');
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <StyledTitle>
        <IconButton data-trackid="prev-button" onClick={() => handleDateChange('prev')}>
          <ArrowBackOutlinedIcon />
        </IconButton>
        <Typography variant={'h4'}>{`${year}`}</Typography>
        <IconButton data-trackid="next-button" onClick={() => handleDateChange('next')}>
          <ArrowForwardIcon />
        </IconButton>
      </StyledTitle>
      <div style={{ marginTop: '20px' }}>
        <StyledTabs scrollButtons={false} value={type} centered={true}>
          <Tab
            component={RouterLink}
            to={`/requests/pending`}
            label={t('Pending')}
            value={'pending'}
          />
          <Tab
            component={RouterLink}
            to={`/requests/approved`}
            label={t('Approved')}
            value={'approved'}
          />
          <Tab
            component={RouterLink}
            to={`/requests/rejected`}
            label={t('Rejected')}
            value={'rejected'}
          />
        </StyledTabs>
        {type === 'pending' && <PendingRequestsTable year={year} userId={userId} />}
        {type === 'approved' && <ApprovedRequestsTable year={year} />}
        {type === 'rejected' && <RejectedRequestsTable year={year} />}
      </div>
    </div>
  );
};

export default Requests;
