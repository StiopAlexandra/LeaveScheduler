import { styled } from '@mui/material';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../components/common/Button/Button';
import useOpenState from '../../../hooks/useOpenState';

import AddDepartment from './AddDepartment';
import { DepartmentsTable } from './DepartmentsTable';

const StyledContainer = styled('div')(({ theme }) => ({
  padding: '20px',
  borderRadius: '10px',
  boxSizing: 'border-box',
  background: theme.palette.background.default,
  [theme?.breakpoints.up('md')]: {
    width: '800px'
  },
  [theme?.breakpoints.down('md')]: {
    width: '100%'
  },
  margin: 'auto'
}));

const Departments = () => {
  const { t } = useTranslation();
  const { open: showAdd, onShow: onShowAdd, onClose: onCloseAdd } = useOpenState();

  return (
    <StyledContainer>
      <Button color={'primary'} variant={'contained'} onClick={onShowAdd}>
        {t('Add Department')}
      </Button>
      {showAdd && <AddDepartment open={showAdd} onClose={onCloseAdd} />}
      <DepartmentsTable />
    </StyledContainer>
  );
};

export default memo(Departments);
