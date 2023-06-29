import React, {memo} from 'react';
import {Doughnut} from 'react-chartjs-2';
import {styled, useTheme, Typography} from '@mui/material'
import {useTranslation} from 'react-i18next';

const StyledContainer = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    background: `${theme.palette.background.paper}`,
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '300px',
    margin: 'auto',
    marginBottom: '35px'
}))

const HolidayChart = ({holiday}) => {
    const theme = useTheme();
    const {t} = useTranslation();

    const data = {
        labels: ['Taken', 'Available'],
        datasets: [
            {
                data: [holiday?.days, holiday?.available],
                backgroundColor: [holiday?.color, theme.palette.grey[500]],
            },
        ],
        text: holiday?.allowanceDays,
        color: theme.palette.text.primary
    };

    const options = {
        cutoutPercentage: 75,
        legend: {
            labels: {
                padding: 20,
                usePointStyle: true,
                fontColor: `${theme.palette.text.primary}`
            },
            position: 'right',
            onClick: (e) => e.stopPropagation()
        },
        tooltips: {
            enabled: true,
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    const plugins = [{
        beforeDraw: function (chart) {
            const {ctx, data} = chart
            var width = chart.chartArea.right,
                height = chart.chartArea.bottom;
            ctx.restore();
            ctx.restore();
            ctx.font = "bolder 18px sans-serif"
            ctx.fillStyle = data.color
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText('Total', Math.round(width / 2), Math.round((height - 18) / 2))
            ctx.fillText(data.text, Math.round(width / 2), Math.round((height + 27) / 2))
            ctx.save();
        }
    }]

    return (
        <StyledContainer>
            <Typography align={'center'} variant={'h5'}
                        sx={{paddingBottom: '25px'}}>{t('Holiday allowance')}</Typography>
            <div style={{position: 'relative', width: '100%', height: 'auto'}}>
                <Doughnut
                    data={data}
                    options={options}
                    plugins={plugins}
                    width={200}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                />
            </div>
        </StyledContainer>
    );
};

export default memo(HolidayChart);
