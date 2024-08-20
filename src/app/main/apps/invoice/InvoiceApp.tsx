import { Outlet } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from './store';

/**
 * The Invoice app.
 */
function InvoiceApp() {
	return <Outlet />;
}

export default withReducer('eCommerceApp', reducer)(InvoiceApp);
