import { apiService as api } from 'app/store/apiService';

export const addTagTypes = ['profile_photos_videos', 'profile_timeline', 'profile_about'] as const;

const ProfileApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getProfilePhotosVideos: build.query<GetProfilePhotosVideosApiResponse, GetProfilePhotosVideosApiArg>({
				query: () => ({ url: `/mock-api/profile/photos-videos` }),
				providesTags: ['profile_photos_videos']
			}),
			getProfileTimeline: build.query<GetProfileTimelineApiResponse, GetProfileTimelineApiArg>({
				query: () => ({ url: `/mock-api/profile/timeline` }),
				providesTags: ['profile_timeline']
			}),
			getProfileAbout: build.query<GetProfileAboutApiResponse, GetProfileAboutApiArg>({
				query: () => ({ url: `/mock-api/profile/about` }),
				providesTags: ['profile_about']
			})
		}),
		overrideExisting: false
	});

export default ProfileApi;

export type GetProfilePhotosVideosApiResponse = /** status 200 OK */ ProfilePhotosVideos[];
export type GetProfilePhotosVideosApiArg = void;

export type GetProfileTimelineApiResponse = /** status 200 OK */ ProfileTimeline;
export type GetProfileTimelineApiArg = void;

export type GetProfileAboutApiResponse = /** status 200 OK */ ProfileAbout;
export type GetProfileAboutApiArg = void;

export type ProfilePhotosVideos = {
	id?: string;
	name?: string;
	info?: string;
	media?: {
		type?: string;
		title?: string;
		preview?: string;
	}[];
};

export type Activity = {
	id?: string;
	user?: {
		name?: string;
		avatar?: string;
	};
	message?: string;
	time?: string;
};

export type Post = {
	id?: string;
	user?: {
		name?: string;
		avatar?: string;
	};
	message?: string;
	time?: string;
	type?: string;
	like?: number;
	share?: number;
	media?: {
		type?: string;
		preview?: string;
	};
	comments?: {
		id?: string;
		user?: {
			name?: string;
			avatar?: string;
		};
		time?: string;
		message?: string;
	}[];
	article?: {
		title?: string;
		subtitle?: string;
		excerpt?: string;
		media?: {
			type?: string;
			preview?: string;
		};
	};
};

export type ProfileTimeline = {
	activities?: Activity[];
	posts?: Post[];
};

export type ProfileAbout = {
	general?: {
		gender?: string;
		birthday?: string;
		locations?: string[];
		about?: string;
	};
	work?: {
		occupation?: string;
		skills?: string;
		jobs?: {
			company?: string;
			date?: string;
		}[];
	};
	contact?: {
		address?: string;
		tel?: string[];
		websites?: string[];
		emails?: string[];
	};
	groups?: {
		id?: string;
		name?: string;
		category?: string;
		members?: string;
	}[];
	friends?: {
		id?: string;
		name?: string;
		avatar?: string;
	}[];
};

export const { useGetProfilePhotosVideosQuery, useGetProfileTimelineQuery, useGetProfileAboutQuery } = ProfileApi;
