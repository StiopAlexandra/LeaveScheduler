import React, {useCallback, useState, useEffect, memo} from 'react'
import {useTranslation} from "react-i18next"
import FocusLock from 'react-focus-lock'
import {Controller, useForm} from "react-hook-form";
import {NumericFormat} from 'react-number-format'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    styled,
    TextField,
    outlinedInputClasses
} from '@mui/material'
import Button from "../../../../components/common/Button";
import UpdateDepartment from "../../../../data/mutations/UpdateDepartment";
import {useMutation} from '@apollo/client'
import ColorPicker from "../../../../components/common/ColorPicker";
import GetDepartments from "../../../../data/queries/GetDepartments";

const PREFIX = 'EditDepartment'
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

const EditDepartment = ({data, open, onClose}) => {
    const {t} = useTranslation();

    const {id, name, maxAbsentEmployees, color} = data

    const [selectedColor, setSelectedColor] = useState(color);

    const {
        control,
        formState: {errors, isDirty},
        handleSubmit,
    } = useForm({
        reValidateMode: 'onChange',
        defaultValues: {
            name: name,
            maxAbsentEmployees: maxAbsentEmployees,
        },
    })

    const [updateDepartment, {loading}] = useMutation(UpdateDepartment, {
        refetchQueries: [
            {
                query: GetDepartments,
            },
        ],
        awaitRefetchQueries: true,
    })

    const onSubmit = useCallback(({name, maxAbsentEmployees}) => {
        if (!isDirty && selectedColor === color) {
            onClose()
            return
        }
        updateDepartment({
            variables: {
                input: {
                    id: id,
                    name: name,
                    maxAbsentEmployees: maxAbsentEmployees,
                    color: selectedColor
                },
            },
        }).then(() => {
            onClose()
        })
    }, [onClose, updateDepartment, selectedColor, id, isDirty, color]);

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
                    <DialogTitle className={classes.title}>{t('Edit Leave Type')}</DialogTitle>
                    <DialogContent className={classes.content} tabIndex={-1}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {name, onChange, value}}) => {
                                return (
                                    <TextField
                                        variant="outlined"
                                        label={t('Leave name')}
                                        placeholder={t('Leave name')}
                                        autoComplete={'off'}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={value}
                                        onChange={onChange}
                                        error={!!errors?.[name]}
                                    />
                                )
                            }}
                        />
                        <Controller
                            name={'maxAbsentEmployees'}
                            control={control}
                            rules={{required: true}}
                            render={({field: {onChange, value, name}}) => {
                                return (
                                    <NumericFormat
                                        value={value}
                                        customInput={TextField}
                                        allowNegative={false}
                                        InputProps={{
                                            size: 'medium',
                                            color: 'default',
                                            autoComplete: 'off',
                                            sx: {
                                                [`&:not(.${outlinedInputClasses.error}).Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                                                    borderColor: (theme) => theme.palette.primary.main,
                                                },
                                            }
                                        }}
                                        decimalScale={0}
                                        variant="outlined"
                                        label={t('Maximum absent employees')}
                                        placeholder={t('Maximum absent employees')}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onValueChange={(values) => {
                                            onChange(values.floatValue);
                                        }}
                                        error={!!errors?.[name]}
                                    />
                                )
                            }}
                        />
                        <ColorPicker
                            selectedColor={selectedColor}
                            setSelectedColor={setSelectedColor}
                        />
                    </DialogContent>
                    <DialogActions className={classes.actions}>
                        <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)} loading={loading}>
                            {t('Save Leave Type')}
                        </Button>
                        <Button variant="outlined" onClick={onClose}>
                            {t('Cancel')}
                        </Button>
                    </DialogActions>
                </FocusLock>
        </StyledDialog>
    )
}

export default memo(EditDepartment)