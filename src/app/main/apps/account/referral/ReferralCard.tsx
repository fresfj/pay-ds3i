import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Iconify } from '@fuse/components/iconify';

/**
 * The Referral card component.
 */
function ReferralCard() {


	return (
		<Card sx={{ display: { md: 'flex', sx: 'none' }, width: '100vw', mx: 4 }}>
			<CardMedia
				component="img"
				sx={{ width: { md: 500, sx: '100vw' } }}
				image="assets/images/etc/quemindica.png"
				alt="Live from space album cover"
			/>
			<Box sx={{ display: 'flex', flexDirection: 'column', p: 4 }}>
				<CardContent sx={{ flex: '1 0 auto' }}>
					<Typography component="div" variant="h4" className='font-semibold'>
						Comece a participar do Indique e Ganhe
					</Typography>
				</CardContent>
				<CardContent sx={{ flex: '2 0 auto' }}>
					<ol className="list-decimal text-xl ">
						<li className='flex gap-14 mb-8 items-center'>
							<span className="bg-light-green-A400 flex min-w-36 min-h-36 items-center justify-center rounded-full font-bold">1</span>
							Compartilhe o seu link
						</li>
						<li className='flex gap-14 mb-8 items-center'>
							<span className="bg-light-green-A400 flex min-w-36 min-h-36 items-center justify-center rounded-full font-bold">2</span>
							Certifique-se de que a venda foi feita por meio dele</li>
						<li className='flex gap-14 items-center'>
							<span className="bg-light-green-A400 flex min-w-36 min-h-36 items-center justify-center rounded-full font-bold">3</span>
							Você receberá a confirmação após a primeira venda</li>
					</ol>
				</CardContent>
				<Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
					<Button
						className="mx-8 whitespace-nowrap text-xl"
						variant="contained"
						color="secondary"
						endIcon={<Iconify icon="solar:copy-bold-duotone" />}
					>
						<span className="hidden sm:flex mx-8">Seu link</span>
					</Button>
					<Button
						className="mx-8 whitespace-nowrap text-xl"
						variant="outlined"
						color="secondary"
						endIcon={<Iconify icon="solar:link-minimalistic-2-line-duotone" />}
					>
						<span className="hidden sm:flex mx-8">Saiba mais</span>
					</Button>
				</Box>
			</Box>
		</Card>
	);
}

export default ReferralCard;
