import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { Iconify } from '@fuse/components/iconify';


// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  list: any[];
  action?: React.ReactNode;
  selected: (selectedId: string) => boolean;
  onSelect: (address: any | null) => void;
};

export function AddressListDialog({
  list,
  open,
  action,
  onClose,
  selected,
  onSelect,
  title = 'Address book',
}: Props) {
  const [searchAddress, setSearchAddress] = useState('');

  const dataFiltered = applyFilter({ inputData: list, query: searchAddress });

  const notFound = !dataFiltered.length && !!searchAddress;

  const handleSearchAddress = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(event.target.value);
  }, []);

  const handleSelectAddress = useCallback(
    (address: any | null) => {
      onSelect(address);
      setSearchAddress('');
      onClose();
    },
    [onClose, onSelect]
  );

  const renderList = (
    <>
      {dataFiltered.map((address) => (
        <ButtonBase
          key={address.id}
          onClick={() => handleSelectAddress(address)}
          sx={{
            py: 1,
            my: 0.5,
            px: 1.5,
            gap: 0.5,
            width: 1,
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            ...(selected(`${address.id}`) && {
              bgcolor: 'action.selected',
            }),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">{address.name}</Typography>

            {address.primary && <>Default</>}
          </Stack>

          {address.company && (
            <Box sx={{ color: 'primary.main', typography: 'caption' }}>{address.company}</Box>
          )}

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {address.fullAddress}
          </Typography>

          {address.phoneNumber && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {address.phoneNumber}
            </Typography>
          )}
        </ButtonBase>
      ))}
    </>
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pr: 1.5 }}
      >
        <Typography variant="h6"> {title} </Typography>

        {action && action}
      </Stack>

      <Stack sx={{ p: 2, pt: 0 }}>
        <TextField
          value={searchAddress}
          onChange={handleSearchAddress}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {notFound ? (
        <></>
      ) : (
        renderList
      )}
    </Dialog>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  query: string;
  inputData: any[];
};

function applyFilter({ inputData, query }: ApplyFilterProps) {
  if (query) {
    return inputData.filter(
      (address) =>
        address.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        address.fullAddress.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        `${address.company}`.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
