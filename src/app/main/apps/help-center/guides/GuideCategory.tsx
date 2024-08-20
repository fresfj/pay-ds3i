import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSelector } from 'react-redux';
import GuideListMenu from './GuideListMenu';
import { selectGuideCategoryBySlug, useGetHelpCenterGuidesByCategoryQuery } from '../HelpCenterApi';

/**
 * The guide category.
 */
function GuideCategory() {
	const navigate = useNavigate();
	const routeParams = useParams();
	const { categorySlug } = routeParams;

	const { data: guides } = useGetHelpCenterGuidesByCategoryQuery({
		categorySlug
	});
	const category = useSelector(selectGuideCategoryBySlug(categorySlug));

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
						Back to Guides & Resources
					</Button>
				</div>
				<div className="mt-8 text-4xl sm:text-7xl font-extrabold tracking-tight leading-tight">
					{category?.title}
				</div>
				<div className="mt-32 sm:mt-48">
					<GuideListMenu list={guides} />
				</div>
			</div>
		</div>
	);
}

export default GuideCategory;
