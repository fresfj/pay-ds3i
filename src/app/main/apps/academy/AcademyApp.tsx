import { Outlet, useParams } from 'react-router-dom';
import { lazy } from 'react';

const Courses = lazy(() => import('./courses/Courses'));
/**
 * The Academy app.
 */
function AcademyApp() {
	const routeParams = useParams();


	if (Boolean(routeParams.teacherId)) {
		return <Courses />
	}

	return <Outlet />;
}

export default AcademyApp;
