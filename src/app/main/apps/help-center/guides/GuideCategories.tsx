import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import _ from '@lodash';
import { useMemo } from 'react';
import GuideListMenu from './GuideListMenu';
import { useGetHelpCenterGuidesQuery, useGetHelpCenterGuideCategoriesQuery } from '../HelpCenterApi';
import { useTranslation } from 'react-i18next'

/**
 * The guide categories.
 */
function GuideCategories() {
	const navigate = useNavigate();
	const { t } = useTranslation('helpCenterApp');
	const { data: guides } = useGetHelpCenterGuidesQuery();
	const { data: categories } = useGetHelpCenterGuideCategoriesQuery();

	const groupedGuides = useMemo(() => {
		return _.map(categories, (category) => ({
			...category,
			guides: _.filter(guides, { categoryId: category.id })
		}));
	}, [categories, guides]);

	const handleGoBack = () => {
		navigate(-1);
	};

	return (
		<div className="flex flex-col items-center p-24 sm:p-40 container">
			<div className="flex flex-col w-full max-w-4xl">
				<div className="sm:mt-32">
					<Button
						onClick={handleGoBack}
						color="secondary"
						startIcon={<FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>}
					>
						{t('BACK_TO_HELP_CENTER')}
					</Button>
				</div>
				<div className="mt-8 text-4xl sm:text-7xl font-extrabold tracking-tight leading-tight">
					{t('TITLE_GUIDE')}
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 grid-flow-row gap-y-48 sm:gap-x-16 mt-32 sm:mt-48">
					{groupedGuides?.map((category) => (
						<div key={category.id}>
							<Typography
								component={Link}
								to={`${category.slug}`}
								className="mb-4 text-2xl font-semibold"
								role="button"
							>
								{category.title}
							</Typography>

							<GuideListMenu
								list={category.guides}
								categorySlug={category.slug}
								maxItems={4}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default GuideCategories;
