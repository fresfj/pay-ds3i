import { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import withRouter from '@fuse/core/withRouter';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { useDispatch } from 'react-redux';
import BoardAddList from './board-list/BoardAddList';
import BoardList from './board-list/BoardList';
import BoardCardDialog from './dialogs/card/BoardCardDialog';
import BoardSettingsSidebar from './sidebars/settings/BoardSettingsSidebar';
import BoardHeader from './BoardHeader';
import {
	useUpdateScrumboardBoardListOrderMutation,
	useGetScrumboardBoardQuery,
	useUpdateScrumboardBoardCardOrderMutation
} from '../ScrumboardApi';

/**
 * The board component.
 */
function Board() {
	const dispatch = useDispatch();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();
	const { boardId } = routeParams;

	const { data: board } = useGetScrumboardBoardQuery(boardId);

	const [reorderList] = useUpdateScrumboardBoardListOrderMutation();
	const [reorderCard] = useUpdateScrumboardBoardCardOrderMutation();

	const [sidebarOpen, setSidebarOpen] = useState(false);

	function onDragEnd(result: DropResult) {
		const { source, destination } = result;

		// dropped nowhere
		if (!destination) {
			return;
		}

		// did not move anywhere - can bail early
		if (source.droppableId === destination.droppableId && source.index === destination.index) {
			return;
		}

		// reordering list
		if (result.type === 'list') {
			reorderList({
				orderResult: result,
				board
			})
				.unwrap()
				.then(() => {
					dispatch(
						showMessage({
							message: 'List Order Saved',
							autoHideDuration: 2000,
							anchorOrigin: {
								vertical: 'top',
								horizontal: 'right'
							}
						})
					);
				});
		}

		// reordering card
		if (result.type === 'card') {
			reorderCard({
				orderResult: result,
				board
			})
				.unwrap()
				.then(() => {
					dispatch(
						showMessage({
							message: 'Card Order Saved',
							autoHideDuration: 2000,
							anchorOrigin: {
								vertical: 'top',
								horizontal: 'right'
							}
						})
					);
				});
		}
	}

	if (!board) {
		return null;
	}

	return (
		<>
			<FusePageSimple
				header={<BoardHeader onSetSidebarOpen={setSidebarOpen} />}
				content={
					board?.lists ? (
						<div className="flex flex-1 overflow-x-auto overflow-y-hidden h-full">
							<DragDropContext onDragEnd={onDragEnd}>
								<Droppable
									droppableId="list"
									type="list"
									direction="horizontal"
								>
									{(provided) => (
										<div
											ref={provided.innerRef}
											className="flex py-16 md:py-24 px-8 md:px-12"
										>
											{board?.lists.map((list, index) => (
												<BoardList
													boardId={boardId}
													key={list.id}
													listId={list.id}
													cardIds={list.cards}
													index={index}
												/>
											))}

											{provided.placeholder}

											<BoardAddList />
										</div>
									)}
								</Droppable>
							</DragDropContext>
						</div>
					) : null
				}
				rightSidebarOpen={sidebarOpen}
				rightSidebarContent={<BoardSettingsSidebar onSetSidebarOpen={setSidebarOpen} />}
				rightSidebarOnClose={() => setSidebarOpen(false)}
				scroll={isMobile ? 'normal' : 'content'}
				rightSidebarWidth={320}
			/>
			<BoardCardDialog />
		</>
	);
}

export default withRouter(Board);
