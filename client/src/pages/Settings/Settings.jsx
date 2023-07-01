import { useMutation, useQuery } from '@apollo/client';
import { styled, Typography, CircularProgress, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formatISO } from 'date-fns';
import React, { useCallback, useContext, useEffect, memo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Button from '../../components/common/Button/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import ConfigsContext from '../../contexts/ConfigsContext';
import UpdateUser from '../../data/mutations/UpdateUser';
import GetUser from '../../data/queries/GetUser';

const PREFIX = 'Settings';
const classes = {
  content: `${PREFIX}-content`,
  button: `${PREFIX}-button`
};

const Loading = styled('div')(({ theme }) => ({
  height: '500px',
  width: '400px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

const StyledProfile = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: 'auto',
  maxWidth: '400px',
  borderRadius: '10px',
  background: theme.palette.background.default,
  [theme?.breakpoints.up('sm')]: {
    padding: theme?.spacing(3)
  },
  [theme?.breakpoints.down('sm')]: {
    padding: theme?.spacing(2)
  },
  [`& .${classes.content}`]: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%'
  },
  [`& .${classes.button}`]: {
    paddingTop: '20px',
    display: 'flex',
    justifyContent: 'flex-end'
  }
}));
const Settings = ({ id }) => {
  //“<Trans i18nKey="Drop receipt here <br/>or <u>upload file</u>" components={{ u: <u /> }} />

  const { t } = useTranslation();
  const { companySettings } = useContext(ConfigsContext);
  const dateFormat = companySettings?.dateFormat;

  const {
    control,
    reset,
    formState: { isDirty, errors },
    handleSubmit
  } = useForm({
    reValidateMode: 'onChange'
  });

  const { data, loading: queryLoading } = useQuery(GetUser, {
    variables: {
      id
    },
    fetchPolicy: 'network-only'
  });

  const user = data?.getUser;

  useEffect(() => {
    if (user) {
      reset({
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        dateOfBirth: user?.dateOfBirth,
        address: user?.address
      });
    }
  }, [reset, user]);

  const [updateUser, { loading }] = useMutation(UpdateUser, {
    refetchQueries: [
      {
        query: GetUser,
        variables: {
          id
        }
      }
    ],
    awaitRefetchQueries: true
  });

  const onSubmit = useCallback(
    (data) => {
      if (!isDirty) {
        return;
      }
      const { dateOfBirth, ...rest } = data;

      updateUser({
        variables: {
          input: {
            ...rest,
            id: id,
            dateOfBirth: formatISO(new Date(dateOfBirth), { representation: 'date' })
          }
        }
      });
    },
    [updateUser, id, isDirty]
  );

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          paddingBottom: '30px',
          paddingTop: '20px'
        }}>
        <Typography variant={'h4'}>{t('Settings')}</Typography>
      </div>
      <StyledProfile>
        {queryLoading ? (
          <Loading>
            <CircularProgress size={40} color="primary" />
          </Loading>
        ) : (
          <LoadingOverlay disabled={loading}>
            <div className={classes.content}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { name, onChange, value } }) => {
                  return (
                    <TextField
                      required={true}
                      variant="outlined"
                      label={t('Full name')}
                      placeholder={t('Full name')}
                      autoComplete={'off'}
                      fullWidth
                      InputLabelProps={{
                        shrink: true
                      }}
                      value={value || ''}
                      onChange={onChange}
                      error={!!errors?.[name]}
                    />
                  );
                }}
              />
              <Controller
                name="email"
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { name, onChange, value } }) => {
                  return (
                    <TextField
                      required={true}
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
                      error={!!errors?.[name]}
                    />
                  );
                }}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field: { name, onChange, value } }) => {
                  return (
                    <TextField
                      variant="outlined"
                      label={t('Phone')}
                      placeholder={t('Phone')}
                      autoComplete={'off'}
                      fullWidth
                      InputLabelProps={{
                        shrink: true
                      }}
                      value={value || ''}
                      onChange={onChange}
                      error={!!errors?.[name]}
                    />
                  );
                }}
              />
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { name, onChange, value } }) => {
                  return (
                    <DatePicker
                      required={true}
                      disableMaskedInput={true}
                      inputFormat={dateFormat}
                      label={t('Date of birth')}
                      value={value || null}
                      onChange={onChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            placeholder: t('Date of birth')
                          }}
                          InputLabelProps={{
                            shrink: true
                          }}
                          required={true}
                          error={!!errors?.[name]}
                        />
                      )}
                    />
                  );
                }}
              />
              <Controller
                name="address"
                control={control}
                render={({ field: { name, onChange, value } }) => {
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
                        shrink: true
                      }}
                      value={value || ''}
                      onChange={onChange}
                      error={!!errors?.[name]}
                    />
                  );
                }}
              />
            </div>
          </LoadingOverlay>
        )}
        <div className={classes.button}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            loading={loading}>
            {t('Update settings')}
          </Button>
        </div>
      </StyledProfile>
    </div>
  );
};

export default memo(Settings);
