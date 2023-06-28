import React, {memo} from 'react'
import {useTranslation} from 'react-i18next';
import {formatISO, addDays} from 'date-fns';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import {
    styled,
    Typography,
} from '@mui/material'

import {
    Timeline,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
    TimelineConnector,
    TimelineDot,
    TimelineContent
} from '@mui/lab'

const StyledContainer = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    background: `${theme.palette.background.paper}`,
    padding: '20px',
    borderRadius: '10px',
    minWidth: '300px',
    height: '190px',
    margin: 'auto'
}))

const StyledOverlay = styled('div')(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: theme.palette.grey[600],
    paddingLeft: 20,
    paddingRight: 20
}))


const NextLeave = ({nextLeave}) => {
    const {t} = useTranslation();

    return (
        <StyledContainer>
            <Typography align={'center'} variant={'h5'}
                        sx={{paddingBottom: '25px'}}>{t('Next Leave')}</Typography>
            {
                nextLeave ? <Timeline position="left" sx={{p: 0}}>
                    <TimelineItem sx={{height: '100%'}}>
                        <TimelineOppositeContent
                            sx={{m: 'auto 0', color: (theme) => theme.palette.text.secondary}}
                            variant="body2"
                        >
                            {formatISO(addDays(new Date(nextLeave?.startDate), 1)) === formatISO(new Date(nextLeave?.endDate)) ? `${nextLeave?.startDate}` : `${nextLeave?.startDate} - ${nextLeave?.endDate}`}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineConnector/>
                            <TimelineDot sx={{background: nextLeave?.color}}>
                                <EventAvailableOutlinedIcon/>
                            </TimelineDot>
                            <TimelineConnector/>
                        </TimelineSeparator>
                        <TimelineContent sx={{m: 'auto 0'}}>
                            <Typography variant="subtitle1">
                                {nextLeave?.type}
                            </Typography>
                        </TimelineContent>
                    </TimelineItem>
                </Timeline> : <StyledOverlay>
                    <Typography align={'center'}>{t(`There’s no data to show you right now.`)}</Typography>
                </StyledOverlay>
            }
        </StyledContainer>
    )
}

export default memo(NextLeave);