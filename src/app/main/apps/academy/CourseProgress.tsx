import LinearProgress from '@mui/material/LinearProgress';
import clsx from 'clsx';
import { Course } from './AcademyApi';

type CourseProgressProps = {
	course: Course;
	className?: string;
};

/**
 * The CourseProgress component.
 */
function CourseProgress(props: CourseProgressProps) {
	const { course, className } = props;

	return (
		<LinearProgress
			className={clsx('w-full h-2', className)}
			variant="determinate"
			value={(course.progress.currentStep * 100) / course.totalSteps}
			color="secondary"
		/>
	);
}

export default CourseProgress;
