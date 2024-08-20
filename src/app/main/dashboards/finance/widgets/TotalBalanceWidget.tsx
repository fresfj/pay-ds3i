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

const RootStyle = styled(Card)(({ theme }) => (console.log(theme), {
  boxShadow: 'none',
  padding: theme.spacing(3)
}));


export default function TotalBalanceWidget({ title = null, total = null, icon = null, color = 'primary' }) {
  const { balance } = useSelector(selectWidget<CurrentStatementWidgetType>('balance')) as any;
  return (
    <RootStyle
      sx={{
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
      }}
    >
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <div>
          <Typography sx={{ mb: 2, typography: 'subtitle2' }}>Total Balance</Typography>
          <Typography sx={{ typography: 'h4' }}>{FuseUtils.formatCurrency(balance)}</Typography>
        </div>
      </Stack>
    </RootStyle>
  );
}
