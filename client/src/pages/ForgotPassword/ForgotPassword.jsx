import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { styled, useTheme, TextField, Typography, Link } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import Onboarding from '../../components/Onboarding/Onboarding';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import RequestResetPassword from '../../data/mutations/RequestResetPassword';
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

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState('');
  const theme = useTheme();

  const schema = Yup.object().shape({
    email: Yup.string().required('email-required').email('Not valid email')
  });

  const [requestResetPassword, { loading }] = useMutation(RequestResetPassword);

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
      requestResetPassword({
        variables: {
          email: data.email
        }
      }).then(({ data }) => {
        setOpen(data.requestResetPassword.message);
      });
    },
    [requestResetPassword, setOpen]
  );

  const onClose = useCallback(() => {
    setOpen('');
    navigate('/login', { replace: true });
  }, [navigate, setOpen]);

  return (
    <Onboarding>
      {open && <Alert messages={[open]} onClose={onClose} severity={'info'} />}
      <FormBox>
        <div
          style={{
            paddingBottom: '40px'
          }}>
          {theme.palette.mode === 'light' ? <LogoLight /> : <LogoDark />}
        </div>
        <StyledForm>
          <Typography variant={'h4'} align={'center'}>
            {t('Forgot your password?')}
          </Typography>
          <Typography variant={'body1'} align={'center'} sx={{ paddingBottom: '15px' }}>
            {t(
              'Please enter the email address associated with your account and we will send you a link to reset your password.'
            )}
          </Typography>
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
          <Button
            fullWidth
            variant={'contained'}
            color={'primary'}
            size={'large'}
            loading={loading}
            onClick={handleSubmit(onSubmit)}>
            {t('Send request')}
          </Button>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: '15px'
            }}>
            <ArrowBackIosIcon sx={{ color: '#26c644', height: '16px' }} />
            <Link component={RouterLink} to="/login" variant={'subtitle1'} underline={'none'}>
              {t('Return to sign in')}
            </Link>
          </div>
        </StyledForm>
      </FormBox>
    </Onboarding>
  );
};

export default ForgotPassword;
