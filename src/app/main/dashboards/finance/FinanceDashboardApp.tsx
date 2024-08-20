import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'framer-motion';
import FuseLoading from '@fuse/core/FuseLoading';
import FinanceDashboardAppHeader from './FinanceDashboardAppHeader';
import PreviousStatementWidget from './widgets/PreviousStatementWidget';
import CurrentStatementWidget from './widgets/CurrentStatementWidget';
import AccountBalanceWidget from './widgets/AccountBalanceWidget';
import RecentTransactionsWidget from './widgets/RecentTransactionsWidget';
import BudgetWidget from './widgets/BudgetWidget';
import { useGetFinanceDashboardWidgetsQuery } from './FinanceDashboardApi';
import TotalBalanceWidget from './widgets/TotalBalanceWidget';
import TotalConfirmedWidget from './widgets/TotalConfirmedWidget';
import TotalPendingWidget from './widgets/TotalPendingWidget';
import TotalFinanceWidget from './widgets/TotalFinanceWidget';
import RecentSubscriptionsWidget from './widgets/RecentSubscriptionsWidget';

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
 * The finance dashboard app.
 */
function FinanceDashboardApp() {
	const { data: widgets, isLoading } = useGetFinanceDashboardWidgetsQuery();

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widgets) {
		return null;
	}

	return (
		<FusePageSimple
			header={<FinanceDashboardAppHeader />}
			content={
				<div className="w-full px-24 md:px-32 pb-24">
					<motion.div
						className="w-full"
						variants={container}
						initial="hidden"
						animate="show"
					>
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-32 w-full mt-32">

							<motion.div
								variants={item}
								className="flex flex-col flex-auto"
							>
								<TotalBalanceWidget />
							</motion.div>
							<motion.div
								variants={item}
								className="flex flex-col flex-auto"
							>
								<TotalPendingWidget />
							</motion.div>

							<motion.div
								variants={item}
								className="flex flex-col flex-auto"
							>
								<TotalConfirmedWidget />
							</motion.div>
							<motion.div
								variants={item}
								className="flex flex-col flex-auto"
							>
								<TotalFinanceWidget />
							</motion.div>
							<div className="grid gap-32 sm:grid-flow-col xl:grid-flow-row">

							</div>
							{/* <motion.div
								variants={item}
								className="flex flex-col flex-auto"
							>
								<AccountBalanceWidget />
							</motion.div> */}
						</div>
						<div className="grid grid-cols-1 xl:grid-cols-3 gap-32 w-full mt-32">
							<motion.div
								variants={item}
								className="xl:col-span-2 flex flex-col flex-auto"
							>
								<RecentTransactionsWidget />
							</motion.div>
							<motion.div
								variants={item}
								className="flex flex-col flex-auto"
							>
								<RecentSubscriptionsWidget />
							</motion.div>
						</div>
					</motion.div>
				</div>
			}
		/>
	);
}

export default FinanceDashboardApp;
