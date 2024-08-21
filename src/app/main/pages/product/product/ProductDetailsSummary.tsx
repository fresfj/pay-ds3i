import { useEffect, useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import { IProductItem } from '../types/product';
import { IncrementerButton } from '../components/IncrementerButton';
import { Iconify } from '@fuse/components/iconify';
import FuseUtils from '@fuse/utils';
import { useTranslation } from 'react-i18next';
import { addToCart } from '../store/cartSlice';
import { useAppDispatch } from 'app/store/store';
import ProductLabel from 'src/app/main/apps/shop/components/MailLabel';
import { ColorPicker } from '@fuse/components/color-utils';
import TextField from '@mui/material/TextField';
import { availableSizes } from 'src/app/main/apps/e-commerce/product/tabs/VariantsTab';
import { calculateDiscountPercentage } from '../products/ProductItem';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Link as RouterLink } from 'react-router-dom';
import { useCopyToClipboard } from '@fuse/hooks/use-copy-to-clipboard';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';


// ----------------------------------------------------------------------

type Props = {
  product: IProductItem;
  items?: any[];
  disableActions?: boolean;
  onGotoStep?: (step: number) => void;
  onAddCart?: (cartItem: any) => void;
};

export function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  disableActions,
  ...other
}: Props) {


  const {
    id,
    name,
    sizes,
    price,
    coverUrl,
    colors,
    label,
    available,
    sku,
    priceSale,
    tags,
    description,
    categories,
    featuredImageId,
    images,
    quantity,
    priceTaxIncl,
    comparedPrice,
    totalRatings,
    totalReviews,
    subDescription,
  } = product;


  const existProduct = !!items?.length && items.map((item) => item.id).includes(id);

  const isMaxQuantity =
    !!items?.length &&
    items.filter((item) => item.id === id).map((item) => item.quantity)[0] >= quantity;


  const defaultValues = {
    id,
    name,
    featuredImageId,
    images,
    available: quantity,
    price: Number(priceTaxIncl),
    colors: colors ? colors[0] : '',
    sizes: sizes ? sizes[0] : '',
    quantity: quantity < 1 ? 0 : 1,
  };

  const methods = useForm({ defaultValues });
  const { t } = useTranslation('shopApp');
  const { reset, watch, control, setValue, handleSubmit } = methods;
  const dispatch = useAppDispatch();
  const values = watch();

  const { copy } = useCopyToClipboard();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);
  const fullURL = window.location.href;
  const [favorites, setFavorites] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
    setIsFavorite(storedFavorites.includes(product.id));
  }, [product.id]);

  const handleToggleFavorite = () => {
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter(id => id !== product.id);
    } else {
      updatedFavorites = [...favorites, product.id];
    }

    setFavorites(updatedFavorites);
    setIsFavorite(!isFavorite);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleSendEmail = useCallback(
    () => {
      const subject = 'Olha que produto incrível';
      const body = `Olha que produto incrível: ${fullURL}`;
      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;

    }, []
  );


  const onCopy = useCallback(
    () => {
      dispatch(
        showMessage({
          message: 'Copied!',
          autoHideDuration: 6000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          variant: 'success'
        }))
      copy(fullURL);

    },
    [copy]
  );

  const onSubmit = handleSubmit(async (data) => {
    // try {
    //   if (!existProduct) {
    //     onAddCart?.({ ...data, colors: [values.colors], subtotal: data.price * data.quantity });
    //   }
    //   onGotoStep?.(0);
    //   router.push(paths.product.checkout);
    // } catch (error) {
    //   console.error(error);
    // }
  });

  const handleAddCart = useCallback(() => {
    try {
      dispatch(addToCart({ ...values, value: values.price, colors: [values.colors], subtotal: values.price * values.quantity }));
    } catch (error) {
      console.error(error);
    }
  }, [onAddCart, values]);

  const PRODUCT_STOCK_OPTIONS = [
    { value: 'IN_STOCK', label: 'In stock' },
    { value: 'LOW_STOCK', label: 'Low stock' },
    { value: 'OUT_OF_STOCK', label: 'Out of stock' },
  ];

  const getStockStatus = (quantity: number) => {
    if (quantity > 25) {
      return PRODUCT_STOCK_OPTIONS.find(option => option.value === 'IN_STOCK');
    } else if (quantity > 0 && quantity <= 25) {
      return PRODUCT_STOCK_OPTIONS.find(option => option.value === 'LOW_STOCK');
    } else {
      return PRODUCT_STOCK_OPTIONS.find(option => option.value === 'OUT_OF_STOCK');
    }
  };

  const stockStatus = getStockStatus(quantity);
  const inventoryType = stockStatus?.value || 'IN_STOCK';
  const discountPercentage = calculateDiscountPercentage(comparedPrice, priceTaxIncl);

  const renderPrice = (
    <Box sx={{ typography: 'h5' }} className='font-semibold'>
      {priceTaxIncl && (
        <Box
          component="small"
          sx={{ color: 'text.disabled', textDecoration: 'line-through', textDecorationColor: 'rgb(255 72 66 / 70%)', mr: 0.5 }}
        >
          {FuseUtils.formatCurrency(comparedPrice)}
        </Box>
      )}

      {FuseUtils.formatCurrency(priceTaxIncl)}

      {priceTaxIncl < comparedPrice && (
        <Box sx={{ ml: 0.5 }} component="small" color="success.main">
          {`(-${discountPercentage}%)`}
        </Box>
      )}
    </Box>
  );

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            color="error"
            checked={isFavorite}
            onChange={handleToggleFavorite}
            icon={<Iconify icon="solar:heart-bold" />}
            checkedIcon={<Iconify icon="solar:heart-bold" />}
            inputProps={{ id: 'favorite-checkbox', 'aria-label': 'Favorite checkbox' }}
          />
        }
        label={(
          <Typography variant="subtitle2" sx={{ px: 0.5, color: 'text.primary' }}>
            {isFavorite ? 'Desfavoritar' : 'Favoritar'}
          </Typography>
        )}
        sx={{ mr: 1 }}
      />

      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <>
            <Link
              variant="subtitle2"
              sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
              {...bindTrigger(popupState)}
            >
              <Iconify icon="solar:share-bold" width={18} sx={{ mr: 1 }} />
              Compartilhar
            </Link>
            <Menu {...bindMenu(popupState)}>
              <MenuItem component={RouterLink} to="https://api.whatsapp.com/send/?text=Olha+que+produto+incr%C3%ADvel+https%3A%2F%2Floja.ds3i.com.br&type=custom_url&app_absent=0"><ListItemIcon><Iconify icon="uil:whatsapp" /></ListItemIcon>Whatsapp</MenuItem>
              <MenuItem onClick={() => { handleSendEmail(); popupState.close(); }}><ListItemIcon><Iconify icon="eva:email-outline" /></ListItemIcon>E-mail</MenuItem>
              <MenuItem onClick={() => { onCopy(); popupState.close(); }}><ListItemIcon><Iconify icon="eva:copy-fill" /></ListItemIcon>Copiar link</MenuItem>
            </Menu>
          </>
        )}
      </PopupState>
    </Stack>
  );

  const renderColorOptions = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        {t('COLOR')}
      </Typography>

      <Controller
        name="colors"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <ColorPicker
            colors={colors}
            selected={field.value}
            onSelectColor={(color) => field.onChange(color as string)}
            limit={5}
          />
        )}
      />
    </Stack>
  )

  const renderSizeOptions = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        {t('SIZE')}
      </Typography>
      <Controller
        name="sizes"
        control={control}
        defaultValue=""
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            select
            fullWidth
            error={!!error}
            size="small"
            helperText={
              error ? error.message : (
                <Link underline="always" color="textPrimary">
                  Size chart
                </Link>
              )
            }
            SelectProps={{
              MenuProps: { PaperProps: { sx: { maxHeight: 270 } } },
              sx: { textTransform: 'capitalize', lineHeight: 1.5 }
            }}
            sx={{
              maxWidth: 98,
              [`& .${formHelperTextClasses.root}`]: { mx: 0, mt: 1, textAlign: 'right' }
            }}
          >
            {sizes.map((option) => {
              const size = availableSizes.find(size => size.id === option);
              return (
                <MenuItem key={option} value={option}>
                  {size ? size.title : option}
                </MenuItem>
              );
            })}
          </TextField>
        )}
      />
      {/* <Field.Select
        name="size"
        size="small"
        helperText={
          <Link underline="always" color="textPrimary">
            Size chart
          </Link>
        }
        sx={{
          maxWidth: 88,
          [`& .${formHelperTextClasses.root}`]: { mx: 0, mt: 1, textAlign: 'right' },
        }}
      >
        {sizes.map((size) => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </Field.Select> */}
    </Stack>
  )

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        {t('QUANTITY')}
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          productView={true}
          quantity={values.quantity}
          disabledDecrease={values.quantity <= 1}
          disabledIncrease={values.quantity >= available}
          onIncrease={() => setValue('quantity', values.quantity + 1)}
          onDecrease={() => setValue('quantity', values.quantity - 1)}
        />

        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
          {t('AVAILABLE', { total: quantity })}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderActions = (
    <Stack direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 2, sm: 2, md: 1 }}>
      <Button
        fullWidth
        disabled={isMaxQuantity || disableActions}
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: 'nowrap', px: 4 }}
        className='hover:scale-105 transition duration-300 delay-150 ease-in-out'
      >
        {t('ADD_TO_CART')}
      </Button>

      <Button fullWidth className='hover:scale-105 transition duration-300 delay-150 ease-in-out' size="large" type="submit" variant="contained" disabled={disableActions}>
        {t('BUY_NOW')}
      </Button>
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {subDescription}
    </Typography>
  );

  const renderRating = (
    <Stack direction="row" alignItems="center" sx={{ color: 'text.disabled', typography: 'body2' }}>
      <Rating size="small" defaultValue={5} precision={0.5} readOnly sx={{ mr: 1 }} />
      {`(3.36k comentários)`}
    </Stack>
  );

  const renderLabels = (label?.enabled) && (
    <Stack direction="row" alignItems="center" spacing={1}>
      {label.enabled &&
        <ProductLabel className='rounded-4 font-bold uppercase' label={{ ...label, color: 'blue' }} />
      }
    </Stack>
  );

  const renderInventoryType = (
    <Box
      className='font-semibold'
      component="span"
      sx={{
        typography: 'overline',
        color:
          (inventoryType === 'OUT_OF_STOCK' && 'error.main') ||
          (inventoryType === 'LOW_STOCK' && 'warning.main') ||
          'success.main',
      }}
    >
      {t(inventoryType)}
    </Box>
  );

  return (
    <form onSubmit={onSubmit} noValidate autoComplete="off">
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {renderLabels}

          {renderInventoryType}

          <Typography variant="h5" className='font-semibold'>{name}</Typography>

          {renderRating}

          {renderPrice}

          {renderSubDescription}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {colors?.length > 0 && renderColorOptions}

        {sizes?.length > 0 && renderSizeOptions}

        {renderQuantity}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderActions}

        {renderShare}
      </Stack>
    </form>
  );
}
