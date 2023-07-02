import { useMutation, useQuery } from '@apollo/client';
import {
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
  outlinedInputClasses
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formatISO, addDays } from 'date-fns';
import { getYear } from 'date-fns';
import React, { useCallback, memo, useContext, useState } from 'react';
import FocusLock from 'react-focus-lock';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Alert from '../../../components/common/Alert/Alert';
import Button from '../../../components/common/Button';
import ConfigsContext from '../../../contexts/ConfigsContext';
import CreateNotification from '../../../data/mutations/CreateNotification';
import CreateUserLeave from '../../../data/mutations/CreateUserLeave';
import GetLeaveTypes from '../../../data/queries/GetLeaveTypes';
import GetUsers from '../../../data/queries/GetUsers';
import { calculateWorkingDays } from '../../../utils/workingDays';

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

const AddLeave = ({ open, onClose, userId, start, end, refetch, userLeaves }) => {
  const { t } = useTranslation();
  const { companySettings } = useContext(ConfigsContext);
  const dateFormat = companySettings?.dateFormat;
  const [openAlert, setOpenAlert] = useState('');

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues
  } = useForm({
    reValidateMode: 'onChange'
  });

  const { data } = useQuery(GetLeaveTypes, {
    fetchPolicy: 'network-only'
  });

  const { data: adminsData } = useQuery(GetUsers, {
    variables: {
      filter: {
        manager: true
      }
    },
    fetchPolicy: 'network-only'
  });

  const leaveTypes = data?.getLeaveTypes?.filter((item) => item.name !== 'Public Holiday') || [];
  const admins = adminsData?.getUsers?.map(({ _id }) => _id);

  const [createUserLeave, { loading }] = useMutation(CreateUserLeave);
  const [createNotification] = useMutation(CreateNotification);

  const onSubmit = useCallback(
    ({ notes, startDate, endDate, leaveType }) => {
      const leaveTypeSelected = leaveTypes.find((item) => item.name === leaveType);
      const leaveTypeId = leaveTypeSelected?._id;
      const days = calculateWorkingDays(startDate, endDate, companySettings?.workingDays);

      const userLeaveType = userLeaves.filter(
        ({ leaveType: acceptedLeaveType, startDate: acceptedStartDate }) =>
          acceptedLeaveType.name === leaveType &&
          getYear(startDate) === getYear(new Date(acceptedStartDate))
      );
      const totalDaysOfLeaveType = userLeaveType.reduce((acc, { days }) => {
        return acc + days;
      }, 0);

      const allowedDays = leaveTypeSelected?.allowanceDays - totalDaysOfLeaveType;

      if (
        leaveTypeSelected?.allowanceDays &&
        totalDaysOfLeaveType + days > leaveTypeSelected?.allowanceDays
      ) {
        setOpenAlert(
          t('You only have {{allowed}} days left of {{name}} type.', {
            allowed: allowedDays,
            name: leaveType
          })
        );
        return;
      }

      createUserLeave({
        variables: {
          input: {
            user: userId,
            status: 'pending',
            notes: notes,
            startDate: formatISO(new Date(startDate), { representation: 'date' }),
            endDate: formatISO(new Date(endDate), { representation: 'date' }),
            leaveType: leaveTypeId,
            days: days
          }
        }
      }).then(() => {
        createNotification({
          variables: {
            input: {
              receiver: admins,
              message: 'send a leave request.',
              sender: userId
            }
          }
        });
        refetch();
        onClose();
      });
    },
    [onClose, createUserLeave, leaveTypes, userId, companySettings, admins, createNotification]
  );

  const onCloseAlert = useCallback(() => {
    setOpenAlert('');
  }, [setOpenAlert]);

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
      {openAlert && <Alert messages={[openAlert]} onClose={onCloseAlert} severity={'warning'} />}
      <FocusLock>
        <DialogTitle className={classes.title}>{t('Send Request')}</DialogTitle>
        <DialogContent className={classes.content} tabIndex={-1}>
          <Controller
            name="leaveType"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <FormControl error={!!error}>
                  <InputLabel>{t('Leave type')}</InputLabel>
                  <Select
                    fullWidth
                    value={value || ''}
                    onChange={onChange}
                    input={<OutlinedInput label={t('Leave type')} />}>
                    {leaveTypes.map(({ _id, name }) => (
                      <MenuItem key={_id} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
            defaultValue={start || new Date()}
            render={({ field: { name, onChange, value } }) => {
              return (
                <DatePicker
                  disableMaskedInput={true}
                  inputFormat={dateFormat}
                  label={t('Start date')}
                  value={value}
                  defaultValue={start || new Date()}
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
            defaultValue={end || addDays(new Date(), 1)}
            render={({ field: { name, onChange, value } }) => {
              return (
                <DatePicker
                  disableMaskedInput={true}
                  inputFormat={dateFormat}
                  label={t('End date')}
                  value={value}
                  defaultValue={end || addDays(new Date(), 1)}
                  onChange={onChange}
                  renderInput={(params) => <TextField {...params} error={!!errors?.[name]} />}
                />
              );
            }}
          />
          <Controller
            name="notes"
            control={control}
            render={({ field: { name, onChange, value } }) => {
              return (
                <TextField
                  variant="outlined"
                  label={t('Notes')}
                  placeholder={t('Notes')}
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
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            loading={loading}>
            {t('Send Request')}
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
