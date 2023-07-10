import React, { useMemo } from 'react';
import { parseISO, format } from 'date-fns';

import Status from '../../../../components/common/Status/Status';

const useColumns = ({ dateFormat }) => {
  return useMemo(() => {
    return {
      user: {
        hide: false,
        seq: 0,
        minWidth: 200,
        headerName: 'Name',
        sortable: true
      },
      department: {
        hide: false,
        seq: 1,
        width: 170,
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
      startDate: {
        hide: false,
        seq: 2,
        minWidth: 160,
        headerName: 'Start Date',
        sortable: true,
        renderCell: (params) => {
          return format(parseISO(params.value), dateFormat);
        }
      },
      endDate: {
        hide: false,
        seq: 3,
        minWidth: 160,
        headerName: 'End Date',
        sortable: true,
        renderCell: (params) => {
          return format(parseISO(params.value), dateFormat);
        }
      },
      leaveType: {
        hide: false,
        seq: 4,
        minWidth: 170,
        headerName: 'Leave Type',
        sortable: true,
        renderCell: (params) => {
          return params.value ? (
            <Status name={params.value?.name} color={params.value?.color} />
          ) : (
            ''
          );
        }
      },
      days: {
        hide: false,
        seq: 5,
        minWidth: 160,
        headerName: 'Working Days'
      },
      notes: {
        hide: false,
        seq: 6,
        minWidth: 220,
        headerName: 'Notes'
      }
    };
  }, [dateFormat]);
};

export default useColumns;
