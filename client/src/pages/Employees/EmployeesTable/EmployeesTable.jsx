import React, {useMemo, useCallback, memo, useState, useContext} from 'react'
import { useTranslation } from 'react-i18next'
import { NetworkStatus } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

import {useGridApiRef} from '@mui/x-data-grid'
import {
    DataGrid, gridClasses, GRID_CHECKBOX_SELECTION_COL_DEF, roRO, enUS
} from '@mui/x-data-grid';
import {useQuery, useMutation} from '@apollo/client'

import GetUsers from "../../../data/queries/GetUsers";
import useColumns from "./utils/useColumns";
import UserUIDefaultState from "./utils/UserUIDefaultState";

import {Typography, styled} from '@mui/material'
import CustomToolbar from "./components/CustomToolbar";
import DeleteUser from "../../../data/mutations/DeleteUser";
import useColumnsInitializer from "../../../hooks/useColumnsInitializer";
import ConfigsContext from "../../../contexts/ConfigsContext";

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
    width: 'auto',
    maxWidth: '1930px',
    margin: 'auto',
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

const EmployeesTable = () => {
    const gridApiRef = useGridApiRef()
    const {lng} = useContext(ConfigsContext)
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [isFilterActive, setFilterActive] = useState(false);
    const [filterButtonEl, setFilterButtonEl] = useState(null);
    const [columnsButtonEl, setColumnsButtonEl] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const [deleteUser, { loading: loading }] = useMutation(DeleteUser)

    const {
        data,
        networkStatus,
        refetch
    } = useQuery(GetUsers, {
        fetchPolicy: 'network-only',
    })

    const users = data?.getUsers || []

    const columnSpecificCellConfigs = useColumns()

    const [columns] = useColumnsInitializer(
        UserUIDefaultState.UsersTableUIKey.columns,
        columnSpecificCellConfigs
    )

    const memoizedRows = useMemo(
        () =>
            users.map(({_id: id, ...rest}) => {
                return {
                    id,
                    ...rest
                }
            }),
        [users]
    )

    const onItemClick = useCallback(
            (params) => {
                if (params.field === GRID_CHECKBOX_SELECTION_COL_DEF.field) {
                    return true
                }
                navigate(`/employees/${params.id}/profile`)
            },[]
        )

    const onDelete = useCallback(async () => {
        try{
            await Promise.all(
                selectedItems.map((id) =>
                    deleteUser({
                        variables: {
                            id
                        },
                    })
                )
            )
        } finally {
             refetch()
        }
    }, [selectedItems, deleteUser, refetch])

    const NoRowsOverlay = () => (
        <StyledGridOverlay>
            <Typography>{t(`There’s no data to show you right now.`)}</Typography>
        </StyledGridOverlay>
    )

    return (
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
                        visible: networkStatus === NetworkStatus.ready && users.length === 0,
                        loading: networkStatus === NetworkStatus.loading && users.length === 0
                    },
                    panel: {
                        anchorEl: isFilterActive ? filterButtonEl : columnsButtonEl,
                        placement: "bottom-end",
                    },
                    toolbar: {
                        setColumnsButtonEl,
                        setFilterButtonEl,
                        setFilterActive,
                        selectedItems,
                        onDelete
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
                onCellClick={onItemClick}
                disableRowSelectionOnClick
                localeText={lng === 'ro' ? roRO.components.MuiDataGrid.defaultProps.localeText : enUS.components.MuiDataGrid.defaultProps.localeText}
                checkboxSelection
                disableColumnMenu
            />
    )
}

export default memo(EmployeesTable)
