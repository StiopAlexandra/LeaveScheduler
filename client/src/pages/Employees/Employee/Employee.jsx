import { useQuery } from '@apollo/client';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Button, SvgIcon, styled, Tab, Tabs, tabsClasses, Typography } from '@mui/material';
import React, { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';

import GetUser from '../../../data/queries/GetUser';

import Leaves from './Leaves';
import Profile from './Profile';

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

const Employee = () => {
  const { t } = useTranslation();
  const { id, type = 'profile' } = useParams();

  const navigate = useNavigate();

  const { data, loading, refetch } = useQuery(GetUser, {
    variables: {
      id
    },
    fetchPolicy: 'network-only'
  });

  const user = data?.getUser;
  const { name } = user || {};

  const onClick = useCallback(() => {
    navigate('/employees');
  }, [navigate]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          onClick={onClick}
          size={'large'}
          variant={'outlined'}
          sx={{ padding: '7px', minWidth: '36px' }}>
          <SvgIcon>
            <ArrowBackOutlinedIcon />
          </SvgIcon>
        </Button>
        <div
          style={{ display: 'flex', justifyContent: 'center', width: '100%', marginRight: '40px' }}>
          <Typography variant={'h4'}>{name}</Typography>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <StyledTabs scrollButtons={false} value={type} centered={true}>
          <Tab
            component={RouterLink}
            to={`/employees/${id}/profile`}
            label={t('Profile')}
            value={'profile'}
          />
          <Tab
            component={RouterLink}
            to={`/employees/${id}/leaves`}
            label={t('Leaves')}
            value={'leaves'}
          />
        </StyledTabs>
        {type === 'profile' && <Profile user={user} refetch={refetch} queryLoading={loading} />}
        {type === 'leaves' && <Leaves userId={id} />}
      </div>
    </div>
  );
};

export default memo(Employee);
