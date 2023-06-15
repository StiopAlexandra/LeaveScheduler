import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {Button, IconButton, styled, Typography} from '@mui/material'
import {getYear} from 'date-fns';

const PREFIX = 'LeavesHeader'
const classes = {
    year: `${PREFIX}-year`,
}

const StyledHeader = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '30px',
    [`& .${classes.year}`]: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        [theme?.breakpoints.up('sm')]: {
            marginRight: '53px'
        }
    }
}))

const CalendarHeader = ({calendarRef, onShowAdd}) => {
    const {t} = useTranslation();

    const [date, setDate] = useState(calendarRef.current?.getApi().getDate())

    useEffect(() => {
        const calApi = calendarRef.current?.getApi();

        if (calApi) {
            setDate(calApi.getDate());
        }
    }, [calendarRef]);

    const handleDateChange = (direction) => {
        const calApi = calendarRef.current?.getApi();
        if (calApi) {
            if (direction === 'prev') {
                calApi.prev();
            } else if (direction === 'next') {
                calApi.next();
            } else {
                calApi.today();
            }

            setDate(calApi.getDate());
        }
    };

    return (
        <StyledHeader>
            <Button
                color={'primary'}
                variant={'contained'}
                onClick={onShowAdd}
            >
                {t('Add Leave')}
            </Button>
            <div className={classes.year}>
                <IconButton
                    data-trackid="prev-button"
                    onClick={() => handleDateChange('prev')}>
                    <ArrowBackOutlinedIcon/>
                </IconButton>
                <Typography variant={'h4'}>{`${getYear(date)}`}</Typography>
                <IconButton
                    data-trackid="next-button"
                    onClick={() => handleDateChange('next')}>
                    <ArrowForwardIcon/>
                </IconButton>
            </div>
            <Button
                color={'primary'}
                variant={'outlined'}
                data-trackid="today-button"
                onClick={() => handleDateChange('today')}
            >
                {t('today')}
            </Button>
        </StyledHeader>
    )
}

export default CalendarHeader