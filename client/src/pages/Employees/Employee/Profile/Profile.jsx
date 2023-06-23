import React, {useCallback, useEffect, memo} from 'react'
import {useTranslation} from 'react-i18next'
import {Controller, useForm} from 'react-hook-form'
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {formatISO} from 'date-fns';
import pick from 'lodash.pick'

import {
    Divider,
    CircularProgress,
    styled,
    TextField,
    Select,
    MenuItem,
    OutlinedInput,
    FormControl,
    InputLabel,
    FormControlLabel,
    Checkbox,
} from '@mui/material'
import Button from '../../../../components/common/Button'
import {useMutation, useQuery} from '@apollo/client'
import useResponsive from '../../../../hooks/useResponsive'
import {userTypes} from '../../../../data/static/constants'
import LoadingOverlay from '../../../../components/common/LoadingOverlay/LoadingOverlay'
import GetDepartments from "../../../../data/queries/GetDepartments";
import UpdateUser from "../../../../data/mutations/UpdateUser";

const PREFIX = 'Profile'
const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
    button: `${PREFIX}-button`,
}

const Loading = styled('div')(({theme}) => ({
    height: '400px',
    [theme?.breakpoints.up('md')]: {
        width: '740px',
    },
    [theme?.breakpoints.down('md')]: {
        width: '350px',
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}))

const StyledProfile = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    [theme?.breakpoints.up('md')]: {
        maxWidth: '740px',
    },
    [theme?.breakpoints.down('md')]: {
        maxWidth: '365px',
    },
    borderRadius: '10px',
    background: theme.palette.background.default,
    [theme?.breakpoints.up('sm')]: {
        padding: theme?.spacing(3),
    },
    [theme?.breakpoints.down('sm')]: {
        padding: theme?.spacing(2),
    },
    [`& .${classes.container}`]: {
        display: 'flex',
        gap: '20px',
        width: '100%',
        [theme?.breakpoints.up('md')]: {
            flexDirection: 'row',
        },
        [theme?.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
    },
    [`& .${classes.content}`]: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
    },
    [`& .${classes.button}`]: {
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'flex-end',
    },
}))

const Profile = ({user, refetch, queryLoading, dateFormat = 'd/MM/Y'}) => {
    const {t} = useTranslation()
    const isSmallScreen = useResponsive('down', 'md')

    const {
        control,
        reset,
        setValue,
        formState: {isDirty, dirtyFields, errors},
        handleSubmit,
    } = useForm({
        defaultValues: {
            ...user
        },
        reValidateMode: 'onChange',
    })

    const {
        data
    } = useQuery(GetDepartments, {
        fetchPolicy: 'network-only',
    })

    const departments = data?.getDepartments || []

    useEffect(() => {
        if (user) {
            const {department, ...rest} = user
            reset({
                ...rest
            })
        }
    }, [reset, user])

    useEffect(() => {
        if(departments.length){
            setValue('department', departments.find(item => item._id === user?.department?._id)?.name)
        }
    },[departments, user])

    const [updateUser, {loading}] = useMutation(UpdateUser)

    const onSubmit = useCallback((data) => {
        if (!isDirty) {
            return
        }
        const modifiedData = pick(
            data,
            Object.keys(dirtyFields).map((field) => field)
        )
        const {department, dateOfEmployment, dateOfBirth, ...rest} = modifiedData
        const departmentId = departments.find(item => item.name === department)?._id

        updateUser({
            variables: {
                input: {
                    ...rest,
                    id: user?._id,
                    department: departmentId,
                    dateOfEmployment: formatISO(new Date(dateOfEmployment), {representation: 'date'}),
                    dateOfBirth: formatISO(new Date(dateOfBirth), {representation: 'date'})
                }
            },
        }).then(() => {
            refetch()
        })
    }, [updateUser, user?._id, refetch, isDirty, dirtyFields, departments])

    return (
        <StyledProfile>
            {queryLoading ? (
                <Loading>
                    <CircularProgress size={40} color='primary'/>
                </Loading>
            ) : (
                <LoadingOverlay disabled={loading}>
                    <div className={classes.container}>
                        <div className={classes.content}>
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
                        <div className={classes.content}>
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
                    </div>
                </LoadingOverlay>
            )}
            <div className={classes.button}>
                <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)} loading={loading}>
                    {t('Save Profile')}
                </Button>
            </div>
        </StyledProfile>

    )
}

export default memo(Profile)