import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

import { bgBlur } from '../../utils/cssStyles';

import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import ThemeSwitch from './ThemeSwitch';

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`
  }
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

const Header = ({ onShow }) => {
  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onShow}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' }
          }}>
          <MenuOutlinedIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1
          }}>
          <ThemeSwitch />
          <LanguagePopover />
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
};

export default Header;
