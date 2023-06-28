import React, {useEffect, useState, memo} from 'react'
import {useTranslation} from 'react-i18next';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {Button, IconButton, styled, Typography} from '@mui/material'
import {getYear} from 'date-fns';
import HolidayChart from "./HolidayChart";
import GetLeaveTypes from "../../../../../data/queries/GetLeaveTypes";
import {useQuery} from '@apollo/client'
import {differenceInDays} from 'date-fns';
import HistoryTable from "./HistoryTable";

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
        display: 'flex',
        [theme?.breakpoints.up('md')]: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: theme?.spacing(4, 3),
            height: 270,
        },
        [theme?.breakpoints.down('md')]: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme?.spacing(3, 0),
            gap: theme?.spacing(3),
        },
    },
    [`& .${classes.table}`]: {
        [theme?.breakpoints.up('sm')]: {
           width: '555px',
        },
        [theme?.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    [`& .${classes.chart}`]: {
        display: 'flex',
        flexDirection: 'column',
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

    const currentYearUserLeaves = userLeaves.filter(({startDate}) => getYear(date) === getYear(new Date(startDate)))

    const groups = {};

    currentYearUserLeaves.forEach((userLeave) => {
        const { leaveType, startDate, endDate, days } = userLeave;
        const { name, color } = leaveType;
        const total = differenceInDays(new Date(endDate), new Date(startDate))
        if (!groups[name]) {
            groups[name] = [];
        }
        groups[name].push({
            color,
            total,
            days
        });
    });

    const history = []

    for (let [key, value] of Object.entries(groups)) {
        const total = value.reduce((acc, { total }) => {
            return acc + total
        }, 0)
        const days = value.reduce((acc, { days }) => {
            return acc + days
        }, 0)

        const color = value[0].color

        history.push({
            name: key,
            total,
            days,
            color
        })
    }

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
                    <Typography align={'center'} variant={'h5'} sx={{paddingBottom: '25px'}}>{t('Holiday Allowance')}</Typography>
                    <HolidayChart totalHoliday={totalHoliday} holiday={holiday}/>
                </div>
                <div className={classes.table}>
                    <Typography align={'center'} variant={'h5'} sx={{paddingBottom: '25px'}}>{t('Leave History')}</Typography>
                    <HistoryTable history={history}/>
                </div>
            </div>
        </StyledHeader>
    )
}

export default memo(CalendarHeader)