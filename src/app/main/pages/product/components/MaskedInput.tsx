import React, { forwardRef } from 'react';
import InputMask from 'react-input-mask';
import { TextFieldProps } from '@mui/material/TextField';
import { CustomTextField } from '../checkout/CheckoutCustomer';


const MaskedInput = forwardRef<HTMLInputElement, any>(({ mask, ...otherProps }, ref) => {
  return (
    <InputMask
      mask={mask}
      {...otherProps}
      inputRef={ref}
    >
      {(inputProps) => <CustomTextField {...inputProps} />}
    </InputMask>
  );
});

export default MaskedInput;
