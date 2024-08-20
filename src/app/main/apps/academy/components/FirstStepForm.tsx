import React, { forwardRef, useEffect } from 'react';
import {
  Typography,
  RadioGroup,
  TextField,
  FormControlLabel,
  styled,
  Paper,
  Box,
  FormControlLabelProps,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import clsx from 'clsx';
import _ from '@lodash';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const OptionPaper = styled(Paper)(({ theme }) => ({
  marginTop: 10,
  padding: 20,
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  border: '1px solid #e0e0e0',
  // backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,.04)' ,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
  '&.Mui-checked': {
    borderColor: theme.palette.primary.main,
    borderStyle: 'solid',
    borderWidth: '2px'
  },
}));

const Title = styled(Typography)({
  fontSize: '1.2rem',
  fontWeight: 'bold',
});

type CustomFormControlLabelProps = Omit<FormControlLabelProps, 'ref'> & {
  inputRef?: React.ForwardedRef<unknown>;
};

const CustomFormControlLabel = styled(
  forwardRef<unknown, CustomFormControlLabelProps>(
    ({ inputRef, ...props }, ref) => (
      <FormControlLabel {...props} ref={ref} />
    )
  )
)(({ theme }) => ({
  margin: '0',
  width: '100%',
  display: 'flex',
  '& .MuiFormControlLabel-label': {
    width: '100%',
  },
}));

interface FormType {
  address: string;
  phone: string;
}

interface FirstStepFormProps {
  selectedRealized: string;
  setSelectedRealized: (value: string) => void;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}

const schema = z.object({
  address: z.string().min(1, { message: 'Address is required' }),
  phone: z.string().min(1, { message: 'Phone is required' }),

});

interface Step1Props {
  formData: { name: string; phone: string };
}


const FirstStepForm: React.FC<Step1Props> = ({ formData }) => {
  const [selectedValue, setSelectedValue] = React.useState('O mais rápido possível');
  const [selectedRealized, setSelectedRealized] = React.useState('online');

  const { control, watch, setValue, reset, handleSubmit, formState: { errors }, register } = useForm<FormType>({
    mode: 'all',
    defaultValues: formData,
    resolver: zodResolver(schema)
  });

  const handleChangeRealized = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRealized(event.target.value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom className="mb-0 font-bold">
        Como deseja ter suas aulas?
      </Typography>
      <RadioGroup
        name='realized'
        value={selectedRealized}
        onChange={handleChangeRealized}
        className='grid gap-14 grid-cols-2'
      >
        {[
          { option: 'online', price: '$0', description: '5-7 Days delivery' },
          { option: 'presenciais', price: '$10', description: '3-5 Days delivery' }
        ].map(({ option }) => (
          <CustomFormControlLabel
            key={option}
            value={option}
            control={<span />}
            label={
              <OptionPaper className={clsx('rounded-lg', { 'Mui-checked': selectedRealized === option })}>
                <div className="flex items-center justify-between w-full">
                  <Title>{option.charAt(0).toUpperCase() + option.slice(1)}</Title>
                </div>
              </OptionPaper>
            }
            onClick={() => setSelectedRealized(option)}
          />
        ))}
      </RadioGroup>

      <Typography variant="h6" gutterBottom className="mb-0 font-bold mt-28">
        Data da primeira aula
      </Typography>
      <RadioGroup
        name='classDay'
        value={selectedValue}
        onChange={handleChange}
        className='grid gap-14 grid-cols-2'
      >
        {['O mais rápido possível', 'Propor uma data'].map((option: string) => (
          <CustomFormControlLabel
            key={option}
            value={option}
            control={<span />}
            label={
              <OptionPaper className={clsx('rounded-lg', { 'Mui-checked': selectedValue === option })}>
                <div className="flex items-center justify-between w-full">
                  <Title>{option.charAt(0).toUpperCase() + option.slice(1)}</Title>
                </div>
              </OptionPaper>
            }
            onClick={() => setSelectedValue(option)}
          />
        ))}
      </RadioGroup>

      <Typography variant="h6" gutterBottom className="mt-28 font-bold">
        Seus dados de contato
      </Typography>
      <div className='grid gap-14 grid-cols-2'>
        <Controller
          control={control}
          name="address"
          {...register('address')}
          render={({ field }) => (
            <TextField
              {...field}
              label="Endereço"
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!errors.address}
              helperText={errors?.address?.message}
              className="mt-4"
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Número de telefone"
              fullWidth
              margin="normal"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              className="mt-4"
            />
          )}
        />
      </div>
    </>
  );
};

export default FirstStepForm;
