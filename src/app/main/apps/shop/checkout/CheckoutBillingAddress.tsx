import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { AddressItem } from '../address';
import { setAddress } from '../store/cartSlice';
import { useAppDispatch } from 'app/store/store';
import { useTranslation } from 'react-i18next';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

type Props = {
  onNextStep: () => void;
  customer: any;
};

export function CheckoutBillingAddress({ customer, onNextStep }: Props) {
  const { addresses } = customer
  const dispatch = useAppDispatch();
  const { t } = useTranslation('shopApp');

  const handleAddress = (address) => {
    dispatch(setAddress(address))
    onNextStep()
  }

  if (!addresses) {
    return (
      <Paper
        sx={{
          gap: 2,
          mb: 4,
          height: 200,
          display: 'flex',
          position: 'relative',
          alignItems: { md: 'center' },
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Stack flexGrow={1} spacing={1}>
          <Stack direction="row" justifyContent="center" alignContent="center" alignItems="center">
            <Typography variant="h6">Não há nenhum endereço cadastrado.</Typography>
          </Stack>
        </Stack>
      </Paper>
    )
  }

  return (
    <>
      {addresses && addresses?.slice(0, 4).map((address) => (
        <AddressItem
          key={address.id}
          address={address}
          action={
            <Stack flexDirection="row" flexWrap="wrap" flexShrink={0}>
              {!address?.addressDefault && (
                <Button size="small" color="error" sx={{ mr: 1 }}>
                  {t('DELETE')}
                </Button>
              )}
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleAddress(address)}
              >
                {t('DELIVER_ADDRESS')}
              </Button>
            </Stack>
          }
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            boxShadow: (theme) => theme.customShadows.card,
          }}
        />
      ))}
    </>
  );
}
