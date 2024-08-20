import { Outlet } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from './store';

/**
 * The Account app.
 */
function AccountApp() {
	return <Outlet />;
}

export default withReducer('accountApp', reducer)(AccountApp);
