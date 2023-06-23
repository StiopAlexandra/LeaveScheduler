import React, {useMemo, useCallback, memo, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { NetworkStatus } from '@apollo/client'

import {useGridApiRef} from '@mui/x-data-grid'
import {
    DataGrid, gridClasses, GRID_CHECKBOX_SELECTION_COL_DEF
} from '@mui/x-data-grid';
import {useQuery, useMutation} from '@apollo/client'

import useColumns from "./utils/useColumns";
import PendingRequestUIDefaultState from "./utils/PendingRequestUIDefaultState";
import useColumnsInitializer from "../../../hooks/useColumnsInitializer";

import {Typography, styled} from '@mui/material'
import useMUILocales from "../../../hooks/useMUILocales";
import CustomToolbar from "./components/CustomToolbar";
import UpdateUserLeave from "../../../data/mutations/UpdateUserLeave";
import GetUserLeaves from "../../../data/queries/GetUserLeaves";
import {getYear} from 'date-fns';
import AddLeave from "../../MyLeaves/AddLeave/AddLeave";
import useOpenState from "../../../hooks/useOpenState";
import RejectRequestDialog from "./components/RejectRequestDialog";

const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: theme.palette.grey[600],
    paddingLeft: 20,
    paddingRight: 20
}))


const DataGridStyledTable = styled(DataGrid)(({theme}) => ({
    border: 'none',
    height: 'auto',
    backgroundColor: theme.palette.background.default,
    [`& .${gridClasses.virtualScroller}`]: {
        // safari (:
        transform: 'translateZ(0)',
    },
    [`& .MuiDataGrid-overlayWrapper`]: {
        //height: '100px',
    },
    [`& .${gridClasses.toolbarContainer}`]: {
        justifyContent: 'flex-end',
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
        },
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
    },

}))

const PendingRequestsTable = ({year}) => {
    const gridApiRef = useGridApiRef()
    const gridLocales = useMUILocales()
    const { t } = useTranslation()
    const { open: showDialog, onShow: onShowDialog, onClose: onCloseDialog } = useOpenState()

    const [isFilterActive, setFilterActive] = useState(false);
    const [filterButtonEl, setFilterButtonEl] = useState(null);
    const [columnsButtonEl, setColumnsButtonEl] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const {
        data,
        networkStatus,
        refetch
    } = useQuery(GetUserLeaves, {
        variables: {
            filter: {
                status: 'pending'
            },
        },
        fetchPolicy: 'network-only',
    })

    const allUserLeaves = data?.getUserLeaves || []
    const userLeaves = allUserLeaves.filter(({startDate}) => year === getYear(new Date(startDate)))

    const [updateUserLeave, {loading}] = useMutation(UpdateUserLeave)

    const onApprove = useCallback(async() => {
        try{
            await Promise.all(
                selectedItems.map((id) =>
                    updateUserLeave({
                        variables: {
                            input: {
                                id,
                                status: 'accepted',
                            }
                        }
                    })
                )
            )
        } finally {
            refetch()
        }
    }, [selectedItems, updateUserLeave, refetch])

    const onReject = useCallback(async() => {
        onShowDialog()
    }, [onShowDialog])

    const columnSpecificCellConfigs = useColumns()

    const [columns] = useColumnsInitializer(
        PendingRequestUIDefaultState.PendingRequestsTableUIKey.columns,
        columnSpecificCellConfigs
    )

    const memoizedRows = useMemo(
        () =>
            userLeaves.map(({_id: id, user, leaveType, startDate, endDate, days, notes}) => {
                return {
                    id,
                    user: user.name,
                    department: user.department,
                    leaveType: leaveType,
                    startDate: startDate,
                    endDate: endDate,
                    days: days,
                    notes: notes,
                }
            }),
        [userLeaves]
    )

    const NoRowsOverlay = () => (
        <StyledGridOverlay>
            <Typography>{t(`There’s no data to show you right now.`)}</Typography>
        </StyledGridOverlay>
    )

    return (
        <>
            <DataGridStyledTable
                autoHeight
                apiRef={gridApiRef}
                columns={columns}
                rows={memoizedRows}
                loading={networkStatus === NetworkStatus.loading || loading}
                onRowSelectionModelChange={(ids) => setSelectedItems(ids)}
                slots={{
                    toolbar: CustomToolbar,
                    noRowsOverlay: NoRowsOverlay,
                    noResultsOverlay: NoRowsOverlay,
                }}
                slotProps={{
                    noRowsOverlay: {
                        visible: networkStatus === NetworkStatus.ready && userLeaves.length === 0,
                        loading: networkStatus === NetworkStatus.loading && userLeaves.length === 0
                    },
                    panel: {
                        anchorEl: isFilterActive ? filterButtonEl : columnsButtonEl,
                        placement: "bottom-end",
                    },
                    toolbar: {
                        setColumnsButtonEl,
                        setFilterButtonEl,
                        setFilterActive,
                        onApprove,
                        onReject,
                        selectedItems
                    },
                    columnsPanel: {
                        disableHideAllButton: true,
                        disableShowAllButton: true,
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
                                },

                            },
                            deleteIconProps: {
                                sx: {
                                    position: 'absolute',
                                    top: 0,
                                    right: '-5px',
                                    '& .MuiSvgIcon-root': { color: '#ff4949' },
                                },
                            },
                        },
                        sx: {
                            '& .MuiDataGrid-filterForm': {
                                padding: '20px',
                                display: 'grid',
                                gridTemplateColumns: '180px 120px',
                                gridTemplateRows: 'auto',
                                columnGap: '20px',
                            },
                            '& .MuiDataGrid-filterFormColumnInput': {width: '100%'},
                            '& .MuiDataGrid-filterFormOperatorInput': {width: '100%'},
                            '& .MuiDataGrid-filterFormValueInput': {width: '100%', gridColumn: '1 / 3'},
                        },
                    },
                }}
                localeText={gridLocales}
                checkboxSelection
                disableColumnMenu
            />
    {
        showDialog && <RejectRequestDialog open={showDialog} onClose={onCloseDialog} selectedItems={selectedItems} refetch={refetch}/>
    }
    </>
    )
}

export default memo(PendingRequestsTable)
