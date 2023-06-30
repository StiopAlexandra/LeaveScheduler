import { useQuery } from '@apollo/client';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  styled,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Tooltip
} from '@mui/material';
import { format, getDate } from 'date-fns';
import React, { memo, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import GetDepartments from '../../../data/queries/GetDepartments';

const PREFIX = 'GroupTable';
const classes = {
  stack: `${PREFIX}-stack`,
  title: `${PREFIX}-title`,
  departmentCell: `${PREFIX}-departmentCell`,
  departmentCellName: `${PREFIX}-departmentCellName`,
  departmentRow: `${PREFIX}-departmentRow`,
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
  [`& .${classes.departmentCell}`]: {
    minWidth: '20px',
    padding: '10px'
  },
  [`& .${classes.departmentCellName}`]: {
    minWidth: '180px',
    padding: '10px',
    border: theme.palette.mode === 'light' ? '1px solid #bfc0c1' : '1px solid #4c5057'
  },
  [`& .${classes.departmentRow}`]: {
    height: '55px'
  },
  [`& .${classes.cell}`]: {
    minWidth: '20px',
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

const GroupTable = ({ daysOfMounth, daysInMonth, currentYearUserLeaves }) => {
  const { t } = useTranslation();
  const [toggle, setToggle] = useState({});

  const { data: departmentData } = useQuery(GetDepartments, {
    fetchPolicy: 'network-only'
  });

  const departments = departmentData?.getDepartments || [];

  useEffect(() => {
    if (departments) {
      var toggleDepartments = {};
      departments.forEach(({ name }) => {
        toggleDepartments = { ...toggleDepartments, [name]: true };
      });
      setToggle(toggleDepartments);
    }
  }, [departments, setToggle]);

  const groups = [];
  departments?.forEach(({ _id, name, color }) => {
    const users = [];
    currentYearUserLeaves.forEach((item) => {
      const { userLeave, department, name: userName } = item;
      if (department?._id === _id) {
        users.push({
          name: userName,
          userLeave
        });
      }
    });
    groups.push({
      users,
      color,
      name
    });
  });

  const onToggle = useCallback(
    (department) => {
      setToggle({ ...toggle, [department]: !toggle[department] });
    },
    [setToggle, toggle]
  );

  return (
    <StyledDiv>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="simple table">
          <TableHead style={{ height: '68px' }}>
            <TableRow>
              <TableCell align={'center'} className={classes.departmentCellName}>
                {t('Departments')}
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
          {groups.map((department) => (
            <TableBody key={department.name}>
              <TableRow key={department.name} className={classes.departmentRow}>
                {daysInMonth.map((day) =>
                  day ? (
                    <TableCell key={day} className={classes.departmentCell} />
                  ) : (
                    <TableCell
                      key={day}
                      className={classes.departmentCell}
                      onClick={() => onToggle(department.name)}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                        className={classes.chip}
                        sx={{
                          background: alpha(department.color, 0.1),
                          color: department.color
                        }}>
                        <Typography variant="body1">{department.name}</Typography>
                        {toggle[department.name] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </Stack>
                    </TableCell>
                  )
                )}
              </TableRow>
              {toggle[department.name] && (
                <>
                  {department.users.map((user) => (
                    <TableRow key={user.name}>
                      {daysInMonth.map((day) => (
                        <TableCell key={day} className={classes.cell}>
                          {day
                            ? user.userLeave.map((leave) => {
                                if (
                                  day >= getDate(new Date(leave.startDate)) &&
                                  day <= getDate(new Date(leave.endDate))
                                )
                                  return (
                                    <Tooltip
                                      key={leave.leaveType.name}
                                      title={t(leave.leaveType.name)}>
                                      <div
                                        className={classes.circle}
                                        style={{
                                          background: alpha(leave.leaveType.color, 0.3),
                                          border: `1px solid ${leave.leaveType.color}`
                                        }}
                                      />
                                    </Tooltip>
                                  );
                              })
                            : user.name}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          ))}
        </Table>
      </TableContainer>
    </StyledDiv>
  );
};

export default memo(GroupTable);
