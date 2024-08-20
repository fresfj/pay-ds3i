import type { ChipProps } from '@mui/material/Chip';
import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Iconify } from '../iconify';
import { useTranslation } from 'react-i18next';


// ----------------------------------------------------------------------

export const chipProps: ChipProps = {
  size: 'small',
  variant: 'filled',
};

type FiltersResultProps = {
  totalResults: number;
  onReset: () => void;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
};

export function FiltersResult({ totalResults, onReset, sx, children }: FiltersResultProps) {
  const { t } = useTranslation('shopApp');

  return (
    <Box sx={sx}>
      <Box sx={{ mb: 1.5, typography: 'body2' }}>
        <strong>{totalResults}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.45 }}>
          {t('RESULTS_FOUND')}
        </Box>
      </Box>

      <Box flexGrow={1} gap={1} display="flex" flexWrap="wrap" alignItems="center">
        {children}

        <Button
          color="error"
          onClick={onReset}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          className='rounded-lg px-12'
        >
          {t('CLEAR')}
        </Button>
      </Box>
    </Box>
  );
}
