import { apiService as api } from 'app/store/apiService';
import { DropResult } from 'react-beautiful-dnd';
import { PartialDeep } from 'type-fest';
import _ from '@lodash';
import BoardModel from './models/BoardModel';
import { AppRootStateType } from './store';
import CardModel from './models/CardModel';
import reorder, { reorderQuoteMap } from './store/reorder';

export const addTagTypes = [
	'scrumboard_members',
	'scrumboard_board_lists',
	'scrumboard_member',
	'scrumboard_board_list',
	'scrumboard_board_labels',
	'scrumboard_board_label',
	'scrumboard_board_cards',
	'scrumboard_board_card',
	'scrumboard_boards',
	'scrumboard_board'
] as const;

const ScrumboardApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getScrumboardMembers: build.query<GetScrumboardMembersApiResponse, GetScrumboardMembersApiArg>({
				query: () => ({ url: `/mock-api/scrumboard/members` }),
				providesTags: ['scrumboard_members']
			}),
			createScrumboardMember: build.mutation<CreateScrumboardMemberApiResponse, CreateScrumboardMemberApiArg>({
				query: (member) => ({
					url: `/mock-api/scrumboard/members`,
					method: 'POST',
					data: member
				}),
				invalidatesTags: ['scrumboard_members']
			}),
			getScrumboardMember: build.query<GetScrumboardMemberApiResponse, GetScrumboardMemberApiArg>({
				query: (memberId) => ({
					url: `/mock-api/scrumboard/members/${memberId}`
				}),
				providesTags: ['scrumboard_member']
			}),
			updateScrumboardMember: build.mutation<UpdateScrumboardMemberApiResponse, UpdateScrumboardMemberApiArg>({
				query: (member) => ({
					url: `/mock-api/scrumboard/members/${member.id}`,
					method: 'PUT',
					data: member
				}),
				invalidatesTags: ['scrumboard_member']
			}),
			deleteScrumboardMember: build.mutation<DeleteScrumboardMemberApiResponse, DeleteScrumboardMemberApiArg>({
				query: (memberId) => ({
					url: `/mock-api/scrumboard/members/${memberId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['scrumboard_members']
			}),
			getScrumboardBoardLists: build.query<GetScrumboardBoardListsApiResponse, GetScrumboardBoardListsApiArg>({
				query: (boardId) => ({
					url: `/mock-api/scrumboard/boards/${boardId}/lists`
				}),
				providesTags: ['scrumboard_board_lists']
			}),
			createScrumboardBoardList: build.mutation<
				CreateScrumboardBoardListApiResponse,
				CreateScrumboardBoardListApiArg
			>({
				query: (queryArg) => ({
					url: `/mock-api/scrumboard/boards/${queryArg.boardId}/lists`,
					method: 'POST',
					data: queryArg.list
				}),
				invalidatesTags: ['scrumboard_board_lists', 'scrumboard_board']
			}),
			getScrumboardBoardList: build.query<GetScrumboardBoardListApiResponse, GetScrumboardBoardListApiArg>({
				query: (queryArg) => ({
					url: `/mock-api/scrumboard/boards/${queryArg.boardId}/lists/${queryArg.listId}`
				}),
				providesTags: ['scrumboard_board_lists', 'scrumboard_board_list']
			}),
			updateScrumboardBoardList: build.mutation<
				UpdateScrumboardBoardListApiResponse,
				UpdateScrumboardBoardListApiArg
			>({
				query: (queryArg) => ({
					url: `/mock-api/scrumboard/boards/${queryArg.boardId}/lists/${queryArg.list.id}`,
					method: 'PUT',
					data: queryArg.list
				}),
				invalidatesTags: ['scrumboard_board_lists', 'scrumboard_board_list']
			}),
			deleteScrumboardBoardList: build.mutation<
				DeleteScrumboardBoardListApiResponse,
				DeleteScrumboardBoardListApiArg
			>({
				query: (queryArg) => ({
					url: `/mock-api/scrumboard/boards/${queryArg.boardId}/lists/${queryArg.listId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['scrumboard_board_lists', 'scrumboard_board']
			}),
			getScrumboardBoardLabels: build.query<GetScrumboardBoardLabelsApiResponse, GetScrumboardBoardLabelsApiArg>({
				query: (boardId) => ({
					url: `/mock-api/scrumboard/boards/${boardId}/labels`
				}),
				providesTags: ['scrumboard_board_labels']
			}),
			createScrumboardBoardLabel: build.mutation<
				CreateScrumboardBoardLabelApiResponse,
				CreateScrumboardBoardLabelApiArg
			>({
				query: (queryArg) => ({
					url: `/mock-api/scrumboard/boards/${queryArg.boardId}/labels`,
					method: 'POST',
					data: queryArg.label
				}),
				invalidatesTags: ['scrumboard_board_labels']
			}),
			getScrumboardBoardLabel: build.query<GetScrumboardBoardLabelApiResponse, GetScrumboardBoardLabelApiArg>({
				query: (queryArg) => ({
					url: `/mock-api/scrumboard/boards/${queryArg.boardId}/labels/${queryArg.labelId}`
				}),
				providesTags: ['scrumboard_board_label']
			}),
			updateScrumboardBoardLabel: build.mutation<
				UpdateScrumboardBoardLabelApiResponse,
				UpdateScrumboardBoardLabelApiArg
			>({
				query: (queryArg) => ({
					url: `/mock-api/scrumboard/boards/${queryArg.boardId}/labels/${queryArg.label.id}`,
					method: 'PUT',
					data: queryArg.label
				}),
				invalidatesTags: ['scrumboard_board_label']
			}),
			deleteScrumboardBoardLabel: build.mutation<
				DeleteScrumboardBoardLabelApiResponse,
				DeleteScrumboardBoardLabelApiArg
			>({
				query: (queryArg) => ({
					url: `/mock-api/scrumboard/boards/${queryArg.boardId}/labels/${queryArg.labelId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['scrumboard_board_labels']
			}),
			getScrumboardBoardCards: build.query<
				GetScrumboardBoardCardListApiResponse,
				GetScrumboardBoardCardListApiArg
			>({
				query: (boardId) => ({
					url: `/mock-api/scrumboard/boards/${boardId}/cards`
				}),
				providesTags: ['scrumboard_board_cards']
			}),
			createScrumboardBoardCard: build.mutation<
				CreateScrumboardBoardCardApiResponse,
				CreateScrumboardBoardCardApiArg
			>({
				query: (queryArg) => ({
					url: `/mock-api/scrumboard/boards/${queryArg.boardId}/lists/${queryArg.listId}/cards`,
					method: 'POST',
					data: CardModel(queryArg.card)
				}),
				invalidatesTags: ['scrumboard_board_cards', 'scrumboard_board']
			}),
			updateScrumboardBoardCard: build.mutation<
				UpdateScrumboardBoardCardApiResponse,
				UpdateScrumboardBoardCardApiArg
			>({
				query: (queryArg) => ({
					url: `/mock-api/scrumboard/boards/${queryArg.boardId}/cards/${queryArg.card.id}`,
					method: 'PUT',
					data: queryArg.card
				}),
				invalidatesTags: ['scrumboard_board_cards']
			}),
			deleteScrumboardBoardCard: build.mutation<
				DeleteScrumboardBoardCardApiResponse,
				DeleteScrumboardBoardCardApiArg
			>({
				query: (queryArg) => ({
					url: `/mock-api/scrumboard/boards/${queryArg.boardId}/cards/${queryArg.cardId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['scrumboard_board_cards']
			}),
			getScrumboardBoards: build.query<GetScrumboardBoardsApiResponse, GetScrumboardBoardsApiArg>({
				query: () => ({ url: `/mock-api/scrumboard/boards` }),
				providesTags: ['scrumboard_boards']
			}),
			createScrumboardBoard: build.mutation<CreateScrumboardBoardApiResponse, CreateScrumboardBoardApiArg>({
				query: (board) => ({
					url: `/mock-api/scrumboard/boards`,
					method: 'POST',
					data: BoardModel(board)
				}),
				invalidatesTags: ['scrumboard_boards', 'scrumboard_board']
			}),
			getScrumboardBoard: build.query<GetScrumboardBoardApiResponse, GetScrumboardBoardApiArg>({
				query: (boardId) => ({
					url: `/mock-api/scrumboard/boards/${boardId}`
				}),
				providesTags: ['scrumboard_board']
			}),
			updateScrumboardBoard: build.mutation<UpdateScrumboardBoardApiResponse, UpdateScrumboardBoardApiArg>({
				query: (board) => ({
					url: `/mock-api/scrumboard/boards/${board.id}`,
					method: 'PUT',
					data: board
				}),
				invalidatesTags: ['scrumboard_board', 'scrumboard_boards']
			}),
			deleteScrumboardBoard: build.mutation<DeleteScrumboardBoardApiResponse, DeleteScrumboardBoardApiArg>({
				query: (boardId) => ({
					url: `/mock-api/scrumboard/boards/${boardId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['scrumboard_boards']
			}),
			updateScrumboardBoardListOrder: build.mutation<
				UpdateScrumboardBoardListOrderApiResponse,
				UpdateScrumboardBoardListOrderApiArg
			>({
				query: (queryArg) => {
					const { orderResult, board } = queryArg;

					const ordered = reorder(
						_.merge([], board.lists),
						orderResult.source.index,
						orderResult.destination.index
					);

					return {
						url: `/mock-api/scrumboard/boards/${board.id}`,
						method: 'PUT',
						data: { lists: ordered }
					};
				},
				invalidatesTags: ['scrumboard_boards', 'scrumboard_board']
			}),
			updateScrumboardBoardCardOrder: build.mutation<
				UpdateScrumboardBoardCardOrderApiResponse,
				UpdateScrumboardBoardCardOrderApiArg
			>({
				query: (queryArg) => {
					const { orderResult, board } = queryArg;

					const ordered = reorderQuoteMap(
						_.merge([], board.lists),
						orderResult.source,
						orderResult.destination
					);

					return {
						url: `/mock-api/scrumboard/boards/${board.id}`,
						method: 'PUT',
						data: { lists: ordered }
					};
				},
				invalidatesTags: ['scrumboard_board_list', 'scrumboard_board']
			})
		}),
		overrideExisting: false
	});

export default ScrumboardApi;

export type ScrumboardApiType = {
	[ScrumboardApi.reducerPath]: ReturnType<typeof ScrumboardApi.reducer>;
};

export type GetScrumboardMembersApiResponse = /** status 200 OK */ ScrumboardMember[];
export type GetScrumboardMembersApiArg = void;

export type CreateScrumboardMemberApiResponse = unknown;
export type CreateScrumboardMemberApiArg = ScrumboardMember;

export type GetScrumboardBoardListsApiResponse = /** status 200 OK */ ScrumboardList[];
export type GetScrumboardBoardListsApiArg = string /** board id */;

export type CreateScrumboardBoardListApiResponse = unknown;
export type CreateScrumboardBoardListApiArg = {
	boardId: string;
	list: PartialDeep<ScrumboardList>;
};

export type GetScrumboardMemberApiResponse = /** status 200 OK */ ScrumboardMember;
export type GetScrumboardMemberApiArg = string /** member id */;

export type UpdateScrumboardMemberApiResponse = unknown;
export type UpdateScrumboardMemberApiArg = PartialDeep<ScrumboardMember>;

export type DeleteScrumboardMemberApiResponse = unknown;
export type DeleteScrumboardMemberApiArg = string /** member id */;

export type GetScrumboardBoardListApiResponse = /** status 200 OK */ ScrumboardList;
export type GetScrumboardBoardListApiArg = {
	listId: string;
	boardId: string;
};

export type UpdateScrumboardBoardListApiResponse = unknown;
export type UpdateScrumboardBoardListApiArg = {
	boardId: string;
	list: PartialDeep<ScrumboardList>;
};

export type DeleteScrumboardBoardListApiResponse = unknown;
export type DeleteScrumboardBoardListApiArg = {
	listId: string;
	boardId: string;
};

export type GetScrumboardBoardLabelsApiResponse = /** status 200 OK */ ScrumboardLabel[];
export type GetScrumboardBoardLabelsApiArg = string /** board id */;

export type CreateScrumboardBoardLabelApiResponse = unknown;
export type CreateScrumboardBoardLabelApiArg = {
	boardId: string;
	label: PartialDeep<ScrumboardLabel>;
};

export type GetScrumboardBoardLabelApiResponse = /** status 200 OK */ ScrumboardLabel;
export type GetScrumboardBoardLabelApiArg = {
	labelId: string;
	boardId: string;
};

export type UpdateScrumboardBoardLabelApiResponse = unknown;
export type UpdateScrumboardBoardLabelApiArg = {
	boardId: string;
	label: PartialDeep<ScrumboardLabel>;
};

export type DeleteScrumboardBoardLabelApiResponse = unknown;
export type DeleteScrumboardBoardLabelApiArg = {
	labelId: string;
	boardId: string;
};

export type GetScrumboardBoardCardListApiResponse = /** status 200 OK */ ScrumboardCard[];
export type GetScrumboardBoardCardListApiArg = string /** board id */;

export type CreateScrumboardBoardCardApiResponse = unknown;
export type CreateScrumboardBoardCardApiArg = {
	boardId: string;
	listId: string;
	card: PartialDeep<ScrumboardCard>;
};

export type UpdateScrumboardBoardCardApiResponse = unknown;
export type UpdateScrumboardBoardCardApiArg = {
	boardId: string;
	card: PartialDeep<ScrumboardCard>;
};

export type DeleteScrumboardBoardCardApiResponse = unknown;
export type DeleteScrumboardBoardCardApiArg = {
	cardId: string;
	boardId: string;
};

export type GetScrumboardBoardsApiResponse = /** status 200 OK */ ScrumboardBoard[];
export type GetScrumboardBoardsApiArg = void;

export type CreateScrumboardBoardApiResponse = unknown;
export type CreateScrumboardBoardApiArg = PartialDeep<ScrumboardBoard>;

export type GetScrumboardBoardApiResponse = /** status 200 OK */ ScrumboardBoard;
export type GetScrumboardBoardApiArg = string /** board id */;

export type UpdateScrumboardBoardApiResponse = unknown;
export type UpdateScrumboardBoardApiArg = PartialDeep<ScrumboardBoard>;

export type DeleteScrumboardBoardApiResponse = unknown;
export type DeleteScrumboardBoardApiArg = string /** board id */;

export type UpdateScrumboardBoardListOrderApiResponse = unknown;
export type UpdateScrumboardBoardListOrderApiArg = {
	orderResult: {
		source: DropResult['source'];
		destination: DropResult['destination'];
	};
	board: ScrumboardBoard;
};
export type UpdateScrumboardBoardCardOrderApiResponse = unknown;
export type UpdateScrumboardBoardCardOrderApiArg = {
	orderResult: {
		source: DropResult['source'];
		destination: DropResult['destination'];
	};
	board: ScrumboardBoard;
};

export type ScrumboardMember = {
	id: string;
	name: string;
	avatar: string;
	class: string;
};

export type ScrumboardList = {
	id: string;
	boardId: string;
	title: string;
};
export type ScrumboardBoardList = {
	id: string;
	cards: ScrumboardCard['id'][];
};

export type ScrumboardLabel = {
	id: string;
	boardId: string;
	title: string;
};

export type ScrumboardAttachment = {
	id: string;
	name: string;
	src: string;
	url: string;
	time: number;
	type: string;
};
export type ScrumboardCheckListItem = {
	id: number;
	name: string;
	checked: boolean;
};

export type ScrumboardChecklist = {
	id?: string;
	name: string;
	checkItems: ScrumboardCheckListItem[];
};

export type ScrumboardCard = {
	id: string;
	boardId: string;
	listId: string;
	title: string;
	description: string;
	labels: string[];
	dueDate?: number | null;
	attachmentCoverId: string;
	memberIds: string[];
	attachments: ScrumboardAttachment[];
	subscribed: boolean;
	checklists: ScrumboardChecklist[];
	activities: {
		id: string;
		type: string;
		idMember: string;
		message: string;
		time: number;
	}[];
};

export type ScrumboardBoard = {
	id: string;
	title: string;
	description: string;
	icon: string;
	lastActivity: string;
	members: string[];
	settings: {
		subscribed: boolean;
		cardCoverImages: boolean;
	};
	lists: {
		id: string;
		cards?: string[];
	}[];
};

export type ScrumboardComment = {
	id: string;
	type: string;
	idMember: string;
	message: string;
	time: number;
};

export const {
	useGetScrumboardMembersQuery,
	useCreateScrumboardMemberMutation,
	useGetScrumboardBoardListsQuery,
	useCreateScrumboardBoardListMutation,
	useGetScrumboardMemberQuery,
	useUpdateScrumboardMemberMutation,
	useDeleteScrumboardMemberMutation,
	useGetScrumboardBoardListQuery,
	useUpdateScrumboardBoardListMutation,
	useDeleteScrumboardBoardListMutation,
	useGetScrumboardBoardLabelsQuery,
	useCreateScrumboardBoardLabelMutation,
	useGetScrumboardBoardLabelQuery,
	useUpdateScrumboardBoardLabelMutation,
	useDeleteScrumboardBoardLabelMutation,
	useGetScrumboardBoardCardsQuery,
	useCreateScrumboardBoardCardMutation,
	useUpdateScrumboardBoardCardMutation,
	useDeleteScrumboardBoardCardMutation,
	useGetScrumboardBoardsQuery,
	useCreateScrumboardBoardMutation,
	useGetScrumboardBoardQuery,
	useUpdateScrumboardBoardMutation,
	useDeleteScrumboardBoardMutation,
	useUpdateScrumboardBoardListOrderMutation,
	useUpdateScrumboardBoardCardOrderMutation
} = ScrumboardApi;

export const selectListById = (boardId: string, listId: string) => (state: AppRootStateType) => {
	const lists = ScrumboardApi.endpoints.getScrumboardBoardLists.select(boardId)(state)?.data ?? [];

	return _.find(lists, { id: listId });
};

export const selectMemberById = (id: string) => (state: AppRootStateType) => {
	const members = ScrumboardApi.endpoints.getScrumboardMembers.select()(state)?.data ?? [];

	return _.find(members, { id });
};

export const selectLabelById = (boardId: string, id: string) => (state: AppRootStateType) => {
	const labels = ScrumboardApi.endpoints.getScrumboardBoardLabels.select(boardId)(state)?.data ?? [];

	return _.find(labels, { id });
};
