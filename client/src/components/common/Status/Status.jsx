import React, {memo} from 'react'

import {Typography, styled, alpha} from '@mui/material'
import {useTranslation} from 'react-i18next'

const TypographyStyled = styled(Typography, {
    shouldForwardProp: prop => !['color'].includes(prop)
})(({theme, color}) => {
    return {
        background: alpha(color, 0.15),
        color: color
    }
})

const Status = ({color, name}) => {
    const {t} = useTranslation()

    return (
        <TypographyStyled noWrap={true} variant="tag" color={color}>
            {t(name)}
        </TypographyStyled>
    )
}

export default memo(Status)
