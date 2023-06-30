import { useQuery } from '@apollo/client';
import allLocales from '@fullcalendar/core/locales-all';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import { styled } from '@mui/material';
import React, { createRef, memo, useCallback, useContext, useState } from 'react';

import ConfigsContext from '../../../contexts/ConfigsContext';
import GetCompanyLeaves from '../../../data/queries/GetCompanyLeaves';
import useOpenState from '../../../hooks/useOpenState';

import AddLeave from './AddLeave';
import CalendarHeader from './CalendarHeader';
import EditLeave from './EditLeave';

const StyledContainer = styled('div')(({ theme }) => ({
  maxWidth: '1150px',
  margin: 'auto',
  [theme?.breakpoints.up('sm')]: {
    padding: '25px'
  },
  [theme?.breakpoints.down('sm')]: {
    padding: '25px 0px'
  },
  borderRadius: '10px',
  background: theme.palette.background.default
}));

const LeaveDays = ({ company }) => {
  const { open: showAdd, onShow: onShowAdd, onClose: onCloseAdd } = useOpenState();
  const { open: showEdit, onShow: onShowEdit, onClose: onCloseEdit } = useOpenState();
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [editItem, setEditItem] = useState({});
  const calendarRef = createRef();
  const { lng } = useContext(ConfigsContext);

  const { data } = useQuery(GetCompanyLeaves, {
    fetchPolicy: 'network-only'
  });

  const companyLeaves = data?.getCompanyLeaves || [];

  const events = companyLeaves.map(({ _id: id, title, startDate, endDate, leaveType }) => {
    return {
      id,
      title,
      start: startDate,
      end: endDate,
      color: leaveType.color,
      groupId: leaveType._id
    };
  });

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
      setEnd(end);
      onShowAdd();
    },
    [onShowAdd, setStart, setEnd]
  );

  const onEventClick = useCallback(
    ({ event }) => {
      setEditItem({
        id: event.id,
        title: event.title,
        startDate: event.start,
        endDate: event.end
        //leaveType: event.groupId
      });
      onShowEdit();
    },
    [onShowEdit, setEditItem]
  );

  return (
    <StyledContainer>
      <CalendarHeader calendarRef={calendarRef} onShowAdd={onShowAdd} />
      <FullCalendar
        locales={allLocales}
        locale={lng}
        ref={calendarRef}
        events={events}
        height={'auto'}
        plugins={[multiMonthPlugin, interactionPlugin]}
        initialView="multiMonthYear"
        selectable={true}
        selectMirror={true}
        headerToolbar={false}
        longPressDelay={1}
        editable={false}
        multiMonthMinWidth={350}
        firstDay={company?.weekStart}
        timeZone={company?.timeZone}
        select={onSelect}
        eventClick={onEventClick}
      />
      {showAdd && (
        <AddLeave
          open={showAdd}
          onClose={handleCloseAdd}
          start={start}
          end={end}
          dateFormat={company?.dateFormat}
        />
      )}
      {showEdit && (
        <EditLeave
          open={showEdit}
          onClose={handleCloseEdit}
          editItem={editItem}
          dateFormat={company?.dateFormat}
        />
      )}
    </StyledContainer>
  );
};

export default memo(LeaveDays);
