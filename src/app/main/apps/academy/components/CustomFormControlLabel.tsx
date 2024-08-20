import React, { forwardRef } from 'react';
import { FormControlLabel, FormControlLabelProps } from '@mui/material';

type CustomFormControlLabelProps = FormControlLabelProps & {
  inputRef?: React.ForwardedRef<unknown>;
};

const CustomFormControlLabel = forwardRef<unknown, CustomFormControlLabelProps>((props, ref) => (
  <FormControlLabel {...props} inputRef={ref} />
));

export default CustomFormControlLabel;
