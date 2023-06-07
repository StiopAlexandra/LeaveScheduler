import React, {useCallback, useContext, useState} from 'react'
import {Controller, useForm} from "react-hook-form";
import {Link as RouterLink} from "react-router-dom";
import {styled, TextField, Typography, Link, InputAdornment, IconButton, useTheme } from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Onboarding from "../../components/Onboarding/Onboarding";
import {ReactComponent as LogoLight} from '../../resources/icons/logo-light.svg'
import {ReactComponent as LogoDark} from '../../resources/icons/logo-dark.svg'
import {yupResolver} from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next"

import Login from "../../data/mutations/SignIn";
import {useMutation} from '@apollo/client'
import UserContext from "../../contexts/UserContext";
import Button from "../../components/common/Button";
import ConfigsContext from "../../contexts/ConfigsContext";

const StyledForm = styled('form')(() => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
}))

const FormBox = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '15px',
    margin: theme?.spacing(2),
    [theme?.breakpoints.up("sm")]: {
        padding: theme?.spacing(5),
    },
    [theme?.breakpoints.down("sm")]: {
        padding: theme?.spacing(3),
    },
    boxShadow: '0px 10px 30px #00000012',
    maxWidth: '400px',
    zIndex: '2',
    flexGrow: 1,
}))

const SignIn = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const {signIn} = useContext(UserContext);
    const {setCompanySettings} = useContext(ConfigsContext);
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const schema = Yup.object().shape({
        email: Yup.string().required('email-required').email('Not valid email'),
        password: Yup
            .string()
            .required('password-required'),
        //.matches(/[0-9!"#\$%&'(\\)*\+,\-./:;<=>?@[\]^_`{|}~]+/i, 'at least 1 number OR special character'),
    })

    const [signin, {loading}] = useMutation(Login)

    const {
        control,
        formState: {errors},
        handleSubmit,
    } = useForm({
        reValidateMode: 'onChange',
        resolver: yupResolver(schema),
    })

    const onSubmit = useCallback((data) => {
        signin({
            variables: {
                email: data.email,
                password: data.password,
            },
        }).then((response) => {
            const {token, user} = response.data.signin
            const {company, ...rest} = user
            signIn(rest, token);
            setCompanySettings(company);
            navigate('/dashboard', { replace: true });
        })
    }, [signin, signIn, setCompanySettings, navigate])


    return (
        <Onboarding>
            <FormBox>
                <div style={{
                    paddingBottom: '25px'
                }}>
                    <Typography variant={'h4'} align={'center'}>Login to</Typography>
                    {
                        theme.palette.mode === 'light' ? <LogoLight/> : <LogoDark/>
                    }
                </div>
                <StyledForm>
                    <Controller
                        name="email"
                        control={control}
                        render={({field: {name, onChange, value}}) => {
                            return (
                                <TextField
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
                                    helperText={errors?.[name]?.message}
                                    error={!!errors?.[name]}
                                />
                            )
                        }}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({field: {name, onChange, value}}) => {
                            return (
                                <TextField
                                    variant="outlined"
                                    label={t('Password')}
                                    placeholder={t('Password')}
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete={'off'}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {
                                                        showPassword ? <VisibilityOutlinedIcon fill={'#777777'}/> : <VisibilityOffOutlinedIcon/>
                                                    }
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    value={value || ''}
                                    onChange={onChange}
                                    helperText={errors?.[name]?.message}
                                    error={!!errors?.[name]}
                                />
                            )
                        }}
                    />
                    <div
                        style={{
                            textAlign: 'right',
                            marginTop: '-15px'
                        }}
                    >
                        <Link
                            href='#'
                            variant={'body1'}
                            underline={'none'}
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <Button
                        fullWidth
                        variant={'contained'}
                        color={'primary'}
                        size={'large'}
                        loading={loading}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {t('Sign In')}
                    </Button>
                </StyledForm>
                <div
                    style={{
                        display: 'flex',
                        gap: '5px',
                        paddingTop: '15px',
                    }}
                >
                    <Typography>{t("Don't have an account?")}</Typography>
                    <Link
                        component={RouterLink}
                        to="/register"
                        variant={'body1'}
                        underline={'none'}
                    >
                        {t('Sign up')}
                    </Link>
                </div>
            </FormBox>
        </Onboarding>
    )
}

export default SignIn