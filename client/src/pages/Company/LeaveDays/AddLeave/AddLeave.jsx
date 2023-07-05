import { useMutation, useQuery } from '@apollo/client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  TextField,
  outlinedInputClasses
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formatISO } from 'date-fns';
import React, { useCallback, memo } from 'react';
import FocusLock from 'react-focus-lock';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Button from '../../../../components/common/Button';
import CreateCompanyLeave from '../../../../data/mutations/CreateCompanyLeave';
import GetCompanyLeaves from '../../../../data/queries/GetCompanyLeaves';
import GetLeaveTypes from '../../../../data/queries/GetLeaveTypes';

const PREFIX = 'AddLeave';
const classes = {
  paper: `${PREFIX}-paper`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`& .${classes.paper}`]: {
    maxWidth: '550px',
    borderRadius: '15px',
    backgroundColor: theme.palette.background.paper
  },
  [`& .${classes.title}`]: {
    [theme?.breakpoints.up('sm')]: {
      padding: theme?.spacing(4, 4, 2)
    },
    [theme?.breakpoints.down('sm')]: {
      padding: theme?.spacing(3, 3, 1)
    },
    lineHeight: '16px'
  },
  [`& .${classes.content}`]: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    [theme?.breakpoints.up('sm')]: {
      padding: `${theme?.spacing(2, 4)}!important`
    },
    [theme?.breakpoints.down('sm')]: {
      padding: `${theme?.spacing(2, 3)}!important`
    }
  },
  [`& .${classes.actions}`]: {
    backgroundColor: theme.palette.background.default,
    justifyContent: 'flex-start',
    [theme?.breakpoints.up('sm')]: {
      padding: theme?.spacing(2, 4)
    },
    [theme?.breakpoints.down('sm')]: {
      padding: theme?.spacing(2, 3)
    },
    borderTop: `1px solid ${theme.palette.divider}`,
    '& > :not(:first-of-type)': {
      marginLeft: theme.spacing(1)
    }
  },
  [`& > .${outlinedInputClasses.root}.${outlinedInputClasses.focused}.${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: theme.palette.primary.main
    }
}));

const AddLeave = ({ open, onClose, start, end, dateFormat }) => {
  const { t } = useTranslation();

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues
  } = useForm({
    reValidateMode: 'onChange'
  });

  const { data } = useQuery(GetLeaveTypes, {
    variables: {
      filter: {
        name: 'Public Holiday',
        default: true
      }
    },
    fetchPolicy: 'network-only'
  });

  const leaveType = data?.getLeaveTypes[0];

  const [createCompanyLeave, { loading }] = useMutation(CreateCompanyLeave, {
    refetchQueries: [
      {
        query: GetCompanyLeaves
      }
    ],
    awaitRefetchQueries: true
  });

  const onSubmit = useCallback(
    ({ title, startDate, endDate }) => {
      createCompanyLeave({
        variables: {
          input: {
            title: title,
            startDate: formatISO(new Date(startDate), { representation: 'date' }),
            endDate: formatISO(new Date(endDate), { representation: 'date' }),
            leaveType: leaveType._id
          }
        }
      })
        .then(() => {
          onClose();
        })
        .catch(() => {});
    },
    [onClose, createCompanyLeave, leaveType]
  );

  return (
    <StyledDialog
      fullWidth={true}
      onClose={onClose}
      open={open}
      disableEnforceFocus={true}
      PaperProps={{
        component: 'form',
        className: classes.paper
      }}>
      <FocusLock>
        <DialogTitle className={classes.title}>{t('Add Leave')}</DialogTitle>
        <DialogContent className={classes.content} tabIndex={-1}>
          <Controller
            name="title"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { name, onChange, value } }) => {
              return (
                <TextField
                  variant="outlined"
                  label={t('Title')}
                  placeholder={t('Title')}
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
            name="startDate"
            control={control}
            rules={{
              required: true,
              validate: {
                lessThanendDate: (date) => {
                  if (getValues('endDate')) return date <= getValues('endDate');
                }
              }
            }}
            defaultValue={start}
            render={({ field: { name, onChange, value } }) => {
              return (
                <DatePicker
                  disableMaskedInput={true}
                  inputFormat={dateFormat}
                  label={t('Start date')}
                  defaultValue={start}
                  value={value}
                  onChange={onChange}
                  renderInput={(params) => <TextField {...params} error={!!errors?.[name]} />}
                />
              );
            }}
          />
          <Controller
            name="endDate"
            control={control}
            rules={{
              required: true,
              validate: {
                moreThanStartDate: (date) => {
                  if (getValues('startDate')) return date >= getValues('startDate');
                }
              }
            }}
            defaultValue={end}
            render={({ field: { name, onChange, value } }) => {
              return (
                <DatePicker
                  disableMaskedInput={true}
                  inputFormat={dateFormat}
                  label={t('End date')}
                  defaultValue={end}
                  value={value}
                  onChange={onChange}
                  renderInput={(params) => <TextField {...params} error={!!errors?.[name]} />}
                />
              );
            }}
          />
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            loading={loading}>
            {t('Save Leave')}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            {t('Cancel')}
          </Button>
        </DialogActions>
      </FocusLock>
    </StyledDialog>
  );
};

export default memo(AddLeave);
