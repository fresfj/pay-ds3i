import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import FuseUtils from '@fuse/utils';
import { Image } from '@fuse/components/image'

import { Iconify } from '@fuse/components/iconify';
import { EcommerceProduct } from '../ShopApi';
import _ from '@lodash';
import { Label } from '@fuse/components/label';
import { motion } from 'framer-motion';
import { useAppDispatch } from 'app/store/store';
import { addToCart, calculateTotalItemsSelector } from '../store/cartSlice';
import { useSelector } from 'react-redux';
import ProductLabel from '../components/MailLabel';
import { RouterLink } from '@fuse/router/components/router-link';
import { ColorPreview } from '@fuse/components/color-utils';



type Props = {
  product?: EcommerceProduct;
};

export function ProductItem({ product }: Props) {
  const { id, name, colors, sizes, handle, featuredImageId, images, priceTaxIncl, comparedPrice, label, quantity } = product;

  const dispatch = useAppDispatch();

  const handleAddCart = async () => {
    const newProduct = {
      id,
      name,
      quantity: 1,
      featuredImageId,
      images,
      colors: colors ? [colors[0]] : '',
      sizes: sizes ? sizes[0] : '',
      value: Number(priceTaxIncl)
    };


    try {
      dispatch(addToCart(newProduct));
    } catch (error) {
      console.error(error);
    }

  };

  const renderLabels = label?.enabled && (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        position: 'absolute',
        zIndex: 9,
        top: 16,
        right: 16,
      }}
    >
      {label.enabled && (
        <ProductLabel label={{ ...label, color: 'blue' }} />
      )}
    </Stack>
  );

  const renderImg = (
    <Box sx={{ position: 'relative', p: 1 }}>

      {!!quantity && (
        <Fab
          color="warning"
          size="medium"
          className="add-cart-btn"
          onClick={handleAddCart}
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 9,
            opacity: 0,
            position: 'absolute',
            transition: (theme) =>
              theme.transitions.create('all', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          <Iconify icon="solar:cart-plus-bold" width={24} />
        </Fab>
      )}
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="flex flex-auto w-full items-center justify-center">
        <Image
          alt={name}
          src={_.find(images, { id: featuredImageId })?.url}
          ratio="1/1"
          sx={{ borderRadius: 1.5 }}
        />
      </motion.div>
    </Box>
  );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      <Link component={RouterLink} href={`${id}/${handle}`} color="inherit" variant="subtitle2" noWrap>
        {name}
      </Link>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {colors ? <ColorPreview colors={colors} /> : <Stack></Stack>}
        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          {priceTaxIncl < comparedPrice && (
            <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
              {FuseUtils.formatCurrency(comparedPrice)}
            </Box>
          )}
          <Box component="span">{FuseUtils.formatCurrency(priceTaxIncl)}</Box>
        </Stack>
      </Stack>
    </Stack>
  );


  return (
    <Card className='rounded-lg relative' sx={{ '&:hover .add-cart-btn': { opacity: 1 } }}>
      {renderLabels}

      {renderImg}

      {renderContent}
    </Card>
  );
}
