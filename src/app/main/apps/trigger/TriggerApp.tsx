import { Outlet } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from './store';

/**
 * The Trigger app.
 */
function TriggerApp() {
	return <Outlet />;
}

export default withReducer('triggerApp', reducer)(TriggerApp);
