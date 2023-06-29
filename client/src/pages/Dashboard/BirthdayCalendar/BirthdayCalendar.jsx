import {styled, Typography, alpha} from '@mui/material'
import React, {createRef, memo, useCallback, useContext} from 'react'
import {useTranslation} from 'react-i18next'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import ConfigsContext from "../../../contexts/ConfigsContext";
import {setYear, getYear, formatISO, format} from 'date-fns';
import tippy from 'tippy.js'

const StyledContainer = styled('div')(({theme}) => ({
    width: '100%',
    boxSizing: 'border-box',
    display: 'inline-block',
    background: `${theme.palette.background.paper}`,
    padding: '20px',
    borderRadius: '10px',
    margin: 'auto',
    [`& .fc-daygrid-day`]: {
        background: `${theme.palette.background.default}!important`,
    },
    '.fc-day-today': {
        backgroundColor: `${alpha(theme.palette.primary.main, 0.4)}!important`,
    },
    ['& .fc-scrollgrid-section']: {
        '> th': {
            background: `${theme.palette.background.paper}!important`,
        }
    },
    ['& .fc-event']: {
        '& .tippy-content': {
            fontWeight: 'bold',
            padding: '5px',
            borderRadius: '3px',
            background: `${theme.palette.warning.main}`,
            color: '#fff'
        }
    },
}))


const BirthdayCalendar = ({users}) => {
    const {t} = useTranslation()
    const calendarRef = createRef();
    const {companySettings} = useContext(ConfigsContext);

    const events = users.map(({name, department, dateOfBirth}, index) => {
        return {
            id: index,
            title: t('Birthday of ') + name,
            start: formatISO(setYear(new Date(dateOfBirth), getYear(new Date())), {representation: 'date'}),
            color: '#FFA32C',
        }
    })

    const handleHover = useCallback((arg) => {
        tippy(arg.el, {
            content: arg.event.title,
            appendTo: arg.el,
            onUntrigger(instance) {
                instance.destroy()
            },
        })
    }, [tippy])

    return (
        <StyledContainer>
            <Typography align={'center'} variant={'h5'}
                        sx={{paddingBottom: '25px'}}>{t('Birthday in ') + t(format(new Date(), 'MMMM yyyy'))}</Typography>
            <FullCalendar
                ref={calendarRef}
                events={events}
                height={450}
                plugins={[dayGridPlugin]}
                initialView={'dayGridMonth'}
                eventMouseEnter={handleHover}
                headerToolbar={false}
                editable={false}
                firstDay={companySettings?.weekStart}
                timeZone={companySettings?.timeZone}
            />
        </StyledContainer>
    )
}

export default memo(BirthdayCalendar)
