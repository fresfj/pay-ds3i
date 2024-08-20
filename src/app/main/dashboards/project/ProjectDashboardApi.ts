import { apiService as api } from 'app/store/apiService';

export const addTagTypes = ['project_dashboard_widgets', 'project_dashboard_projects'] as const;
const ProjectDashboardApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getProjectDashboardWidgets: build.query<
				GetProjectDashboardWidgetsApiResponse,
				GetProjectDashboardWidgetsApiArg
			>({
				query: () => ({ url: `/mock-api/dashboards/project/widgets` }),
				providesTags: ['project_dashboard_widgets']
			}),
			getProjectDashboardProjects: build.query<
				GetProjectDashboardProjectsApiResponse,
				GetProjectDashboardProjectsApiArg
			>({
				query: () => ({ url: `/mock-api/dashboards/project/projects` }),
				providesTags: ['project_dashboard_projects']
			})
		}),
		overrideExisting: false
	});
export default ProjectDashboardApi;

export type GetProjectDashboardWidgetsApiResponse = /** status 200 OK */ object;
export type GetProjectDashboardWidgetsApiArg = void;

export type GetProjectDashboardProjectsApiResponse = /** status 200 OK */ ProjectType[];
export type GetProjectDashboardProjectsApiArg = void;

export type ProjectType = {
	id: number;
	name: string;
};

export const { useGetProjectDashboardWidgetsQuery, useGetProjectDashboardProjectsQuery } = ProjectDashboardApi;

export type ProjectDashboardApiType = {
	[ProjectDashboardApi.reducerPath]: ReturnType<typeof ProjectDashboardApi.reducer>;
};

export const selectWidget =
	<T>(id: string) =>
	(state: ProjectDashboardApiType) => {
		const widgets = ProjectDashboardApi.endpoints.getProjectDashboardWidgets.select()(state)?.data;
		return widgets?.[id] as T;
	};
