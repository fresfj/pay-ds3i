import { Outlet } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from './store';

/**
 * The E-Commerce app.
 */
function ECommerceApp() {
	return <Outlet />;
}

export default withReducer('eCommerceApp', reducer)(ECommerceApp);
