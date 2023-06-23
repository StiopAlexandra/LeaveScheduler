import React, {useCallback, memo} from 'react'
import {
    styled,
    alpha,
    FormControlLabel,
    Radio,
} from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {useTranslation} from 'react-i18next'

const StyledContainer = styled('div')(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '7px'
}))

const Label = styled('legend')(({theme}) => ({
    fontSize: '12px',
    padding: '0 5px',
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(0.875),
}))

const Fieldset = styled('fieldset')(({theme}) => ({
    margin: theme.spacing(0),
    padding: theme.spacing(0),
    borderRadius: '4px',
    border: theme.palette.mode === 'light' ? '1px solid #bfc0c1' : '1px solid #4c5057',
    overflow: 'hidden',
}))

const ColorPicker = ({setSelectedColor, selectedColor}) => {
    const {t} = useTranslation()

    const colors = ['#009688', '#4caf50', '#8bc34a', '#cddc39',
        '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
        '#ff1744', '#e91e63', '#9c27b0', '#673ab7',
        '#3f51b5', '#2979ff', '#03a9f4', '#00bcd4']


    const onChange = useCallback((event) => {
        if (event.target.checked) {
            setSelectedColor(event.target.value);
        } else {
            setSelectedColor('');
        }
    }, [setSelectedColor])

    return (
        <Fieldset>
            <Label>{t('Color')}</Label>
            <StyledContainer>
                {colors.map((color) => (
                    <FormControlLabel
                        sx={{
                            margin: '15px'
                        }}
                        key={color}
                        control={
                            <Radio
                                disableRipple
                                value={color}
                                checked={selectedColor === color}
                                onChange={onChange}
                                sx={{
                                    padding: '2px',
                                    background: (theme) => theme.palette.background.paper,
                                    ':hover': {
                                        backgroundColor: alpha(color, 0.16),
                                    }

                                }}
                                icon={<CircleIcon style={{color: color}}/>}
                                checkedIcon={<CheckCircleIcon style={{color: color}}/>}
                            />
                        }
                    />
                ))}
            </StyledContainer>
        </Fieldset>
    )
}

export default memo(ColorPicker)