import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { lighten } from '@mui/material/styles';
import { motion } from 'framer-motion';
import * as React from 'react';
import FolderItem from './FolderItem';
import FileItem from './FileItem';
import { FileManagerItem, QuizeManagerItem } from './QuizApi';
import QuizItem from './QuizItem';

type QuizListProps = {
	folders: FileManagerItem[];
	files: FileManagerItem[];
	quizzes?: {
		pendingQuizzes: QuizeManagerItem[],
		completedQuizzes: QuizeManagerItem[],
	};
};

/**
 * The file manager list.
 */
function QuizList(props: QuizListProps) {
	const { files, folders, quizzes } = props;

	if (files.length === 0 && folders.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There are no items!
				</Typography>
			</motion.div>
		);
	}

	return (
		<div className="p-32">
			{quizzes?.pendingQuizzes.length > 0 && (
				<Box
					className="p-16 w-full rounded-16 mb-24 border"
					sx={{
						backgroundColor: (theme) =>
							theme.palette.mode === 'light'
								? lighten(theme.palette.background.default, 0.4)
								: lighten(theme.palette.background.default, 0.02)
					}}
				>
					<Typography className="font-medium">Avaliação Pendentes</Typography>

					<div className="flex flex-wrap -m-8 mt-8">
						{quizzes?.pendingQuizzes.map((item, index) => (
							<QuizItem
								key={index}
								item={item}
							/>
						))}
					</div>
				</Box>
			)}

			{quizzes?.completedQuizzes.length > 0 && (
				<Box
					className="p-16 w-full rounded-16 mb-24 border"
					sx={{
						backgroundColor: (theme) =>
							theme.palette.mode === 'light'
								? lighten(theme.palette.background.default, 0.4)
								: lighten(theme.palette.background.default, 0.02)
					}}
				>
					<Typography className="font-medium">Avaliação Realizadas</Typography>

					<div className="flex flex-wrap -m-8 mt-8">
						{quizzes?.completedQuizzes.map((item, index) => (
							<QuizItem
								key={index}
								item={item}
							/>
						))}
					</div>
				</Box>
			)}

		</div>
	);
}

export default QuizList;
