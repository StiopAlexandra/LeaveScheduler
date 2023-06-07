import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'
import { useTranslation } from 'react-i18next'

import PropTypes from 'prop-types'
import { set, sub } from 'date-fns'
import React, { useState, useCallback } from 'react'
import {
    Box,
    List,
    Badge,
    Button,
    Paper,
    Avatar,
    Tooltip,
    Divider,
    Popover,
    Typography,
    IconButton,
    ListItemText,
    ListSubheader,
    ListItemAvatar,
    ListItemButton,
} from '@mui/material'

import { fToNow } from '../../utils/formatTime'

const NOTIFICATIONS = [
    {
        id: '1',
        title: 'Your order is placed',
        description: 'waiting for shipping',
        avatar: null,
        type: 'order_placed',
        createdAt: set(new Date(), { hours: 10, minutes: 30 }),
        isUnRead: true,
    },
    {
        id: '2',
        title: 'Minimal',
        description: 'answered to your comment on the Minimal',
        avatar: '/assets/images/avatars/avatar_2.jpg',
        type: 'friend_interactive',
        createdAt: sub(new Date(), { hours: 3, minutes: 30 }),
        isUnRead: true,
    },
    {
        id: '3',
        title: 'You have new message',
        description: '5 unread messages',
        avatar: null,
        type: 'chat_message',
        createdAt: sub(new Date(), { days: 1, hours: 3, minutes: 30 }),
        isUnRead: false,
    },
    {
        id: '4',
        title: 'You have new mail',
        description: 'sent from Guido Padberg',
        avatar: null,
        type: 'mail',
        createdAt: sub(new Date(), { days: 2, hours: 3, minutes: 30 }),
        isUnRead: false,
    },
    {
        id: '5',
        title: 'Delivery processing',
        description: 'Your order is being shipped',
        avatar: null,
        type: 'order_shipped',
        createdAt: sub(new Date(), { days: 3, hours: 3, minutes: 30 }),
        isUnRead: false,
    },
]

export default function NotificationsPopover() {
    const [notifications, setNotifications] = useState(NOTIFICATIONS)
    const { t } = useTranslation()
    const [open, setOpen] = useState(null)
    const totalUnRead = notifications.filter((item) => item.isUnRead === true).length

    const handleOpen = useCallback((event) => {
        setOpen(event.currentTarget)
    }, [setOpen])

    const handleClose = useCallback(() => {
        setOpen(null)
    }, [setOpen])

    const handleMarkAllAsRead = useCallback(() => {
        setNotifications(
            notifications.map((notification) => ({
                ...notification,
                isUnRead: false,
            }))
        )
    }, [setNotifications])

    return (
        <>
            <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40, mr: '10px !important', pl: 0 }}>
                <Badge badgeContent={totalUnRead} color="error">
                    <NotificationsOutlinedIcon/>
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
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">Notifications</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {t('You have {{count}} unread message', {count: totalUnRead})}
                        </Typography>
                    </Box>

                    {totalUnRead > 0 && (
                        <Tooltip title={t("Mark all as read")}>
                            <IconButton color="primary" onClick={handleMarkAllAsRead}>
                                <DoneAllOutlinedIcon/>
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Paper sx={{ maxHeight: { xs: 340, sm: 'auto' }, overflow: 'auto', backgroundColor: 'background.default' }} elevation={0}>
                    <List
                        disablePadding
                        subheader={
                            <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                                {t('New')}
                            </ListSubheader>
                        }
                    >
                        {notifications.slice(0, 2).map((notification) => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))}
                    </List>

                    <List
                        disablePadding
                        subheader={
                            <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                                {t('Before that')}
                            </ListSubheader>
                        }
                    >
                        {notifications.slice(2, 5).map((notification) => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))}
                    </List>
                </Paper>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box sx={{ p: 1 }}>
                    <Button fullWidth disableRipple>
                        {t('View All')}
                    </Button>
                </Box>
            </Popover>
        </>
    )
}

NotificationItem.propTypes = {
    notification: PropTypes.shape({
        createdAt: PropTypes.instanceOf(Date),
        id: PropTypes.string,
        isUnRead: PropTypes.bool,
        title: PropTypes.string,
        description: PropTypes.string,
        type: PropTypes.string,
        avatar: PropTypes.any,
    }),
}

function NotificationItem({ notification }) {
    const { avatar, title } = renderContent(notification);

    return (
        <ListItemButton
            sx={{
                py: 1.5,
                px: 2.5,
                mt: '1px',
                ...(notification.isUnRead && {
                    backgroundColor: 'action.selected',
                }),
            }}
        >
            <ListItemAvatar>
                <Avatar sx={{ background: 'background.neutral' }}>{avatar}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={title}
                secondary={
                    <Typography
                        variant="caption"
                        sx={{
                            mt: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.disabled',
                        }}
                    >
                        <ScheduleOutlinedIcon sx={{ mr: 0.5, width: 16, height: 16 }} />
                        {fToNow(notification.createdAt)}
                    </Typography>
                }
            />
        </ListItemButton>
    )
}

function renderContent(notification) {
    const title = (
        <Typography variant="subtitle2">
            {notification.title}
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                &nbsp; {notification.description}
            </Typography>
        </Typography>
    )

    // if (notification.type === 'order_placed') {
    //     return {
    //         avatar: <img alt={notification.title} src="/assets/icons/ic_notification_package.svg" />,
    //         title,
    //     };
    // }
    // if (notification.type === 'order_shipped') {
    //     return {
    //         avatar: <img alt={notification.title} src="/assets/icons/ic_notification_shipping.svg" />,
    //         title,
    //     };
    // }
    // if (notification.type === 'mail') {
    //     return {
    //         avatar: <img alt={notification.title} src="/assets/icons/ic_notification_mail.svg" />,
    //         title,
    //     };
    // }
    // if (notification.type === 'chat_message') {
    //     return {
    //         avatar: <img alt={notification.title} src="/assets/icons/ic_notification_chat.svg" />,
    //         title,
    //     };
    // }
    return {
        avatar: <img alt={notification.title} src="../../resources/images/avatar.jpg" />,
        title,
    }
}
