import { useEffect, useMemo, useState } from 'react';
import type { CardProps } from '@mui/material/Card';
import type { PaperProps } from '@mui/material/Paper';
import { Controller, useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { getStorage } from '@fuse/hooks/useLocalStorage';
import { motion } from 'framer-motion';
import React from 'react';

const STORAGE_KEY = 'message_template';

type Props = CardProps & {
  templates?: any[];
  onApplyShipping?: (shipping: any) => void;
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  },
};

export function SelectImage({ templates, onApplyShipping, ...other }: Props) {
  const { control, setValue } = useFormContext();
  const [selected, setSelected] = useState(null);

  // useEffect(() => {
  //   const storedOption = getStorage(STORAGE_KEY);
  //   if (storedOption?.shipping) {
  //     setValue('template', storedOption.shipping.id);
  //     setSelected(storedOption.shipping.id);
  //   } else if (templates && templates.length > 0) {
  //     setValue('template', templates[0].id);
  //     setSelected(templates[0].id);
  //     onApplyShipping?.(templates[0]);
  //   }
  // }, [setValue, templates, onApplyShipping]);

  const templateOptions = useMemo(() => (
    templates?.map((option) => (
      <motion.div key={option.id} variants={item}>
        <OptionItem
          option={option}
          selected={selected === option.id}
          onClick={() => {
            setValue('template', option.id);
            setSelected(option.id);
            onApplyShipping?.(option);
          }}
        />
      </motion.div>
    ))
  ), [templates, selected, onApplyShipping, setValue]);

  const hasMultipleImages = templates.length > 1;

  return (
    <Controller
      name="template"
      control={control}
      render={({ field }) => (
        <motion.div variants={container} initial="hidden" animate="show">
          <div className="w-full overflow-hidden">
            <div
              className={`flex gap-8 py-8 px-14 ${hasMultipleImages
                ? 'overflow-x-auto scroll-snap-x snap-mandatory snap-always'
                : ''
                }`}
              style={{ scrollSnapType: hasMultipleImages ? 'x mandatory' : 'none' }}
            >
              {templateOptions}
            </div>
          </div>
        </motion.div>
      )}
    />
  );
}

// ----------------------------------------------------------------------

type OptionItemProps = PaperProps & {
  selected: boolean;
  option: any;
  onClick: () => void;
};

const OptionItem = React.memo(({ option, selected, onClick, ...other }: OptionItemProps) => {
  const { image, id } = option;

  return (
    <Paper
      variant="outlined"
      key={id}
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        height: "100%",
        overflow: "hidden",
        position: "relative",
        ...(selected && {
          boxShadow: (theme) => `0 0 0 3.2px ${theme.palette.text.primary}`
        })
      }}
      className={`rounded-lg`}

      {...other}
    >
      <Box
        className="flex items-center justify-center overflow-hidden rounded-lg"
        sx={{
          borderRadius: 3.5,
          borderTopLeftRadius: 0,
          position: "relative",
          textAlign: 'center',
        }}
      >
        <img style={{ maxHeight: 300, maxWidth: 300 }} src={image} alt='template' />
      </Box>
    </Paper>
  );
});

export default SelectImage;