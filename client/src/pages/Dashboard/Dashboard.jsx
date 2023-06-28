import React from 'react'
import {useTranslation} from 'react-i18next';
import {styled, Typography} from '@mui/material'
import {useQuery} from '@apollo/client'
import {getYear} from 'date-fns';

import GetLeaveTypes from "../../data/queries/GetLeaveTypes";
import GetCompanyLeaves from "../../data/queries/GetCompanyLeaves";
import GetUserLeaves from "../../data/queries/GetUserLeaves";
import HistoryTable from "./HistoryTable";
import HolidayChart from "./HolidayChart";
import NextLeave from "./NextLeave";
import DepartmentChart from "./DepartmentChart";
import BirthdayCalendar from "./BirthdayCalendar";
import GetUsersDashboard from "../../data/queries/GetUsersDashboard";
import EmployeeChart from "./EmployeeChart";

const PREFIX = 'Dashboard'
const classes = {
    box: `${PREFIX}-box`,
    table: `${PREFIX}-table`,
    chart: `${PREFIX}-chart`,
    hello: `${PREFIX}-hello`,
}

const StyledContainer = styled('div')(({theme}) => ({
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '35px',
    borderRadius: '10px',
    boxSizing: 'border-box',
    background: theme.palette.background.default,
    [theme?.breakpoints.up('md')]: {
        maxWidth: '1100px',
        padding: '40px 30px',
    },
    [theme?.breakpoints.down('md')]: {
        width: '100%',
        padding: '30px 20px',
    },
    [`& .${classes.box}`]: {
        display: 'flex',
        gap: '35px',
        justifyContent: 'space-between',
        [theme?.breakpoints.up("md")]: {
            flexDirection: 'row'
        },
        [theme?.breakpoints.down("md")]: {
            flexDirection: 'column'
        },
        width: '100%',
    },
    [`& .${classes.chart}`]: {
        display: 'flex',
        gap: '35px',
        flexDirection: 'column',
        boxSizing: 'border-box',
        // margin: 'auto',
        flex: '0 1 300px'
    },
    [`& .${classes.table}`]: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
    },
    [`& .${classes.hello}`]: {
        background: `${theme.palette.background.paper}`,
        padding: '20px',
        borderRadius: '10px',
    },
}))

const Dashboard = ({id: userId}) => {
    const {t} = useTranslation();

    const {
        data: usersData,
    } = useQuery(GetUsersDashboard, {
        fetchPolicy: 'network-only',
    })

    const users = usersData?.getUsers || []

    const {
        data
    } = useQuery(GetLeaveTypes, {
        fetchPolicy: 'network-only',
    })

    const leaveTypes = data?.getLeaveTypes?.filter((item) => item.name !== 'Public Holiday') || []

    const {
        data: companyData
    } = useQuery(GetCompanyLeaves, {
        fetchPolicy: 'network-only',
    })

    const companyLeaves = companyData?.getCompanyLeaves || []

    const currentYearCompanyLeaves = companyLeaves.filter(({startDate}) => getYear(new Date()) === getYear(new Date(startDate)))

    const {
        data: userData,
    } = useQuery(GetUserLeaves, {
        variables: {
            filter: {
                user: userId,
                status: 'accepted'
            },
        },
        fetchPolicy: 'network-only',
    })

    const userLeaves = userData?.getUserLeaves || []

    const currentYearUserLeaves = userLeaves.filter(({startDate}) => getYear(new Date()) === getYear(new Date(startDate)))

    const nextPublicLeave = currentYearCompanyLeaves.filter(({startDate}) => new Date(startDate) > new Date()).map((item) => {
        return {
            startDate: item.startDate,
            endDate: item.endDate,
            type: item.leaveType.name,
            color: item.leaveType.color
        }
    })
    const nextUserLeave = currentYearUserLeaves.filter(({startDate}) => new Date(startDate) > new Date()).map((item) => {
        return {
            startDate: item.startDate,
            endDate: item.endDate,
            type: item.leaveType.name,
            color: item.leaveType.color
        }
    })


    var nextLeave = [...nextPublicLeave, ...nextUserLeave].sort(function (a, b) {
        return new Date(b.startDate) - new Date(a.startDate);
    });

    const history = [];
    const groupTaken = []

    currentYearUserLeaves.forEach(({leaveType, days}) => {
        const {name} = leaveType;
        if (!groupTaken[name]) {
            groupTaken[name] = [];
        }
        groupTaken[name].push({
            days
        });
    });
    leaveTypes.forEach(({name, allowanceDays, color}) => {
        let taken = 0
        for (let [key, value] of Object.entries(groupTaken)) {
            if (key === name) {
                taken = value.reduce((acc, {days}) => {
                    return acc + days
                }, 0)
            }
        }
        history.push({
            name,
            color,
            days: taken,
            available: allowanceDays ? allowanceDays - taken : '-',
            allowanceDays: allowanceDays || '-'
        });
    });

    const holiday = history.find((item) => item.name === 'Holiday')

    return (
        <StyledContainer>
            <div className={classes.box}>
                <div className={classes.table}>
                    <div className={classes.hello}>
                        <Typography variant={'h5'} align={'center'}>{t('Hello') + ',' + +'!'}</Typography>
                    </div>
                    <HistoryTable history={history}/>
                </div>
                <div className={classes.chart}>
                    <HolidayChart holiday={holiday}/>
                    <NextLeave nextLeave={nextLeave[0]}/>
                </div>
            </div>
            <div className={classes.box}>
                <div className={classes.chart}>
                    <DepartmentChart users={users}/>
                    <EmployeeChart users={users}/>
                </div>
                <BirthdayCalendar users={users}/>
            </div>

        </StyledContainer>
    )
}

export default Dashboard