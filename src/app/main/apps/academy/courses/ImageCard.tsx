import React, { useState } from 'react';
import FuseSvgIcon from "@fuse/core/FuseSvgIcon"
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Image } from '@fuse/components/image'
import { Link } from 'react-router-dom';
const ImageCard = ({ children = null, imgSrc, ...props }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        {...props}
        className="relative max-w-xs overflow-hidden rounded-2xl shadow-lg group"
      >
        {props.unlocked ?
          <div className="group-hover:blur-sm hover:!blur-none group-hover:scale-[0.85] hover:!scale-100 cursor-pointer backdrop-contrast-100">
            <Link to="/apps/academy/courses/course/694e4e5f-f25f-470b-bd0e-26b1d4f64028/basics-of-angular">
              <Image
                alt={"aula"}
                src={imgSrc}
                loading="lazy"
                className="filter grayscale blur-md transition-transform group-hover:scale-110 duration-400"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent">
                <div className="p-4 w-full text-white">{children}</div>
              </div>
            </Link>
          </div>
          :
          <div onClick={handleClickOpen} className="group-hover:blur-sm hover:!blur-none group-hover:scale-[0.85] hover:!scale-100 cursor-no-drop backdrop-contrast-100">
            <div className="absolute z-10	inset-0 flex justify-center items-center bg-gradient-to-t from-black/60 to-transparent">
              <div className="opacity-50 flex justify-center items-center rounded-full bg-gray-500 hover:bg-gray-600 w-62 h-62  min-w-64 min-h-64">
                <FuseSvgIcon className="text-48 text-gray-700" size={44}>feather:lock</FuseSvgIcon>
              </div>
            </div>
            <Image
              alt={"aula"}
              src={imgSrc}
              loading="lazy"
              style={{ filter: "grayscale(100%) blur(4px)" }}
              className="filter grayscale blur-md transition-transform group-hover:scale-110 duration-400"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent">
              <div className="p-4 w-full text-white">{children}</div>
            </div>
          </div>
        }
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h4" className='mb-0 text-xl font-semibold' gutterBottom>
            Conteúdo Bloqueado
          </Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          size='large'
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DialogContentText className='items-center rounded-md bg-red-50 p-16 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10'>
            <Typography variant="h6" className='text-xl' gutterBottom>
              O conteúdo que você está tentando acessar está temporariamente bloqueado.
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default ImageCard
