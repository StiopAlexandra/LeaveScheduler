import { useMutation } from '@apollo/client';
import {
  Select,
  Divider,
  MenuItem,
  OutlinedInput,
  FormControl,
  InputLabel,
  styled,
  TextField,
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import React, { useCallback, useEffect, memo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Button from '../../../components/common/Button';
import LoadingOverlay from '../../../components/common/LoadingOverlay/LoadingOverlay';
import UpdateCompany from '../../../data/mutations/UpdateCompany';
import {
  countries,
  weekDays,
  dateFormats,
  timeFormats,
  timezones
} from '../../../data/static/constants';
import useResponsive from '../../../hooks/useResponsive';

const PREFIX = 'Details';
const classes = {
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`,
  button: `${PREFIX}-button`
};

const Loading = styled('div')(({ theme }) => ({
  height: '400px',
  [theme?.breakpoints.up('md')]: {
    width: '740px'
  },
  [theme?.breakpoints.down('md')]: {
    width: '350px'
  },
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

const StyledDetails = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: 'auto',
  borderRadius: '10px',
  background: theme.palette.background.default,
  [theme?.breakpoints.up('sm')]: {
    padding: theme?.spacing(3)
  },
  [theme?.breakpoints.down('sm')]: {
    padding: theme?.spacing(2)
  },
  [`& .${classes.container}`]: {
    display: 'flex',
    gap: '20px',
    [theme?.breakpoints.up('md')]: {
      flexDirection: 'row'
    },
    [theme?.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  },
  [`& .${classes.content}`]: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    [theme?.breakpoints.up('md')]: {
      width: '350px'
    }
  },
  [`& .${classes.button}`]: {
    paddingTop: '20px',
    display: 'flex',
    justifyContent: 'flex-end'
  }
}));

const Details = ({ company, refetch, queryLoading }) => {
  const { t } = useTranslation();
  const isSmallScreen = useResponsive('down', 'md');

  const {
    control,
    reset,
    formState: { isDirty, errors },
    handleSubmit
  } = useForm({
    defaultValues: {
      ...company
    },
    reValidateMode: 'onChange'
  });

  useEffect(() => {
    if (company) {
      reset({
        ...company
      });
    }
  }, [reset, company]);

  const [updateCompany, { loading }] = useMutation(UpdateCompany);

  const onSubmit = useCallback(
    ({ _id, ...rest }) => {
      if (!isDirty) {
        return;
      }
      updateCompany({
        variables: {
          input: {
            id: _id,
            ...rest
          }
        }
      }).then(() => {
        refetch();
      });
    },
    [updateCompany, refetch, isDirty]
  );

  return (
    <StyledDetails>
      {queryLoading ? (
        <Loading>
          <CircularProgress size={40} color="primary" />
        </Loading>
      ) : (
        <LoadingOverlay disabled={loading}>
          <div className={classes.container}>
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
                      variant="outlined"
                      label={t('Name')}
                      placeholder={t('Name')}
                      autoComplete={'off'}
                      fullWidth
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
                      variant="outlined"
                      label={t('Email')}
                      placeholder={t('Email')}
                      autoComplete={'off'}
                      fullWidth
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
                rules={{
                  required: true
                }}
                render={({ field: { name, onChange, value } }) => {
                  return (
                    <TextField
                      variant="outlined"
                      label={t('Phone')}
                      placeholder={t('Phone')}
                      autoComplete={'off'}
                      fullWidth
                      value={value || ''}
                      onChange={onChange}
                      error={!!errors?.[name]}
                    />
                  );
                }}
              />
              <Controller
                name="country"
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  return (
                    <FormControl error={!!error}>
                      <InputLabel>{t('Country')}</InputLabel>
                      <Select
                        fullWidth
                        value={value || ''}
                        onChange={onChange}
                        label={t('Country')}
                        input={<OutlinedInput label={t('Country')} />}>
                        {countries.map((country) => (
                          <MenuItem key={country} value={country}>
                            {country}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }}
              />
              <Controller
                name="address"
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { name, onChange, value } }) => {
                  return (
                    <TextField
                      variant="outlined"
                      label={t('Address')}
                      placeholder={t('Address')}
                      autoComplete={'off'}
                      multiline
                      maxRows={2}
                      fullWidth
                      value={value || ''}
                      onChange={onChange}
                      error={!!errors?.[name]}
                    />
                  );
                }}
              />
            </div>
            <Divider orientation={isSmallScreen ? 'horizontal' : 'vertical'} flexItem />
            <div className={classes.content}>
              <Controller
                name="timezone"
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  return (
                    <FormControl error={!!error}>
                      <InputLabel>{t('Timezone')}</InputLabel>
                      <Select
                        fullWidth
                        value={value || ''}
                        onChange={onChange}
                        input={<OutlinedInput label={t('Timezone')} />}>
                        {timezones.map(({ label, value }) => (
                          <MenuItem sx={{ whiteSpace: 'normal' }} key={label} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }}
              />
              <Controller
                name="dateFormat"
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  return (
                    <FormControl error={!!error}>
                      <InputLabel>{t('Date format')}</InputLabel>
                      <Select
                        fullWidth
                        value={value || ''}
                        onChange={onChange}
                        input={<OutlinedInput label={t('Date format')} />}>
                        {dateFormats.map(({ label, value }) => (
                          <MenuItem key={label} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }}
              />
              <Controller
                name="timeFormat"
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  return (
                    <FormControl error={!!error}>
                      <InputLabel>{t('Time format')}</InputLabel>
                      <Select
                        fullWidth
                        value={value || ''}
                        onChange={onChange}
                        input={<OutlinedInput label={t('Time format')} />}>
                        {timeFormats.map(({ label, value }) => (
                          <MenuItem key={label} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }}
              />
              <Controller
                name="weekStart"
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  return (
                    <FormControl error={!!error}>
                      <InputLabel>{t('Week starts on')}</InputLabel>
                      <Select
                        fullWidth
                        value={value || ''}
                        onChange={onChange}
                        input={<OutlinedInput label={t('Week starts on')} />}>
                        {weekDays.map(({ label, value }) => (
                          <MenuItem key={label} value={value}>
                            {t(label)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }}
              />
              <Controller
                name="workingDays"
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  return (
                    <FormControl error={!!error}>
                      <InputLabel>{t('Working days')}</InputLabel>
                      <Select
                        multiple
                        value={value || []}
                        onChange={onChange}
                        input={<OutlinedInput label={t('Working days')} />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={t(weekDays.find((item) => item.value === value).label)}
                              />
                            ))}
                          </Box>
                        )}>
                        {weekDays.map(({ label, value }) => (
                          <MenuItem key={label} value={value}>
                            {t(label)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }}
              />
            </div>
          </div>
        </LoadingOverlay>
      )}
      <div className={classes.button}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          loading={loading}>
          {t('Save Details')}
        </Button>
      </div>
    </StyledDetails>
  );
};

export default memo(Details);
