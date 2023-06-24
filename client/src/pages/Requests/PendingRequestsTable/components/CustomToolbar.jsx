import React, {memo} from 'react'
import {useTranslation} from "react-i18next"

import {
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector
} from '@mui/x-data-grid';
import {styled, buttonClasses} from '@mui/material'
import Button from "../../../../components/common/Button/Button";

const GridToolbarContainerStyled = styled(GridToolbarContainer)(({theme}) => ({
    padding: '8px 15px'
}))

const ApproveButtonStyled = styled(Button)(({theme}) => ({
    [`&.${buttonClasses.disabled}`]: {
        backgroundColor: theme.palette.primary.main,
        opacity: 0.4
    },
}))
const RejectButtonStyled = styled(Button)(({theme}) => ({
    [`&.${buttonClasses.disabled}`]: {
        backgroundColor: theme.palette.error.main,
        opacity: 0.4
    },
}))

const CustomToolbar = ({
                           setColumnsButtonEl,
                           setFilterButtonEl,
                           setFilterActive,
                           onApprove,
                           onReject,
                           selectedItems
                       }) => {
    const {t} = useTranslation();

    return (
        <GridToolbarContainerStyled>
            <ApproveButtonStyled variant="contained" color="primary" size={'small'} onClick={onApprove}
                    disabled={!selectedItems.length}>
                {t('Approve')}
            </ApproveButtonStyled>
            <RejectButtonStyled variant="contained" color="error" size={'small'} onClick={onReject}
                    disabled={!selectedItems.length}>
                {t('Reject')}
            </RejectButtonStyled>
            <div style={{flex: 1}}/>
            <div>
            <GridToolbarFilterButton
                ref={setFilterButtonEl}
                componentsProps={{
                    button: {
                        onClick: () => {
                            setFilterActive(true);
                        }
                    }
                }}
            />
            <GridToolbarColumnsButton
                ref={setColumnsButtonEl}
                onClick={() => {
                    setFilterActive(false);
                }}
            />
            <GridToolbarDensitySelector/>
            </div>
        </GridToolbarContainerStyled>
    )
}

export default memo(CustomToolbar)
