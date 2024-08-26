import type { CardProps } from '@mui/material/Card';
import type { PaperProps } from '@mui/material/Paper';

import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import { Iconify } from '@fuse/components/iconify';
import { useEffect, useState } from 'react';
import { getStorage } from '@fuse/hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';
import FuseUtils from '@fuse/utils';
import Typography from '@mui/material/Typography';
import axios from 'axios';



// ----------------------------------------------------------------------
const STORAGE_KEY = 'shopApp_cart';

type Props = CardProps & {
  options?: any[];
  onApplyShipping: (shipping: number) => void;
};

export function CheckoutDelivery({ options, onApplyShipping, ...other }: Props) {
  const { control, setValue } = useFormContext();
  const { t } = useTranslation('shopApp');
  const [optionsMe, setOptionsMe] = useState([]);

  const data = [
    {
      "id": 1,
      "name": "PAC",
      "company": {
        "id": 1,
        "name": "Correios",
        "picture": "https://www.melhorenvio.com.br/images/shipping-companies/correios.png"
      },
      "error": "Serviço econômico indisponível para o trecho."
    },
    {
      "id": 2,
      "name": "SEDEX",
      "price": "11.24",
      "custom_price": "11.24",
      "discount": "9.76",
      "currency": "R$",
      "delivery_time": 3,
      "delivery_range": {
        "min": 2,
        "max": 3
      },
      "custom_delivery_time": 3,
      "custom_delivery_range": {
        "min": 2,
        "max": 3
      },
      "packages": [
        {
          "price": "11.24",
          "discount": "9.76",
          "format": "box",
          "weight": "0.30",
          "insurance_value": "0.00",
          "dimensions": {
            "height": 2,
            "width": 12,
            "length": 17
          }
        }
      ],
      "additional_services": {
        "receipt": false,
        "own_hand": false,
        "collect": false
      },
      "company": {
        "id": 1,
        "name": "Correios",
        "picture": "https://www.melhorenvio.com.br/images/shipping-companies/correios.png"
      }
    },
    {
      "id": 3,
      "name": ".Package",
      "price": "14.49",
      "custom_price": "14.49",
      "discount": "0.00",
      "currency": "R$",
      "delivery_time": 4,
      "delivery_range": {
        "min": 3,
        "max": 4
      },
      "custom_delivery_time": 4,
      "custom_delivery_range": {
        "min": 3,
        "max": 4
      },
      "packages": [
        {
          "format": "box",
          "weight": "0.30",
          "insurance_value": "0.00",
          "dimensions": {
            "height": 2,
            "width": 12,
            "length": 17
          }
        }
      ],
      "additional_services": {
        "receipt": false,
        "own_hand": false,
        "collect": false
      },
      "company": {
        "id": 2,
        "name": "Jadlog",
        "picture": "https://www.melhorenvio.com.br/images/shipping-companies/jadlog.png"
      }
    },
    {
      "id": 4,
      "name": ".Com",
      "price": "12.23",
      "custom_price": "12.23",
      "discount": "0.00",
      "currency": "R$",
      "delivery_time": 3,
      "delivery_range": {
        "min": 2,
        "max": 3
      },
      "custom_delivery_time": 3,
      "custom_delivery_range": {
        "min": 2,
        "max": 3
      },
      "packages": [
        {
          "format": "box",
          "weight": "0.30",
          "insurance_value": "0.00",
          "dimensions": {
            "height": 2,
            "width": 12,
            "length": 17
          }
        }
      ],
      "additional_services": {
        "receipt": false,
        "own_hand": false,
        "collect": false
      },
      "company": {
        "id": 2,
        "name": "Jadlog",
        "picture": "https://www.melhorenvio.com.br/images/shipping-companies/jadlog.png"
      }
    },
    {
      "id": 12,
      "name": "éFácil",
      "company": {
        "id": 6,
        "name": "LATAM Cargo",
        "picture": "https://www.melhorenvio.com.br/images/shipping-companies/latamcargo.png"
      },
      "error": "Transportadora não atende este trecho."
    },
    {
      "id": 15,
      "name": "Amanhã",
      "company": {
        "id": 9,
        "name": "Azul Cargo Express",
        "picture": "https://www.melhorenvio.com.br/images/shipping-companies/azulcargo.png"
      },
      "error": "Transportadora não atende este trecho."
    },
    {
      "id": 16,
      "name": "e-commerce",
      "company": {
        "id": 9,
        "name": "Azul Cargo Express",
        "picture": "https://www.melhorenvio.com.br/images/shipping-companies/azulcargo.png"
      },
      "error": "Transportadora não atende este trecho."
    },
    {
      "id": 17,
      "name": "Mini Envios",
      "company": {
        "id": 1,
        "name": "Correios",
        "picture": "https://www.melhorenvio.com.br/images/shipping-companies/correios.png"
      },
      "error": "Serviço econômico indisponível para o trecho."
    },
    {
      "id": 22,
      "name": "Rodoviário",
      "price": "20.00",
      "custom_price": "20.00",
      "discount": "0.00",
      "currency": "R$",
      "delivery_time": 4,
      "delivery_range": {
        "min": 3,
        "max": 4
      },
      "custom_delivery_time": 4,
      "custom_delivery_range": {
        "min": 3,
        "max": 4
      },
      "packages": [
        {
          "format": "box",
          "weight": "0.30",
          "insurance_value": "0.00",
          "dimensions": {
            "height": 2,
            "width": 12,
            "length": 17
          }
        }
      ],
      "additional_services": {
        "receipt": false,
        "own_hand": false,
        "collect": false
      },
      "company": {
        "id": 12,
        "name": "Buslog",
        "picture": "https://www.melhorenvio.com.br/images/shipping-companies/buslog.png"
      }
    },
    {
      "id": 27,
      "name": ".Package Centralizado",
      "company": {
        "id": 2,
        "name": "Jadlog",
        "picture": "https://www.melhorenvio.com.br/images/shipping-companies/jadlog.png"
      },
      "error": "Transportadora não atende este trecho."
    },
    {
      "id": 31,
      "name": "Express",
      "price": "7.26",
      "custom_price": "7.26",
      "discount": "0.00",
      "currency": "R$",
      "delivery_time": 3,
      "delivery_range": {
        "min": 2,
        "max": 3
      },
      "custom_delivery_time": 3,
      "custom_delivery_range": {
        "min": 2,
        "max": 3
      },
      "packages": [
        {
          "price": "7.26",
          "discount": "0.00",
          "format": "box",
          "weight": "0.30",
          "insurance_value": "1.00",
          "dimensions": {
            "height": 2,
            "width": 12,
            "length": 17
          }
        }
      ],
      "additional_services": {
        "receipt": false,
        "own_hand": false,
        "collect": false
      },
      "company": {
        "id": 14,
        "name": "Loggi",
        "picture": "https://www.melhorenvio.com.br/images/shipping-companies/loggi.png"
      }
    },
    {
      "id": 32,
      "name": "Coleta",
      "price": "14.47",
      "custom_price": "14.47",
      "discount": "0.00",
      "currency": "R$",
      "delivery_time": 2,
      "delivery_range": {
        "min": 1,
        "max": 2
      },
      "custom_delivery_time": 2,
      "custom_delivery_range": {
        "min": 1,
        "max": 2
      },
      "packages": [
        {
          "price": "14.47",
          "discount": "0.00",
          "format": "box",
          "weight": "0.30",
          "insurance_value": "1.00",
          "dimensions": {
            "height": 2,
            "width": 12,
            "length": 17
          }
        }
      ],
      "additional_services": {
        "receipt": false,
        "own_hand": false,
        "collect": true
      },
      "company": {
        "id": 14,
        "name": "Loggi",
        "picture": "https://www.melhorenvio.com.br/images/shipping-companies/loggi.png"
      }
    },
    {
      "id": 33,
      "name": "Standard",
      "price": "12.59",
      "custom_price": "12.59",
      "discount": "0.00",
      "currency": "R$",
      "delivery_time": 6,
      "delivery_range": {
        "min": 5,
        "max": 6
      },
      "custom_delivery_time": 6,
      "custom_delivery_range": {
        "min": 5,
        "max": 6
      },
      "packages": [
        {
          "price": "12.59",
          "discount": "0.00",
          "format": "box",
          "weight": "0.30",
          "insurance_value": "0.00",
          "dimensions": {
            "height": 2,
            "width": 12,
            "length": 17
          }
        }
      ],
      "additional_services": {
        "receipt": false,
        "own_hand": false,
        "collect": false
      },
      "company": {
        "id": 15,
        "name": "JeT",
        "picture": "https://www.melhorenvio.com.br/images/shipping-companies/jet.png"
      }
    },
    {
      "id": 34,
      "name": "Loggi Ponto",
      "price": "7.68",
      "custom_price": "7.68",
      "discount": "0.00",
      "currency": "R$",
      "delivery_time": 3,
      "delivery_range": {
        "min": 2,
        "max": 3
      },
      "custom_delivery_time": 3,
      "custom_delivery_range": {
        "min": 2,
        "max": 3
      },
      "packages": [
        {
          "price": "7.68",
          "discount": "0.00",
          "format": "box",
          "weight": "0.30",
          "insurance_value": "1.00",
          "dimensions": {
            "height": 2,
            "width": 12,
            "length": 17
          }
        }
      ],
      "additional_services": {
        "receipt": false,
        "own_hand": false,
        "collect": false
      },
      "company": {
        "id": 14,
        "name": "Loggi",
        "picture": "https://www.melhorenvio.com.br/images/shipping-companies/loggi.png"
      }
    },
    {
      "id": 10,
      "company": {},
      "error": "Serviço indisponível no momento"
    },
    {
      "id": 19,
      "company": {},
      "error": "Serviço indisponível no momento"
    },
    {
      "id": 20,
      "company": {},
      "error": "Serviço indisponível no momento"
    }
  ]
  const fetchDeliveryOptions = async () => {
    try {
      const response = await axios.get('https://creabox-pay.vercel.app/api/v1/delivery/melhorenvio', {
        params: {
          from: '81500000',
          to: '81560460',
          width: 12,
          weight: 0.3,
          height: 2,
          length: 17,
          insurance_value: 99.99,
          services: '1,2,17,31,32,34,3,4,27,10,12,15,16,19,20,12,22,33'
        },
        headers: {
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'Content-Type': 'application/json'
        }
      });
      setOptionsMe(response.data);
    } catch (error) {
      console.error('Erro ao buscar opções de entrega:', error);
    }
  };



  useEffect(() => {
    const storedOption = getStorage(STORAGE_KEY);
    if (storedOption?.shipping) {
      setValue('delivery', storedOption.shipping.value);
    }
    //fetchDeliveryOptions();
  }, [setValue]);

  return (
    <Card {...other}>
      <CardHeader
        title={
          <Typography variant="h6">
            {t('DELIVERY')}
          </Typography>
        }
        sx={{ px: { md: 6, xs: 2 }, mt: 2 }}
      />

      <Controller
        name="delivery"
        control={control}
        render={({ field }) => (
          <Box
            columnGap={2}
            rowGap={2.5}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            sx={{ px: { md: 6, xs: 2 }, pb: 4 }}
          >
            {options.map((option) => (
              <OptionItem
                key={option.label}
                option={option}
                selected={field.value === option.value}
                onClick={() => {
                  field.onChange(option.value);
                  onApplyShipping(option);
                }}
              />
            ))}
          </Box>
        )}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

type OptionItemProps = PaperProps & {
  selected: boolean;
  option: any;
};

function OptionItem({ option, selected, ...other }: OptionItemProps) {
  const { value, label, description } = option;
  const { t } = useTranslation('shopApp');
  return (
    <Paper
      variant="outlined"
      key={value}
      sx={{
        p: 2.5,
        cursor: 'pointer',
        display: 'flex',
        ...(selected && { boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}` }),
      }}
      {...other}
    >
      {label === 'Free' && <Iconify icon="carbon:bicycle" width={32} />}
      {label === 'Standard' && <Iconify icon="carbon:delivery" width={32} />}
      {label === 'Express' && <Iconify icon="carbon:rocket" width={32} />}

      <ListItemText
        sx={{ ml: 2 }}
        primary={
          <Stack direction="row" alignItems="center">
            <Box component="span" sx={{ flexGrow: 1 }}>
              {t(label)}
            </Box>
            <Box component="span" sx={{ typography: 'h6' }}>{`${FuseUtils.formatCurrency(value)}`}</Box>
          </Stack>
        }
        secondary={description}
        primaryTypographyProps={{ typography: 'subtitle1', mb: 0.5 }}
        secondaryTypographyProps={{ typography: 'body2' }}
      />
    </Paper>
  );
}
