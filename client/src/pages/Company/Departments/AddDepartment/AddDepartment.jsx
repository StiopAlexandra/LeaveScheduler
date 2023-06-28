import React, {memo, useCallback, useState} from 'react'
import {useTranslation} from "react-i18next"
import FocusLock from 'react-focus-lock'
import {Controller, useForm} from "react-hook-form";
import { NumericFormat } from 'react-number-format'

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
import CreateDepartment from "../../../../data/mutations/CreateDepartment";
import {useMutation} from '@apollo/client'
import ColorPicker from "../../../../components/common/ColorPicker";
import GetDepartments from "../../../../data/queries/GetDepartments";

const PREFIX = 'AddDepartment'
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
    [`& > .${outlinedInputClasses.root}.${outlinedInputClasses.focused}.${outlinedInputClasses.notchedOutline}`]:
        {
            borderColor: theme.palette.primary.main,
        },
}))

const AddDepartment = ({open, onClose}) => {
    const {t} = useTranslation();

    const {
        control,
        formState: {errors},
        handleSubmit,
    } = useForm({
        reValidateMode: 'onChange',
    })

    const [selectedColor, setSelectedColor] = useState('');

    const [createDepartment, {loading}] = useMutation(CreateDepartment, {
        refetchQueries: [
            {
                query: GetDepartments,
            },
        ],
        awaitRefetchQueries: true,
    })

    const onSubmit = useCallback(({name, maxAbsentEmployees}) => {
        createDepartment({
            variables: {
                input: {
                    name: name,
                    maxAbsentEmployees: parseInt(maxAbsentEmployees),
                    color: selectedColor
                },
            },
        }).then(() => {
            onClose()
        })
    }, [onClose, createDepartment, selectedColor]);

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
                <DialogTitle className={classes.title}>{t('Add Department')}</DialogTitle>
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
                                    label={t('Department name')}
                                    placeholder={t('Department name')}
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
                    <Controller
                        name={'maxAbsentEmployees'}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value, name }}) => {
                            return (
                                <NumericFormat
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
                                    defaultValue={value}
                                    variant="outlined"
                                    label={t('Maximum absent employees')}
                                    placeholder={t('Maximum absent employees')}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
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
                        {t('Save Department')}
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        {t('Cancel')}
                    </Button>
                </DialogActions>
            </FocusLock>
        </StyledDialog>
    )
}

export default memo(AddDepartment)