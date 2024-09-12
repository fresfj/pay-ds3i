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
import FuseUtils from '@fuse/utils';


// ----------------------------------------------------------------------
const STORAGE_KEY = 'plan_checkout';

type Props = CardProps & {
  period: string;
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

export function CheckoutPlans({ options, period, onApplyShipping, ...other }: Props) {
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
            {options?.sort((a, b) => a.name.localeCompare(b.name)).map((option) => (
              <motion.div key={option.uid} variants={item}>
                <OptionItem
                  option={option}
                  period={period}
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

const calculateDiscount = (baseValue, comparisonValue) => {
  const discount = ((baseValue - comparisonValue) / baseValue) * 100;
  return discount.toFixed(2); // Retorna o desconto com 2 casas decimais
};

// ----------------------------------------------------------------------

type OptionItemProps = PaperProps & {
  selected: boolean;
  period: string;
  option: any;
};

function OptionItem({ option, period, selected, ...other }: OptionItemProps) {
  const { priceTaxIncl, comparedPrice, subDescription, subscriptionOptions, name, uid, featuredImageId, images } = option;

  const subscriptionOption = subscriptionOptions?.find((option) => {
    return option.type.toLowerCase() === period.toLowerCase();
  });

  // Suponha que 'Trimestral' seja o valor base para comparar os descontos
  const baseOption = subscriptionOptions?.find((opt) => opt.type.toLowerCase() === 'trimestral');

  // Calcula o valor mensal da opção base
  const baseMonthlyValue = baseOption ? baseOption.value / baseOption.installments : null;

  // Calcula o valor mensal da opção selecionada
  const selectedMonthlyValue = subscriptionOption ? subscriptionOption.value / subscriptionOption.installments : null;

  // Calcula o desconto, se ambos os valores forem válidos
  const discount = baseMonthlyValue && selectedMonthlyValue
    ? calculateDiscount(baseMonthlyValue, selectedMonthlyValue)
    : null;

  // Calcula o valor total da opção selecionada
  const selectedTotalValue = subscriptionOption ? subscriptionOption.value : null;

  // Calcula o valor total da opção base
  const baseTotalValue = baseOption ? baseOption.value : null;

  // Calcula a economia em valor absoluto (R$)
  const savedValue = baseTotalValue && selectedTotalValue
    ? baseTotalValue - selectedTotalValue
    : null;

  // Calcula o desconto mensal, se ambos os valores forem válidos
  const monthlySavings = baseMonthlyValue && selectedMonthlyValue
    ? baseMonthlyValue - selectedMonthlyValue
    : null;

  // Calcula a economia total acumulada (desconto por mês * quantidade de meses)
  const totalSavings = monthlySavings && subscriptionOption
    ? monthlySavings * subscriptionOption.installments
    : null;

  return (
    <Paper
      variant="outlined"
      key={uid}
      className="grid grid-cols-3 max-w-sm overflow-hidden lg:max-w-xl lg:flex-row p-0"
      sx={{
        p: 2.5,
        cursor: 'pointer',
        ...(selected && { boxShadow: (theme) => `0 0 4px 2px #7505fb` }),
      }}
      {...other}
    >
      <div className="flex flex-col col-span-2 py-16 gap-y-12 px-16 sm:py-32 lg:py-32">
        <div className="content-center">
          <Typography className={`text-xl lg:text-2xl ${selected ? `font-semibold` : 'font-medium'}`}>{name}</Typography>
          <Typography className={`text-base lg:text-lg ${selected ? `font-medium` : 'font-light'}`}>{subDescription}</Typography>
        </div>
        <div className="content-end text-right">
          {discount > '0.00' ? (
            <Typography component='span' className={`bg-brand-strong text-sm rounded-full p-8 lg:text-md ${selected ? `font-medium` : 'font-400'}`}>
              {`Economia de ${FuseUtils.formatCurrency(totalSavings)}`}
            </Typography>
          ) : (
            <Typography className={`hidden text-sm lg:text-md ${selected ? `font-medium` : 'font-400'}`}>
              {subscriptionOption ? FuseUtils.formatCurrency(subscriptionOption.value / subscriptionOption.installments) : ''}/mês
            </Typography>
          )}
        </div>
      </div>
      <Box
        sx={{
          backgroundColor: 'primary.main',
          backgroundImage: `url(${_.find(images, { id: featuredImageId })?.url})`
        }}
        className="bg-cover bg-no-repeat bg-center flex flex-col items-center p-8 min-h-96 lg:min-h-160 lg:min-w-200 lg:px-40 lg:py-48"
      >
      </Box>
    </Paper>
  );
}
