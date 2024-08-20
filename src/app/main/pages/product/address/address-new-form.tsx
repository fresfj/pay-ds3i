
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';


// ----------------------------------------------------------------------

export type NewAddressSchemaType = zod.infer<typeof NewAddressSchema>;

export const NewAddressSchema = zod.object({
  city: zod.string().min(1, { message: 'City is required!' }),
  state: zod.string().min(1, { message: 'State is required!' }),
  name: zod.string().min(1, { message: 'Name is required!' }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  primary: zod.boolean(),
  addressType: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (address: any) => void;
};

export function AddressNewForm({ open, onClose, onCreate }: Props) {
  const defaultValues = {
    name: '',
    city: '',
    state: '',
    address: '',
    zipCode: '',
    country: '',
    primary: true,
    phoneNumber: '',
    addressType: 'Home',
  };

  const methods = useForm<NewAddressSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      onCreate({
        name: data.name,
        fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.zipCode}`,
        addressType: data.addressType,
        primary: data.primary,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>

    </Dialog>
  );
}
