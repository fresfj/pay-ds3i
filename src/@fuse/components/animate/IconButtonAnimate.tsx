import { m } from 'framer-motion';
import { forwardRef } from 'react';
import { Box, IconButton } from '@mui/material';

// ----------------------------------------------------------------------

const IconButtonAnimate = forwardRef<HTMLButtonElement, IconButtonAnimateProps>(
  ({ children, size = 'medium', ...other }, ref) => (
    <AnimateWrap size={size}>
      <IconButton size={size} ref={ref} {...other}>
        {children}
      </IconButton>
    </AnimateWrap>
  )
);

interface IconButtonAnimateProps {
  children: React.ReactNode;
  color?: 'inherit' | 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
}

export default IconButtonAnimate;

// ----------------------------------------------------------------------

const varSmall = {
  hover: { scale: 1.1 },
  tap: { scale: 0.95 }
};

const varMedium = {
  hover: { scale: 1.09 },
  tap: { scale: 0.97 }
};

const varLarge = {
  hover: { scale: 1.08 },
  tap: { scale: 0.99 }
};

interface AnimateWrapProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

function AnimateWrap({ size, children }: AnimateWrapProps) {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <Box
      component={m.div}
      whileTap="tap"
      whileHover="hover"
      variants={(isSmall && varSmall) || (isLarge && varLarge) || varMedium}
      sx={{
        display: 'inline-flex'
      }}
    >
      {children}
    </Box>
  );
}
