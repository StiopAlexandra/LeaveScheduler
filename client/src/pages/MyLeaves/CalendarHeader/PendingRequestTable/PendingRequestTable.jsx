import { useMutation } from '@apollo/client';
import { Typography, styled } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import { DataGrid, gridClasses, roRO, enUS } from '@mui/x-data-grid';
import React, { useMemo, useCallback, memo, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigsContext from '../../../../contexts/ConfigsContext';
import DeleteUserLeave from '../../../../data/mutations/DeleteUserLeave';
import useColumnsInitializer from '../../../../hooks/useColumnsInitializer';
import useOpenState from '../../../../hooks/useOpenState';
import EditLeave from '../../EditLeave';

import PendingRequestTableUIDefaultState from './utils/PendingRequestTableUIDefaultState';
import useColumns from './utils/useColumns';

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  color: theme.palette.grey[600],
  paddingLeft: 20,
  paddingRight: 20
}));

const DataGridStyledTable = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  height: 'auto',
  backgroundColor: theme.palette.background.default,
  [`& .${gridClasses.virtualScroller}`]: {
    // safari (:
    transform: 'translateZ(0)'
  },
  [`& .${gridClasses.toolbarContainer}`]: {
    justifyContent: 'flex-end'
  },
  [`& .${gridClasses.columnHeaders}`]: {
    backgroundColor: theme.palette.background.neutral,
    borderRadius: '10px',
    borderBottom: 0,
    [':focus']: {
      outline: 'none'
    },
    [':focus-within']: {
      outline: 'none'
    }
  },
  [`& .${gridClasses.columnHeader}`]: {
    [':focus']: {
      outline: 'none'
    },
    [':focus-within']: {
      outline: 'none'
    }
  },
  [`& .${gridClasses.row}`]: {
    [':hover']: {
      cursor: 'pointer'
    }
  },
  [`& .${gridClasses.cell}`]: {
    padding: `0 ${theme.spacing(1.5)}`,
    overflow: `visible!important`,
    [`&[data-field="__check__"]`]: {
      // align with column checkbox
      paddingLeft: `${theme.spacing(1.5)}`
    },
    [':focus']: {
      outline: 'none'
    },
    [':focus-within']: {
      outline: 'none'
    }
  },
  [`& .${gridClasses.columnHeaderTitleContainer}`]: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5)
  },
  [`& .${gridClasses.columnHeaderCheckbox}`]: {
    [`& .${gridClasses.columnHeaderTitleContainer}`]: {
      padding: 0
    }
  }
}));

const PendingRequestTable = ({ requests, refetch, userLeaves }) => {
  const gridApiRef = useGridApiRef();
  const { lng } = useContext(ConfigsContext);
  const { t } = useTranslation();
  const [editItem, setEditItem] = useState({});
  const { open: showEdit, onShow: onShowEdit, onClose: onCloseEdit } = useOpenState();

  const [deleteUserLeave, { loading: loading }] = useMutation(DeleteUserLeave);

  const onClose = useCallback(() => {
    setEditItem({});
    onCloseEdit();
  }, [setEditItem, onCloseEdit]);

  const onEdit = useCallback(
    (data) => {
      setEditItem({ ...data });
      onShowEdit();
    },
    [setEditItem, onShowEdit]
  );

  const onDelete = useCallback(
    (id) => {
      deleteUserLeave({
        variables: {
          id
        }
      }).then(() => {
        refetch();
      });
    },
    [deleteUserLeave]
  );

  const columnSpecificCellConfigs = useColumns({ onDelete, onEdit });

  const [columns] = useColumnsInitializer(
    PendingRequestTableUIDefaultState.PendingRequestTableUIKey.columns,
    columnSpecificCellConfigs
  );

  const memoizedRows = useMemo(
    () =>
      requests?.map(({ leaveType, days, startDate, endDate, _id: id, notes }) => {
        return {
          color: leaveType?.color,
          name: leaveType?.name,
          days,
          startDate,
          endDate,
          id,
          notes
        };
      }) || [][requests]
  );

  const NoRowsOverlay = () => (
    <StyledGridOverlay>
      <Typography>{t(`There’s no data to show you right now.`)}</Typography>
    </StyledGridOverlay>
  );

  return (
    <>
      <DataGridStyledTable
        autoHeight
        apiRef={gridApiRef}
        columns={columns}
        rows={memoizedRows}
        loading={loading}
        slots={{
          noRowsOverlay: NoRowsOverlay
        }}
        disableRowSelectionOnClick
        localeText={
          lng === 'ro'
            ? roRO.components.MuiDataGrid.defaultProps.localeText
            : enUS.components.MuiDataGrid.defaultProps.localeText
        }
        disableColumnMenu
      />
      {showEdit && (
        <EditLeave
          userLeaves={userLeaves}
          open={showEdit}
          onClose={onClose}
          data={editItem}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default memo(PendingRequestTable);
