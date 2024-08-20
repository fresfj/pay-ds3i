import { at, keyBy } from 'lodash'
import { useField } from 'formik'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'

import FuseUtils from '@fuse/utils'
import { Grid } from '@mui/material'
import { setShipping, getTotals } from '../../store/cartSlice'

const Title = styled('div')(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary
}))

const Price = styled('div')(({ theme }) => ({
  fontWeight: 600,
  textAlign: 'right',
  color: theme.palette.text.primary
}))

const Description = styled('div')(({ theme }) => ({
  fontSize: 'small',
  color: '#969696'
}))

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  fontSize: 20,
  fontWeight: 600
}))

const StyledDiscount = styled(FormLabel)(({ theme }) => ({
  fontSize: 8,
  fontWeight: 700,
  position: 'absolute',
  background: '#FFC107',
  top: -12,
  right: 12,
  flex: 1,
  borderRadius: 6,
  paddingLeft: 6,
  paddingRight: 6,
  paddingTop: 4,
  paddingBottom: 4,
  color: '#212121 !important',
  textTransform: 'uppercase'
}))

const StyledFormControlLabel = styled(FormControlLabel)(
  ({ theme, checked, ...props }) => ({
    fontSize: 22,
    color: theme.palette.mode === 'light' ? '#586069' : '#8b949e',
    fontWeight: 600,
    minHeight: 44,

    borderRadius: '6px',
    margin: '8px 0',
    padding: checked ? '19px' : '20px',
    border: '1px solid',
    borderColor: checked ? theme.palette.primary.main : '#E0E3E7',
    borderWidth: checked ? '2px' : '1px',
    letterSpacing: '0.025em',

    boxShadow: checked
      ? `0 0 0 2px rgba(${theme.palette.primary.main} / 0.25)`
      : '0 2px 4px #E0E3E7',

    outline: 0,

    userSelect: 'none',
    position: 'relative',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: '#f1f5f949'
    },
    '& .MuiFormControlLabel-label': {
      width: '100%'
    },

    '& .Mui-checked': {
      color: theme.palette.primary.main,
      '&, & + .MuiFormControlLabel-label': {
        color: theme.palette.primary.main
      }
    }
  })
)

const renderOptions = (options, selectedValue, setValue) => {
  const dispatch = useDispatch()

  function _onChange(e) {
    const val = e.target.value.split('_')
    const free = parseFloat(parseFloat(val[1]).toFixed(2))
    dispatch(setShipping({ value: free, delivery: true, title: val[2] }))
    dispatch(getTotals())
  }

  return options.map((option, key) => (
    <StyledFormControlLabel
      key={key}
      control={
        <Radio
          onChange={e => {
            _onChange(e)
            setValue(e.target.value)
          }}
          value={
            key +
            '_' +
            option.price +
            '_' +
            option.title +
            ' (' +
            option.about +
            ')'
          }
          readOnly
        />
      }
      checked={
        selectedValue ===
        key +
          '_' +
          option.price +
          '_' +
          option.title +
          ' (' +
          option.about +
          ')'
          ? true
          : false
      }
      label={
        <>
          {option.discount && (
            <StyledDiscount>
              Express (c/ Desconto de{' '}
              {FuseUtils.formatCurrency(option.discount)})
            </StyledDiscount>
          )}
          <div className="flex w-full items-center justify-between">
            <Title variant="caption">{option.title}</Title>
            <Price variant="caption">
              {option.price > 0 ? (
                <>
                  {option.value > 0 && (
                    <small className="text-red-500">
                      <del>{FuseUtils.formatCurrency(option.value)}</del>
                    </small>
                  )}
                  <span className="mx-2 text-slate-950">
                    {FuseUtils.formatCurrency(option.price)}
                  </span>
                </>
              ) : (
                'Grátis'
              )}
            </Price>
          </div>
          {option.about && <Description>{option.about}</Description>}
        </>
      }
    />
  ))
}

const FormikRadioGroup = props => {
  const { options, name, label, children, ...rest } = props
  const [field, meta, helper] = useField(props)
  const { setValue } = helper

  const { value: selectedValue } = field
  const [touched, error] = at(meta, 'touched', 'error')
  const isError = touched && error && true

  function _renderHelperText() {
    if (isError) {
      return <FormHelperText>{error}</FormHelperText>
    }
  }

  return (
    <>
      <FormControl {...rest} error={isError}>
        <StyledFormLabel id="dradios" component={'h2'}>
          {label}
        </StyledFormLabel>
        <RadioGroup {...field} name={name} aria-labelledby="dradios">
          {options ? renderOptions(options, selectedValue, setValue) : children}
        </RadioGroup>
        {_renderHelperText()}
      </FormControl>
    </>
  )
}

export default FormikRadioGroup
