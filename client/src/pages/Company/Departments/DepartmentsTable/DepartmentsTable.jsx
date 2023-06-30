import { NetworkStatus } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client';
import { Typography, styled } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import { DataGrid, gridClasses, roRO, enUS } from '@mui/x-data-grid';
import React, { useMemo, useCallback, memo, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigsContext from '../../../../contexts/ConfigsContext';
import DeleteDepartment from '../../../../data/mutations/DeleteDepartment';
import GetDepartments from '../../../../data/queries/GetDepartments';
import useColumnsInitializer from '../../../../hooks/useColumnsInitializer';
import useOpenState from '../../../../hooks/useOpenState';
import EditDepartment from '../EditDepartment';

import DepartmentUIDefaultState from './utils/DepartmentUIDefaultState';
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
  marginTop: '30px',
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

const DepartmentsTable = () => {
  const gridApiRef = useGridApiRef();
  const { lng } = useContext(ConfigsContext);
  const { t } = useTranslation();
  const [editItem, setEditItem] = useState({});
  const { open: showEdit, onShow: onShowEdit, onClose: onCloseEdit } = useOpenState();

  const [deleteDepartment, { loading: loading }] = useMutation(DeleteDepartment, {
    refetchQueries: [
      {
        query: GetDepartments
      }
    ],
    awaitRefetchQueries: true
  });

  const { data, networkStatus } = useQuery(GetDepartments, {
    fetchPolicy: 'network-only'
  });

  const departments = data?.getDepartments || [];

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
      deleteDepartment({
        variables: {
          id
        }
      });
    },
    [deleteDepartment]
  );

  const columnSpecificCellConfigs = useColumns({ onDelete, onEdit });

  const [columns] = useColumnsInitializer(
    DepartmentUIDefaultState.DepartmentsTableUIKey.columns,
    columnSpecificCellConfigs
  );

  const memoizedRows = useMemo(
    () =>
      departments.map(({ _id: id, ...rest }) => {
        return {
          id,
          ...rest
        };
      }),
    [departments]
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
        loading={networkStatus === NetworkStatus.loading || loading}
        slots={{
          noRowsOverlay: NoRowsOverlay,
          noResultsOverlay: NoRowsOverlay
        }}
        slotProps={{
          noRowsOverlay: {
            visible: networkStatus === NetworkStatus.ready && departments.length === 0,
            loading: networkStatus === NetworkStatus.loading && departments.length === 0
          }
        }}
        disableRowSelectionOnClick
        localeText={
          lng === 'ro'
            ? roRO.components.MuiDataGrid.defaultProps.localeText
            : enUS.components.MuiDataGrid.defaultProps.localeText
        }
        disableColumnMenu
        disableColumnSelector
        rowSelection={false}
      />
      {showEdit && <EditDepartment open={showEdit} onClose={onClose} data={editItem} />}
    </>
  );
};

export default memo(DepartmentsTable);
