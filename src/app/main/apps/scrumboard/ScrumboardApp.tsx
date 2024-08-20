import { Outlet } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from './store';

/**
 * The scrumboard app.
 */
function ScrumboardApp() {
	return <Outlet />;
}

export default withReducer('scrumboardApp', reducer)(ScrumboardApp);
