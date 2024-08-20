import PropTypes from 'prop-types';
import { m } from 'framer-motion';
// @mui
import { Box } from '@mui/material';
// hooks
import useResponsive from '@fuse/hooks/useResponsive';
//
import { varContainer } from '.';


// ----------------------------------------------------------------------

MotionViewport.propTypes = {
  children: PropTypes.node.isRequired,
  disableAnimatedMobile: PropTypes.bool,
};

export default function MotionViewport({ children, disableAnimatedMobile = true, ...other }) {
  const isDesktop = useResponsive('up', 'sm', 'sm', 'lg'); // Adicionei 'sm' e 'lg' como argumentos

  if (!isDesktop && disableAnimatedMobile) {
    return <Box {...other}>{children}</Box>;
  }

  return (
    <Box
      component={m.div}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={varContainer()}
      {...other}
    >
      {children}
    </Box>
  );
}
