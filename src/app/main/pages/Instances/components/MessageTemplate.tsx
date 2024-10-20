import type { CardProps } from '@mui/material/Card';
import type { PaperProps } from '@mui/material/Paper';
import { Controller, useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';
import { getStorage } from '@fuse/hooks/useLocalStorage';
import Typography from '@mui/material/Typography';
import _ from '@lodash';
import { motion } from 'framer-motion';


// ----------------------------------------------------------------------
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

export function MessageTemplate({ templates, onApplyShipping, ...other }: Props) {
  const { control, setValue } = useFormContext();

  useEffect(() => {
    const storedOption = getStorage(STORAGE_KEY);
    if (storedOption?.shipping) {
      setValue('template', storedOption.shipping.value);
    } else if (templates && templates.length > 0) {
      setValue('template', templates[0].id);
      onApplyShipping(templates[0]);
    }
  }, [setValue, templates, onApplyShipping]);

  return (
    <Controller
      name="template"
      control={control}
      render={({ field }) => (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          <Box
            columnGap={3}
            rowGap={2.5}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            }}
            sx={{ px: { md: 3, xs: 2 }, pb: 4 }}
          >
            {templates?.map((option) => (
              <motion.div key={option.id} variants={item}>
                <OptionItem
                  option={option}
                  selected={field.value === option.id}
                  onClick={() => {
                    field.onChange(option.id);
                    onApplyShipping(option);
                  }}
                />
              </motion.div>
            ))}

          </Box>
        </motion.div>
      )}
    />
  );
}

// ----------------------------------------------------------------------

type OptionItemProps = PaperProps & {
  selected: boolean;
  option: any;
};

function OptionItem({ option, selected, ...other }: OptionItemProps) {
  const { message, id } = option;
  return (
    <Paper
      variant="outlined"
      key={id}
      className="max-w-sm overflow-hidden lg:max-w-xl lg:flex-row p-0 min-h-360"
      sx={{
        p: 2.5,
        cursor: 'pointer',
        height: "100%",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#e5ddd5",
        ...(selected && { boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}` }),
        '&::before': {
          backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/rmr3BrOAAd8.png')",
          backgroundSize: "366.5px 666px",
          height: "100%",
          width: "100%",
          position: "absolute",
          content: '""',
          top: 0,
          left: 0,
          opacity: 0.06,
        }
      }}
      {...other}
    >
      <Box sx={{
        mx: 3,
        my: 4,
        backgroundColor: "#fff",
        borderRadius: 3.5,
        borderTopLeftRadius: 0,
        position: "relative",
        '&::after': {
          background: "url('https://static.xx.fbcdn.net/rsrc.php/v3/yT/r/cTpzmA9a2VH.png') 50% 50% no-repeat",
          backgroundSize: "contain",
          content: '""',
          height: '31px',
          left: '-12px',
          position: 'absolute',
          top: '-6px',
          width: '12px',
        }
      }}>
        <div className="content-center col-span-2 py-24 px-16 sm:py-14 lg:py-28">
          <Typography className={`leading-5 tracking-tight prose prose-sm dark:prose-invert w-full max-w-full text-base lg:text-lg ${selected ? `font-medium` : 'font-light'}`}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: message.replace(/\n\n/g, '<br /><br />') }}
          />
        </div>
      </Box>
    </Paper>
  );
}
