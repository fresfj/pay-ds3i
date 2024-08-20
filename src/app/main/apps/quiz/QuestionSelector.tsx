import React, { ForwardedRef, forwardRef } from 'react';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import clsx from 'clsx';
import QuestionInput from './QuestionInput';
import { useFieldArray, useFormContext } from 'react-hook-form';

interface Question {
  text: string;
  options: string[];
  correctOption: string;
  image?: string;
}

interface QuestionSelectorProps {
  value: Question[];
  onChange: (value: Question[]) => void;
  className?: string;
}

const QuestionSelector = forwardRef((props: QuestionSelectorProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { control } = useFormContext();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "questions"
  });

  return (
    <div className={clsx('w-full', props.className)} ref={ref}>
      {props.value.map((item, index) => {
        return (
          <QuestionInput
            key={index}
            value={item}
            onChange={(val) => update(index, val)}
            onRemove={() => remove(index)}
            hideRemove={fields.length === 1}
          />
        );
      })}
      <Button
        variant="contained"
        color="success"
        className="group inline-flex items-center my-8 py-2 px-12 cursor-pointer"
        onClick={() =>
          append({
            text: '',
            options: ['', '', ''],
            correctOption: '',
            image: '',
          })
        }
      >
        <FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>
        <span className="ml-4 font-medium text-secondary">Adicionar Pergunta</span>
      </Button>
    </div>
  );
});

export default QuestionSelector