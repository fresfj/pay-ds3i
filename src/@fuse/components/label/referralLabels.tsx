import React, { useState } from 'react';
import { Stack, Box, Chip, Popover, Typography, Tooltip } from '@mui/material';
import clsx from 'clsx';
import { Iconify } from '../iconify';

interface ReferralCustomer {
  name: string;
  referral?: {
    discount?: number;
    labels?: string[];
    status?: boolean;
  };
}

interface Props {
  referralCustomer?: ReferralCustomer;
}

const labelDetails: { [key: string]: { background: string; color: string; icon: string } } = {
  'Embaixador': { background: '#EEEEFF', color: '#5D5DEC', icon: 'fluent:sparkle-24-filled' },
  'Apaixonado': { background: '#FFE4E4', color: '#D95B5B', icon: 'mdi:heart' },
  'Fã': { background: '#FFF4CC', color: '#D1A355', icon: 'mdi:star' },
};

const ReferralLabels: React.FC<Props> = ({ referralCustomer }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openPopover = Boolean(anchorEl);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const visibleLabels = referralCustomer.referral.labels.slice(0, 1);
  const hiddenLabels = referralCustomer.referral.labels.slice(1);

  return (
    <>
      {referralCustomer?.referral && referralCustomer?.referral.status && (
        <Stack direction="column" sx={{ px: 3, mt: 2 }}>
          <Box component="span" sx={{ typography: 'subtitle2' }}>
            Você está recebendo um desconto especial de{' '}
            <Typography component="span" sx={{ fontWeight: 800 }}>
              {referralCustomer?.referral.discount}%
            </Typography>{' '}
            por ser indicado por:
          </Box>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 1, typography: 'subtitle2' }}>
            <Tooltip title="Recomendado" className="transition hover:scale-110 ease-in-out duration-150">
              <Iconify icon="ic:round-verified" sx={{ mr: 0.5, color: 'success.main' }} />
            </Tooltip>
            <Box component="span" sx={{ typography: 'body2', fontWeight: '600', color: 'text.primary' }}>
              {referralCustomer.name}
            </Box>

            {visibleLabels.map((label) => (
              <Chip
                key={label}
                label={
                  <Stack direction="row" alignItems="center">
                    <Iconify icon={labelDetails[label]?.icon} sx={{ mr: 0.5, color: labelDetails[label]?.color }} />
                    <Box className="font-semibold" component="span" sx={{ color: labelDetails[label]?.color, typography: 'body2' }}>
                      {label}
                    </Box>
                  </Stack>
                }
                classes={{ root: clsx('h-24 border-0 rounded-4 transition hover:scale-105 ease-in-out duration-150'), label: 'px-8 py-4 font-semibold leading-none', }}
                sx={{ backgroundColor: labelDetails[label]?.background }}
              />
            ))}

            {hiddenLabels.length > 0 && (
              <>
                <Chip
                  label={`+${hiddenLabels.length}`}
                  classes={{
                    root: clsx('h-24 border-0 rounded-4 transition hover:scale-105 ease-in-out duration-150'),
                    label: 'px-8 py-4 font-semibold leading-none',
                  }}
                  sx={{ backgroundColor: '#EEEEFF', cursor: 'pointer' }}
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                />
                <Popover
                  id="mouse-over-popover"
                  sx={{ pointerEvents: 'none' }}
                  open={openPopover}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
                >
                  <Stack sx={{ p: 1.5 }}>
                    {hiddenLabels.map((label) => (
                      <Typography key={label} sx={{ p: 0.5 }}>
                        {label}
                      </Typography>
                    ))}
                  </Stack>
                </Popover>
              </>
            )}
          </Stack>
        </Stack>
      )}
    </>
  )
}

export default ReferralLabels;
