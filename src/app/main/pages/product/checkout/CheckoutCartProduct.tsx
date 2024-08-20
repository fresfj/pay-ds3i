import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Iconify } from '@fuse/components/iconify';
import FuseUtils from '@fuse/utils';
import _ from '@lodash';
import { IncrementerButton } from '../components/IncrementerButton';


// ----------------------------------------------------------------------

type Props = {
  row: any;
  onDelete: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function CheckoutCartProduct({ row, onDelete, onDecrease, onIncrease }: Props) {
  return (
    <TableRow>
      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar
            variant="rounded"
            alt={row.name}
            src={_.find(row.images, { id: row.featuredImageId })?.url}
            sx={{ width: 64, height: 64 }}
          />

          <Stack spacing={0.5}>
            <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
              {row.name}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              sx={{ typography: 'body2', color: 'text.secondary' }}
            >
            </Stack>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell>{FuseUtils.formatCurrency(row.value)}</TableCell>

      <TableCell>
        <Box sx={{ width: 88, textAlign: 'right' }}>
          <IncrementerButton
            quantity={row.quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            disabledDecrease={row.quantity <= 1}
            disabledIncrease={row.quantity >= row.available}
          />
        </Box>
      </TableCell>

      <TableCell align="right">{FuseUtils.formatCurrency(row.value * row.quantity)}</TableCell>

    </TableRow>
  );
}
