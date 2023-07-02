import { addDays, getDay } from 'date-fns';

export const calculateWorkingDays = (start_date, end_date, workingDays = []) => {
  let working_days = 0;
  let current_date = new Date(start_date);

  while (current_date <= new Date(end_date)) {
    if (workingDays.includes(getDay(current_date))) {
      working_days += 1;
    }
    current_date = addDays(current_date, 1);
  }
  return working_days;
};
