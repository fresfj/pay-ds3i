import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import { Iconify } from '@fuse/components/iconify';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';


// ----------------------------------------------------------------------

type Props = {
  onBackStep: () => void;
  billing: any | null;
};

export function CheckoutBillingInfo({ billing, onBackStep }: Props) {
  const { t } = useTranslation('shopApp');
  const { address, customer } = billing
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={
          <Typography variant="h6">
            {t('ADDRESS')}
          </Typography>
        }
        sx={{ px: 3, mt: 2 }}
        action={
          <Button size="small" className='px-12' startIcon={<Iconify icon="solar:pen-bold" />} onClick={onBackStep}>
            {t('EDIT')}
          </Button>
        }
      />
      <Stack spacing={1} sx={{ p: 3 }}>
        <Box sx={{ typography: 'subtitle2' }}>
          {`${customer?.name} `}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            ({customer?.email})
          </Box>
        </Box>

        <Box sx={{ color: 'text.secondary', typography: 'body2' }}>{`${address?.address}, ${address?.addressNumber} - ${address?.neighborhood}, ${address?.city} - ${address?.state}, ${address?.zipCode}`}</Box>

        <Box sx={{ color: 'text.secondary', typography: 'body2' }}>{customer?.phone}</Box>
      </Stack>
    </Card>
  );
}
