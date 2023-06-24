import React, {useState, useCallback, memo} from 'react';
import {Snackbar, Alert as MuiAlert, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next'

const Alert = ({severity, messages, onClose, duration}) => {
    const [open, setOpen] = useState(true);
    const {t} = useTranslation()

    const handleClose = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        onClose();
        setOpen(false);
    }, [setOpen])
    
    return (
        <Snackbar open={open} autoHideDuration={duration} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <MuiAlert
                onClose={handleClose}
                severity={severity}
                variant={'outlined'}
                color={severity}
                sx={{
                    background: (theme) => theme.palette.background.paper,
                    border: (theme) => `1px solid ${theme.palette[severity].main}`,
                    color: (theme) => theme.palette.text.primary,
                    '.MuiAlert-action': {
                        color: (theme) => theme.palette[severity].main,
                    }
                }}
            >
                {messages?.map((message, index) => (
                    <Typography key={index}>{t(message)}</Typography>
                ))}
            </MuiAlert>
        </Snackbar>
    );
}

export default memo(Alert)
