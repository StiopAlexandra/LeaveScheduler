import { useMutation, useSubscription, useQuery } from '@apollo/client';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import {
  Box,
  List,
  Badge,
  Paper,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItem
} from '@mui/material';
import React, { useState, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import UserContext from '../../contexts/UserContext';
import UpdateNotification from '../../data/mutations/UpdateNotification';
import GetNotifications from '../../data/queries/GetNotifications';
import SubscriptionNotification from '../../data/subscriptions/Notification';
import { fToNow } from '../../utils/formatTime';

export default function NotificationsPopover() {
  const { t } = useTranslation();
  const context = useContext(UserContext);
  const id = context?.user?._id;
  const [open, setOpen] = useState(null);

  const { data, refetch } = useQuery(GetNotifications, {
    variables: {
      filter: {
        receiver: id
      }
    },
    fetchPolicy: 'network-only'
  });

  useSubscription(SubscriptionNotification, {
    onData: () => refetch()
  });

  const notifications = data?.getNotifications?.filter(({ sender }) => id !== sender._id) || [];
  notifications.sort(function (a, b) {
    return new Date(b.created) - new Date(a.created);
  });

  const unreadNotifications = notifications?.filter(
    ({ read }) => read?.filter((item) => item.reader._id !== id).length === read.length
  );
  const readNotifications = notifications?.filter(({ read }) =>
    read?.find((item) => item.reader._id === id)
  );

  const unread = unreadNotifications.length;

  const handleOpen = useCallback(
    (event) => {
      setOpen(event.currentTarget);
    },
    [setOpen]
  );

  const handleClose = useCallback(() => {
    setOpen(null);
  }, [setOpen]);

  const [updateNotification] = useMutation(UpdateNotification);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await Promise.all(
        unreadNotifications.map(({ _id }) =>
          updateNotification({
            variables: {
              input: {
                id: _id,
                reader: id
              }
            }
          })
        )
      );
    } finally {
      refetch();
    }
  }, [unreadNotifications, id, updateNotification]);

  return (
    <>
      <IconButton
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{ width: 40, height: 40, mr: '10px !important', pl: 0 }}>
        <Badge badgeContent={unread} color="error">
          <NotificationsOutlinedIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
            backgroundColor: 'background.default'
          }
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">{t('Notifications')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('You have {{unread}} unread messages', { unread: unread })}
            </Typography>
          </Box>

          {unread > 0 && (
            <Tooltip title={t('Mark all as read')}>
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <DoneAllOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Paper
          sx={{
            maxHeight: { xs: 340, sm: 'auto' },
            overflow: 'auto',
            backgroundColor: 'background.default'
          }}
          elevation={0}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                {t('New')}
              </ListSubheader>
            }>
            {unreadNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                style={{ backgroundColor: 'action.selected' }}
              />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{
                  py: 1,
                  px: 2.5,
                  typography: 'overline',
                  borderTop: (theme) =>
                    theme.palette.mode === 'light' ? '1px dashed #bfc0c1' : '1px dashed #4c5057'
                }}>
                {t('Before that')}
              </ListSubheader>
            }>
            {readNotifications.map((notification) => (
              <NotificationItem key={notification._id} notification={notification} />
            ))}
          </List>
        </Paper>
      </Popover>
    </>
  );
}

function NotificationItem({ notification, style }) {
  return (
    <ListItem
      sx={{
        py: 1.5,
        px: 2.5,
        borderTop: (theme) =>
          theme.palette.mode === 'light' ? '1px solid #bfc0c1' : '1px solid #4c5057',
        ...style
      }}>
      <ListItemText
        primary={
          <Typography variant="subtitle2">
            {notification.sender.name}
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
              &nbsp; {notification.message}
            </Typography>
          </Typography>
        }
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}>
            <ScheduleOutlinedIcon sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.created)}
          </Typography>
        }
      />
    </ListItem>
  );
}
