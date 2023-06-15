import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {Button, IconButton, styled, Typography} from '@mui/material'
import {getYear} from 'date-fns';
import HolidayChart from "./HolidayChart";
import GetLeaveTypes from "../../../data/queries/GetLeaveTypes";
import {useQuery} from '@apollo/client'
import {compareAsc} from 'date-fns';
import UserLeavesTable from "./UserLeavesTable";
import PendingRequestTable from "./PendingRequestTable/PendingRequestTable";

const PREFIX = 'LeavesHeader'
const classes = {
    year: `${PREFIX}-year`,
    row: `${PREFIX}-rox`,
    grid: `${PREFIX}-grid`,
    table: `${PREFIX}-table`,
    pendingTable: `${PREFIX}-pendingTable`,
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme?.spacing(3),
        [theme?.breakpoints.up('md')]: {
            padding: theme?.spacing(3),
        },
        [theme?.breakpoints.down('md')]: {
            padding: theme?.spacing(3, 0),
        },
    },
    [`& .${classes.table}`]: {
        [theme?.breakpoints.up('sm')]: {
            width: '715px',
        },
        [theme?.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    [`& .${classes.pendingTable}`]: {
        [theme?.breakpoints.up('sm')]: {
            width: '815px',
        },
        [theme?.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    [`& .${classes.chart}`]: {
    },
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

const CalendarHeader = ({calendarRef, onShowAdd, userLeaves, requests, refetch}) => {
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

    const currentYearRequests = requests.filter(({startDate}) => getYear(date) === getYear(new Date(startDate)))
    const currentYearUserLeaves = userLeaves.filter(({startDate}) => getYear(date) === getYear(new Date(startDate)))
    const pastUserLeaves = currentYearUserLeaves.filter(({
                                                             startDate,
                                                             endDate
                                                         }) => compareAsc(new Date(startDate), new Date()) < 0 && compareAsc(new Date(endDate), new Date()) < 0)
    const upcomingUserLeaves = currentYearUserLeaves.filter(({
                                                                 startDate,
                                                                 endDate
                                                             }) => compareAsc(new Date(startDate), new Date()) >= 0 || compareAsc(new Date(endDate), new Date()) >= 0)

    const userHoliday = userLeaves.filter(({
                                               leaveType,
                                               startDate
                                           }) => leaveType.name === 'Holiday' && getYear(date) === getYear(new Date(startDate)))
    const totalHoliday = userHoliday.reduce((acc, {days}) => {
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
                    {t('Send Request')}
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
                    <Typography align={'center'} variant={'h5'}
                                sx={{paddingBottom: '25px'}}>{t('Holiday Allowance')}</Typography>
                    <HolidayChart totalHoliday={totalHoliday} holiday={holiday}/>
                </div>
                <div className={classes.table}>
                    <Typography align={'center'} variant={'h5'}
                                sx={{paddingBottom: '25px'}}>{t('Curren & Upcoming Leaves')}</Typography>
                    <UserLeavesTable userLeaves={upcomingUserLeaves}/>
                </div>
                <div className={classes.table}>
                    <Typography align={'center'} variant={'h5'}
                                sx={{paddingBottom: '25px'}}>{t('Past Leaves')}</Typography>
                    <UserLeavesTable userLeaves={pastUserLeaves}/>
                </div>
                <div className={classes.pendingTable}>
                    <Typography align={'center'} variant={'h5'}
                                sx={{paddingBottom: '25px'}}>{t('Pending for review')}</Typography>
                    <PendingRequestTable requests={currentYearRequests} refetch={refetch}/>
                </div>
            </div>
        </StyledHeader>
    )
}

export default CalendarHeader