import mockApi from '../../mock-api.json';
import ExtendedMockAdapter from '../../ExtendedMockAdapter';

const widgets = mockApi.components.examples.project_dashboard_widgets.value;
const projects = mockApi.components.examples.project_dashboard_projects.value;

export const projectDashboardApiMocks = (mock: ExtendedMockAdapter) => {
	mock.onGet('/dashboards/project/widgets').reply(() => {
		return [200, widgets];
	});

	mock.onGet('/dashboards/project/projects').reply(() => {
		return [200, projects];
	});
};
