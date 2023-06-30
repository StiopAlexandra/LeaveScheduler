import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { styled, TextField, Typography, InputAdornment, IconButton, useTheme } from '@mui/material';
import jwtDecode from 'jwt-decode';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import Onboarding from '../../components/Onboarding/Onboarding';
import Button from '../../components/common/Button';
import UpdatePassword from '../../data/mutations/ResetPassword';
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

const ResetPassword = () => {
  const { resetToken } = useParams();
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const token = jwtDecode(resetToken);
  const id = token.userId;
  const [showPassword, setShowPassword] = useState(false);

  const schema = Yup.object().shape({
    password: Yup.string().required('password-required')
    //.matches(/[0-9!"#\$%&'(\\)*\+,\-./:;<=>?@[\]^_`{|}~]+/i, 'at least 1 number OR special character'),
  });

  const [resetPassword, { loading }] = useMutation(UpdatePassword);

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
      resetPassword({
        variables: {
          id: id,
          password: data.password
        }
      }).then(() => {
        navigate('/login', { replace: true });
      });
    },
    [id, resetPassword, navigate]
  );

  return (
    <Onboarding>
      <FormBox>
        <div
          style={{
            paddingBottom: '20px'
          }}>
          {theme.palette.mode === 'light' ? <LogoLight /> : <LogoDark />}
        </div>
        {token.exp * 1000 > Date.now() ? (
          <StyledForm>
            <Typography variant={'h4'} align={'center'} sx={{ paddingBottom: '25px' }}>
              {t('Reset password for your account')}
            </Typography>
            <Controller
              name="password"
              control={control}
              render={({ field: { name, onChange, value } }) => {
                return (
                  <TextField
                    variant="outlined"
                    label={t('Password')}
                    placeholder={t('Password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={'off'}
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? (
                              <VisibilityOutlinedIcon fill={'#777777'} />
                            ) : (
                              <VisibilityOffOutlinedIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
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
              {t('Save password')}
            </Button>
          </StyledForm>
        ) : (
          <Typography variant={'body'} align={'center'}>
            {t('Your invitation has expired or is no longer valid. ')}
            {t('Please contact your project manager and ask for a new invite.')}
          </Typography>
        )}
      </FormBox>
    </Onboarding>
  );
};

export default ResetPassword;
