import PropTypes from 'prop-types'

// @mui
import { styled } from '@mui/material/styles'
import {
  Box,
  Card,
  Radio,
  Stack,
  Button,
  Collapse,
  TextField,
  Typography,
  RadioGroup,
  CardHeader,
  CardContent,
  FormHelperText,
  FormControlLabel
} from '@mui/material'
// hooks
import useResponsive from '@fuse/hooks/useResponsive'
// components
import { Image } from '@fuse/components/image'
import { Iconify } from '@fuse/components/iconify'

// ----------------------------------------------------------------------

const OptionStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2.5),
  justifyContent: 'space-between',
  transition: theme.transitions.create('all'),
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5
}))

// ----------------------------------------------------------------------

PaymentMethods.propTypes = {
  paymentOptions: PropTypes.array,
  cardOptions: PropTypes.array
}
import { at, keyBy } from 'lodash'
import { useField } from 'formik'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { useDispatch, useSelector } from 'react-redux'
import { height, width } from '@mui/system'

export default function PaymentMethods(props) {
  const { paymentOptions, cardOptions, name, label, ...rest } = props
  const [field, meta, helper] = useField(props)
  const { setValue } = helper

  const { value: selectedValue } = field
  const [touched, error] = at(meta, 'touched', 'error')
  const isError = touched && error && true

  const isDesktop = useResponsive('up', 'sm')

  const handleChange = value => {
    setValue(value)
  }

  return (
    <>
      <FormControl {...rest} error={isError}>
        <RadioGroup {...field} name="pay" value={selectedValue || ''}>
          <Stack
            spacing={2}
            direction="row"
            useFlexGap
            flexWrap="wrap"
            sx={{ minWidth: 0 }}
            className="flex flex-nowrap snap-x"
          >
            {paymentOptions.map(method => {
              const { value, title, icons, description } = method
              const hasChildren = value === 'credit_card'
              const selected = field.value === value
              return (
                <OptionStyle
                  key={title}
                  className="uppercase shadow-md min-w-320 cursor-pointer snap-start"
                  sx={{
                    ...(selected && {
                      border: theme =>
                        `solid 1px ${theme.palette.primary.main}`,
                      boxShadow: theme => theme.customShadows.z20
                    }),
                    ...(hasChildren && { flexWrap: 'wrap' })
                  }}
                  onClick={() => handleChange(value)}
                >
                  <FormControlLabel
                    value={value}
                    control={
                      <Radio
                        className="absolute h-0 w-0 appearance-none hidden"
                        readOnly
                      />
                    }
                    label={
                      <>
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="subtitle2">{title}</Typography>
                        </Box>
                      </>
                    }
                    sx={{ flexGrow: 1, py: 3 }}
                  />

                  {isDesktop && (
                    <Stack direction="row" spacing={1} flexShrink={0}>
                      {icons.map(icon => (
                        <Image
                          key={icon}
                          alt="logo card"
                          src={icon}
                          sx={{ height: 24 }}
                        />
                      ))}
                    </Stack>
                  )}
                  {hasChildren && 1 == 0 && (
                    <Collapse
                      in={field.value === 'credit_card'}
                      sx={{ width: 1 }}
                    >
                      <TextField
                        select
                        fullWidth
                        label="Cards"
                        SelectProps={{ native: true }}
                      >
                        {cardOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>

                      <Button
                        size="small"
                        startIcon={
                          <Iconify
                            icon={'eva:plus-fill'}
                            width={20}
                            height={20}
                          />
                        }
                        sx={{ my: 3 }}
                      >
                        Add new card
                      </Button>
                    </Collapse>
                  )}
                </OptionStyle>
              )
            })}
          </Stack>
        </RadioGroup>

        {!!error && (
          <FormHelperText error sx={{ pt: 1, px: 2 }}>
            {error.message}
          </FormHelperText>
        )}
      </FormControl>
    </>
  )
}
