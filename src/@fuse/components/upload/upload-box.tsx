import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { varAlpha } from 'src/theme/styles';

import { Iconify } from '../iconify';

import type { UploadProps } from './types';
import { MultiFilePreview } from './components/preview-multi-file';
import { RejectionFiles } from './components/rejection-files';

// ----------------------------------------------------------------------

export function UploadBox({
  sx,
  value,
  error,
  disabled,
  onDelete,
  onUpload,
  onRemove,
  thumbnail,
  helperText,
  onRemoveAll,
  placeholder,
  multiple,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple,
    disabled,
    ...other,
  });

  const isArray = Array.isArray(value) && multiple;

  const hasFiles = isArray && !!value.length;

  const hasError = isDragReject || !!error;

  const renderMultiPreview = hasFiles && (
    <>
      <MultiFilePreview files={value} thumbnail={thumbnail} onRemove={onRemove} sx={{ my: 3 }} />

      {(onRemoveAll || onUpload) && (
        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          {onRemoveAll && (
            <Button color="inherit" variant="outlined" size="small" onClick={onRemoveAll}>
              Remove all
            </Button>
          )}

          {onUpload && (
            <Button
              size="small"
              variant="contained"
              onClick={onUpload}
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            >
              Upload
            </Button>
          )}
        </Stack>
      )}
    </>
  );

  return (
    <>
      <Box sx={{ width: 1, position: 'relative', ...sx }}>
        <Box
          {...getRootProps()}
          sx={{
            width: 64,
            height: 64,
            flexShrink: 0,
            display: 'flex',
            borderRadius: 1,
            cursor: 'pointer',
            alignItems: 'center',
            color: 'text.disabled',
            justifyContent: 'center',
            bgcolor: (theme) => varAlpha(theme.palette.grey['500Channel'], 0.08),
            border: (theme) => `dashed 1px ${varAlpha(theme.palette.grey['500Channel'], 0.16)}`,
            ...(isDragActive && { opacity: 0.72 }),
            ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
            ...(hasError && {
              color: 'error.main',
              borderColor: 'error.main',
              bgcolor: (theme) => varAlpha(theme.palette.error.main, 0.08),
            }),
            '&:hover': { opacity: 0.72 },
            ...sx,
          }}
        >
          <input {...getInputProps()} />

          {placeholder || <Iconify icon="eva:cloud-upload-fill" width={28} />}
        </Box>

        <RejectionFiles files={fileRejections} />
        {renderMultiPreview}
      </Box>
    </>
  );
}
