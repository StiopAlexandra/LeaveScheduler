import { Typography, styled } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import { DataGrid, gridClasses, roRO, enUS } from '@mui/x-data-grid';
import React, { useMemo, memo, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigsContext from '../../../../contexts/ConfigsContext';
import useColumnsInitializer from '../../../../hooks/useColumnsInitializer';

import UserLeavesUIDefaultState from './utils/UserLeavesUIDefaultState';
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
      background: 'none'
    }
  },
  [`& .${gridClasses.cell}`]: {
    padding: `0 ${theme.spacing(1.5)}`,
    overflow: `visible!important`,
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
  }
}));

const UserLeavesTable = ({ userLeaves }) => {
  const gridApiRef = useGridApiRef();
  const { t } = useTranslation();
  const { lng } = useContext(ConfigsContext);

  const columnSpecificCellConfigs = useColumns();

  const [columns] = useColumnsInitializer(
    UserLeavesUIDefaultState.UserLeavesTableUIKey.columns,
    columnSpecificCellConfigs
  );

  const memoizedRows = useMemo(
    () =>
      userLeaves.map(({ leaveType, days, startDate, endDate, _id: id }) => {
        return {
          color: leaveType?.color,
          name: leaveType?.name,
          days,
          startDate,
          endDate,
          id
        };
      }),
    [userLeaves]
  );

  const NoRowsOverlay = () => (
    <StyledGridOverlay>
      <Typography>{t(`There’s no data to show you right now.`)}</Typography>
    </StyledGridOverlay>
  );

  return (
    <DataGridStyledTable
      autoHeight
      apiRef={gridApiRef}
      columns={columns}
      rows={memoizedRows}
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
  );
};

export default memo(UserLeavesTable);
