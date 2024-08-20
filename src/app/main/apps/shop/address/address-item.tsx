import type { PaperProps } from '@mui/material/Paper';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Label } from '@fuse/components/label';


// ----------------------------------------------------------------------

type Props = PaperProps & {
  action?: React.ReactNode;
  address: any;
};

export function AddressItem({ address, action, sx, ...other }: Props) {
  return (
    <Paper
      sx={{
        gap: 2,
        display: 'flex',
        position: 'relative',
        alignItems: { md: 'flex-end' },
        flexDirection: { xs: 'column', md: 'row' },
        ...sx,
      }}
      {...other}
    >
      <Stack flexGrow={1} spacing={1}>
        <Stack direction="row" alignItems="center">
          <Typography variant="subtitle2">
            {address.name}
            <Box component="span" sx={{ ml: 0.5, typography: 'body2', color: 'text.secondary' }}>
              ({address.addressType})
            </Box>
          </Typography>

          {address.addressDefault && (
            <Box sx={{ ml: 1 }} className="transition-all px-8 min-w-28 h-28 text-sm capitalize font-bold inline-flex items-center rounded-md bg-blue-50  py-1 text-blue-800 ring-1 ring-inset ring-blue-600/20">
              Default
            </Box>
          )}
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {address.addressFormatted.address}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {address.phoneNumber}
        </Typography>
      </Stack>

      {action && action}
    </Paper>
  );
}
