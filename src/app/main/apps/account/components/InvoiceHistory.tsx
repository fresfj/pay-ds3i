import { useState } from 'react';
import { Stack, Typography, Link, Divider, Button } from '@mui/material';
import { Iconify } from '@fuse/components/iconify';
import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';

const InvoiceHistory = (props) => {
  const { subscriptions } = props
  const [showAll, setShowAll] = useState(false);
  const theme = useTheme();

  const handleClick = () => {
    setShowAll(!showAll);
  };

  return (
    <>
      {subscriptions ?
        <>
          <Stack className='w-full'>
            {subscriptions.slice(0, showAll ? subscriptions.length : 10).map((invoice, index) => (
              <div key={index} className="grid grid-cols-3 gap-8 justify-between items-center border-b border-gray-300/20 py-2">
                <div>
                  <Typography variant="body1" className="font-medium text-blue-500 underline">{invoice.invoiceNumber}</Typography>
                  <Typography variant="body2" className="text-gray-500">{invoice.originalDueDate}</Typography>
                </div>
                <div className="grid grid-cols-2 gap-8 items-center justify-between space-x-2 text-right col-span-2">
                  <Typography variant="body2" className="font-medium">{invoice.value}</Typography>
                  <div>
                    <Typography
                      className={clsx(
                        'inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase',
                        invoice.status === 'PENDING' &&
                        'bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50',
                        invoice.status === 'CONFIRMED' &&
                        'bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50',
                        invoice.status === 'RECEIVED' &&
                        'bg-blue-50 text-blue-800 dark:bg-blue-600 dark:text-blue-50'
                      )}
                    >
                      {invoice.status}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
            {subscriptions.length > 10 && (
              <Divider className="border-dashed border-b border-gray-300" />
            )}
          </Stack>
          {subscriptions.length > 10 && (
            <Stack className="mt-12">
              <Button className="text-blue-500 px-8" size='small' onClick={handleClick}>

                {showAll ?
                  <><Iconify icon={'solar:alt-arrow-up-linear'} sx={{ width: 20, height: 20, marginRight: 1 }} /> Show Less</>
                  :
                  <><Iconify icon={'solar:alt-arrow-down-linear'} sx={{ width: 20, height: 20, marginRight: 1 }} /> Show More</>}
              </Button>
            </Stack>
          )}
        </>
        :
        <>
          <div className='grid grid-cols-1 gap-4 justify-items-center content-center'>
            <Iconify icon={'solar:bill-cross-line-duotone'} sx={{ width: 120, height: 120, color: theme.palette.secondary.main }} />
            <Typography className="mb-8 flex-1 text-16 font-semibold opacity-80 group-hover:opacity-100">History is Empty!</Typography>
            <Typography className="text-14 font-medium">Look like you have no items in your invoice history.</Typography>
          </div>
        </>
      }
    </>
  );
};

export default InvoiceHistory;
