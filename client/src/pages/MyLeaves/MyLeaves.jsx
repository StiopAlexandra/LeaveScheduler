import React, {useCallback, useState, createRef, useContext} from 'react'
import {useTranslation} from 'react-i18next';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import multiMonthPlugin from '@fullcalendar/multimonth'
import interactionPlugin from '@fullcalendar/interaction'
import allLocales from '@fullcalendar/core/locales-all'
import { styled } from '@mui/material'
import useOpenState from "../../hooks/useOpenState";
import AddLeave from "./AddLeave";
import {useQuery} from '@apollo/client'
import GetUserLeaves from "../../data/queries/GetUserLeaves";
import CalendarHeader from "./CalendarHeader";
import ConfigsContext from "../../contexts/ConfigsContext";
import GetCompanyLeaves from "../../data/queries/GetCompanyLeaves";

const StyledContainer = styled('div')(({theme}) => ({
    margin: 'auto',
    boxSizing: 'border-box',
    [theme?.breakpoints.up('sm')]: {
        padding: '25px',
    },
    [theme?.breakpoints.down('sm')]: {
        padding: '25px 0px',
    },
    [theme?.breakpoints.up('md')]: {
        maxWidth: '1150px',
    },
    [theme?.breakpoints.down('md')]: {
        width: '100%',
    },
    borderRadius: '10px',
    background: theme.palette.background.default,
}))



const MyLeaves = ({id: userId}) => {
    const {t} = useTranslation();
    const { open: showAdd, onShow: onShowAdd, onClose: onCloseAdd } = useOpenState()
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')

    const {companySettings, lng} = useContext(ConfigsContext);

    const calendarRef = createRef();

    const {
        data: companyData
    } = useQuery(GetCompanyLeaves, {
        fetchPolicy: 'network-only',
    })

    const companyLeaves = companyData?.getCompanyLeaves || []

    const {
        data: userData,
        refetch
    } = useQuery(GetUserLeaves, {
        variables: {
            filter: {
                user: userId,
            },
        },
        fetchPolicy: 'network-only',
    })

    const userLeaves = userData?.getUserLeaves || []
    const acceptedUserLeaves = userLeaves.filter(({status}) => status === 'accepted') || []
    const requests = userLeaves.filter(({status}) => status === 'pending') || []

    const events = [...acceptedUserLeaves, ...companyLeaves].map(({_id: id, title, startDate, endDate, leaveType, notes}, index) => {
        return {
            ...(leaveType.name !== 'Public Holiday' && {leaveUserId: id}),
            id: index,
            title: title || leaveType.name,
            start: startDate,
            end: endDate,
            color: leaveType.color,
            leaveType: leaveType.name,
            notes: notes,
        }
    })

    const handleCloseAdd = useCallback(() => {
        setStart('')
        setEnd('')
        onCloseAdd()
    }, [onCloseAdd, setStart, setEnd])

    const onSelect = useCallback(({start, end}) => {
        setStart(start)
        setEnd(end)
        onShowAdd()
    }, [onShowAdd, setStart, setEnd])

    return (
        <StyledContainer>
            <CalendarHeader calendarRef={calendarRef} onShowAdd={onShowAdd} userLeaves={acceptedUserLeaves} requests={requests} refetch={refetch}/>
            <FullCalendar
                ref={calendarRef}
                locales={allLocales}
                locale={lng}
                events={events}
                height={'auto'}
                plugins={[multiMonthPlugin, interactionPlugin]}
                initialView="multiMonthYear"
                selectable={true}
                selectMirror={true}
                headerToolbar={false}
                editable={false}
                multiMonthMinWidth={350}
                firstDay={companySettings?.weekStart}
                timeZone={companySettings?.timeZone}
                select={onSelect}
            />
            {
                showAdd && <AddLeave open={showAdd} onClose={handleCloseAdd} userId={userId} start={start} end={end} refetch={refetch} userLeaves={acceptedUserLeaves}/>
            }
        </StyledContainer>
    )
}

export default MyLeaves