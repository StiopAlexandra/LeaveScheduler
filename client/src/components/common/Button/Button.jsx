import { Button as MuiButton, CircularProgress } from '@mui/material';
import clsx from 'clsx';
import React, { memo, forwardRef } from 'react';

const Button = forwardRef((props, ref) => {
  const { children, loading, color, disabled, sx, className, ...buttonProps } = props;

  return (
    <MuiButton
      ref={ref}
      color={color}
      {...buttonProps}
      sx={{
        ...sx
      }}
      className={clsx([
        {
          ['loading']: loading
        },
        className
      ])}
      disabled={disabled || loading}>
      {children}
      {loading && (
        <CircularProgress
          size={20}
          color={color}
          sx={{
            position: 'absolute',
            m: 'auto',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }}
        />
      )}
    </MuiButton>
  );
});

export default memo(Button);
