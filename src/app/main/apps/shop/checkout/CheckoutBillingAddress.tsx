import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { AddressItem } from '../address';
import { setAddress } from '../store/cartSlice';
import { useAppDispatch } from 'app/store/store';
import { useTranslation } from 'react-i18next';

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

  return (
    <>
      {addresses.slice(0, 4).map((address) => (
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
