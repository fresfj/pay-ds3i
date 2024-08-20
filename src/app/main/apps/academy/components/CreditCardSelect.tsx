import React, { forwardRef } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Typography, Paper, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Image } from '@fuse/components/image'
import FuseUtils from '@fuse/utils/FuseUtils';
import CreditCard from './CreditCard';
import { Iconify } from '@fuse/components/iconify';

interface PayPalCheckoutProps {
  cards: any;
  newCard: boolean
  selectedCard: string;
  onChange: (event: any) => void
  onAddNewCard: () => void;
  formData: any;
  onDataChange: (data: any) => void;
}


const CreditCardSelect = forwardRef<HTMLDivElement, PayPalCheckoutProps>(({ formData, onDataChange, cards, newCard, selectedCard, onChange, onAddNewCard }, ref) => {


  return (
    <Paper ref={ref} elevation={3} className='rounded-lg' style={{ padding: '20px', marginBottom: '20px' }}>
      <div className='mb-12' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" className=' text-16 font-semibold'>Cartão Crédito / Débito</Typography>
        <div className='grid grid-cols-2 gap-4'>
          <Image alt="icon" src={FuseUtils.cardFlag('mastercard')} sx={{ maxWidth: 32 }} />
          <Image alt="icon" src={FuseUtils.cardFlag('visa')} sx={{ maxWidth: 32 }} />
        </div>
      </div>
      {!newCard ?
        <>
          <FormControl fullWidth>
            <InputLabel id="card-select-label">Cartões Cadastrados</InputLabel>
            <Select
              name='cardId'
              labelId="card-select-label"
              value={selectedCard}
              onChange={onChange}
              label="Cartões Cadastrados"
              fullWidth
            >
              {cards.map((card) => (
                <MenuItem key={card.id} value={card.id} className='mx-8 p-14 text-14 rounded-lg'>
                  {`**** **** **** ${card.creditCard.number.slice(-4)} - ${card.creditCardHolderInfo.name}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className='mt-24 flex justify-end'>
            <Button className='px-20' color="primary" onClick={onAddNewCard}>
              <Iconify className='mr-4 inline' width={20} icon={'solar:card-bold-duotone'} />
              <Typography variant="body2" color="primary" onClick={onAddNewCard} style={{ cursor: 'pointer' }}>
                Novo cartão
              </Typography>
            </Button>
          </div>
        </>
        :
        <CreditCard onAddNewCard={onAddNewCard} />
      }
    </Paper>
  );
});

export default CreditCardSelect;
