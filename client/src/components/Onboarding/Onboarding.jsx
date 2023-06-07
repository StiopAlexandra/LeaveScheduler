import React from 'react'
import backgroundLight from '../../resources/images/background-light.png'
import backgroundDark from '../../resources/images/background-dark.png'
import {styled} from '@mui/material'

const Onboarding = styled('div')(({theme}) => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    [`&::before`]: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
        opacity: '0.8',
        backgroundImage: theme.palette.mode === 'light' ? `url(${backgroundLight})` : `url(${backgroundDark})`,
        backgroundSize: 'cover',
        content: "''",
    }
}))

export default Onboarding

