import { Outlet } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from './store';

/**
 * The Shop app.
 */
function ShopApp() {
	return <Outlet />;
}

export default withReducer('shopApp', reducer)(ShopApp);
