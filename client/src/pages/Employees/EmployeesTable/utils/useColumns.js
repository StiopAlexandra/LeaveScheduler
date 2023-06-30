import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import React, { useMemo } from 'react';

import Status from '../../../../components/common/Status';

const CHECKBOX_COL_DEF = {
  ...GRID_CHECKBOX_SELECTION_COL_DEF,
  type: 'singleSelect'
};

const useColumns = () => {
  return useMemo(() => {
    return {
      [CHECKBOX_COL_DEF.field]: {
        headerName: 'Checkbox selection',
        ...CHECKBOX_COL_DEF,
        width: 50, // will end up in 50 after MUI calcs
        hide: false,
        seq: 0,
        minWidth: 40
      },
      name: {
        hide: false,
        seq: 1,
        width: 180,
        headerName: 'Name',
        sortable: true
      },
      email: {
        hide: false,
        seq: 2,
        width: 180,
        headerName: 'Email'
      },
      department: {
        hide: false,
        seq: 3,
        width: 150,
        headerName: 'Department',
        sortable: true,
        renderCell: (params) => {
          return params.value ? (
            <Status name={params.value?.name} color={params.value?.color} />
          ) : (
            ''
          );
        }
      },
      role: {
        hide: false,
        seq: 4,
        width: 180,
        headerName: 'Role'
      },
      type: {
        hide: false,
        seq: 5,
        width: 180,
        headerName: 'Employment'
      },
      manager: {
        hide: false,
        seq: 6,
        width: 130,
        headerName: 'Type',
        sortable: true,
        renderCell: (params) => {
          return (
            <Status
              name={params.value ? 'manager' : 'employee'}
              color={params.value ? '#26C644' : '#FF722C'}
            />
          );
        }
      },
      status: {
        hide: false,
        seq: 7,
        width: 120,
        headerName: 'Status',
        sortable: true,
        renderCell: (params) => {
          const status = params.value;
          const color = status === 'active' ? '#22D0B8' : '#FF4949';
          return <Status name={status} color={color} />;
        }
      },
      dateOfEmployment: {
        hide: false,
        seq: 8,
        width: 180,
        headerName: 'Date Of Employment',
        sortable: true
      },
      dateOfBirth: {
        hide: false,
        seq: 9,
        width: 180,
        headerName: 'Date Of Birthday',
        sortable: true
      },
      phone: {
        hide: false,
        seq: 10,
        width: 130,
        headerName: 'Phone'
      },
      address: {
        hide: false,
        seq: 11,
        width: 280,
        headerName: 'Address'
      }
    };
  }, []);
};

export default useColumns;
