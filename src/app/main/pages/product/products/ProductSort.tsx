import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';


import { Iconify } from '@fuse/components/iconify';
import { CustomPopover, usePopover } from '@fuse/components/custom-popover';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

type Props = {
  sort: string;
  onSort: (newValue: string) => void;
  sortOptions: {
    value: string;
    label: string;
  }[];
};

export function ProductSort({ sort, onSort, sortOptions }: Props) {
  const popover = usePopover();
  const { t } = useTranslation('shopApp');

  const sortLabel = sortOptions.find((option) => option.value === sort)?.label;

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ fontWeight: 'fontWeightSemiBold' }}
        className='rounded-lg'
      >
        {t('SORT_BY')}
        <Box component="span" sx={{ ml: 0.5, fontWeight: 'fontWeightBold' }}>
          {t(sortLabel)}
        </Box>
      </Button>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          {sortOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === sort}
              onClick={() => {
                popover.onClose();
                onSort(option.value);
              }}
              className='mx-4 rounded-lg'
            >
              {t(option.label)}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
