import { Iconify } from '@fuse/components/iconify'
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { styled, alpha } from '@mui/material/styles';
import { useState } from 'react';
import { useUpdateAccountPaymentMutation } from '../AccountApi';


const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));


const PaymentOption = (props) => {
  const { card: setCard, user, updateUser } = props
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [updatePayment] = useUpdateAccountPaymentMutation()
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleDelete = async () => {
    // deleteAddress({ addressId: setAddress?.id, customerId: user.data.customer.id })
    // const addressesOld = user.data?.customer?.addresses || [];
    // if (Array.isArray(addressesOld)) {
    //   const deletedAddresses = addressesOld.filter((address) => address.id !== setAddress.id);

    //   await updateUser({
    //     data: {
    //       customer: {
    //         addresses: deletedAddresses
    //       }
    //     }
    //   });
    // }

    handleClose()
  }

  const handleSet = async () => {
    updatePayment({ paymentId: setCard?.id, customerId: user.data.customer.id })
    const paymentOld = user.data?.customer?.paymentMethods || [];
    if (Array.isArray(paymentOld)) {
      const updatedPayment = paymentOld.map((payment) => {
        if (payment.paymentDefault && payment.id !== setCard.id) {
          return {
            ...payment,
            paymentDefault: false
          };
        } else if (payment.id === setCard.id) {
          return {
            ...payment,
            paymentDefault: true
          };
        } else {
          return payment;
        }
      });

      await updateUser({ data: { customer: { paymentMethods: updatedPayment } } });
    }
    handleClose()
  }

  return (
    <>
      <IconButton
        id="demo-customized-button-and"
        aria-controls={open ? 'demo-customized-menu-and' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          top: 8,
          right: 8,
          position: 'absolute',
        }}
      >
        <Iconify icon={'eva:more-vertical-fill'} sx={{ width: 20, height: 20 }} />
      </IconButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className='shadow-md rounded-lg p-4 opacity-100 transition-opacity duration-248 ease-in-out transform duration-165'
      >
        <MenuItem className="flex items-center text-gray-700 hover:text-gray-900 focus:text-gray-900" onClick={handleSet} disableRipple>
          <Iconify icon={'solar:star-bold'} sx={{ width: 22, height: 22, marginRight: 1 }} /> Set as primary
        </MenuItem>
        <MenuItem disabled className="flex items-center text-gray-700 hover:text-gray-900 focus:text-gray-900" onClick={handleClose} disableRipple>
          <Iconify icon={'solar:pen-bold'} sx={{ width: 22, height: 22, marginRight: 1 }} /> Edit
        </MenuItem>
        <MenuItem disabled className="flex items-center text-gray-700 hover:text-gray-900 focus:text-gray-900" onClick={handleDelete} disableRipple color='error'>
          <Iconify icon={'solar:trash-bin-trash-bold'} sx={{ width: 22, height: 22, marginRight: 1 }} />	Delete
        </MenuItem>
      </StyledMenu>
    </>
  )

};

export default PaymentOption;
