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


// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  padding: theme.spacing(3)
}));

// ----------------------------------------------------------------------

const TOTAL = 18765;
const PERCENT = 2.6;
const CHART_DATA = [{ data: [111, 136, 76, 108, 74, 54, 57, 84] }];

export default function TotalFinanceWidget({ title = null, total = null, icon = null, color = 'error' }) {
  const { overdue, overduePrevious } = useSelector(selectWidget<CurrentStatementWidgetType>('statistics')) as any;

  function calculatePercentageGrowth(currentValue, previousValue) {
    if (previousValue === 0) {
      return 0;
    }
    return ((currentValue - previousValue) / previousValue) * 100;
  }


  const growthPercentage = calculatePercentageGrowth(overdue.value, overduePrevious.value);
  console.log(growthPercentage)
  return (
    <RootStyle
      sx={{
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
      }}
    >
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <div>
          <Typography sx={{ mb: 2, typography: 'subtitle2' }}>Total Overdue</Typography>
          <Typography sx={{ typography: 'h4' }}>{FuseUtils.formatCurrency(overdue.value)}</Typography>
        </div>

        <div>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 0.6 }}>
            <Iconify width={20} height={20} icon={growthPercentage >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'} />
            <Typography variant="subtitle2" component="span" sx={{ ml: 0.5 }}>
              {growthPercentage > 0 && '+'}
              {growthPercentage.toFixed(1) + '%'}
            </Typography>
          </Stack>
          <Typography variant="body2" component="span" sx={{ opacity: 0.72 }}>
            &nbsp;than last month
          </Typography>
        </div>
      </Stack>
    </RootStyle>
  );
}
