import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CourseInfo from '../CourseInfo';
import CourseProgress from '../CourseProgress';
import { Course } from '../AcademyApi';

type CourseCardProps = {
	course: Course;
	loading?: boolean;
}
/**
 * The CourseCard component.
 */
function CourseCard(props: CourseCardProps) {
	const { course, loading = false } = props;

	function buttonStatus() {
		switch (course.activeStep) {
			case course.totalSteps:
				return 'Completed';
			case 0:
				return 'Start';
			default:
				return 'Continue';
		}
	}

	return (
		<Card className="flex flex-col h-414 shadow">
			<CardHeader
				avatar={
					loading ? (
						<Skeleton animation="wave" variant="circular" width={40} height={40} />
					) : (
						<Avatar
							alt="Personal trainer"
							src="https://c.superprof.com/i/m/20182544/300/20230803005733/20182544.webp"
						/>
					)
				}
				title={
					loading ? (
						<Skeleton
							animation="wave"
							height={10}
							width="80%"
							style={{ marginBottom: 6 }}
						/>
					) : (
						'Adriana'
					)
				}
				subheader={
					loading ? (
						<Skeleton animation="wave" height={10} width="40%" />
					) : (
						'Personal trainer'
					)
				}
				action={
					loading ? null : (
						<IconButton aria-label="settings">
							<MoreVertIcon />
						</IconButton>
					)
				}
			/>

			<CardContent className="flex flex-col flex-auto p-24">
				<CourseInfo course={course} />
			</CardContent>
			<CourseProgress course={course} />
			<CardActions
				className="items-center justify-end py-16 px-24"
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? lighten(theme.palette.background.default, 0.4)
							: lighten(theme.palette.background.default, 0.03)
				}}
			>
				<Button
					to={`/apps/academy/courses/course/${course.id}/${course.slug}`}
					component={Link}
					className="px-16 min-w-128"
					color="secondary"
					variant="contained"
					endIcon={<FuseSvgIcon size={20}>heroicons-solid:arrow-sm-right</FuseSvgIcon>}
				>
					{buttonStatus()}
				</Button>
			</CardActions>
		</Card>
	);
}

export default CourseCard;
