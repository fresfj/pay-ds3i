import type { CardProps } from '@mui/material/Card';
import type { PaperProps } from '@mui/material/Paper';

import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import FormHelperText from '@mui/material/FormHelperText';
import { Iconify } from '@fuse/components/iconify';
import { Image } from '@fuse/components/image'
import FuseUtils from '@fuse/utils';
import FormNewCard from '../../account/components/dialogs/FormNewCard';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';


// ----------------------------------------------------------------------

type Props = CardProps & {
  options: {
    payments: any[];
    cards: any[];
    user: any;
    updateUser: any;
  };
};

export function CheckoutPaymentMethods({ options, ...other }: Props) {
  const { control } = useFormContext();
  const { t } = useTranslation('shopApp');
  return (
    <>
      <Card {...other}>
        <CardHeader
          title={
            <Typography variant="h6">
              {t('PAYMENT')}
            </Typography>
          }
          sx={{ px: 3, mt: 2 }}
        />

        <Controller
          name="payment"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Stack sx={{ px: 3, pb: 3 }}>
              {options.payments.map((option) => (
                <OptionItem
                  option={option}
                  key={option.label}
                  cardOptions={options.cards}
                  user={options.user}
                  updateUser={options.updateUser}
                  selected={field.value === option.value}
                  isCredit={option.value === 'credit' && field.value === 'credit'}
                  onClick={() => {
                    field.onChange(option.value);
                  }}
                />
              ))}

              {!!error && (
                <FormHelperText error sx={{ pt: 1, px: 2 }}>
                  {error.message}
                </FormHelperText>
              )}
            </Stack>
          )}
        />
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------

type OptionItemProps = PaperProps & {
  selected: boolean;
  isCredit: boolean;
  user: any;
  updateUser?: () => void;
  onOpen?: () => void;
  option: any;
  cardOptions: any[];
};

function OptionItem({
  option,
  user,
  updateUser,
  cardOptions,
  selected,
  isCredit,
  onOpen,
  ...other
}: OptionItemProps) {
  const { value, label, description } = option;
  const formNewCardRef = useRef();
  return (
    <Paper
      variant="outlined"
      key={value}
      sx={{
        p: 2.5,
        mt: 2.5,
        cursor: 'pointer',
        ...(selected && { boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}` }),
      }}
      {...other}
    >
      <ListItemText
        primary={
          <Stack direction="row" alignItems="center">
            <Box component="span" sx={{ flexGrow: 1 }}>
              {label}
            </Box>
            <Stack spacing={1} direction="row" alignItems="center">
              {value === 'credit' && (
                <>
                  <Iconify icon="logos:mastercard" width={24} />
                  <Iconify icon="logos:visa" width={24} />
                </>
              )}
              {value === 'paypal' && <Iconify icon="logos:paypal" width={24} />}
              {value === 'pix' && <Image alt="icon" src={FuseUtils.cardFlag('pix')} sx={{ maxWidth: 32 }} />}
            </Stack>
          </Stack>
        }
        secondary={description}
        primaryTypographyProps={{ typography: 'subtitle1', mb: 0.5 }}
        secondaryTypographyProps={{ typography: 'body2' }}
      />

      {isCredit && (
        <Stack spacing={2.5} alignItems="flex-end" sx={{ pt: 2.5 }}>
          <TextField select fullWidth label="Cards" SelectProps={{ native: true }}>
            {cardOptions.map((card) => (
              <option key={card.creditCard.number} value={card.creditCard.number}>
                {`**** **** **** ${card.creditCard.number.slice(-4)} (${FuseUtils.identifyCardBrand(card.creditCard.number)?.brand}) - ${card.creditCard.holderName}`}
              </option>
            ))}
          </TextField>

          <FormNewCard ref={formNewCardRef} user={user} updateUser={updateUser} />
          {/* <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={onOpen}
          >
            Add New Card
          </Button> */}
        </Stack>
      )}
    </Paper>
  );
}
