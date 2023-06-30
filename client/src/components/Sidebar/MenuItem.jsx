import { ListItemText, ListItemIcon, ListItemButton, styled, alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NavLink as RouterLink } from 'react-router-dom';

import { getPageRoutePath } from '../../utils/path';

const StyledNavItem = styled((props) => <ListItemButton disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius,
    ['&.active']: {
      color: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.16),
      fontWeight: 'fontWeightBold'
    }
  })
);

const StyledNavItemIcon = styled(ListItemIcon)({
  width: 22,
  height: 22,
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const MenuItem = ({ item }) => {
  const { name, icon } = item;
  const { t } = useTranslation();

  return (
    <StyledNavItem component={RouterLink} to={getPageRoutePath({ name })} sx={{}}>
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
      <ListItemText disableTypography primary={t(name)} />
    </StyledNavItem>
  );
};

export default MenuItem;
