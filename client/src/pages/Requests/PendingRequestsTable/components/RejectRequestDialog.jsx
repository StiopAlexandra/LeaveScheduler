import React, {useCallback, memo} from 'react'
import {useTranslation} from "react-i18next"
import FocusLock from 'react-focus-lock'
import {Controller, useForm} from "react-hook-form";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    styled,
    TextField,
    Typography,
    outlinedInputClasses
} from '@mui/material'
import Button from "../../../../components/common/Button";
import {useMutation} from '@apollo/client'
import UpdateUserLeave from "../../../../data/mutations/UpdateUserLeave";
import CreateNotification from "../../../../data/mutations/CreateNotification";

const PREFIX = 'RejectRequest'
const classes = {
    paper: `${PREFIX}-paper`,
    title: `${PREFIX}-title`,
    content: `${PREFIX}-content`,
    actions: `${PREFIX}-actions`,
}

const StyledDialog = styled(Dialog)(({theme}) => ({
    [`& .${classes.paper}`]: {
        maxWidth: '550px',
        borderRadius: '15px',
        backgroundColor: theme.palette.background.paper,
    },
    [`& .${classes.title}`]: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        [theme?.breakpoints.up("sm")]: {
            padding: theme?.spacing(4, 4, 2),
        },
        [theme?.breakpoints.down("sm")]: {
            padding: theme?.spacing(3, 3, 1),
        },
        lineHeight: '16px',
    },
    [`& .${classes.content}`]: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        [theme?.breakpoints.up("sm")]: {
            padding: `${theme?.spacing(2, 4)}!important`,
        },
        [theme?.breakpoints.down("sm")]: {
            padding: `${theme?.spacing(2, 3)}!important`,
        },
    },
    [`& .${classes.actions}`]: {
        // backgroundColor: theme.palette.background.default,
        // justifyContent: 'flex-start',
        justifyContent: 'center',
        [theme?.breakpoints.up("sm")]: {
            padding: theme?.spacing(2, 4),
        },
        [theme?.breakpoints.down("sm")]: {
            padding: theme?.spacing(2, 3),
        },
        // borderTop: `1px solid ${theme.palette.divider}`,
        '& > :not(:first-of-type)': {
            marginLeft: theme.spacing(1),
        },
    },
    [`& > .${outlinedInputClasses.root}.${outlinedInputClasses.focused}.${outlinedInputClasses.notchedOutline}`]:
        {
            borderColor: theme.palette.primary.main,
        },
}))

const RejectRequestDialog = ({open, onClose, selectedItems, refetch, userId}) => {
    const {t} = useTranslation();

    const {
        control,
        formState: {errors},
        handleSubmit,
    } = useForm({
        reValidateMode: 'onChange',
    })

    const [updateUserLeave, {loading}] = useMutation(UpdateUserLeave)
    const [createNotification] = useMutation(CreateNotification)

    const onSubmit = useCallback(async ({reason}) => {
        try {
            await Promise.all(
                selectedItems.map(({id, user, leaveType}) =>
                    updateUserLeave({
                        variables: {
                            input: {
                                id,
                                reason,
                                status: 'rejected',
                            },
                        }
                    })
                        .then(() => {
                            createNotification({
                                variables: {
                                    input: {
                                        receiver: user._id,
                                        message: `rejected your "${leaveType.name}" leave request, because "${reason}".`,
                                        sender: userId
                                    }
                                }
                            })
                        })
                )
            )
        } finally {
            onClose()
            refetch()
        }
    }, [onClose, selectedItems, updateUserLeave, refetch, createNotification, userId]);

    return (
        <StyledDialog
            fullWidth={true}
            onClose={onClose}
            open={open}
            disableEnforceFocus={true}
            PaperProps={{
                component: 'form',
                className: classes.paper,
            }}
        >
            <FocusLock>
                <DialogTitle className={classes.title}>{t('Reject Leave Requests')}</DialogTitle>
                <DialogContent className={classes.content} tabIndex={-1}>
                    <Typography
                        variant={'subtitle1'}>{t('Are you sure you want to reject leave requests?')}</Typography>
                    <Controller
                        name="reason"
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({field: {name, onChange, value}}) => {
                            return (
                                <TextField
                                    variant="outlined"
                                    label={t('Reason')}
                                    placeholder={t('Reason')}
                                    autoComplete={'off'}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    multiline
                                    maxRows={3}
                                    value={value || ''}
                                    onChange={onChange}
                                    error={!!errors?.[name]}
                                />
                            )
                        }}
                    />
                </DialogContent>
                <DialogActions className={classes.actions}>
                    <Button variant="contained" color="error" onClick={handleSubmit(onSubmit)} loading={loading}>
                        {t('Reject requests')}
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        {t('Cancel')}
                    </Button>
                </DialogActions>
            </FocusLock>
        </StyledDialog>
    )
}

export default memo(RejectRequestDialog)