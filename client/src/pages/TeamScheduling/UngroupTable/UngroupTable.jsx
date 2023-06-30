import {
  styled,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import { format, getDate } from 'date-fns';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

const PREFIX = 'UngroupTable';
const classes = {
  stack: `${PREFIX}-stack`,
  title: `${PREFIX}-title`,
  cellUsers: `${PREFIX}-cellUsers`,
  chip: `${PREFIX}-chip`,
  cell: `${PREFIX}-cell`,
  circle: `${PREFIX}-circle`,
  container: `${PREFIX}-container`,
  header: `${PREFIX}-header`
};

const StyledDiv = styled('div')(({ theme }) => ({
  [`.MuiTableCell-stickyHeader`]: {
    backgroundColor: theme.palette.background.neutral
  },
  thead: {
    '& th:first-of-type': {
      borderRadius: '1em 0 0 1em'
    },
    '& th:last-of-type': {
      borderRadius: '0 1em 1em 0'
    }
  },
  [`& .${classes.container}`]: {
    padding: '50px 20px 20px',
    backgroundColor: theme.palette.background.default,
    borderRadius: '10px',
    width: 'auto',
    maxWidth: '1510px',
    margin: 'auto'
  },
  [`& .${classes.title}`]: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '40px'
  },
  [`& .${classes.chip}`]: {
    height: 24,
    maxHeight: 24,
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0 10px',
    fontSize: '12px',
    fontWeight: 600,
    borderRadius: '12px'
  },
  [`& .${classes.cell}`]: {
    minWidth: '20px',
    padding: '10px',
    border: theme.palette.mode === 'light' ? '1px solid #bfc0c1' : '1px solid #4c5057'
  },
  [`& .${classes.cellUsers}`]: {
    minWidth: '180px',
    padding: '10px',
    border: theme.palette.mode === 'light' ? '1px solid #bfc0c1' : '1px solid #4c5057'
  },
  [`& .${classes.circle}`]: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    color: '#22d0b8'
  }
}));

const UngroupTable = ({ daysOfMounth, daysInMonth, currentYearUserLeaves }) => {
  const { t } = useTranslation();

  const users = [];
  currentYearUserLeaves.forEach((item) => {
    const { userLeave, name: userName } = item;
    users.push({
      name: userName,
      userLeave
    });
  });

  return (
    <StyledDiv>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="simple table">
          <TableHead style={{ height: '68px' }}>
            <TableRow>
              <TableCell align={'center'} className={classes.cellUsers}>
                {t('Users')}
              </TableCell>
              {daysOfMounth.map((day) => (
                <TableCell align={'center'} className={classes.cell} key={day}>
                  {t(format(day, 'EEEEEE'))}
                  <br />
                  {getDate(day)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.name}>
                {daysInMonth.map((day) => {
                  if (day) {
                    return (
                      <TableCell key={day} className={classes.cell}>
                        {user.userLeave.map((leave) => {
                          if (
                            day >= getDate(new Date(leave.startDate)) &&
                            day <= getDate(new Date(leave.endDate))
                          ) {
                            return (
                              <Tooltip key={leave.leaveType.name} title={t(leave.leaveType.name)}>
                                <div
                                  className={classes.circle}
                                  style={{
                                    background: alpha(leave.leaveType.color, 0.3),
                                    border: `1px solid ${leave.leaveType.color}`
                                  }}
                                />
                              </Tooltip>
                            );
                          }
                        })}
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell key={day} className={classes.cellUsers}>
                        {user.name}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledDiv>
  );
};

export default memo(UngroupTable);
