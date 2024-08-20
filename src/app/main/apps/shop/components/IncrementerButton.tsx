import type { StackProps } from '@mui/material/Stack';
import { forwardRef } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { varAlpha } from 'src/theme/styles';
import { Iconify } from '@fuse/components/iconify';

// ----------------------------------------------------------------------

type Props = StackProps & {
  name?: string;
  productView?: boolean;
  quantity: number;
  disabledIncrease?: boolean;
  disabledDecrease?: boolean;
  onRemovase?: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
};

export const IncrementerButton = forwardRef<HTMLDivElement, Props>(
  ({ productView = false, quantity, onIncrease, onRemovase, onDecrease, disabledIncrease, disabledDecrease, sx, ...other }, ref) => (
    <Stack
      ref={ref}
      flexShrink={0}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 0.5,
        width: 88,
        borderRadius: 1,
        typography: 'subtitle2',
        border: (theme) => `solid 1px ${varAlpha(theme.palette.grey['500Channel'], 0.2)}`,
        ...sx,
      }}
      {...other}
    >
      <IconButton
        size="small"
        disabled={disabledDecrease && productView ? true : false}
        onClick={disabledDecrease ? onRemovase : onDecrease}
        sx={{ borderRadius: 0.75 }}
      >
        {disabledDecrease && !productView ?
          <Iconify className='text-red-A400' icon="solar:trash-bin-minimalistic-line-duotone" width={16} />
          :
          <Iconify icon="eva:minus-fill" width={16} />
        }

      </IconButton>

      {quantity}

      <IconButton
        size="small"
        onClick={onIncrease}
        disabled={disabledIncrease}
        sx={{ borderRadius: 0.75 }}
      >
        <Iconify icon="mingcute:add-line" width={16} />
      </IconButton>
    </Stack>
  )
);
