import mockApi from '../mock-api.json';
import { TimelineResponseDataType } from '../../app/main/apps/profile/tabs/timeline/TimelineTab';
import { ProfileAbout, ProfilePhotosVideos } from '../../app/main/apps/profile/ProfileApi';
import ExtendedMockAdapter from '../ExtendedMockAdapter';

const timelineApi = mockApi.components.examples.profile_timeline.value as TimelineResponseDataType;
const photosVideosApi = mockApi.components.examples.profile_photos_videos.value as ProfilePhotosVideos;
const aboutApi = mockApi.components.examples.profile_about.value as ProfileAbout;

export const profileApiMocks = (mock: ExtendedMockAdapter) => {
	mock.onGet('/profile/timeline').reply(() => {
		return [200, timelineApi];
	});

	mock.onGet('/profile/photos-videos').reply(() => {
		return [200, photosVideosApi];
	});

	mock.onGet('/profile/about').reply(() => {
		return [200, aboutApi];
	});
};
