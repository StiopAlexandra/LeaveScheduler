import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { styled, TextField, Typography, Link, useTheme } from '@mui/material';
import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import Onboarding from '../../components/Onboarding/Onboarding';
import Button from '../../components/common/Button';
import AddCompany from '../../data/mutations/AddCompany';
import Register from '../../data/mutations/SignUp';
import { ReactComponent as LogoDark } from '../../resources/icons/logo-dark.svg';
import { ReactComponent as LogoLight } from '../../resources/icons/logo-light.svg';


const StyledForm = styled('form')(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
}));

const FormBox = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '15px',
  margin: theme?.spacing(2),
  [theme?.breakpoints.up('sm')]: {
    padding: theme?.spacing(5)
  },
  [theme?.breakpoints.down('sm')]: {
    padding: theme?.spacing(3)
  },
  boxShadow: '0px 10px 30px #00000012',
  maxWidth: '400px',
  zIndex: '2',
  flexGrow: 1
}));

const SignUp = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [signup, { loading: loadingRegister }] = useMutation(Register);
  const [addCompany, { loading: loading }] = useMutation(AddCompany);

  const schema = Yup.object().shape({
    company: Yup.string().trim().required('company-required'),
    email: Yup.string().required('email-required').email(t('Not valid email')),
    name: Yup.string().trim().required('name-required'),
    password: Yup.string().required('password-required').min(8, t('Your password is too short.')),
    //.matches(/[0-9!"#\$%&'(\\)*\+,\-./:;<=>?@[\]^_`{|}~]+/i, 'at least 1 number OR special character'),
    confirmPassword: Yup.string()
      .required('confirm-password-required')
      .oneOf([Yup.ref('password')], t('Your passwords do not match.'))
  });

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({
    reValidateMode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = useCallback(
    (data) => {
      addCompany({
        variables: {
          email: data.email,
          name: data.company
        }
      }).then((response) => {
        signup({
          variables: {
            name: data.name,
            email: data.email,
            password: data.password,
            manager: true,
            company: response.data.addCompany._id
          }
        }).then(() => {
          navigate('/login', { replace: true });
        });
      });
    },
    [addCompany, signup, navigate]
  );

  return (
    <Onboarding>
      <FormBox>
        <div
          style={{
            paddingBottom: '25px'
          }}>
          <Typography variant={'h4'} align={'center'}>
            Register with
          </Typography>
          {theme.palette.mode === 'light' ? <LogoLight /> : <LogoDark />}
        </div>
        <StyledForm>
          <Controller
            name="company"
            control={control}
            render={({ field: { name, onChange, value } }) => {
              return (
                <TextField
                  variant="outlined"
                  label={t('Company name')}
                  placeholder={t('Company name')}
                  autoComplete={'off'}
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={value || ''}
                  onChange={onChange}
                  helperText={errors?.[name]?.message}
                  error={!!errors?.[name]}
                />
              );
            }}
          />
          <Controller
            name="email"
            control={control}
            render={({ field: { name, onChange, value } }) => {
              return (
                <TextField
                  variant="outlined"
                  label={t('Email')}
                  placeholder={t('Email')}
                  autoComplete={'off'}
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={value || ''}
                  onChange={onChange}
                  helperText={errors?.[name]?.message}
                  error={!!errors?.[name]}
                />
              );
            }}
          />
          <Controller
            name="name"
            control={control}
            render={({ field: { name, onChange, value } }) => {
              return (
                <TextField
                  variant="outlined"
                  label={t('HR name')}
                  placeholder={t('HR name')}
                  autoComplete={'off'}
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={value || ''}
                  onChange={onChange}
                  helperText={errors?.[name]?.message}
                  error={!!errors?.[name]}
                />
              );
            }}
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { name, onChange, value } }) => {
              return (
                <TextField
                  type="password"
                  variant="outlined"
                  label={t('Password')}
                  placeholder={t('Password')}
                  autoComplete={'off'}
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={value || ''}
                  onChange={onChange}
                  helperText={errors?.[name]?.message}
                  error={!!errors?.[name]}
                />
              );
            }}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { name, onChange, value } }) => {
              return (
                <TextField
                  type="password"
                  variant="outlined"
                  label={t('Confirm Password')}
                  placeholder={t('Confirm Password')}
                  autoComplete={'off'}
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={value || ''}
                  onChange={onChange}
                  helperText={errors?.[name]?.message}
                  error={!!errors?.[name]}
                />
              );
            }}
          />
          <Button
            fullWidth
            variant={'contained'}
            color={'primary'}
            size={'large'}
            loading={loading || loadingRegister}
            onClick={handleSubmit(onSubmit)}>
            {t('Register')}
          </Button>
        </StyledForm>
        <div
          style={{
            display: 'flex',
            gap: '5px',
            paddingTop: '15px'
          }}>
          <Typography>{t('Already have an account?')}</Typography>
          <Link component={RouterLink} to="/login" variant={'body1'} underline={'none'}>
            {t('Sign in')}
          </Link>
        </div>
      </FormBox>
    </Onboarding>
  );
};

export default SignUp;
