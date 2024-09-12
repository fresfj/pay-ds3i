import { at } from 'lodash'
import { useField } from 'formik'
import TextField from '@mui/material/TextField'
import InputMask from 'react-input-mask'
export default function InputDocument(props) {
  const { errorText, ...rest } = props
  const [field, meta] = useField(props)

  function _renderHelperText() {
    const [touched, error] = at(meta, 'touched', 'error')
    if (touched && error) {
      return error
    }
  }

  return (
    <>
      <InputMask
        {...field}
        {...rest}
        mask={'999.999.999-999'}
        maskChar=""
        type="text"
      >
        {inputProps => (
          <TextField
            variant="filled"
            {...inputProps}
            type="tel"
            error={meta.touched && meta.error && true}
            helperText={_renderHelperText()}
          />
        )}
      </InputMask>
    </>
  )
}
