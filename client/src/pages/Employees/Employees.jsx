import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../components/common/Button';
import useOpenState from '../../hooks/useOpenState';

import AddEmployee from './AddEmployee';
import EmployeesTable from './EmployeesTable/EmployeesTable';

const Employees = () => {
  const { t } = useTranslation();
  const { open, onShow, onClose } = useOpenState();

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Button
        color={'primary'}
        variant={'contained'}
        onClick={onShow}
        sx={{ marginBottom: '30px' }}>
        {t('Add Employee')}
      </Button>
      {open && <AddEmployee open={open} onClose={onClose} />}
      <EmployeesTable />
    </div>
  );
};

export default Employees;
