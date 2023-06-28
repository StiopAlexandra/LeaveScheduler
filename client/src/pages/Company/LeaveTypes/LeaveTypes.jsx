import React, {memo} from 'react'
import {useTranslation} from 'react-i18next';
import { styled } from '@mui/material'
import Button from "../../../components/common/Button/Button";
import useOpenState from "../../../hooks/useOpenState";
import {LeaveTypesTable} from "./LeaveTypesTable";
import AddLeaveType from "./AddLeaveType";

const StyledContainer = styled('div')(({theme}) => ({
    padding: '20px',
    borderRadius: '10px',
    boxSizing: 'border-box',
    background: theme.palette.background.default,
    [theme?.breakpoints.up('md')]: {
        width: '800px',
    },
    [theme?.breakpoints.down('md')]: {
        width: '100%',
    },
    margin: 'auto',
}))

const LeaveTypes = () => {
    const {t} = useTranslation();
    const { open: showAdd, onShow: onShowAdd, onClose: onCloseAdd } = useOpenState()

    return (
        <StyledContainer>
            <Button
                color={'primary'}
                variant={'contained'}
                onClick={onShowAdd}
            >
                {t('Add Leave Type')}
            </Button>
            {showAdd && <AddLeaveType open={showAdd} onClose={onCloseAdd}/>}
            <LeaveTypesTable/>
        </StyledContainer>
    )
}

export default memo(LeaveTypes)