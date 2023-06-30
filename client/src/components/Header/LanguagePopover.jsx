import { Box, MenuItem, Stack, IconButton, Popover, Avatar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import React, { useState, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigsContext from '../../contexts/ConfigsContext';
import ro from '../../resources/icons/ro.png';
import eng from '../../resources/icons/us-uk.png';

const LanguagePopover = () => {
  const { t } = useTranslation();
  const { lng, changeLng } = useContext(ConfigsContext);
  const [open, setOpen] = useState(null);

  const languages = [
    {
      value: 'en',
      label: t('English'),
      icon: eng
    },
    {
      value: 'ro',
      label: t('Romanian'),
      icon: ro
    }
  ];

  const handleOpen = useCallback(
    (event) => {
      setOpen(event.currentTarget);
    },
    [setOpen]
  );

  const handleClose = useCallback(() => {
    setOpen(null);
  }, [setOpen]);

  const handleChange = useCallback(
    (lng) => {
      changeLng(lng);
      handleClose();
    },
    [changeLng, handleClose]
  );

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
        <Avatar
          src={languages[lng === 'en' ? 0 : 1].icon}
          alt="language"
          sx={{ width: '24px', height: '24px' }}
        />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            mt: 0.75,
            ml: 0.75,
            width: 160,
            backgroundColor: 'background.default',
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75
            }
          }
        }}>
        <Stack spacing={0.75}>
          {languages.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === lng}
              onClick={() => handleChange(option.value)}>
              <Box
                component="img"
                alt={option.label}
                src={option.icon}
                sx={{ width: 28, mr: 2, borderRadius: '50%' }}
              />
              {option.label}
            </MenuItem>
          ))}
        </Stack>
      </Popover>
    </>
  );
};

export default LanguagePopover;
