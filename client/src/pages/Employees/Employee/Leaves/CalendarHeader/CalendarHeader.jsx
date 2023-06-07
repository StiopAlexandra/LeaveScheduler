import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {Button, IconButton, SvgIcon, styled, Stack, Typography} from '@mui/material'
import {getYear} from 'date-fns';
import HolidayChart from "./HolidayChart";
import GetLeaveTypes from "../../../../../data/queries/GetLeaveTypes";
import {useMutation, useQuery} from '@apollo/client'

const PREFIX = 'LeavesHeader'
const classes = {
    year: `${PREFIX}-year`,
    row: `${PREFIX}-rox`,
    grid: `${PREFIX}-grid`,
    table: `${PREFIX}-table`,
    chart: `${PREFIX}-chart`,
}

const StyledHeader = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    [`& .${classes.row}`]: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    [`& .${classes.grid}`]: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        padding: theme?.spacing(3),
    },
    [`& .${classes.table}`]: {
        gridColumn: 'span 2'
    },
    [`& .${classes.chart}`]: {
        gridColumn: 1 / 2
    },
    [`& .${classes.year}`]: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px'
    }
}))

const CalendarHeader = ({calendarRef, onShowAdd, userLeaves}) => {
    const {t} = useTranslation();

    const [date, setDate] = useState(calendarRef.current?.getApi().getDate())

    useEffect(() => {
        const calApi = calendarRef.current?.getApi();

        if (calApi) {
            setDate(calApi.getDate());
        }
    }, [calendarRef]);

    const {
        data
    } = useQuery(GetLeaveTypes, {
        variables: {
            filter: {
                name: "Holiday",
                default: true
            },
        },
        fetchPolicy: 'network-only',
    })

    const holiday = data?.getLeaveTypes[0]

    const userHoliday = userLeaves.filter(({leaveType, startDate}) => leaveType.name === 'Holiday' && getYear(date) === getYear(new Date(startDate)))
    const totalHoliday = userHoliday.reduce((acc, { days}) => {
        return acc + days
    }, 0)

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
            <div className={classes.row}>
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
            </div>
            <div className={classes.grid}>
                <div className={classes.chart}>
                    <Typography align={'center'} variant={'h5'} sx={{paddingBottom: '15px'}}>{t('Holiday Allowance')}</Typography>
                    <HolidayChart totalHoliday={totalHoliday} holiday={holiday}/>
                </div>
                <div className={classes.table}>
                    <Typography align={'center'} variant={'h5'} sx={{paddingBottom: '15px'}}>{t('Leave History')}</Typography>
                </div>
            </div>
        </StyledHeader>
    )
}

export default CalendarHeader