import React, {useMemo, useCallback, memo, useState, useContext} from 'react'
import {useTranslation} from 'react-i18next'
import {NetworkStatus} from '@apollo/client'

import {useGridApiRef} from '@mui/x-data-grid'
import {
    DataGrid, gridClasses, roRO, enUS
} from '@mui/x-data-grid';
import {useQuery, useMutation} from '@apollo/client'

import useColumns from "./utils/useColumns";
import LeaveTypeUIDefaultState from "./utils/LeaveTypeUIDefaultState";

import {Typography, styled} from '@mui/material'
import GetLeaveTypes from "../../../../data/queries/GetLeaveTypes";
import useColumnsInitializer from "../../../../hooks/useColumnsInitializer";
import DeleteLeaveType from "../../../../data/mutations/DeleteLeaveType";
import EditLeaveType from "../EditLeaveType";
import useOpenState from "../../../../hooks/useOpenState";
import ConfigsContext from "../../../../contexts/ConfigsContext";

const StyledGridOverlay = styled('div')(({theme}) => ({
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
    marginTop: '30px',
    height: 'auto',
    backgroundColor: theme.palette.background.default,
    [`& .${gridClasses.virtualScroller}`]: {
        // safari (:
        transform: 'translateZ(0)',
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
    },
}))

const LeaveTypesTable = () => {
    const gridApiRef = useGridApiRef()
    const {lng} = useContext(ConfigsContext)
    const {t} = useTranslation()
    const [editItem, setEditItem] = useState({})
    const { open: showEdit, onShow: onShowEdit, onClose: onCloseEdit } = useOpenState()

    const [deleteLeaveType, {loading: loading}] = useMutation(DeleteLeaveType, {
        refetchQueries: [
            {
                query: GetLeaveTypes,
            },
        ],
        awaitRefetchQueries: true,
    })

    const {
        data,
        networkStatus
    } = useQuery(GetLeaveTypes, {
        fetchPolicy: 'network-only',
    })

    const leaveTypes = data?.getLeaveTypes || []

    const onClose = useCallback(
        () => {
            setEditItem({})
            onCloseEdit()
        }, [setEditItem, onCloseEdit]
    )

    const onEdit = useCallback(
        (data) => {
            setEditItem({...data})
            onShowEdit()
        }, [setEditItem, onShowEdit]
    )

    const onDelete = useCallback((id) => {
        deleteLeaveType({
            variables: {
                id
            },
        })
    }, [deleteLeaveType])

    const columnSpecificCellConfigs = useColumns({onDelete, onEdit})

    const [columns] = useColumnsInitializer(
        LeaveTypeUIDefaultState.LeaveTypesTableUIKey.columns,
        columnSpecificCellConfigs
    )

    const memoizedRows = useMemo(
        () =>
            leaveTypes.map(({_id, name, ...rest}) => {
                return {
                    id: _id,
                    name: t(name),
                    ...rest
                }
            }),
        [leaveTypes]
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
            slots={{
                noRowsOverlay: NoRowsOverlay,
                noResultsOverlay: NoRowsOverlay,
            }}
            slotProps={{
                noRowsOverlay: {
                    visible: networkStatus === NetworkStatus.ready && leaveTypes.length === 0,
                    loading: networkStatus === NetworkStatus.loading && leaveTypes.length === 0
                },
            }}
            disableRowSelectionOnClick
            localeText={lng === 'ro' ? roRO.components.MuiDataGrid.defaultProps.localeText : enUS.components.MuiDataGrid.defaultProps.localeText}
            disableColumnMenu
            disableColumnSelector
            rowSelection={false}
        />
            {showEdit && <EditLeaveType open={showEdit} onClose={onClose} data={editItem}/>}
        </>
    )
}

export default memo(LeaveTypesTable)
