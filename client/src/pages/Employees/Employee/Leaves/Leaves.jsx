import { useQuery } from '@apollo/client';
import allLocales from '@fullcalendar/core/locales-all';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import { styled } from '@mui/material';
import React, { useCallback, useState, createRef, useContext, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { addDays, formatISO } from 'date-fns';
import ConfigsContext from '../../../../contexts/ConfigsContext';
import GetCompanyLeaves from '../../../../data/queries/GetCompanyLeaves';
import GetUserLeaves from '../../../../data/queries/GetUserLeaves';
import useOpenState from '../../../../hooks/useOpenState';

import AddLeave from './AddLeave';
import CalendarHeader from './CalendarHeader';
import EditLeave from './EditLeave';

const StyledContainer = styled('div')(({ theme }) => ({
  margin: 'auto',
  boxSizing: 'border-box',
  [theme?.breakpoints.up('sm')]: {
    padding: '25px'
  },
  [theme?.breakpoints.down('sm')]: {
    padding: '25px 0px'
  },
  [theme?.breakpoints.up('md')]: {
    maxWidth: '1150px'
  },
  [theme?.breakpoints.down('md')]: {
    width: '100%'
  },
  borderRadius: '10px',
  background: theme.palette.background.default
}));

const Leaves = ({ userId }) => {
  const { t } = useTranslation();
  const { open: showAdd, onShow: onShowAdd, onClose: onCloseAdd } = useOpenState();
  const { open: showEdit, onShow: onShowEdit, onClose: onCloseEdit } = useOpenState();
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [editItem, setEditItem] = useState({});
  const { companySettings, lng } = useContext(ConfigsContext);

  const calendarRef = createRef();

  const { data: companyData } = useQuery(GetCompanyLeaves, {
    fetchPolicy: 'network-only'
  });

  const companyLeaves = companyData?.getCompanyLeaves || [];

  const { data: userData, refetch } = useQuery(GetUserLeaves, {
    variables: {
      filter: {
        user: userId,
        status: 'accepted'
      }
    },
    fetchPolicy: 'network-only'
  });

  const userLeaves = userData?.getUserLeaves || [];

  const events = [...userLeaves, ...companyLeaves].map(
    ({ _id: id, title, startDate, endDate, leaveType, notes }, index) => {
      return {
        ...(leaveType.name !== 'Public Holiday' && { leaveUserId: id }),
        id: index,
        title: title || leaveType.name,
        start: startDate,
        end: formatISO(addDays(new Date(endDate), 1), { representation: 'date' }),
        color: leaveType.color,
        leaveType: leaveType.name,
        notes: notes
      };
    }
  );

  const handleCloseAdd = useCallback(() => {
    setStart('');
    setEnd('');
    onCloseAdd();
  }, [onCloseAdd, setStart, setEnd]);

  const handleCloseEdit = useCallback(() => {
    setEditItem({});
    onCloseEdit();
  }, [onCloseEdit, setEditItem]);

  const onSelect = useCallback(
    ({ start, end }) => {
      setStart(start);
      setEnd(addDays(new Date(end), -1));
      onShowAdd();
    },
    [onShowAdd, setStart, setEnd]
  );

  const onEventClick = useCallback(
    ({ event }) => {
      const leaveType = event.extendedProps.leaveType;
      if (leaveType === 'Public Holiday') return;
      setEditItem({
        id: event.extendedProps.leaveUserId,
        startDate: event.start,
        endDate: addDays(new Date(event.end), -1),
        leaveType: leaveType,
        notes: event.extendedProps.notes
      });
      onShowEdit();
    },
    [onShowEdit, setEditItem]
  );

  return (
    <StyledContainer>
      <CalendarHeader calendarRef={calendarRef} onShowAdd={onShowAdd} userLeaves={userLeaves} />
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
        eventClick={onEventClick}
      />
      {showAdd && (
        <AddLeave
          open={showAdd}
          onClose={handleCloseAdd}
          dateFormat={companySettings?.dateFormat}
          userId={userId}
          start={start}
          end={end}
          refetch={refetch}
        />
      )}
      {showEdit && (
        <EditLeave
          open={showEdit}
          onClose={handleCloseEdit}
          editItem={editItem}
          dateFormat={companySettings?.dateFormat}
          refetch={refetch}
        />
      )}
    </StyledContainer>
  );
};

export default memo(Leaves);
