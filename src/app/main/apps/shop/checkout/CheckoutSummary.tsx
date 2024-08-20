import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FuseUtils from '@fuse/utils';
import { Iconify } from '@fuse/components/iconify';
import { useTranslation } from 'react-i18next';
import Avatar from '@mui/material/Avatar';
import _ from '@lodash';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Label } from '@fuse/components/label';
import { ColorPreview } from '@fuse/components/color-utils';

// ----------------------------------------------------------------------
const container = {
  show: {
    transition: {
      staggerChildren: 0.04
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));


type Props = {
  total: number;
  products?: any[];
  subtotal: number;
  discount?: number;
  shipping?: number;
  activeStep?: number;
  onEdit?: (step: number) => void;
  onApplyDiscount?: (discount: number) => void;
};

export function CheckoutSummary({
  total,
  onEdit,
  products,
  discount,
  subtotal,
  shipping,
  activeStep,
  onApplyDiscount,
}: Props) {
  const displayShipping = shipping !== null ? 'Free' : '-';
  const { t } = useTranslation('shopApp');
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={
          <Typography variant="h6">
            {t('SUMMARY')}
          </Typography>
        }
        sx={{ px: 3, mt: 2 }}
        action={
          onEdit && activeStep === 2 && (
            <Button size="small" className='px-12' onClick={() => onEdit(0)} startIcon={<Iconify icon="solar:pen-bold" />}>
              {t('EDIT')}
            </Button>
          )
        }
      />
      {activeStep >= 1 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          <Stack spacing={2} sx={{ p: 3 }}>
            {products.length > 0 && products?.map((row) => (
              <motion.div
                variants={item}
                key={row.id}
              >
                <Stack spacing={2} direction="row" alignItems="center">
                  <Badge badgeContent={row.quantity} color="secondary">
                    <Avatar
                      variant="rounded"
                      alt={row.name}
                      src={_.find(row.images, { id: row.featuredImageId })?.url}
                      sx={{ width: 64, height: 64 }}
                    />
                  </Badge>
                  <Stack spacing={0.5}>
                    <Typography noWrap variant="subtitle2" sx={{ maxWidth: 300 }}>
                      {row.name}
                    </Typography>
                    {row?.sizes &&
                      <Stack
                        direction="row"
                        alignItems="center"
                        sx={{ typography: 'body2', color: 'text.secondary' }}>
                        size: <Label sx={{ ml: 0.5, textTransform: 'uppercase' }}> {row.sizes} </Label>
                        <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
                        <ColorPreview sx={{ ml: 0.5 }} colors={row.colors} />
                      </Stack>
                    }
                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{ typography: 'body2', color: 'text.secondary' }}
                    >
                      {FuseUtils.formatCurrency(row.value)}
                    </Stack>
                  </Stack>
                </Stack>
              </motion.div>
            ))}

            <Link
              color="text.primary"
              to={`/apps/shop`}
              style={{ textDecoration: 'none' }}
            >
              <Stack spacing={2} direction="row" alignItems="center">
                <Box display="flex" justifyContent="center" alignItems="center" border="1px dashed #ccc" borderRadius={2}
                  sx={{ width: 64, height: 64 }}
                >
                  <Iconify className='text-grey-700' icon="eva:plus-fill" width={34} />
                </Box>

                <Typography noWrap variant="h4" className='text-lg font-medium no-underline hover:underline'>
                  {t('SEE_MORE_PRODUCT')}
                </Typography>
              </Stack>
            </Link>
          </Stack>
        </motion.div>
      )}
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: 'text.secondary' }}
          >
            {t('SUBTOTAL')}
          </Typography>
          <Typography component="span" variant="subtitle2">
            {FuseUtils.formatCurrency(subtotal)}
          </Typography>
        </Box>

        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: 'text.secondary' }}
          >
            {t('DISCOUNT')}
          </Typography>
          <Typography component="span" variant="subtitle2">
            {discount ? FuseUtils.formatCurrency(-discount) : '-'}
          </Typography>
        </Box>

        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: 'text.secondary' }}
          >
            {t('SHIPPING')}
          </Typography>
          <Typography component="span" variant="subtitle2">
            {shipping ? FuseUtils.formatCurrency(shipping) : displayShipping}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box display="flex">
          <Typography component="span" variant="subtitle1" sx={{ flexGrow: 1 }}>
            {t('TOTAL')}
          </Typography>

          <Box sx={{ textAlign: 'right' }}>
            <Typography
              component="span"
              variant="subtitle1"
              sx={{ display: 'block', color: 'error.main' }}
            >
              {FuseUtils.formatCurrency(total)}
            </Typography>
            {/* <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
              (VAT included if applicable)
            </Typography> */}
          </Box>
        </Box>

        {onApplyDiscount && activeStep === 0 && (
          <TextField
            fullWidth
            placeholder="Discount codes / Gifts"
            value="DISCOUNT5"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button color="primary" onClick={() => onApplyDiscount(5)} sx={{ mr: -0.5 }}>
                    Apply
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        )}
      </Stack>
    </Card>
  );
}
