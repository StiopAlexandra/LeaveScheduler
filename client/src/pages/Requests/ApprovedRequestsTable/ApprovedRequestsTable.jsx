import { NetworkStatus } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { Typography, styled } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import { DataGrid, gridClasses, roRO, enUS } from '@mui/x-data-grid';
import { getYear } from 'date-fns';
import React, { useMemo, memo, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigsContext from '../../../contexts/ConfigsContext';
import GetUserLeaves from '../../../data/queries/GetUserLeaves';
import useColumnsInitializer from '../../../hooks/useColumnsInitializer';

import CustomToolbar from './components/CustomToolbar';
import ApprovedRequestsUIDefaultState from './utils/ApprovedRequestsUIDefaultState';
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
  width: 'auto',
  maxWidth: '1510px',
  margin: 'auto',
  backgroundColor: theme.palette.background.default,
  [`& .${gridClasses.virtualScroller}`]: {
    // safari (:
    transform: 'translateZ(0)'
  },
  [`& .MuiDataGrid-overlayWrapper`]: {
    //height: '100px',
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

const ApprovedRequestsTable = ({ year }) => {
  const gridApiRef = useGridApiRef();
  const { lng, companySettings } = useContext(ConfigsContext);
  const dateFormat = companySettings?.dateFormat;

  const { t } = useTranslation();

  const [isFilterActive, setFilterActive] = useState(false);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [columnsButtonEl, setColumnsButtonEl] = useState(null);

  const { data, networkStatus } = useQuery(GetUserLeaves, {
    variables: {
      filter: {
        status: 'accepted'
      }
    },
    fetchPolicy: 'network-only'
  });

  const allUserLeaves = data?.getUserLeaves || [];
  const userLeaves = allUserLeaves.filter(({ startDate }) => year === getYear(new Date(startDate)));

  const columnSpecificCellConfigs = useColumns({ dateFormat });

  const [columns] = useColumnsInitializer(
    ApprovedRequestsUIDefaultState.ApprovedRequestsTableUIKey.columns,
    columnSpecificCellConfigs
  );

  const memoizedRows = useMemo(
    () =>
      userLeaves.map(({ _id: id, user, leaveType, startDate, endDate, days, notes }) => {
        return {
          id,
          user: user.name,
          department: user.department,
          leaveType: leaveType,
          startDate: startDate,
          endDate: endDate,
          days: days,
          notes: notes
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
      loading={networkStatus === NetworkStatus.loading}
      slots={{
        toolbar: CustomToolbar,
        noRowsOverlay: NoRowsOverlay,
        noResultsOverlay: NoRowsOverlay
      }}
      slotProps={{
        noRowsOverlay: {
          visible: networkStatus === NetworkStatus.ready && userLeaves.length === 0,
          loading: networkStatus === NetworkStatus.loading && userLeaves.length === 0
        },
        panel: {
          anchorEl: isFilterActive ? filterButtonEl : columnsButtonEl,
          placement: 'bottom-end'
        },
        toolbar: {
          setColumnsButtonEl,
          setFilterButtonEl,
          setFilterActive
        },
        columnsPanel: {
          disableHideAllButton: true,
          disableShowAllButton: true
        },
        filterPanel: {
          filterFormProps: {
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
                sx: {
                  marginTop: '25px'
                }
              }
            },
            deleteIconProps: {
              sx: {
                position: 'absolute',
                top: 0,
                right: '-5px',
                '& .MuiSvgIcon-root': { color: '#ff4949' }
              }
            }
          },
          sx: {
            '& .MuiDataGrid-filterForm': {
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '180px 120px',
              gridTemplateRows: 'auto',
              columnGap: '20px'
            },
            '& .MuiDataGrid-filterFormColumnInput': { width: '100%' },
            '& .MuiDataGrid-filterFormOperatorInput': { width: '100%' },
            '& .MuiDataGrid-filterFormValueInput': { width: '100%', gridColumn: '1 / 3' }
          }
        }
      }}
      localeText={
        lng === 'ro'
          ? roRO.components.MuiDataGrid.defaultProps.localeText
          : enUS.components.MuiDataGrid.defaultProps.localeText
      }
      disableColumnMenu
      disableRowSelectionOnClick
    />
  );
};

export default memo(ApprovedRequestsTable);
