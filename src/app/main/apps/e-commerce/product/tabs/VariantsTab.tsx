import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { EcommerceProduct } from '../../ECommerceApi';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox';
import _ from '@lodash';

// Opções fixas

export const availableGender = [
	{ id: 'men', title: 'Men' },
	{ id: 'women', title: 'Women' },
	{ id: 'kids', title: 'Kids' }
];

export const availableColors = [
	{ id: '#FF4842', title: 'Red' },
	{ id: '#1890FF', title: 'Blue' },
	{ id: '#FFC0CB', title: 'Pink' },
	{ id: '#00AB55', title: 'Green' },
	{ id: '#FFC107', title: 'Yellow' },
	{ id: '#7F00FF', title: 'Violet' },
	{ id: '#000000', title: 'Black' },
	{ id: '#FFFFFF', title: 'White' },
];

export const availableSizes = [
	{ id: 'xs', title: 'Extra Small' },
	{ id: 's', title: 'Small' },
	{ id: 'm', title: 'Medium' },
	{ id: 'l', title: 'Large' },
	{ id: 'xl', title: 'Extra Large' },
	{ id: 'xxl', title: '2X Large' },
	{ id: 'xxxl', title: '3X Large' }
];

export const availableFlavors = [
	{ id: 'banana', title: 'Banana' },
	{ id: 'frutas-mistas', title: 'Frutas Mistas' },
	{ id: 'pimenta', title: 'Pimenta' },
	{ id: 'barbecue', title: 'Barbecue' },
	{ id: 'queijo', title: 'Queijo' },
	{ id: 'acai-com-banana', title: 'Açaí com Banana' },
	{ id: 'baunilha', title: 'Baunilha' },
	{ id: 'chocolate', title: 'Chocolate' },
	{ id: 'cookies', title: 'Cookies' },
	{ id: 'doce-de-leite', title: 'Doce de Leite' },
	{ id: 'leite-ninho', title: 'Leite Ninho' },
	{ id: 'morango', title: 'Morango' },
	{ id: 'maracuja', title: 'Maracujá' },
	{ id: 'milho-verde', title: 'Milho Verde' },
	{ id: 'creme-de-coco', title: 'Creme de Coco' },
	{ id: 'cappuccino', title: 'Cappuccino' },
	{ id: 'chocolate-branco', title: 'Chocolate Branco' },
	{ id: 'amendoim', title: 'Amendoim' },
	{ id: 'leite-ninho-com-avela', title: 'Leite Ninho com Avelã' },
	{ id: 'trufa-de-avela', title: 'Trufa de Avelã' },
	{ id: 'morango-com-chocolate-branco', title: 'Morango com Chocolate Branco' },
	{ id: 'fondue-de-morango', title: 'Fondue de Morango' },
	{ id: 'trufa-de-coco', title: 'Trufa de Coco' },
	{ id: 'creme-de-avela', title: 'Creme de Avelã' },
	{ id: 'belga-coconut', title: 'Belga Coconut' },
	{ id: 'chocolate-belga', title: 'Chocolate Belga' },
	{ id: 'chocolate-belga-com-coco', title: 'Chocolate Belga com Coco' },
	{ id: 'cookies-black', title: 'Cookies Black' },
	{ id: 'bombom-italiano', title: 'Bombom Italiano' },
	{ id: 'buenissimo', title: 'Buenissimo' }
];

/**
 * The variants tab.
 */
function VariantsTab() {
	const methods = useFormContext();
	const { control, formState } = methods;

	const renderOptionSelect = (options, name, label) => (
		<Grid container spacing={2}>
			<Grid item xs={12} md={12}>
				<Controller
					control={control}
					name={name}
					render={({ field: { onChange, value } }) => (
						<Autocomplete
							className="mt-8 mb-16"
							multiple
							options={options}
							disableCloseOnSelect
							getOptionLabel={(option) => option?.title}
							renderOption={(_props, option, { selected }) => (
								<li {..._props}>
									<Checkbox
										style={{ marginRight: 8 }}
										checked={selected}
									/>
									{option?.title}
								</li>
							)}
							value={Array.isArray(value) ? value.map((id) => options.find((option) => option.id === id)) : []}
							onChange={(event, newValue) => {
								onChange(newValue?.map((item) => item?.id));
							}}
							fullWidth
							renderInput={(params) => (
								<TextField
									{...params}
									label={label}
									placeholder={`Select ${label}`}
								/>
							)}
						/>
					)}
				/>
			</Grid>
		</Grid>
	);

	return (
		<div>
			{renderOptionSelect(availableGender, 'gender', 'Gender')}
			{renderOptionSelect(availableColors, 'colors', 'Colors')}
			{renderOptionSelect(availableSizes, 'sizes', 'Sizes')}
			{renderOptionSelect(availableFlavors, 'flavors', 'Flavors')}
		</div>
	);
}

export default VariantsTab;
