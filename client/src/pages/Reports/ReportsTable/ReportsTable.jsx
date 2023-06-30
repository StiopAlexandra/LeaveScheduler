import { NetworkStatus } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { Typography, styled } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import { DataGrid, gridClasses, roRO, enUS } from '@mui/x-data-grid';
import { getYear } from 'date-fns';
import React, { useMemo, useCallback, memo, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Status from '../../../components/common/Status/Status';
import ConfigsContext from '../../../contexts/ConfigsContext';
import GetLeaveTypes from '../../../data/queries/GetLeaveTypes';
import GetUsersLeaves from '../../../data/queries/GetUsersLeaves';
import employee from '../../Employees/Employee';

import CustomToolbar from './components/CustomToolbar';

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
  maxWidth: '1430px',
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

const ReportsTable = ({ year }) => {
  const gridApiRef = useGridApiRef();
  const { lng } = useContext(ConfigsContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isFilterActive, setFilterActive] = useState(false);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [columnsButtonEl, setColumnsButtonEl] = useState(null);

  const { data, networkStatus } = useQuery(GetUsersLeaves, {
    variables: {
      filter: {
        status: 'accepted'
      }
    },
    fetchPolicy: 'network-only'
  });

  const { data: dataLeaveTypes } = useQuery(GetLeaveTypes, {
    fetchPolicy: 'network-only'
  });

  const leaveTypes =
    dataLeaveTypes?.getLeaveTypes?.filter((item) => item.name !== 'Public Holiday') || [];

  const allUsersLeaves = data?.getUsers || [];

  const currentYearUserLeaves = allUsersLeaves.map(({ userLeave, ...rest }) => {
    const userLeaveFiltered = userLeave.filter(
      ({ startDate, status }) => status === 'accepted' && year === getYear(new Date(startDate))
    );
    return {
      userLeave: userLeaveFiltered,
      ...rest
    };
  });

  const gridRows = [];
  currentYearUserLeaves?.forEach(({ _id, name, userLeave }) => {
    const groupType = [];
    const history = {};
    userLeave.forEach(({ leaveType, days }) => {
      const { name, color, _id } = leaveType;
      if (!groupType[name]) {
        groupType[name] = [];
      }
      groupType[name].push({
        days,
        color,
        _id
      });
    });
    leaveTypes.forEach(({ name, allowanceDays }) => {
      let taken = 0;
      for (let [key, value] of Object.entries(groupType)) {
        if (key === name) {
          taken = value.reduce((acc, { days }) => {
            return acc + days;
          }, 0);
        }
      }
      history[name] = `${taken ? taken : '-'} / ${allowanceDays ? allowanceDays : '-'}`;
    });

    gridRows.push({
      id: _id,
      employee: name,
      ...history
    });
  });

  const gridColumns = leaveTypes.map((leaveType, index) => ({
    field: leaveType.name,
    headerName: leaveType.name,
    color: leaveType.color,
    width: 180,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    seq: index + 1,
    renderHeader: ({ colDef }) => {
      return <Status name={colDef.headerName} color={colDef.color} />;
    }
  }));

  gridColumns.unshift({
    field: 'employee',
    headerName: t('Employees'),
    width: 220,
    sortable: true,
    headerAlign: 'center',
    align: 'center',
    seq: 0
  });

  const memoizedRows = useMemo(
    () =>
      gridRows.map((item) => {
        return {
          ...item
        };
      }),
    [gridRows]
  );

  const memoizedColumns = useMemo(
    () =>
      gridColumns.map((item) => {
        return {
          ...item
        };
      }),
    [gridColumns]
  );

  const onItemClick = useCallback((params) => {
    navigate(`/employees/${params.id}/leaves`);
  }, []);

  const NoRowsOverlay = () => (
    <StyledGridOverlay>
      <Typography>{t(`There’s no data to show you right now.`)}</Typography>
    </StyledGridOverlay>
  );

  return (
    <DataGridStyledTable
      autoHeight
      apiRef={gridApiRef}
      columns={memoizedColumns}
      rows={memoizedRows}
      loading={networkStatus === NetworkStatus.loading}
      slots={{
        toolbar: CustomToolbar,
        noRowsOverlay: NoRowsOverlay,
        noResultsOverlay: NoRowsOverlay
      }}
      slotProps={{
        noRowsOverlay: {
          visible: networkStatus === NetworkStatus.ready && currentYearUserLeaves.length === 0,
          loading: networkStatus === NetworkStatus.loading && currentYearUserLeaves.length === 0
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
      onCellClick={onItemClick}
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

export default memo(ReportsTable);
