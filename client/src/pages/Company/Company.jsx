import { useQuery } from '@apollo/client';
import { styled, Tab, Tabs, tabsClasses, Typography, Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';

import GetCompany from '../../data/queries/GetCompany';
import useResponsive from '../../hooks/useResponsive';

import Departments from './Departments';
import Details from './Details';
import LeaveDays from './LeaveDays';
import LeaveTypes from './LeaveTypes';

const StyleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column'
}));
const StyledTabsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%'
}));
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

const Company = () => {
  const { t } = useTranslation();
  const { type = 'details' } = useParams();
  const isSmallScreen = useResponsive('down', 'sm');
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/company/details');
  }, []);

  const {
    data,
    refetch,
    loading: queryLoading
  } = useQuery(GetCompany, {
    fetchPolicy: 'network-only'
  });

  const company = data?.getCompany;
  const { name } = company || {};

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 0 30px'
        }}>
        <Typography variant={'h4'}>{name}</Typography>
      </div>
      <StyleContainer>
        <StyledTabsBox>
          <StyledTabs
            scrollButtons={false}
            value={type}
            variant={isSmallScreen ? 'scrollable' : 'standard'}>
            <Tab
              component={RouterLink}
              to={`/company/details`}
              label={t('Details')}
              value={'details'}
            />
            <Tab
              component={RouterLink}
              to={`/company/departments`}
              label={t('Departments')}
              value={'departments'}
            />
            <Tab
              component={RouterLink}
              to={`/company/leave-types`}
              label={t('Leave types')}
              value={'leave-types'}
            />
            <Tab
              component={RouterLink}
              to={`/company/leave-days`}
              label={t('Leave days')}
              value={'leave-days'}
            />
          </StyledTabs>
        </StyledTabsBox>
        {type === 'details' && (
          <Details company={company} refetch={refetch} queryLoading={queryLoading} />
        )}
        {type === 'departments' && <Departments />}
        {type === 'leave-types' && <LeaveTypes />}
        {type === 'leave-days' && <LeaveDays company={company} />}
      </StyleContainer>
    </div>
  );
};

export default Company;
