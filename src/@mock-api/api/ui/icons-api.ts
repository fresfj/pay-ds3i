import mockApi from '../../mock-api.json';
import ExtendedMockAdapter from '../../ExtendedMockAdapter';

const heroiconsApi = mockApi.components.examples.icons_heroicons.value;
const materialIconsApi = mockApi.components.examples.icons_material.value;
const featherIconsApi = mockApi.components.examples.icons_feather.value;

export const iconsApiMocks = (mock: ExtendedMockAdapter) => {
	mock.onGet('/ui/icons/heroicons').reply(() => {
		return [200, heroiconsApi];
	});

	mock.onGet('/ui/icons/material').reply(() => {
		return [200, materialIconsApi];
	});

	mock.onGet('/ui/icons/feather').reply(() => {
		return [200, featherIconsApi];
	});
};
