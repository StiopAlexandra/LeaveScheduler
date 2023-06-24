import React, {useCallback, useState} from 'react'
import {styled, Typography, IconButton} from '@mui/material'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {getYear} from 'date-fns';
import {useTranslation} from 'react-i18next';
import ReportsTable from "./ReportsTable/ReportsTable";

const StyledTitle = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px'
}))

const Reports = ({id: userId}) => {
    const {t} = useTranslation();

    const [year, setYear] = useState(getYear(new Date()))

    const handleDateChange = useCallback((direction) => {
        if (direction === 'prev') {
            setYear((prev) => prev - 1)
        }
        if (direction === 'next') {
            setYear((prev) => prev + 1)
        }
    }, [setYear])

    return (
        <div style={{height: '100%', width: '100%'}}>
            <StyledTitle>
                <IconButton
                    data-trackid="prev-button"
                    onClick={() => handleDateChange('prev')}>
                    <ArrowBackOutlinedIcon/>
                </IconButton>
                <Typography variant={'h4'}>{`${year}`}</Typography>
                <IconButton
                    data-trackid="next-button"
                    onClick={() => handleDateChange('next')}>
                    <ArrowForwardIcon/>
                </IconButton>
            </StyledTitle>
            <div style={{marginTop: '30px'}}>
                <ReportsTable year={year}/>
            </div>
        </div>
    )
}

export default Reports