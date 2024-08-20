import { useSelector } from 'react-redux';
import BillingTab from '../tabs/billing/BillingTab';
import GeneralTab from '../tabs/general/GeneralTab';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import SecurityTab from '../tabs/security/SecurityTab';
import { useDeleteAccountsItemMutation, useUpdateAccountsItemMutation, useUpdateAccountPlanMutation, useUpdateAccountSecurityMutation } from '../AccountApi';
import { useAuth } from 'src/app/auth/AuthRouteProvider';

type ContentProps = {
	selectedTab?: any;
};
/**
 *  Content
 */
function Content(props: ContentProps) {
	const { selectedTab } = props;
	const user = useSelector(selectUser);
	const { updateUser } = useAuth();
	const [updateAccount] = useUpdateAccountsItemMutation();
	const [updatePlan] = useUpdateAccountPlanMutation();
	const [updateSecurity] = useUpdateAccountSecurityMutation();
	const [deleteAccount] = useDeleteAccountsItemMutation();


	return (
		<div className="flex flex-auto justify-center w-full mx-auto p-16 sm:p-32" >
			{selectedTab === 0 && <GeneralTab user={user} updateUser={updateUser} updateAccount={updateAccount} />}
			{selectedTab === 1 && <BillingTab user={user} updateUser={updateUser} updatePlan={updatePlan} />}
			{selectedTab === 2 && <SecurityTab />}
		</div>
	);
}

export default Content;
