import type { DialogProps } from '@mui/material/Dialog';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Iconify } from '@fuse/components/iconify';
import OrderCompleteIllustration from '@fuse/utils/illustration/orderComplete';
import { useTranslation } from 'react-i18next';


// ----------------------------------------------------------------------

type Props = DialogProps & {
  onReset: () => void;
  onDownloadPDF: () => void;
};

export function CheckoutOrderComplete({ open, onReset, onDownloadPDF }: Props) {
  const { t } = useTranslation('shopApp');
  return (
    <Dialog
      fullWidth
      fullScreen
      open={open}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, md: 2 },
          width: { md: `calc(100% - 48px)` },
          height: { md: `calc(100% - 48px)` },
        },
      }}
    >
      <Box
        gap={5}
        display="flex"
        alignItems="center"
        flexDirection="column"
        sx={{
          py: 5,
          m: 'auto',
          maxWidth: 480,
          textAlign: 'center',
          px: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h4">{t('THANK_PURCHASE')}</Typography>

        <OrderCompleteIllustration />

        <Typography>
          {t('THANK_ORDER')}
          <br />
          <br />
          <Link>01dc1370-3df6-11eb-b378-0242ac130002</Link>
          <br />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('THANK_DESCRIPTION') }} />
        </Typography>

        <Divider sx={{ width: 1, borderStyle: 'dashed' }} />

        <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
          <Button
            size="large"
            color="inherit"
            variant="outlined"
            onClick={onReset}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            {t('CONTINUE_SHOPPING')}
          </Button>

          <Button
            size="large"
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-download-fill" />}
            onClick={onDownloadPDF}
          >
            Download as PDF
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
