import React from 'react'
import { at } from 'lodash'
import { useField } from 'formik'
import TextField from '@mui/material/TextField'
import InputMask from 'react-input-mask'

export default function InputFieldNumber(props) {
  const { errorText, ...rest } = props
  const [field, meta] = useField(props)

  function _renderHelperText() {
    const [touched, error] = at(meta, 'touched', 'error')
    if (touched && error) {
      return error
    }
  }

  return (
    <InputMask {...field} {...rest} mask={'99/99'} maskChar="" type="tel">
      {inputProps => (
        <TextField
          type="number"
          variant="filled"
          error={meta.touched && meta.error && true}
          helperText={_renderHelperText()}
          {...inputProps}
        />
      )}
    </InputMask>
  )
}
