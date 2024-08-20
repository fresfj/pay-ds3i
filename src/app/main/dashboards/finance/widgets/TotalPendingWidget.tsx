import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Typography, Stack } from '@mui/material';
import { Iconify } from '@fuse/components/iconify';
import { useSelector } from 'react-redux';
import { selectWidget } from '../FinanceDashboardApi';
import CurrentStatementWidgetType from './types/CurrentStatementWidgetType';
import FuseUtils from '@fuse/utils/FuseUtils';


const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  padding: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundColor: theme.palette.primary.light,
}));


export default function TotalPendingWidget({ title = null, total = null, icon = null, color = 'warning' }) {

  const { pending } = useSelector(selectWidget<CurrentStatementWidgetType>('statistics')) as any;

  return (
    <RootStyle
      sx={{
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
      }}
    >
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <div>
          <Typography sx={{ mb: 2, typography: 'subtitle2' }}>Total Pending</Typography>
          <Typography sx={{ typography: 'h4' }}>{FuseUtils.formatCurrency(pending.value)}</Typography>
        </div>
      </Stack>
    </RootStyle>
  );
}
