import { useQuery } from '@apollo/client';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Divider, Typography, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import { alpha } from '@mui/material/styles';
import React, { useContext, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink as RouterLink } from 'react-router-dom';

import UserContext from '../../contexts/UserContext';
import GetUser from '../../data/queries/GetUser';
import avatar from '../../resources/images/avatar_default.jpg';

const AccountPopover = () => {
  const [open, setOpen] = useState(null);
  const context = useContext(UserContext);
  const id = context?.user?._id;
  const { t } = useTranslation();

  const { data } = useQuery(GetUser, {
    variables: {
      id
    },
    fetchPolicy: 'network-only'
  });
  const user = data?.getUser;

  const handleOpen = useCallback(
    (event) => {
      setOpen(event.currentTarget);
    },
    [setOpen]
  );

  const handleClose = useCallback(() => {
    setOpen(null);
  }, [setOpen]);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              background: (theme) => alpha(theme.palette.grey[900], 0.8)
            }
          })
        }}>
        <Avatar src={avatar} alt="photoURL" />
      </IconButton>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 220,
            backgroundColor: 'background.default',
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75
            }
          }
        }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleClose} sx={{ m: 1 }} component={RouterLink} to={'/settings'}>
          <SettingsOutlinedIcon />
          <Typography variant="body2" noWrap sx={{ pl: 1 }}>
            {t('Settings')}
          </Typography>
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleClose} sx={{ m: 1 }} component={RouterLink} to={'/login'}>
          <LogoutOutlinedIcon />
          <Typography variant="body2" noWrap sx={{ pl: 1 }}>
            {t('Logout')}
          </Typography>
        </MenuItem>
      </Popover>
    </>
  );
};

export default AccountPopover;
