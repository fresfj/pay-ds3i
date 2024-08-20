import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CourseInfo from '../CourseInfo';
import CourseProgress from '../CourseProgress';
import { Offer } from '../AcademyApi';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';


const StyledCard = styled(Card)(({ theme }) => ({
	boxShadow: theme.shadows[2],
	borderRadius: theme.shape.borderRadius,
	transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s',
	'&:hover': {
		backgroundColor: theme.palette.action.hover,
		borderColor: theme.palette.primary.main,
		transform: 'scale(1.05)',
		boxShadow: theme.shadows[6],
	},
	cursor: 'pointer',
}));

const StyledBox = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	boxShadow: theme.shadows[2],
	borderRadius: theme.shape.borderRadius,
	height: '224px',
	textDecoration: 'none',
	color: 'inherit',
	transition: 'all 0.3s ease',
	'&:hover': {
		backgroundColor: theme.palette.action.hover,
		borderColor: theme.palette.primary.main,
		boxShadow: theme.shadows[6],
	},
}));

type OfferCardProps = {
	offer: Offer;
	loading?: boolean;
}
/**
 * The OfferCard component.
 */
function OfferCard(props: OfferCardProps) {
	const { offer, loading = false } = props;
	const navigate = useNavigate();

	const handleCardClick = () => {
		const link = `/apps/academy/offers/${offer?.establishmentId ? `${offer.establishmentId}/cashback` : offer.id}`
		console.log(link)
		navigate(link, { replace: true });
	}

	return (
		<StyledCard onClick={handleCardClick} className="flex flex-col shadow-md rounded-xl h-224">
			<CardContent className="relative flex flex-col flex-auto">
				{
					loading ? (
						<Skeleton animation="wave" variant="rectangular" width={68} height={68} />
					) : (
						offer?.establishmentImage?.image ? (
							<Avatar
								className='object-cover object-center h-68 w-68 mb-12 rounded-lg'
								alt={offer.name}
								src={`${offer.establishmentImage.image}`}
							/>
						) : (
							<Avatar
								className='object-cover object-center h-68 w-68 mb-12'
								alt={offer.name}
								src={`https://clubecerto.com.br/brand/${offer.establishmentId}.png`}
							/>
						)
					)
				}

				{/* loading ? (
						<Skeleton animation="wave" height={10} width="40%" />
					) : Object.entries(offer.category).map(([key, text]) => text) */}

				<Typography className="text-16 font-medium">{offer.name}</Typography>
			</CardContent>
			<CardActions
				className="uppercase items-center justify-center py-16 px-24 font-bold"
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? lighten(theme.palette.background.default, 0.4)
							: lighten(theme.palette.background.default, 0.03)
				}}
			>
				{offer?.visible ?
					`Até ${offer.max}% de volta`
					: `${offer.discount} de desconto`}
			</CardActions>
		</StyledCard>
	);
}

export default OfferCard;
