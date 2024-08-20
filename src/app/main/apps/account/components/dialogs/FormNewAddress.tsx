import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Iconify } from '@fuse/components/iconify';
import { Controller, useForm } from 'react-hook-form';
import history from '@history';
import _ from '@lodash';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { useDispatch } from 'react-redux';
import { NewAddressProps } from './FormTypes';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { padding, textAlign } from '@mui/system';
import Divider from '@mui/material/Divider';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import InputMask from 'react-input-mask';
import CircularProgress from '@mui/material/CircularProgress';
import { useCreateAccountAddressMutation } from '../../AccountApi';
import FuseUtils from '@fuse/utils/FuseUtils';
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid';
import { useAppDispatch } from 'app/store/store';
const mapKey = import.meta.env.VITE_MAP_KEY

type FormType = NewAddressProps;

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    padding: 10,
    maxWidth: 200,
    textAlign: 'center'
  },
  [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
  {
    marginTop: '0px',
  },
  [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
  {
    marginBottom: '0px',
  },
  [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
  {
    marginLeft: '0px',
  },
  [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
  {
    marginRight: '0px',
  },
});


const schema = z.object({
  addressType: z.string().optional(),
  phoneNumber: z.string({ required_error: 'Phone Number is required' }),
  name: z.string({ required_error: 'Full Name is required' }).refine((value) => {
    const words = value.trim().split(' ');
    return words.length >= 2;
  }, {
    message: 'Digite o nome completo'
  }),
  address: z.string().min(1, { message: 'Address is required' }),
  addressNumber: z.string().min(1, { message: 'Address Number is required' }),
  addressComplement: z.string().optional(),
  neighborhood: z.string().min(1, { message: 'Neighborhood is required' }),
  city: z.string({ required_error: 'City is required' }),
  state: z.string({ required_error: 'State is required' }),
  zipCode: z.string({ required_error: 'ZipCode is required' }),
  addressDefault: z.boolean().optional(),
});

export default function FormNewAddress(props) {
  const { user, updateUser } = props
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [addressData, setAddressData] = React.useState([] as any);
  const [loading, setLoading] = React.useState(false);
  const [cep, setCep] = React.useState('');
  const [address, setAddress] = React.useState(null);
  const { t } = useTranslation('accountApp');
  const dispatch = useAppDispatch();

  const [createAccountAddress] = useCreateAccountAddressMutation();

  const handleCepChange = (event) => {
    setCep(event.target.value);
  };

  const handleCepSearch = async (e) => {
    const cep = e.target.value.replace(/[^0-9]/g, '')
    if (cep.length === 8) {
      setLoading(true);

      await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
          setAddress(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erro ao buscar informações de endereço:', error);
          setLoading(false);
        });
    }
  }

  const handleInputChange = async (event) => {
    const cep = event.target.value.replace(/[^0-9]/g, '')
    setInputValue(event.target.value);
    if (cep.length === 8) {
      setLoading(true);

      try {
        await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${event.target.value}&key=${mapKey}`)
          .then(response => response.json())
          .then(data => {
            setLoading(false);
            setAddressData(data.results[0]);
            fillAddressFields(data.results[0].address_components);
          })
          .catch(error => {
            console.error('Erro ao buscar sugestões de endereço:', error);
            setLoading(false);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const defaultValues = {
    addressType: 'Home',
    addressDefault: false,
    address: '',
    addressNumber: '',
    addressComplement: '',
    neighborhood: ''
  }

  const { control, watch, setValue, reset, handleSubmit, formState, getValues } = useForm<FormType>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(schema)
  });

  const fillAddressFields = (addressComponents) => {
    addressComponents.forEach(component => {
      switch (component.types[0]) {
        case 'postal_code':
          setValue('zipCode', component.long_name);
          break;
        case 'route':
          setValue('address', component.long_name);
          break;
        case 'political':
          setValue('neighborhood', component.long_name);
          break;
        case 'administrative_area_level_2':
          setValue('city', component.short_name);
          break;
        case 'administrative_area_level_1':
          setValue('state', component.short_name);
          break;
        default:
          break;
      }
    });
  };

  const { isValid, dirtyFields, errors } = formState;
  const form = watch();

  /**
   * Form Submit
   */
  function onSubmit(address: any) {
    const formatted = {
      address: addressData.formatted_address,
      ...addressData.geometry.location
    }
    const id: string = FuseUtils.generateGUID()
    const addressNew = { ...address, id }

    createAccountAddress({ data: addressNew, addressFormatted: formatted, uid: user.uid, customerId: user.data.customer.id }).then(() => {
      dispatch(
        showMessage({
          message: 'Endereço adicionado com sucesso',
          autoHideDuration: 6000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          variant: 'success'
        }))
    }).catch((_error) => {
      dispatch(
        showMessage({
          message: 'Error ao  adicionado o endereço',
          autoHideDuration: 6000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          variant: 'error'
        }))
    })

    const addressesOld = user.data?.customer?.addresses || []
    if (Array.isArray(addressesOld)) {
      const updatedAddresses = addressesOld.map((address) => {
        if (address.addressDefault && addressNew.addressDefault) {
          return {
            ...address,
            addressDefault: false
          };
        } else {
          return address;
        }
      })

      updateUser({
        data: {
          customer: {
            addresses: [...updatedAddresses, { ...addressNew, addressFormatted: formatted }]
          }
        }
      });
      reset();
      handleClose();
    } else {
      updateUser({ data: { customer: { addresses: [{ ...addressNew, addressFormatted: formatted }] } } })
      reset();
      handleClose();
    }

  }


  React.useEffect(() => {
    if (form) {
      reset(form)
    } else {
      reset()
    }

  }, [reset]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    reset()
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        color="inherit"
        size="small"
        className='px-12'
        onClick={handleClickOpen}
      >
        <Iconify icon={'eva:plus-fill'} sx={{ width: 22, height: 22, marginRight: 1 }} />
        {t('NEW_ADDRESS')}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            reset()
            handleClose();
          },
        }}
        fullWidth
      >
        <DialogTitle>{t('NEW_ADDRESS')}</DialogTitle>
        <DialogContent>

          <fieldset className="MuiFormControl-root">
            <div className="MuiFormGroup-root MuiFormGroup-row">
              <Controller
                name="addressType"
                control={control}
                defaultValue="Home"
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="Home" control={<Radio />} label="Home" />
                    <FormControlLabel value="Office" control={<Radio />} label="Office" />
                  </RadioGroup>
                )}
              />
            </div>
          </fieldset>
          <Grid container className='py-20' rowSpacing={.5} spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField {...field} className="mt-20" label={t('FULL_NAME')} fullWidth variant="outlined"
                    error={!!errors.name}
                    helperText={errors?.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField {...field} className="mt-20" label={t('PHONE_NUMBER')} fullWidth variant="outlined"
                    error={!!errors.phoneNumber}
                    helperText={errors?.phoneNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="zipCode"
                control={control}
                render={({ field }) => (
                  <InputMask
                    {...field}
                    className="mt-20"
                    mask="99999-999"
                    maskChar=""
                    onChange={handleInputChange}
                  >
                    {(inputProps) => (
                      <TextField
                        {...inputProps}
                        label={t('ZIP_CODE')}
                        fullWidth
                        variant="outlined"
                        error={!!errors.zipCode}
                        helperText={errors?.zipCode?.message}
                        InputProps={{
                          endAdornment: (
                            <>
                              {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            </>
                          )
                        }}
                      />
                    )}
                  </InputMask>
                )}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-20"
                    id="address"
                    label={t('M_ADDRESS')}
                    variant="outlined"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors?.address?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="addressNumber"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-20"
                    id="addressNumber"
                    label={t('ADDRESS_NUMBER')}
                    variant="outlined"
                    fullWidth
                    error={!!errors.addressNumber}
                    helperText={errors?.addressNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="addressComplement"
                render={({ field }) => (
                  <TextField
                    fullWidth
                    className="mt-20"
                    {...field}
                    id="addressComplement"
                    label={t('ADDRESS_COMPLEMENT')}
                    variant="outlined"
                    error={!!errors.addressComplement}
                    helperText={errors?.addressComplement?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="neighborhood"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-20"
                    id="neighborhood"
                    label={t('NEIGHBORHOOD')}
                    variant="outlined"
                    fullWidth
                    error={!!errors.neighborhood}
                    helperText={errors?.neighborhood?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-20"
                    id="city"
                    label={t('CITY')}
                    variant="outlined"
                    fullWidth
                    error={!!errors.city}
                    helperText={errors?.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <TextField
                    fullWidth
                    className="mt-20"
                    {...field}
                    id="state"
                    label={t('STATE')}
                    variant="outlined"
                    error={!!errors.state}
                    helperText={errors?.state?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <div className="mt-20">
                <Controller
                  name="addressDefault"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label={t('USER_DEFAULT')}
                    />
                  )}
                />
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider className="border-dashed" />
        <DialogActions className="p-24 flex justify-end space-x-16">
          <Button
            className="whitespace-nowrap"
            variant="outlined"
            onClick={handleClose}>{t('CANCEL')}</Button>
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            disabled={_.isEmpty(dirtyFields) || !isValid}
            onClick={handleSubmit(onSubmit)}
          >{t('ADD')}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
