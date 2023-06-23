import {
    Dialog,
    DialogActions,
    DialogContent,
    styled,
    Button
} from '@mui/material'
import React, {memo} from 'react'
import {useTranslation} from 'react-i18next';

const PREFIX = 'MsgDialog'

const classes = {
    dialogActions: `${PREFIX}-dialogActions`,
    content: `${PREFIX}-content`,
}

const StyledDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialog-paper': {
        borderRadius: '15px',
        maxWidth: '400px',
    },
    [`& .${classes.content}`]: {
        textAlign: 'center',
        padding: theme.spacing(5, 4, 0),
    },
    [`& .${classes.dialogActions}`]: {
        justifyContent: 'center',
        padding: theme.spacing(2, 4, 5),
    },
}))

const MessageBox = ({onClose, message}) => {
    const {t} = useTranslation();

    return (
        <StyledDialog
            open={true}
            fullWidth={true}
            onClose={onClose}
        >
            <DialogContent className={classes.content}>
                {message}
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <Button
                    size={'small'}
                    color={'error'}
                    variant={'outlined'}
                    onClick={onClose}>
                    {t('Close')}
                </Button>
            </DialogActions>
        </StyledDialog>
    )
}

export default memo(MessageBox)
