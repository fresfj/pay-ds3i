import React, { ForwardedRef, forwardRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import clsx from 'clsx';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface Question {
  text: string;
  options: string[];
  correctOption: string;
  image?: string;
}

interface QuestionInputProps {
  value: Question;
  onChange: (value: Question) => void;
  onRemove: () => void;
  hideRemove: boolean;
  className?: string;
}

const schema = z.object({
  text: z.string().optional(),
  options: z.array(z.string().optional()),
  correctOption: z.string().optional(),
  image: z.string().optional()
});

const defaultValues = {
  text: '',
  options: ['', '', ''],
  correctOption: '',
  image: '',
};

const QuestionInput = forwardRef((props: QuestionInputProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { value, onChange, onRemove, hideRemove, className } = props;

  const { control, formState, handleSubmit, reset } = useForm<any>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    reset(value);
  }, [reset, value]);

  const { errors } = formState;

  function onSubmit(data: any): void {
    onChange(data);
  }

  const handleOptionChange = (index: number, newOption: string) => {
    const newOptions = [...value.options];
    newOptions[index] = newOption;
    onChange({ ...value, options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...value.options, ''];
    onChange({ ...value, options: newOptions });
  };

  const removeOption = () => {
    const newOptions = value.options.slice(0, -1);
    onChange({ ...value, options: newOptions });
  };

  return (
    <div className={clsx('w-full', className)} ref={ref}>
      <TextField
        onChange={(e) => onChange({ ...value, text: e.target.value })}
        value={value.text}
        label="Texto da Pergunta"
        variant="outlined"
        className="mt-8 mb-16"
        fullWidth
        required
      />
      {value.options.map((option, index) => (
        <TextField
          key={index}
          label={`Opção ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          variant="outlined"
          fullWidth
          className="mt-8 mb-16"
        />
      ))}
      <div className="flex justify-between">
        <Button
          variant="outlined"
          color="primary"
          onClick={addOption}
          className="group inline-flex items-center my-8 py-2 px-12 cursor-pointer"
          startIcon={<FuseSvgIcon>heroicons-outline:plus-circle</FuseSvgIcon>}
        >
          <span className="ml-4 font-medium text-secondary">Adicionar Opção</span>
        </Button>
        {value.options.length > 3 && (
          <Button
            variant="outlined"
            color="error"
            onClick={removeOption}
            startIcon={<FuseSvgIcon>heroicons-outline:minus-circle</FuseSvgIcon>}
            className="group inline-flex items-center my-8 py-2 px-12 cursor-pointer"
          >
            Remover Opção
          </Button>
        )}
      </div>
      <TextField
        label="Opção Correta"
        value={value.correctOption}
        onChange={(e) => onChange({ ...value, correctOption: e.target.value })}
        variant="outlined"
        fullWidth
        className="mt-8 mb-16"
      />
      <TextField
        label="URL da Imagem (opcional)"
        value={value.image}
        onChange={(e) => onChange({ ...value, image: e.target.value })}
        variant="outlined"
        fullWidth
        className="mt-8 mb-16"
      />
      {!hideRemove && (
        <Button
          variant="contained"
          color="error"
          onClick={onRemove}
          className="group inline-flex items-center my-8 py-2 px-12 cursor-pointer"
          startIcon={<FuseSvgIcon>heroicons-outline:minus-circle</FuseSvgIcon>}
        >
          Remover Pergunta
        </Button>
      )}
    </div>
  );
});

export default QuestionInput;
