import { Box, styled } from '@mui/material';

const LoadingOverlay = styled(Box)(({ disabled }) => {
  const disabledStyle = disabled
    ? {
        opacity: 0.75,
        pointerEvents: 'none'
      }
    : {};
  return {
    height: '100%',
    ...disabledStyle
  };
});

export default LoadingOverlay;
