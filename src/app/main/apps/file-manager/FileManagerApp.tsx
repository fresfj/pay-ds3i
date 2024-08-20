import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useParams } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import * as React from 'react';
import { useSelector } from 'react-redux';
import _ from '@lodash';
import withReducer from 'app/store/withReducer';
import DetailSidebarContent from './DetailSidebarContent';
import FileManagerHeader from './FileManagerHeader';
import FileManagerList from './FileManagerList';
import { useGetFileManagerFolderQuery } from './FileManagerApi';
import { selectSelectedItemId } from './store/selectedItemIdSlice';
import reducer from './store';

/**
 * The file manager app.
 */
function FileManagerApp() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();
	const { folderId } = routeParams;

	const { data, isLoading } = useGetFileManagerFolderQuery(folderId);

	const selectedItemId = useSelector(selectSelectedItemId);
	const selectedItem = _.find(data?.items, { id: selectedItemId });

	const folders = _.filter(data?.items, { type: 'folder' });
	const files = _.reject(data?.items, { type: 'folder' });

	const path = data?.path;

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<FusePageCarded
			header={
				<FileManagerHeader
					path={path}
					folders={folders}
					files={files}
				/>
			}
			content={
				<FileManagerList
					folders={folders}
					files={files}
				/>
			}
			rightSidebarOpen={Boolean(selectedItem)}
			rightSidebarContent={
				<div className="w-full">
					<DetailSidebarContent items={data?.items} />
				</div>
			}
			rightSidebarWidth={400}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default withReducer('fileManagerApp', reducer)(FileManagerApp);
