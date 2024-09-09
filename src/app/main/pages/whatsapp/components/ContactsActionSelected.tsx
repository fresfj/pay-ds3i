import type { Theme, SxProps } from '@mui/material/styles';
import { memo, useMemo } from 'react';

import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

import { stylesMode } from 'src/theme/styles';
import { Iconify } from '@fuse/components/iconify';
import FuseUtils from '@fuse/utils';


// ----------------------------------------------------------------------

type Props = {
  all: number;
  rowCount: number;
  numSelected: number;
  selected?: string[];
  action?: React.ReactNode;
  onSelectAllItems?: () => void;
  sx?: SxProps<Theme>;
};

const ContactsActionSelected = memo(({
  all,
  action,
  selected,
  rowCount,
  numSelected,
  onSelectAllItems,
  sx,
  ...other
}: Props) => {

  const potentialEarnings = useMemo(
    () => FuseUtils.formatCurrency(numSelected * 20),
    [numSelected]
  );

  const totalEarnings = useMemo(
    () => FuseUtils.formatCurrency(all * 20),
    [all]
  );

  return (
    <Portal>
      <Box
        sx={{
          right: 0,
          zIndex: 100,
          bottom: 0,
          display: 'grid',
          borderRadius: 2.8,
          position: 'fixed',
          alignItems: 'center',
          bgcolor: 'text.primary',
          p: (theme) => theme.spacing(1.5, 2, 1.5, 1),
          boxShadow: (theme) => theme.customShadows.z20,
          m: { xs: 2, md: 2.2 },
          ...sx,
        }}
        {...other}
      >
        <Box sx={{ ml: .8, gap: 2, display: 'grid' }}>
          <Typography component="span" variant="h6" className="text-md leading-5" sx={{ textAlign: 'center', mb: 0, color: 'common.white', [stylesMode.dark]: { color: 'grey.800' } }}>
            Você poderá ganhar: <br /> <Typography component="span" variant="h5" className="leading-7	font-500 text-4xl font-['Cera_Pro']">{potentialEarnings}</Typography>
            <br />{` de ${totalEarnings}`}
          </Typography>
        </Box>
        <Box sx={{ ml: .8, gap: 1, display: 'grid', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              indeterminate={!!numSelected && numSelected < rowCount}
              checked={!!rowCount && numSelected === rowCount}
              onChange={onSelectAllItems}
              icon={<Iconify icon="eva:radio-button-off-fill" />}
              checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
              indeterminateIcon={<Iconify icon="eva:minus-circle-fill" />}
            />

            {selected && (
              <Typography
                variant="subtitle2"
                sx={{ mr: 2, color: 'common.white', [stylesMode.dark]: { color: 'grey.800' } }}
              >
                {selected.length} Contatos selecionados
              </Typography>
            )}
          </Box>
          {action && action}
        </Box>
      </Box>
    </Portal>
  );
});

export default ContactsActionSelected;
