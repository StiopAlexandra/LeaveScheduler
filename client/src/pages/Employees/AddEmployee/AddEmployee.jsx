import React, {useCallback, memo} from 'react'
import {useTranslation} from "react-i18next"
import FocusLock from 'react-focus-lock'
import {Controller, useForm} from "react-hook-form";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {formatISO} from 'date-fns';
import pick from 'lodash.pick'

import {
    Divider,
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
    FormControlLabel,
    Checkbox,
    outlinedInputClasses
} from '@mui/material'
import Button from "../../../components/common/Button";
import {useMutation, useQuery} from '@apollo/client'
import GetDepartments from "../../../data/queries/GetDepartments";
import CreateUser from "../../../data/mutations/CreateUser";
import GetUsers from "../../../data/queries/GetUsers";
import useResponsive from "../../../hooks/useResponsive";
import {userTypes} from "../../../data/static/constants";

const PREFIX = 'AddEmployee'
const classes = {
    paper: `${PREFIX}-paper`,
    title: `${PREFIX}-title`,
    content: `${PREFIX}-content`,
    actions: `${PREFIX}-actions`,
    container: `${PREFIX}-container`,
}

const StyledDialog = styled(Dialog)(({theme}) => ({
    [`& .${classes.paper}`]: {
        [theme?.breakpoints.up('md')]: {
            maxWidth: '820px',
        },
        [theme?.breakpoints.down('md')]: {
            maxWidth: '430px',
        },
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
        gap: '20px',
        [theme?.breakpoints.up('md')]: {
            flexDirection: 'row',
        },
        [theme?.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
        [theme?.breakpoints.up("sm")]: {
            padding: `${theme?.spacing(2, 4)}!important`,
        },
        [theme?.breakpoints.down("sm")]: {
            padding: `${theme?.spacing(2, 3)}!important`,
        },
    },
    [`& .${classes.container}`]: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        [theme?.breakpoints.up("sm")]: {
            width: '350px'
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

const AddEmployee = ({open, onClose, dateFormat = 'd/MM/Y'}) => {
    const {t} = useTranslation();
    const isSmallScreen = useResponsive('down', 'md')

    const {
        control,
        formState: { dirtyFields, errors },
        handleSubmit,
    } = useForm({
        reValidateMode: 'onChange',
    })

    const {
        data
    } = useQuery(GetDepartments, {
        fetchPolicy: 'network-only',
    })

    const departments = data?.getDepartments || []

    const [createUser, {loading}] = useMutation(CreateUser, {
        refetchQueries: [
            {
                query: GetUsers,
            },
        ],
        awaitRefetchQueries: true,
    })

    const onSubmit = useCallback((data) => {
        const modifiedData = pick(
            data,
            Object.keys(dirtyFields).map((field) => field)
        )
        const {department, dateOfEmployment, dateOfBirth, ...rest} = modifiedData
        const departmentId = departments.find(item => item.name === department)?._id

        createUser({
            variables: {
                input: {
                    ...rest,
                    department: departmentId,
                    dateOfEmployment: formatISO(new Date(dateOfEmployment), {representation: 'date'}),
                    dateOfBirth: formatISO(new Date(dateOfBirth), {representation: 'date'})
                }
            }
        }).then(() => {
            onClose()
        })
    }, [onClose, dirtyFields, createUser, departments]);

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
                <DialogTitle className={classes.title}>{t('Add Employee')}</DialogTitle>
                <DialogContent className={classes.content} tabIndex={-1}>
                    <div className={classes.container}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {name, onChange, value}}) => {
                                return (
                                    <TextField
                                        required={true}
                                        variant="outlined"
                                        label={t('Full name')}
                                        placeholder={t('Full name')}
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
                            name="email"
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {name, onChange, value}}) => {
                                return (
                                    <TextField
                                        required={true}
                                        variant="outlined"
                                        label={t('Email')}
                                        placeholder={t('Email')}
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
                            name="phone"
                            control={control}
                            render={({field: {name, onChange, value}}) => {
                                return (
                                    <TextField
                                        variant="outlined"
                                        label={t('Phone')}
                                        placeholder={t('Phone')}
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
                            name="dateOfBirth"
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {name, onChange, value}}) => {
                                return (
                                    <DatePicker
                                        required={true}
                                        disableMaskedInput={true}
                                        inputFormat={dateFormat}
                                        label={t('Date of birth')}
                                        value={value || null}
                                        onChange={onChange}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    placeholder: t('Date of birth')
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                required={true}
                                                error={!!errors?.[name]}
                                            />
                                        }
                                    />)
                            }}
                        />
                        <Controller
                            name="address"
                            control={control}
                            render={({field: {name, onChange, value}}) => {
                                return (
                                    <TextField
                                        variant="outlined"
                                        label={t('Address')}
                                        placeholder={t('Address')}
                                        autoComplete={'off'}
                                        multiline
                                        rows={2}
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
                    </div>
                    <Divider orientation={isSmallScreen ? 'horizontal' : 'vertical'} flexItem/>
                    <div className={classes.container}>
                        <Controller
                            name="dateOfEmployment"
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {name, onChange, value}}) => {
                                return (
                                    <DatePicker
                                        required={true}
                                        disableMaskedInput={true}
                                        inputFormat={dateFormat}
                                        label={t('Date of employment')}
                                        value={value || null}
                                        onChange={onChange}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    placeholder: t('Date of employment')
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                required={true}
                                                error={!!errors?.[name]}
                                            />
                                        }
                                    />)
                            }}
                        />
                        <Controller
                            name="department"
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, value}, fieldState: {error}}) => {
                                return (
                                    <FormControl error={!!error}>
                                        <InputLabel required shrink>{t('Department')}</InputLabel>
                                        <InputLabel>{t('Department')}</InputLabel>
                                        <Select
                                            notched={true}
                                            fullWidth
                                            label={t('Department')}
                                            value={value || ''}
                                            onChange={onChange}
                                            input={<OutlinedInput required label={t('Department')}/>}
                                        >
                                            {departments.map(({_id, name}) => (
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
                            name="role"
                            control={control}
                            render={({field: {name, onChange, value}}) => {
                                return (
                                    <TextField
                                        variant="outlined"
                                        label={t('Role')}
                                        placeholder={t('Role')}
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
                            name="type"
                            control={control}
                            render={({field: {onChange, value}, fieldState: {error}}) => {
                                return (
                                    <FormControl error={!!error}>
                                        <InputLabel shrink>{t('Employment')}</InputLabel>
                                        <InputLabel>{t('Employment')}</InputLabel>
                                        <Select
                                            fullWidth
                                            notched={true}
                                            value={value || ''}
                                            onChange={onChange}
                                            label={t('Employment')}
                                            input={<OutlinedInput label={t('Employment')}/>}
                                        >
                                            {userTypes.map((type) => (
                                                <MenuItem
                                                    key={type}
                                                    value={type}
                                                >
                                                    {t(type)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )
                            }}
                        />
                        <Controller
                            name={'manager'}
                            control={control}
                            render={({field}) => (
                                <FormControlLabel
                                    sx={{display: 'flex', alignContent: 'center'}}
                                    control={<Checkbox color={'primary'} {...field} checked={!!field?.value}/>}
                                    label={t('Is manager')}
                                />
                            )}
                        />
                    </div>
                </DialogContent>
                <DialogActions className={classes.actions}>
                    <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)} loading={loading}>
                        {t('Save Employee')}
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        {t('Cancel')}
                    </Button>
                </DialogActions>
            </FocusLock>
        </StyledDialog>
    )
}

export default memo(AddEmployee)