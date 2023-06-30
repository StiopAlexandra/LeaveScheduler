import CircleIcon from '@mui/icons-material/Circle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { GridActionsCellItem } from '@mui/x-data-grid';
import React, { useMemo } from 'react';
const useColumns = ({ onDelete, onEdit }) => {
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
        sortable: true
      },
      endDate: {
        hide: false,
        seq: 3,
        minWidth: 160,
        headerName: 'End Date',
        sortable: true
      },
      days: {
        hide: false,
        seq: 4,
        minWidth: 160,
        headerName: 'Working Days'
      },
      actions: {
        seq: 5,
        type: 'actions',
        align: 'right',
        flex: 1,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditOutlinedIcon />}
            label="Edit"
            onClick={() => onEdit(params.row)}
          />,
          <GridActionsCellItem
            icon={<DeleteOutlineIcon />}
            label="Delete"
            onClick={() => onDelete(params.id)}
          />
        ]
      }
    };
  }, [onDelete, onEdit]);
};

export default useColumns;
