import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

type SearchNotFoundProps = BoxProps & {
  query?: string;
};

export function SearchNotFound({ query, sx, ...other }: SearchNotFoundProps) {
  const { t } = useTranslation('shopApp');
  if (!query) {
    return (
      <Typography variant="body2" sx={sx}>
        {t('PLEASE_ENTER')}
      </Typography>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', borderRadius: 1.5, ...sx }} {...other}>
      <Box sx={{ mb: 1, typography: 'h6' }}>{t('NOT_FOUND')}</Box>

      <Typography variant="body2">
        {t('NO_RESULTS')}&nbsp;
        <strong>{`"${query}"`}</strong>.
        <br />{t('TRY_CHECKING')}
      </Typography>
    </Box>
  );
}
