import React from 'react';
import { Dialog, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BottomSheet: React.FC<BottomSheetProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        className: 'rounded-t-2xl mx-auto rounded-b-0',
      }}
      sx={{
        '& .MuiPaper-root': {
          m: 0,
          maxWidth: '100vw',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
        },
      }}
    >
      <div className="p-4 bg-white">
        <h2 className="text-xl font-semibold">Bottom Sheet Content</h2>
        <p className="mt-2 text-gray-600">Aqui está o conteúdo do Bottom Sheet.</p>
      </div>
    </Dialog>
  );
};

export default BottomSheet;