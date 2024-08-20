import { useState } from 'react';
import { Typography, Card, Button, CardActions, CardContent } from '@mui/material';
import { Iconify } from '@fuse/components/iconify';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const BillingEmpty = () => {
  const theme = useTheme();
  const { t } = useTranslation('accountApp');
  const container = {
    show: {
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full"
    >

      <div className="md:flex">
        <div className="flex flex-col flex-1 items-center md:ltr:pr-32 md:rtl:pl-32">
          <Card className="w-full"
            component={motion.div}
            variants={item}
          >
            <CardContent sx={{ my: 12 }}>
              <div className='grid grid-cols-1 gap-4 justify-items-center content-center'>
                <Iconify icon={'solar:documents-bold-duotone'} sx={{ width: 120, height: 120, color: theme.palette.secondary.main }} />
                <Typography className="flex-1 mt-8 text-2xl font-semibold opacity-80 group-hover:opacity-100">{t('NO_BILLING_TITLE')}</Typography>
                <Typography className="text-lg font-medium">{t('NO_BILLING_SUB')}</Typography>
              </div>
            </CardContent>
            <CardActions className='my-28 justify-center'>
              <Button
                component={Link}
                to={'https://creabox.com.br/'}
                className="mx-8 whitespace-nowrap text-xl"
                variant="outlined"
                color="secondary"
                endIcon={<Iconify icon="solar:link-minimalistic-2-line-duotone" />}
              >
                <span className="hidden sm:flex mx-8">Quero assinar agora!</span>
              </Button>
            </CardActions>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default BillingEmpty;
