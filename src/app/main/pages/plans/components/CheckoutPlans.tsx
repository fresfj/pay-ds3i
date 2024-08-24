import type { CardProps } from '@mui/material/Card';
import type { PaperProps } from '@mui/material/Paper';
import { Controller, useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';
import { getStorage } from '@fuse/hooks/useLocalStorage';
import Typography from '@mui/material/Typography';
import _ from '@lodash';
import { EcommerceProduct } from 'src/app/main/apps/shop/ShopApi';
import { motion } from 'framer-motion';


// ----------------------------------------------------------------------
const STORAGE_KEY = 'plan_checkout';

type Props = CardProps & {
  options?: EcommerceProduct[];
  onApplyShipping: (shipping: any) => void;
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  },
};

export function CheckoutPlans({ options, onApplyShipping, ...other }: Props) {
  const { control, setValue } = useFormContext();

  useEffect(() => {
    const storedOption = getStorage(STORAGE_KEY);
    if (storedOption?.shipping) {
      setValue('plan', storedOption.shipping.value);
    } else if (options && options.length > 0) {
      setValue('plan', options[0].uid);
      onApplyShipping(options[0]);
    }
  }, [setValue, options, onApplyShipping]);

  return (
    <Controller
      name="plan"
      control={control}
      render={({ field }) => (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          <Box
            columnGap={2}
            rowGap={2.5}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            sx={{ px: { md: 3, xs: 2 }, pb: 4 }}
          >
            {options?.map((option) => (
              <motion.div key={option.uid} variants={item}>
                <OptionItem
                  option={option}
                  selected={field.value === option.uid}
                  onClick={() => {
                    field.onChange(option.uid);
                    onApplyShipping(option);
                  }}
                />
              </motion.div>
            ))}

          </Box>
        </motion.div>
      )}
    />
  );
}

// ----------------------------------------------------------------------

type OptionItemProps = PaperProps & {
  selected: boolean;
  option: any;
};

function OptionItem({ option, selected, ...other }: OptionItemProps) {
  const { priceTaxIncl, comparedPrice, subDescription, description, name, uid, featuredImageId, images } = option;
  return (
    <Paper
      variant="outlined"
      key={uid}
      className="grid grid-cols-3 max-w-sm overflow-hidden lg:max-w-xl lg:flex-row p-0"
      sx={{
        p: 2.5,
        cursor: 'pointer',
        ...(selected && { boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}` }),
      }}
      {...other}
    >
      <div className="col-span-2 py-24 px-20 sm:py-32 lg:py-32">
        <Typography className="text-2xl font-bold">{name}</Typography>
        <Typography className="text-xl font-semibold">{subDescription}</Typography>
      </div>
      <Box
        sx={{
          backgroundColor: 'primary.main',
          backgroundImage: `url(${_.find(images, { id: featuredImageId })?.url})`
        }}
        className="bg-cover bg-no-repeat bg-center flex flex-col items-center p-8 min-h-192 lg:min-w-200 lg:px-40 lg:py-48"
      >
      </Box>
    </Paper>
  );
}
