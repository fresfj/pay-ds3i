import {
  InputField,
  InputDocument,
  InputPhone,
  InputZipCode,
  InputBirthdate
} from '../formFields'
import Grid from '@mui/material/Grid'

export default function AddressForm(props) {
  const {
    formField: {
      fullName,
      email,
      cpfCnpj,
      phone,
      birthday,
      state,
      zipcode,
      country,
      useAddressForPaymentDetails
    }
  } = props
  return (
    <>
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} sm={6}>
          <InputField name={fullName.name} label={fullName.label} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField name={email.name} label={email.label} fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputBirthdate
            name={birthday.name}
            label={birthday.label}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputDocument name={cpfCnpj.name} label={cpfCnpj.label} fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <InputPhone name={phone.name} label={phone.label} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <InputZipCode
            fullWidth
            name={zipcode.name}
            label={zipcode.label}
            {...props}
          />
        </Grid>
      </Grid>
    </>
  )
}
