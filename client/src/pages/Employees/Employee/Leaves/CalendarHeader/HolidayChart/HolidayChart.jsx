import { useTheme, Typography } from '@mui/material';
import React, { memo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

const HolidayChart = ({ totalHoliday, holiday }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const data = {
    labels: ['Taken', 'Available'],
    datasets: [
      {
        data: [totalHoliday, holiday?.allowanceDays - totalHoliday],
        backgroundColor: [holiday?.color, theme.palette.grey[500]]
      }
    ]
  };

  const options = {
    cutoutPercentage: 75,
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 'auto', margin: 'auto' }}>
      <Doughnut
        data={data}
        options={options}
        width={200}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
        <Typography variant={'subtitle1'} align={'center'}>
          {t('Taken')}
          <br />
          {totalHoliday}
        </Typography>
        <Typography variant={'subtitle1'} align={'center'}>
          {t('Available')}
          <br />
          {holiday?.allowanceDays - totalHoliday}
        </Typography>
      </div>
    </div>
  );
};

export default memo(HolidayChart);
