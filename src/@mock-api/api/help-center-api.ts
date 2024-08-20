import _ from '@lodash';
import mockApi from '../mock-api.json';
import { FaqCategory, GuideCategory } from '../../app/main/apps/help-center/HelpCenterApi';
import ExtendedMockAdapter, { Params } from '../ExtendedMockAdapter';

const faqsDB = mockApi.components.examples.help_center_faqs.value;
const faqCategoriesDB = mockApi.components.examples.help_center_faq_categories.value;

const guidesDB = mockApi.components.examples.help_center_guides.value;
const guideCategoriesDB = mockApi.components.examples.help_center_guide_categories.value;
const guideContent = mockApi.components.examples.help_center_guide_content.value;

export const helpCenterApiMocks = (mock: ExtendedMockAdapter) => {
	mock.onGet('/help-center/faqs').reply(() => {
		return [200, faqsDB];
	});

	mock.onGet('/help-center/faqs/categories').reply(() => {
		return [200, faqCategoriesDB];
	});

	mock.onGet('/help-center/faqs/:categorySlug').reply((config) => {
		const { categorySlug } = config.params as Params;

		const category = _.find(faqCategoriesDB, { slug: categorySlug }) as FaqCategory;

		return [200, _.filter(faqsDB, { categoryId: category.id })];
	});

	mock.onGet('/help-center/guides').reply(() => {
		return [200, guidesDB];
	});

	mock.onGet('/help-center/guides/categories').reply(() => {
		return [200, guideCategoriesDB];
	});

	mock.onGet('/help-center/guides/:categorySlug').reply((config) => {
		const { categorySlug } = config.params as Params;

		const category = _.find(guideCategoriesDB, { slug: categorySlug }) as GuideCategory;

		return [200, _.filter(guidesDB, { categoryId: category.id })];
	});

	mock.onGet('/help-center/guides/:categorySlug/:guideSlug').reply((config) => {
		// eslint-disable-next-line unused-imports/no-unused-vars
		const { categorySlug, guideSlug } = config.params as Params;
		return [
			200,
			{
				..._.find(guidesDB, { slug: guideSlug }),
				content: guideContent
			}
		];
	});
};
