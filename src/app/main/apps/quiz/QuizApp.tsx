import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useParams } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import * as React from 'react';
import { useSelector } from 'react-redux';
import _ from '@lodash';
import withReducer from 'app/store/withReducer';
import FileManagerHeader from './QuizHeader';
import { useGetFileManagerFolderQuery } from './QuizApi';
import { selectSelectedItemId } from './store/selectedItemIdSlice';
import reducer from './store';
import DetailSidebarContent from './DetailSidebarContent';
import QuizList from './QuizList';
import QuizDialog from './QuizDialog';
import { useEffect, useState } from 'react';
import { fetchQuizzes } from './fetchQuizzes';
import { selectUser } from 'src/app/auth/user/store/userSlice';


/**
 * The quiz app.
 */
function QuizApp() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [open, setOpen] = useState(false);
	const user = useSelector(selectUser);

	const routeParams = useParams();
	const { folderId } = routeParams;

	const { data, isLoading } = useGetFileManagerFolderQuery(folderId);

	const [quizzes, setQuizzes] = useState({ allQuizzes: [], pendingQuizzes: [], completedQuizzes: [] });
	const [loading, setLoading] = useState(true);
	const [shouldUpdate, setShouldUpdate] = useState(false);
	const selectedItemId = useSelector(selectSelectedItemId);
	const selectedItem = _.find(data?.items, { id: selectedItemId });


	const folders = _.filter(data?.items, { type: 'folder' });
	const files = _.reject(data?.items, { type: 'folder' });

	const path = data?.path;

	const getQuizzes = async () => {
		setLoading(true);
		try {
			const { allQuizzes, pendingQuizzes, completedQuizzes }: any = await fetchQuizzes(user.data.customer.id);
			setQuizzes({ allQuizzes, pendingQuizzes, completedQuizzes });

		} catch (error) {
			console.error('Erro ao buscar quizzes: ', error);
		}
		setLoading(false);
	};

	useEffect(() => {
		getQuizzes();
	}, []);

	useEffect(() => {
		if (shouldUpdate) {
			getQuizzes();
			setShouldUpdate(false)
		}
	}, [shouldUpdate]);

	if (isLoading && loading) {
		return <FuseLoading />;
	}

	const handleClose = () => {
		setOpen(false);
		getQuizzes();
	}

	return (
		<FusePageCarded
			header={
				<FileManagerHeader
					path={path}
					quizzes={quizzes}
					folders={folders}
					files={files}
					setShouldUpdate={setShouldUpdate}
				/>
			}
			content={
				<QuizList
					quizzes={quizzes}
					folders={folders}
					files={files}
				/>
			}
			rightSidebarOpen={Boolean(selectedItemId)}
			rightSidebarContent={
				<div className="w-full">
					<DetailSidebarContent items={data?.items} setOpen={setOpen} />
					<QuizDialog open={open} onClose={handleClose} />
				</div>
			}
			rightSidebarWidth={400}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default withReducer('quizApp', reducer)(QuizApp);
