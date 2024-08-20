import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import FuseLoading from '@fuse/core/FuseLoading';
import AnalyticsDashboardAppHeader from './EcommerceDashboardAppHeader';
import VisitorsOverviewWidget from './widgets/VisitorsOverviewWidget';
import ConversionsWidget from './widgets/ConversionsWidget';
import ImpressionsWidget from './widgets/ImpressionsWidget';
import VisitsWidget from './widgets/VisitsWidget';
import VisitorsVsPageViewsWidget from './widgets/VisitorsVsPageViewsWidget';
import NewVsReturningWidget from './widgets/NewVsReturningWidget';
import AgeWidget from './widgets/AgeWidget';
import LanguageWidget from './widgets/LanguageWidget';
import GenderWidget from './widgets/GenderWidget';
import { selectWidget, useGetEcommerceDashboardWidgetsQuery } from './widgets/budget/EcommerceDashboardApi';

import { useGetAnalyticsDashboardWidgetsQuery } from './EcommerceDashboardApi';
import BudgetDetailsWidget from './widgets/budget/widgets/BudgetDetailsWidget';
import WeeklyExpensesWidget from './widgets/budget/widgets/WeeklyExpensesWidget';
import MonthlyExpensesWidget from './widgets/budget/widgets/MonthlyExpensesWidget';
import YearlyExpensesWidget from './widgets/budget/widgets/YearlyExpensesWidget';
import { useSelector } from 'react-redux';
import MonthlyTotalWidget from './widgets/budget/widgets/MonthlyTotalWidget';
import CouponsDetailsWidget from './widgets/budget/widgets/CouponsDetailsWidget';
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

/**
 * The analytics dashboard app.
 */
function EcommerceDashboardApp() {
	const { isLoading } = useGetEcommerceDashboardWidgetsQuery()

	const currentMonthSales = useSelector(selectWidget<any>('currentMonthSalesTotal'));
	const percentages = useSelector(selectWidget<any>('percentages'));


	if (!currentMonthSales) {
		return <FuseLoading />;
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<FusePageSimple
			header={<AnalyticsDashboardAppHeader />}
			content={
				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32 w-full p-24 md:p-32"
					variants={container}
					initial="hidden"
					animate="show"
				>

					<motion.div
						variants={item}
						className="sm:col-span-1"
					>
						<MonthlyExpensesWidget title={'Sales'} value={currentMonthSales.totalSales} percentage={percentages.salesPercentageChange} />
					</motion.div>
					<motion.div
						variants={item}
						className="sm:col-span-1"
					>
						<MonthlyExpensesWidget title={'Approveds'} value={currentMonthSales.totalValueApproved} percentage={percentages.approvedPercentageChange} />
					</motion.div>
					<motion.div
						variants={item}
						className="sm:col-span-1"
					>
						<MonthlyExpensesWidget title={'Pendings'} value={currentMonthSales.countTotalPending} percentage={percentages.pendingPercentageChange} />
					</motion.div>
					<motion.div
						variants={item}
						className="sm:col-span-1"
					>
						<MonthlyExpensesWidget title={'Discounts'} value={currentMonthSales.totalValueDiscount} percentage={percentages.discountPercentageChange} />
					</motion.div>
					<motion.div
						variants={item}
						className="sm:col-span-1"
					>
						<MonthlyTotalWidget title={'Total Sales'} value={currentMonthSales.countTotalOrders} percentage={percentages.ordersPercentageTotal} />
					</motion.div>
					<motion.div
						variants={item}
						className="sm:col-span-1"
					>
						<MonthlyTotalWidget title={'Total Coupon'} value={currentMonthSales.countTotalDiscount} percentage={percentages.discountsPercentageTotal} />
					</motion.div>
					<motion.div
						variants={item}
						className="sm:col-span-2 md:col-span-4 lg:col-span-2"
					>
						<BudgetDetailsWidget />
					</motion.div>
					<motion.div
						variants={item}
						className="sm:col-span-2 md:col-span-4 lg:col-span-1"
					>
						<CouponsDetailsWidget />
					</motion.div>
				</motion.div>
			}
		/>
	);
}

export default EcommerceDashboardApp;
