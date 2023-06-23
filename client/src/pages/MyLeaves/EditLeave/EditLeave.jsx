import React, {useCallback, memo, useContext} from 'react'
import {useTranslation} from "react-i18next"
import FocusLock from 'react-focus-lock'
import {Controller, useForm} from "react-hook-form";
import {formatISO, addDays} from 'date-fns';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    styled,
    TextField,
    Select,
    MenuItem,
    OutlinedInput,
    FormControl,
    InputLabel,
} from '@mui/material'
import Button from "../../../components/common/Button";
import UpdateUserLeave from "../../../data/mutations/UpdateUserLeave";
import {useMutation, useQuery} from '@apollo/client'
import {calculateWorkingDays} from "../../../utils/workingDays";
import GetLeaveTypes from "../../../data/queries/GetLeaveTypes";
import ConfigsContext from "../../../contexts/ConfigsContext";

const PREFIX = 'EditLeave'
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
        gap: '20px',
        [theme?.breakpoints.up("sm")]: {
            padding: `${theme?.spacing(2, 4)}!important`,
        },
        [theme?.breakpoints.down("sm")]: {
            padding: `${theme?.spacing(2, 3)}!important`,
        },
    },
    [`& .${classes.actions}`]: {
        backgroundColor: theme.palette.background.default,
        justifyContent: 'flex-start',
        [theme?.breakpoints.up("sm")]: {
            padding: theme?.spacing(2, 4),
        },
        [theme?.breakpoints.down("sm")]: {
            padding: theme?.spacing(2, 3),
        },
        borderTop: `1px solid ${theme.palette.divider}`,
        '& > :not(:first-of-type)': {
            marginLeft: theme.spacing(1),
        },
    },
}))

const EditLeave = ({data, open, onClose, refetch}) => {
    const {t} = useTranslation();
    const {companySettings} = useContext(ConfigsContext);
    const dateFormat = companySettings?.dateFormat

    const {id, startDate, endDate, notes, name} = data

    const {
        control,
        formState: {errors, isDirty},
        handleSubmit,
        getValues
    } = useForm({
        reValidateMode: 'onChange',
        defaultValues: {
            notes: notes || '',
            startDate: startDate,
            endDate: endDate,
            leaveType: name
        },
    })

    const {
        data: leaveTypesData
    } = useQuery(GetLeaveTypes, {
        fetchPolicy: 'network-only',
    })

    const leaveTypes = leaveTypesData?.getLeaveTypes?.filter((item) => item.name !== 'Public Holiday') || []


    const [updateUserLeave, {loading}] = useMutation(UpdateUserLeave)

    const onSubmit = useCallback(({notes, startDate, endDate, leaveType}) => {
        if (!isDirty) {
            onClose()
            return
        }
        const leaveTypeId = leaveTypes.find(item => item.name === leaveType)?._id
        const days = calculateWorkingDays(startDate, endDate, companySettings?.workingDays)
        updateUserLeave({
            variables: {
                input: {
                    id: id,
                    notes: notes,
                    startDate: formatISO(new Date(startDate), {representation: 'date'}),
                    endDate: formatISO(new Date(endDate), {representation: 'date'}),
                    leaveType: leaveTypeId,
                    days: days
                },
            },
        }).then(() => {
            refetch()
            onClose()
        })
    }, [onClose, updateUserLeave, leaveTypes, id, companySettings, isDirty]);


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
                <DialogTitle className={classes.title}>{t('Edit Request')}</DialogTitle>
                <DialogContent className={classes.content} tabIndex={-1}>
                    <Controller
                        name="leaveType"
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({field: {onChange, value}, fieldState: {error}}) => {
                            return (
                                <FormControl error={!!error}>
                                    <InputLabel>{t('Leave type')}</InputLabel>
                                    <Select
                                        fullWidth
                                        value={value}
                                        onChange={onChange}
                                        input={<OutlinedInput label={t('Leave type')}/>}
                                    >
                                        {leaveTypes.map(({_id, name}) => (
                                            <MenuItem
                                                key={_id}
                                                value={name}
                                            >
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )
                        }}
                    />
                    <Controller
                        name="startDate"
                        control={control}
                        rules={{
                            required: true,
                            validate: {
                                lessThanendDate: (date) => {
                                    if(getValues("endDate"))
                                        return new Date(date) < new Date(getValues("endDate"))
                                },
                            },
                        }}
                        defaultValue={new Date()}
                        render={({field: {name, onChange, value}}) => {
                            return (
                                <DatePicker
                                    disableMaskedInput={true}
                                    inputFormat={dateFormat}
                                    label={t('Start date')}
                                    defaultValue={startDate}
                                    value={value}
                                    onChange={onChange}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            error={!!errors?.[name]}
                                        />
                                    }
                                />)
                        }}
                    />
                    <Controller
                        name="endDate"
                        control={control}
                        rules={{
                            required: true,
                            validate: {
                                moreThanStartDate: (date) => {
                                    if(getValues("startDate"))
                                        return new Date(date) > new Date(getValues("startDate"))
                                },
                            },
                        }}
                        defaultValue={addDays(new Date(), 1)}
                        render={({field: {name, onChange, value}}) => {
                            return (
                                <DatePicker
                                    disableMaskedInput={true}
                                    inputFormat={dateFormat}
                                    label={t('End date')}
                                    defaultValue={endDate}
                                    value={value}
                                    onChange={onChange}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            error={!!errors?.[name]}
                                        />
                                    }
                                />
                            )
                        }}
                    />
                    <Controller
                        name="notes"
                        control={control}
                        render={({field: {name, onChange, value}}) => {
                            return (
                                <TextField
                                    variant="outlined"
                                    label={t('Notes')}
                                    placeholder={t('Notes')}
                                    autoComplete={'off'}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={value || ''}
                                    onChange={onChange}
                                    error={!!errors?.[name]}
                                />
                            )
                        }}
                    />
                </DialogContent>
                <DialogActions className={classes.actions}>
                    <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)} loading={loading}>
                        {t('Save Request')}
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        {t('Cancel')}
                    </Button>
                </DialogActions>
            </FocusLock>
        </StyledDialog>
    )
}

export default memo(EditLeave)