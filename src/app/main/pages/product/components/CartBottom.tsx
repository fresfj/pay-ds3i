import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectFooterTheme } from '@fuse/core/FuseSettings/store/fuseSettingsSlice';
import { ThemeProvider } from '@mui/material/styles';
import AppBar from "@mui/material/AppBar";
import { Iconify } from "@fuse/components/iconify";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import Badge from '@mui/material/Badge';
import Typography from "@mui/material/Typography";
import FuseUtils from "@fuse/utils/FuseUtils";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Button from '@mui/material/Button';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import _ from '@lodash';


type Props = {
  cart: any;
  total: number;
  totalItems: number;
  onOpen: (newValue: boolean) => void
};

export function CartBottom(props: Props) {
  const { totalItems, total, cart } = props
  const { t } = useTranslation('shopApp');
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const footerTheme = useSelector(selectFooterTheme);

  return (
    <Box className="flex justify-center mt-36">
      <ThemeProvider theme={footerTheme}>
        <AppBar position="fixed" color="primary" elevation={0}
          sx={{
            bottom: 0,
            display: 'flex',
            top: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? footerTheme.palette.background.paper
                : footerTheme.palette.background.default
          }}
        >
          <Toolbar disableGutters className="container flex cursor-pointer min-h-56 items-center overflow-x-auto px-8 py-0 sm:px-28 md:min-h-68">
            <Stack spacing={4} flex={1} direction="row" alignItems="center" justifyContent="space-between" onClick={() => props.onOpen(true)}>
              <Stack spacing={2} flex={1} direction="row" alignItems="center">
                <Badge showZero badgeContent={totalItems} color="error" max={99}>
                  <Iconify icon="solar:cart-3-bold" width={32} />
                </Badge>
                {!isMobile &&
                  <Typography
                    color="text.primary"
                    variant="body1"
                    className='text-white font-bold text-xl invisible sm:visible'
                  >
                    {t('YOUR_CART')}
                  </Typography>
                }
              </Stack>
              <Stack spacing={2} direction="row" justifyContent="center" alignItems="center">
                <>
                  {Boolean(cart.products.length) && (
                    <div className="flex items-center mt-24 -space-x-6 overflow-hidden">
                      <AvatarGroup max={isMobile ? 2 : 4}>
                        {cart.products.map((product, index) => (
                          <Avatar
                            key={index}
                            alt={product.name}
                            className='inline-block rounded-lg ring-2 ring-white bg-white'
                            src={_.find(product.images, { id: product.featuredImageId })?.url}
                          />
                        ))}
                      </AvatarGroup>
                    </div>
                  )}
                  <Typography
                    color="text.primary"
                    variant="body1"
                    className='text-white font-bold text-xl sm:text-3xl'
                  >
                    {FuseUtils.formatCurrency(total)}
                  </Typography>
                </>
                {!isMobile ?
                  <Button
                    className="mb-4 px-12 opacity-100 text-lg"
                    color="secondary"
                    variant="contained"
                    endIcon={
                      <FuseSvgIcon size={20}>material-solid:arrow_forward_ios</FuseSvgIcon>
                    }
                  >
                    {t('SEE')}
                  </Button>
                  :
                  <FuseSvgIcon size={20}>material-solid:arrow_forward_ios</FuseSvgIcon>
                }
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </Box>
  );
}
