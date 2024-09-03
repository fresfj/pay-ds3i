import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Image } from '@fuse/components/image';

/**
 * The single pricing card component.
 */
function SinglePricingCard() {
	return (
		<Paper className="flex max-w-sm flex-col overflow-hidden lg:max-w-xl lg:flex-row">
			<div className="p-24 sm:p-32 lg:p-40">
				<Typography className="text-3xl font-bold">Escaneie o QR Code</Typography>

				<Typography
					className="mt-8 leading-relaxed"
					color="text.secondary"
				>
					Fornecemos um QR Code exclusivo para você. <br />
					Basta escanear e começar a indicar.< br />
					Envie uma Mensagem para Seus Contatos com o QR Code, sua mensagem de indicação já estará pronta para ser enviada.
				</Typography>

				<div className="mt-40 flex items-center">
					<Typography
						className="font-medium"
						color="text.secondary"
					>
						Ganhe Dinheiro
					</Typography>
					<Divider className="ml-8 flex-auto" />
				</div>

				<div className="mt-48 grid grid-cols-5 gap-y-16 lg:grid-cols-5">
					<div className="flex items-center justify-center">
						<Typography className="ml-8">Você indica</Typography>
					</div>
					<div className="flex items-center justify-center">
						<FuseSvgIcon
							size={20}
							color="secondary"
						>
							heroicons-outline:chevron-double-right
						</FuseSvgIcon>
					</div>
					<div className="flex items-center justify-center">
						<Typography className="ml-8">Sua Indicação Compra</Typography>
					</div>

					<div className="flex items-center justify-center">
						<FuseSvgIcon
							size={20}
							color="secondary"
						>
							heroicons-outline:chevron-double-right
						</FuseSvgIcon>

					</div>
					<div className="flex items-center justify-center">

						<Typography  className="ml-8">Você Ganha</Typography>
					</div>

				</div>
			</div>

			<Box
				sx={{ backgroundColor: 'primary.dark' }}
				className="flex flex-col items-center p-8 lg:min-w-320 lg:px-40 lg:py-48 rounded-r"
			>
				<Typography
					className="text-center font-medium mb-8"
					color="text.secondary"
				>
					<br />
					Atualize em caso de Erro

				</Typography>
				<div className="flex items-center whitespace-nowrap">
					<Image src='/assets/images/etc/qrcode.svg' width={200} height={200} className="mb-16" />

				</div>

				<Button
					variant="contained"
					color="secondary"
					className="mt-32 w-full lg:mt-auto"
				>
					Atualizar
				</Button>
			</Box>
		</Paper>
	);
}

export default SinglePricingCard;
