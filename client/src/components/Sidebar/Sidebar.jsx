import React from 'react'
import {Box, Drawer, styled, useTheme} from '@mui/material'
import useResponsive from '../../hooks/useResponsive'
import Menu from './Menu'
import {ReactComponent as LogoLight} from '../../resources/icons/logo-light.svg'
import {ReactComponent as LogoDark} from '../../resources/icons/logo-dark.svg'

const NAV_WIDTH = 280;

const LogoBox = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    margin: theme.spacing(2, 1)
}));
const Sidebar = ({pages, open, onClose}) => {
    const theme = useTheme()
    const isDesktop = useResponsive('up', 'lg')
    const renderContent =
        <div>
            <LogoBox>
                {
                    theme.palette.mode === 'light' ? <LogoLight/> : <LogoDark/>
                }
            </LogoBox>
            <Menu pages={pages}/>
        </div>

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: {lg: 0},
                width: {lg: NAV_WIDTH},
            }}
        >
            {isDesktop ? (
                <Drawer
                    open
                    variant="permanent"
                    PaperProps={{
                        sx: {
                            width: NAV_WIDTH,
                            background: 'background.default',
                            borderRightStyle: 'dashed',
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            ) : (
                <Drawer
                    open={open}
                    onClose={onClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    PaperProps={{
                        sx: {width: NAV_WIDTH},
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        </Box>
    )
}

export default Sidebar