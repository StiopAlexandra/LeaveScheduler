import React from 'react';
import {Doughnut} from 'react-chartjs-2';
import {useTheme, Typography, styled} from '@mui/material'
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

const DepartmentChart = ({users}) => {
    const theme = useTheme();
    const {t} = useTranslation();

    const groupsByDepartment = {}
    users.forEach(({department}) => {
        const name = department?.name || t('Undefined')
        if (!groupsByDepartment[name]) {
            groupsByDepartment[name] = [];
        }
        groupsByDepartment[name].push({
            color: name === 'Undefined' ? theme.palette.grey[500] : department?.color
        });
    });

    const countUserByDepartment = []

    for (let [key, value] of Object.entries(groupsByDepartment)) {
        const total = value.length

        countUserByDepartment.push({
            name: key,
            total,
            color: value[0].color
        })
    }

    const label = []
    const dataset = []
    const backgroundColor = []

    countUserByDepartment?.forEach(({color, name, total}) => {
        label.push(name)
        dataset.push(total)
        backgroundColor.push(color)
    })

    const data = {
        labels: label,
        datasets: [
            {
                data: dataset,
                backgroundColor: backgroundColor,
            },
        ],
        text: users?.length,
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
                        sx={{paddingBottom: '25px'}}>{t('Employees by department')}</Typography>
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


export default DepartmentChart;


