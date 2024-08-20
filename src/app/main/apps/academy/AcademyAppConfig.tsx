import { lazy } from 'react';
import { Navigate } from 'react-router-dom';


const AcademyApp = lazy(() => import('./AcademyApp'));
const Course = lazy(() => import('./course/Course'));
const Courses = lazy(() => import('./courses/Courses'));
const Teacher = lazy(() => import('./teacher/TeacherView'));
const Offers = lazy(() => import('./offers/Offers'));
const OfferView = lazy(() => import('./offers/OfferView'));
const TypeView = lazy(() => import('./offers/TypeView'));
/**
 * The Academy app config.
 */
const AcademyAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/academy',
			element: <AcademyApp />,
			children: [
				{
					path: '',
					element: <Navigate to="/apps/academy/courses" />
				},
				{
					path: 'courses',
					element: <Courses />
				},
				{
					path: 'courses/teacher/:teacherId',
					element: <Teacher />
				},
				{
					path: 'courses/course/:courseId/*',
					element: <Course />
				},
			]
		},
		{
			path: 'apps/academy/offers',
			element: <Offers />,
			children: [
				{
					path: ':offerId',
					element: <OfferView />
				},
				{
					path: ':offerId/:type',
					element: <TypeView />
				},
			]
		}
	]
};

export default AcademyAppConfig;
