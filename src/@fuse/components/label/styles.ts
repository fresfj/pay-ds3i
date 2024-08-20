import type { Theme } from '@mui/material/styles'

import Box, { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/material/styles'

import { varAlpha, stylesMode } from 'src/theme/styles'

import type { LabelColor, LabelVariant } from './types'

// ----------------------------------------------------------------------

interface StyledLabelProps extends BoxProps {
  ownerState?: {
    color: LabelColor
    variant: LabelVariant
  }
}

export const StyledLabel = styled(Box, {
  shouldForwardProp: prop => prop !== 'ownerState'
})<StyledLabelProps>(({ theme, ownerState }) => {
  const { color = 'default', variant } = ownerState || {}

  const defaultColor = {
    ...(color === 'default' && {
      ...(variant === 'filled' && {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.text.primary,
        [stylesMode.dark]: { color: theme.palette.grey[800] }
      }),
      ...(variant === 'outlined' && {
        backgroundColor: 'transparent',
        color: theme.palette.text.primary,
        border: `2px solid ${theme.palette.text.primary}`
      }),
      ...(variant === 'soft' && {
        color: theme.palette.text.secondary,
        backgroundColor: varAlpha(theme.palette.grey['500Channel'], 0.16)
      }),
      ...(variant === 'inverted' && {
        color: theme.palette.grey[800],
        backgroundColor: theme.palette.grey[300]
      })
    })
  }

  const styleColors = {
    ...(color !== 'default' && {
      ...(variant === 'filled' && {
        color: theme.palette[color].contrastText,
        backgroundColor: theme.palette[color].main
      }),
      ...(variant === 'outlined' && {
        backgroundColor: 'transparent',
        color: theme.palette[color].main,
        border: `2px solid ${theme.palette[color].main}`
      }),
      ...(variant === 'soft' && {
        color: theme.palette[color].dark,
        backgroundColor: theme.palette['info'].main,
        [stylesMode.dark]: { color: theme.palette[color].light }
      }),
      ...(variant === 'inverted' && {
        color: theme.palette[color].darker,
        backgroundColor: theme.palette[color].lighter
      })
    })
  }

  return {
    height: 24,
    minWidth: 24,
    lineHeight: 0,
    cursor: 'default',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    justifyContent: 'center',
    padding: theme.spacing(0, 0.75),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightBold,
    borderRadius: theme.shape.borderRadius * 0.75,
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.shorter
    }),
    ...defaultColor,
    ...styleColors
  }
})
