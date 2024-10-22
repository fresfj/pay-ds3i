import type { IconButtonProps } from '@mui/material/IconButton';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from '../../iconify';

import type { SingleFilePreviewProps } from '../types';
import { FileThumbnail } from '../../file-thumbnail';

// ----------------------------------------------------------------------

export function SingleFilePreview({ file }: SingleFilePreviewProps) {
  const fileName = typeof file === 'string' ? file : file.name;
  const previewUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
  const isAudio = typeof file !== 'string' && file.type.startsWith('audio');
  const isImage = typeof file !== 'string' && file.type.startsWith('image');

  return (
    <Box
      sx={{
        p: 1,
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {isAudio ? (
        <Box
          component="audio"
          controls
          src={previewUrl}
          sx={{
            width: '100%',
            maxWidth: '300px',
            outline: 'none',
            borderRadius: 1,
            boxShadow: (theme) => theme.shadows[3],
          }}
        />
      ) : isImage ? (
        <Box
          component="img"
          alt={fileName}
          src={previewUrl}
          sx={{
            width: 1,
            height: 1,
            borderRadius: 1,
            objectFit: 'cover',
          }}
        />
      ) : (
        <FileThumbnail
          tooltip
          imageView
          file={file}
          sx={{
            width: 120,
            height: 120
          }}
          slotProps={{ icon: { width: 96, height: 96 } }}
        />
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

export function DeleteButton({ sx, ...other }: IconButtonProps) {
  return (
    <IconButton
      size="small"
      sx={{
        top: 36,
        right: 16,
        zIndex: 9,
        position: 'absolute',
        color: (theme) => varAlpha(theme.palette.common.whiteChannel, 0.8),
        bgcolor: (theme) => varAlpha(theme.palette.grey['900Channel'], 0.72),
        '&:hover': { bgcolor: (theme) => varAlpha(theme.palette.grey['900Channel'], 0.48) },
        ...sx,
      }}
      {...other}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );
}
