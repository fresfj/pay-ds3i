import React, { useState, useEffect } from 'react'
import { at } from 'lodash'
import { useField } from 'formik'
import {
  TextField,
  Grid,
  Autocomplete,
  Box,
  InputAdornment
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

import { InputField } from '.'
import { useFormikContext } from 'formik'
import InputMask from 'react-input-mask'

export default function InputZipCode(props) {
  const {
    formField: { address, city, neighborhood, complement, addressNumber },
    errorText,
    ...rest
  } = props

  const [field, meta] = useField(props)
  const { values, setValues, setFieldValue } = useFormikContext()
  const [status, setStatus] = useState(false)

  const [acValue, setACValue] = useState(stateCountry.BR[0])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addressAt, setAddressAt] = useState(false)

  useEffect(() => {
    if (values?.zipcode && !status) {
      zipCode(values?.zipcode)
      setStatus(true)
    }
  }, [values?.zipcode, status])

  function _renderHelperText() {
    const { value } = meta
    const [touched, error] = at(meta, 'touched', 'error')
    if (touched && error) {
      return error
    }
  }

  const zipCode = async code => {
    const zip = code.replace('-', '')
    if (zip.length === 8) {
      setTimeout(() => {
        setAddressAt(false)
        setLoading(true)
      }, 100)

      await fetch(`https://viacep.com.br/ws/${code.replace('-', '')}/json/`, {
        mode: 'cors'
      })
        .then(res => res.json())
        .then(data => {
          if (data.hasOwnProperty('erro')) {
            //alert('Cep não existente');
            setFieldValue('city', '')
            setFieldValue('address', '')
            setFieldValue('neighborhood', '')
            setFieldValue('state', '')
          } else {
            if (data) {
              setFieldValue('city', data?.localidade)
              setFieldValue('address', data?.logradouro)
              setFieldValue('neighborhood', data?.bairro)
              setFieldValue('state', data?.uf)

              const filtered = stateCountry.BR.filter(state => {
                return state.code === data?.uf
              })

              if (filtered.length > 0) {
                setACValue(filtered[0])
              }
            }
          }
        })
        .catch(err => console.log(err))

      setTimeout(() => {
        setLoading(false)
        setAddressAt(true)
      }, 1500)
    }
  }

  if (values?.zipcode && !status) {
    zipCode(values?.zipcode)
    setStatus(true)
  }

  return (
    <>
      <Grid container spacing={3} columns={{ xs: 4, md: 12 }}>
        <Grid item xs={12} sm={3}>
          <InputMask
            {...field}
            {...rest}
            mask={'99999-999'}
            maskChar=""
            type="text"
            onChange={event => {
              const value = event.target.value
              field.onChange(field.name)(value)
              zipCode(value)
            }}
          >
            {inputProps => (
              <TextField
                {...inputProps}
                fullWidth
                type="tel"
                variant="filled"
                error={meta.touched && meta.error && true}
                helperText={_renderHelperText()}
                InputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  endAdornment: (
                    <InputAdornment position="end">
                      {loading ? <CircularProgress size={26} /> : <></>}
                    </InputAdornment>
                  )
                }}
              />
            )}
          </InputMask>
        </Grid>

        {addressAt && (
          <>
            <Grid item xs={12} sm={9}>
              <InputField name={address.name} label={address.label} fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputField
                type="number"
                name={addressNumber.name}
                label={addressNumber.label}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputField
                name={complement.name}
                label={complement.label}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputField
                name={neighborhood.name}
                label={neighborhood.label}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputField name={city.name} label={city.label} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={stateCountry.BR}
                value={acValue}
                onChange={(event, value) => setACValue(value)}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                autoHighlight
                getOptionLabel={option => option.label}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    <img
                      loading="lazy"
                      width="42"
                      style={{ borderRadius: 4, cursor: 'pointer' }}
                      src={`https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/${option.code}.png`}
                      srcSet={`https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/${option.code}.png 2x`}
                      alt=""
                    />
                    {option.label} ({option.code})
                  </Box>
                )}
                renderInput={params => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="filled"
                    label="Choose a state"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password'
                    }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: acValue ? (
                        <InputAdornment
                          position="start"
                          onClick={() => setOpen(true)}
                          sx={{ mt: '0!important' }}
                        >
                          <img
                            loading="lazy"
                            width="32"
                            style={{ borderRadius: 4, cursor: 'pointer' }}
                            src={`https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/${acValue.code}.png`}
                            srcSet={`https://raw.githubusercontent.com/bgeneto/bandeiras-br/master/imagens/${acValue.code}.png 2x`}
                            alt=""
                          />
                        </InputAdornment>
                      ) : null
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item style={{ paddingTop: 0 }} xs={12} sm={12}>
              <p className="p-1 small mb-0 font-italic font-size-10 mt-2">
                <small>
                  <strong>Porque precisamos do seu endereço?</strong>
                </small>
              </p>
              <div className="p-1 mb-0 font-italic text-muted font-size-10">
                <small>
                  É para garantir que sua box chegue no endereço correto.
                </small>
              </div>
            </Grid>
          </>
        )}
      </Grid>
    </>
  )
}

const stateCountry = {
  BR: [
    { label: 'Acre', code: 'AC' },
    { label: 'Alagoas', code: 'AL' },
    { label: 'Amapá', code: 'AP' },
    { label: 'Amazonas', code: 'AM' },
    { label: 'Bahia', code: 'BA' },
    { label: 'Ceará', code: 'CE' },
    { label: 'Distrito Federal', code: 'DF' },
    { label: 'Espírito Santo', code: 'ES' },
    { label: 'Goiás', code: 'GO' },
    { label: 'Maranhão', code: 'MA' },
    { label: 'Mato Grosso', code: 'MT' },
    { label: 'Mato Grosso do Sul', code: 'MS' },
    { label: 'Minas Gerais', code: 'MG' },
    { label: 'Pará', code: 'PA' },
    { label: 'Paraíba', code: 'PB' },
    { label: 'Paraná', code: 'PR' },
    { label: 'Pernambuco', code: 'PE' },
    { label: 'Piauí', code: 'PI' },
    { label: 'Rio de Janeiro', code: 'RJ' },
    { label: 'Rio Grande do Norte', code: 'RN' },
    { label: 'Rio Grande do Sul', code: 'RS' },
    { label: 'Rondônia', code: 'RO' },
    { label: 'Roraima', code: 'RR' },
    { label: 'Santa Catarina', code: 'SC' },
    { label: 'São Paulo', code: 'SP' },
    { label: 'Sergipe', code: 'SE' },
    { label: 'Tocantins', code: 'TO' }
  ]
}
