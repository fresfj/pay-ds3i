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
import { RouterLink } from '../components/router-link';
import ProductLabel from 'src/app/main/apps/shop/components/MailLabel';
import { ColorPreview } from '@fuse/components/color-utils';



type Props = {
  product?: EcommerceProduct;
};

export const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
  const discount = originalPrice - discountedPrice;
  const discountPercentage = (discount / originalPrice) * 100;
  return discountPercentage.toFixed(0);
};


export function ProductItem({ product }: Props) {
  const { id, name, colors, sizes, featuredImageId, images, priceTaxIncl, comparedPrice, label, quantity, handle } = product;

  const dispatch = useAppDispatch();
  const discountPercentage = calculateDiscountPercentage(comparedPrice, priceTaxIncl);

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
        {images?.length > 0 && featuredImageId ? (
          <Image
            alt={name}
            src={_.find(images, { id: featuredImageId })?.url}
            ratio="1/1"
            sx={{ borderRadius: 1.5 }}
          />
        ) : (
          <img
            className="w-full block rounded"
            src="assets/images/apps/ecommerce/product-image-placeholder.png"
            alt={name}
          />
        )}
      </motion.div>
    </Box>
  );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      <Link className='font-semibold text-xl' component={RouterLink} href={`${id}/${handle}`} variant="subtitle2" noWrap>
        {name}
      </Link>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {colors ? <ColorPreview colors={colors} /> : <Stack></Stack>}
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          {priceTaxIncl < comparedPrice && (
            <Box component="small" sx={{ color: 'text.disabled', textDecoration: 'line-through', textDecorationColor: 'rgb(255 72 66 / 70%)', }}>{FuseUtils.formatCurrency(comparedPrice)}
            </Box>
          )}
          <Box component="small" color='text.primary' className='font-semibold'>{FuseUtils.formatCurrency(priceTaxIncl)}</Box>
          {priceTaxIncl < comparedPrice && (
            <Box component="small" color="success.main" className='font-semibold'>
              {`(-${discountPercentage}%)`}
            </Box>
          )}
        </Stack>
      </Stack>
    </Stack>
  );


  return (
    <Card className='rounded-lg relative transition duration-300 delay-150 hover:-translate-y-6' sx={{ '&:hover .add-cart-btn': { opacity: 1 } }}>
      {renderLabels}

      {renderImg}

      {renderContent}
    </Card>
  );
}
