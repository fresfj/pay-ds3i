import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { useAppDispatch } from 'app/store/store';
import ItemIcon from './ItemIcon';
import { QuizeManagerItem } from './QuizApi';
import { setSelectedItemId, setQuiz, resetQuiz } from './store/selectedItemIdSlice';
import { fetchGetQuiz } from './fetchQuizzes';
import { m, motion } from 'framer-motion';
import { varHover, varTranHover } from '@fuse/components/animate';

type FolderItemProps = {
	item: QuizeManagerItem;
};

/**
 * The quiz item.
 */
function QuizItem(props: FolderItemProps) {
	const { item } = props;
	const dispatch = useAppDispatch();

	if (!item) {
		return null;
	}

	const handleQuizClick = async () => {
		dispatch(resetQuiz());
		dispatch(setQuiz(item))
		dispatch(setSelectedItemId(item.id))
	};

	return (
		<Box
			sx={{ backgroundColor: 'background.paper' }}
			className="flex flex-col relative w-full sm:w-160 h-160 m-8 p-16 shadow rounded-16 cursor-pointer"
			onClick={handleQuizClick}
		>
			<motion.div
				whileHover={{ scale: 1.1 }}
				transition={{ type: "spring", stiffness: 400, damping: 10 }}
				className="flex flex-auto w-full items-center justify-center">
				<ItemIcon type={item.type} />
			</motion.div>

			<div className="flex shrink flex-col justify-center text-center">
				<Typography className="truncate text-12 font-medium">{item.title}</Typography>
				{item.contents && (
					<Typography
						className="truncate text-12 font-medium"
						color="text.secondary"
					>
						{item.contents}
					</Typography>
				)}

			</div>
		</Box >
	);
}

export default QuizItem;
