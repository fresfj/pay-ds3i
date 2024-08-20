import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { FileManagerItem, FileManagerPath, QuizeManagerItem } from './QuizApi';
import QuizAdd from './QuizAdd';
import { useSelector } from 'react-redux';
import { selectUserRole } from 'src/app/auth/user/store/userSlice';

type QuizHeaderHeaderProps = {
	path: FileManagerPath[];
	folders: FileManagerItem[];
	files: FileManagerItem[];
	quizzes: {
		pendingQuizzes: QuizeManagerItem[],
		completedQuizzes: QuizeManagerItem[],
	};
	setShouldUpdate: (value: boolean) => void
};

function isUserAdmin(role: string[] | string) {
	if (!role) {
		return false;
	}
	if (Array.isArray(role)) {
		return role.includes('admin');
	}
	return role === 'admin';
}
/**
 * The file manager header.
 */
function QuizHeader(props: QuizHeaderHeaderProps) {
	const { path, folders, files, quizzes, setShouldUpdate } = props;
	const userRole = useSelector(selectUserRole);
	const isAdmin = isUserAdmin(userRole);

	return (
		<div className="p-24 sm:p-32 w-full flex  space-y-8 sm:space-y-0 items-center justify-between">
			<div className="flex flex-col space-y-8 sm:space-y-0">
				<motion.span
					className="flex items-end"
					initial={{ x: -20 }}
					animate={{ x: 0, transition: { delay: 0.2 } }}
				>
					<Typography
						component={Link}
						to="/apps/quiz"
						className="text-20 md:text-32 font-extrabold tracking-tight leading-none"
						role="button"
					>
						Avaliação
					</Typography>
					{path && path?.length > 0 && (
						<Breadcrumbs
							aria-label="breadcrumb"
							className="mx-12"
							separator={<NavigateNextIcon fontSize="small" />}
						>
							<div />
							{path.map((item, index) =>
								index + 1 === path.length ? (
									<Typography key={index}>{item.name}</Typography>
								) : (
									<Link
										key={index}
										color="text.primary"
										to={`/apps/quiz/${item.id}`}
									>
										{item.name}
									</Link>
								)
							)}
						</Breadcrumbs>
					)}
				</motion.span>
				{quizzes && (
					<motion.span
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					>
						<Typography
							className="text-14 font-medium mx-2"
							color="text.secondary"
						>
							{`${quizzes.pendingQuizzes.length} pendentes, ${quizzes.completedQuizzes.length} realizados`}
						</Typography>
					</motion.span>
				)}
			</div>

			<motion.div
				className="flex items-center -mx-8"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
			>
				{isAdmin &&
					<QuizAdd setShouldUpdate={setShouldUpdate} />
				}
			</motion.div>
		</div>
	);
}

export default QuizHeader;
