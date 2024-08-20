import mockApi from '../../mock-api.json';
import ExtendedMockAdapter from '../../ExtendedMockAdapter';

const widgets = mockApi.components.examples.crypto_dashboard_widgets.value;

export const cryptoDashboardApiMocks = (mock: ExtendedMockAdapter) => {
	mock.onGet('/dashboards/crypto/widgets').reply(() => {
		return [200, widgets];
	});
};
