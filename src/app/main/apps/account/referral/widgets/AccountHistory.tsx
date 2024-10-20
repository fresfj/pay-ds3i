import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import * as React from 'react';
import { m, useScroll, useSpring, useTransform, useMotionValueEvent, motion } from 'framer-motion';
import { useGetAccountHistoryQuery } from '../../AccountApi';
import FuseLoading from '@fuse/core/FuseLoading';
import { Iconify } from '@fuse/components/iconify';
import { lighten } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { format } from 'date-fns';
import FuseUtils from '@fuse/utils';
import Box from '@mui/material/Box';

type Props = {
  userId: string;
};

/**
 * The columns type.
 */
type columnsType = {
  id: string;
  align: 'left' | 'center' | 'right';
  disablePadding: boolean;
  label: string;
  sort: boolean;
};

/**
 * The columns.
 */
const columns: columnsType[] = [
  {
    id: 'amount',
    align: 'left',
    disablePadding: false,
    label: 'Movimentações',
    sort: true
  },
  {
    id: 'description',
    align: 'left',
    disablePadding: false,
    label: '',
    sort: true
  },
  {
    id: 'date',
    align: 'right',
    disablePadding: false,
    label: '',
    sort: true
  }
];
export function AccountHistory({ userId }: Props) {
  const { data, isLoading } = useGetAccountHistoryQuery(userId);

  const container = {
    show: {
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return <FuseLoading />;
  }


  if (data.length === 0) {
    return (
      <div className='mx-auto flex flex-col h-384 w-full items-center text-center justify-center'>
        <Typography variant='h5' className='text-xl font-medium' color='inherit'>
          Você ainda não tem nenhum registrado
        </Typography>
      </div>)
  }
  return (
    <React.Fragment>
      <motion.div variants={item}>
        <Paper className="w-full min-w-full flex flex-col flex-auto shadow rounded-2xl overflow-hidden h-full">
          <div className="table-responsive">
            <Table className="w-full min-w-full">
              <TableHead>
                <TableRow className="h-48 sm:h-64">
                  {columns.map((row) => {
                    return (
                      <TableCell
                        sx={{
                          backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                              ? lighten(theme.palette.background.default, 0.4)
                              : lighten(theme.palette.background.default, 0.02)
                        }}
                        className="p-4 md:p-16"
                        key={row.id}
                        align={row.align}
                        padding={row.disablePadding ? 'none' : 'normal'}
                      >
                        {row.sort && (
                          <Tooltip
                            title="Sort"
                            placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                            enterDelay={300}
                          >
                            <TableSortLabel
                              className="font-semibold"
                            >
                              {row.label}
                            </TableSortLabel>
                          </Tooltip>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {[...data].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((n, k) => (
                  <TableRow
                    key={n.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                      sx={{ minWidth: '200px', color: `${n.type === "entwithdrawalry" ? "#e70505" : "#51ca00"}` }}
                    >

                      <Box display='flex' gap={2} alignItems="center">
                        <Iconify icon={n.type === 'entwithdrawalry' ? 'solar:graph-down-bold-duotone' : 'solar:graph-up-bold-duotone'} width={32} />
                        <Typography className="text-lg font-semibold leading-5 font-['Cera_Pro']" component="span">{FuseUtils.formatCurrency(n.amount)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="left"
                      component="th"
                      scope="row"
                      sx={{ minWidth: '330px' }}
                    >
                      {n.description}
                    </TableCell>
                    <TableCell
                      align="right"
                      component="th"
                      scope="row"
                    >
                      {format(new Date(n.date), 'dd/MM/yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Paper>
      </motion.div>
    </React.Fragment >
  );
}
