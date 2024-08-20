import { Outlet } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from './store'

/**
 * The checkout app.
 */
function CheckoutApp() {
	return <Outlet />;
}

export default withReducer('checkoutApp', reducer)(CheckoutApp);

