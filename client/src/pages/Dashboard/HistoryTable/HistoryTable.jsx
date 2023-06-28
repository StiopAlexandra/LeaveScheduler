import React, {useMemo, memo} from 'react'
import {useTranslation} from 'react-i18next'

import {useGridApiRef} from '@mui/x-data-grid'
import {
    DataGrid, gridClasses,
} from '@mui/x-data-grid';

import useColumns from "./utils/useColumns";
import HistoryUIDefaultState from "./utils/HistoryUIDefaultState";

import {Typography, styled} from '@mui/material'
import useColumnsInitializer from "../../../hooks/useColumnsInitializer";
import useMUILocales from "../../../hooks/useMUILocales";

const StyledGridOverlay = styled('div')(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: theme.palette.grey[600],
    paddingLeft: 20,
    paddingRight: 20
}))

const StyledContainer = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    background: `${theme.palette.background.paper}`,
    padding: '20px',
    borderRadius: '10px',
    boxSizing: 'border-box',
    [theme?.breakpoints.up('md')]: {
        maxWidth: '655px',
    },
    [theme?.breakpoints.down('md')]: {
        width: '100%',
    },
    //margin: 'auto',
}))

const DataGridStyledTable = styled(DataGrid)(({theme}) => ({
    border: 'none',
    height: 'auto',
    width: '100%',
    backgroundColor: theme.palette.background.default,
    [`& .${gridClasses.virtualScroller}`]: {
        // safari (:
        transform: 'translateZ(0)',
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
        },
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
    },
}))

const HistoryTable = ({history}) => {
    const gridApiRef = useGridApiRef()
    const gridLocales = useMUILocales()
    const {t} = useTranslation()

    const columnSpecificCellConfigs = useColumns()

    const [columns] = useColumnsInitializer(
        HistoryUIDefaultState.HistoryTableUIKey.columns,
        columnSpecificCellConfigs
    )

    const memoizedRows = useMemo(
        () =>
            history.map((item) => {
                return item
            }),
        [history]
    )

    const NoRowsOverlay = () => (
        <StyledGridOverlay>
            <Typography>{t(`There’s no data to show you right now.`)}</Typography>
        </StyledGridOverlay>
    )

    return (
        <StyledContainer>
            <Typography align={'center'} variant={'h5'}
                        sx={{paddingBottom: '25px'}}>{t('Leave history for current year')}</Typography>

            <DataGridStyledTable
            autoHeight
            apiRef={gridApiRef}
            columns={columns}
            rows={memoizedRows}
            getRowId={(row) => row.name}
            slots={{
                noRowsOverlay: NoRowsOverlay,
            }}
            disableRowSelectionOnClick
            localeText={gridLocales}
            disableColumnMenu
            hideFooter
        />
        </StyledContainer>
    )
}

export default memo(HistoryTable)
