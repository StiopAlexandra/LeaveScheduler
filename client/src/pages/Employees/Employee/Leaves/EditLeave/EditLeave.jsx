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
import { formatISO } from 'date-fns';
import React, { useCallback, memo, useContext } from 'react';
import FocusLock from 'react-focus-lock';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Button from '../../../../../components/common/Button';
import ConfigsContext from '../../../../../contexts/ConfigsContext';
import DeleteUserLeave from '../../../../../data/mutations/DeleteUserLeave';
import UpdateUserLeave from '../../../../../data/mutations/UpdateUserLeave';
import GetLeaveTypes from '../../../../../data/queries/GetLeaveTypes';
import { calculateWorkingDays } from '../../../../../utils/workingDays';

const PREFIX = 'EditLeave';
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

const EditLeave = ({ open, onClose, editItem, dateFormat, refetch }) => {
  const { t } = useTranslation();
  const { id, notes, startDate, endDate, leaveType } = editItem;
  const { companySettings } = useContext(ConfigsContext);

  const { data } = useQuery(GetLeaveTypes, {
    fetchPolicy: 'network-only'
  });

  const leaveTypes = data?.getLeaveTypes?.filter((item) => item.name !== 'Public Holiday') || [];

  const {
    control,
    formState: { isDirty, errors },
    handleSubmit,
    getValues
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      notes: notes || '',
      startDate: startDate,
      endDate: endDate,
      leaveType: leaveType
    }
  });

  const [updateUserLeave, { loading: editLoading }] = useMutation(UpdateUserLeave);

  const [deleteUserLeave, { loading: deleteLoading }] = useMutation(DeleteUserLeave);

  const onSubmit = useCallback(
    ({ notes, startDate, endDate, leaveType }) => {
      if (!isDirty) {
        onClose();
        return;
      }
      const leaveTypeId = leaveTypes.find((item) => item.name === leaveType)?._id;
      const days = calculateWorkingDays(startDate, endDate, companySettings?.workingDays);
      updateUserLeave({
        variables: {
          input: {
            id: id,
            notes: notes,
            startDate: formatISO(new Date(startDate), { representation: 'date' }),
            endDate: formatISO(new Date(endDate), { representation: 'date' }),
            leaveType: leaveTypeId,
            days: days
          }
        }
      }).then(() => {
        refetch();
        onClose();
      });
    },
    [onClose, updateUserLeave, leaveTypes, id, isDirty, companySettings?.workingDays]
  );

  const onDelete = useCallback(() => {
    deleteUserLeave({
      variables: {
        id
      }
    }).then(() => {
      refetch();
      onClose();
    });
  }, [id, deleteUserLeave, onClose, refetch]);

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
        <DialogTitle className={classes.title}>{t('Edit Leave')}</DialogTitle>
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
                    value={value}
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
                  if (getValues('endDate')) return new Date(date) < new Date(getValues('endDate'));
                }
              }
            }}
            render={({ field: { name, onChange, value } }) => {
              return (
                <DatePicker
                  disableMaskedInput={true}
                  inputFormat={dateFormat}
                  label={t('Start date')}
                  defaultValue={startDate}
                  value={value}
                  //maxDate={addDays(getValues("endDate"), -1)}
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
                  if (getValues('startDate'))
                    return new Date(date) > new Date(getValues('startDate'));
                }
              }
            }}
            render={({ field: { name, onChange, value } }) => {
              return (
                <DatePicker
                  disableMaskedInput={true}
                  label={t('End date')}
                  defaultValue={endDate}
                  value={value}
                  onChange={onChange}
                  inputFormat={dateFormat}
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
                  value={value}
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
            loading={editLoading}
            disabled={editLoading || deleteLoading}>
            {t('Save Leave')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onDelete}
            loading={deleteLoading}
            disabled={editLoading || deleteLoading}>
            {t('Delete Leave')}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            {t('Cancel')}
          </Button>
        </DialogActions>
      </FocusLock>
    </StyledDialog>
  );
};

export default memo(EditLeave);
