import _ from '@lodash';
import mockApi from '../mock-api.json';
import ExtendedMockAdapter, { Params } from '../ExtendedMockAdapter';
import { FileManagerItem } from '../../app/main/apps/file-manager/FileManagerApi';

const itemsApi = mockApi.components.examples.file_manager_items.value as FileManagerItem[];

export const fileManagerApiMocks = (mock: ExtendedMockAdapter) => {
	mock.onGet('/file-manager/:folderId').reply((config) => {
		const { folderId: _folderId } = config.params as Params;

		let items = _.cloneDeep(itemsApi);

		const folderId = _folderId === 'undefined' ? null : _folderId;

		items = items.filter((item) => item.folderId === folderId);

		const pathItems = _.cloneDeep(itemsApi);
		const path = [];

		let currentFolder: FileManagerItem | null = null;

		if (folderId) {
			currentFolder = _.find(pathItems, { id: folderId });

			if (currentFolder) {
				path.push(currentFolder);
			}
		}

		while (currentFolder?.folderId) {
			// eslint-disable-next-line no-loop-func
			currentFolder = pathItems.find((item) => item.id === currentFolder?.folderId);

			if (currentFolder) {
				path.unshift(currentFolder);
			}
		}

		return [
			200,
			{
				items,
				path
			}
		];
	});
};
