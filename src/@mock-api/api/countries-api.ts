import mockApi from '../mock-api.json';
import { Country } from '../../app/main/apps/contacts/ContactsApi';
import ExtendedMockAdapter from '../ExtendedMockAdapter';

const countriesApi = mockApi.components.examples.countries.value as Country[];

export const countriesApiMocks = (mock: ExtendedMockAdapter) => {
	mock.onGet('/countries').reply(() => {
		return [200, countriesApi];
	});
};
