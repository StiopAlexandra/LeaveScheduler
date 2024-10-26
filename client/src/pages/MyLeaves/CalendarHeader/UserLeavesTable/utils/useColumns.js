import CircleIcon from '@mui/icons-material/Circle';
import React, { useMemo } from 'react';
import { parseISO, format } from 'date-fns';

const useColumns = ({ dateFormat }) => {
  return useMemo(() => {
    return {
      color: {
        hide: false,
        seq: 0,
        width: 55,
        headerName: '',
        renderCell: (params) => {
          return <CircleIcon sx={{ color: params.value }} />;
        }
      },
      name: {
        hide: false,
        seq: 1,
        minWidth: 180,
        headerName: 'Type',
        sortable: true
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
      days: {
        hide: false,
        seq: 4,
        minWidth: 160,
        headerName: 'Working Days'
      }
    };
  }, [dateFormat]);
};

export default useColumns;
