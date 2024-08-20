import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';
/* eslint-disable import/no-webpack-loader-syntax, import/extensions, global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

/**
 * Theme Layouts Doc
 * This document provides information on how to use theme layouts.
 */
function ThemeShemesDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-40 font-700"
			>
				Theme Schemes
			</Typography>

			<Typography
				className="mb-16"
				component="p"
			>
				The Fuse React uses material-ui's theming by default. You can create theme color schemes with defining
				theme configuration objects.
			</Typography>

			<Typography
				className="text-20 mt-20 mb-10 font-700"
				variant="h5"
			>
				Configuration
			</Typography>

			<Typography
				className="mb-16"
				component="p"
			>
				For the configuration options checkout{' '}
				<a
					href="https://mui.com/customization/theming"
					target="_blank"
					rel="noopener noreferrer"
				>
					Material UI's theme configuration options.
				</a>
			</Typography>
			<Typography
				className="mb-16"
				component="p"
			>
				Theme configurations are located at <code>app/configs/themesConfig.ts</code> file.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{`
				/**
				* The themesConfig object is a configuration object for the color themes of the Fuse application.
				*/
				export const themesConfig: FuseThemesType = {
					default: {
							palette: {
							mode: 'light',
							divider: '#e2e8f0',
							text: lightPaletteText,
							common: {
							black: 'rgb(17, 24, 39)',
							white: 'rgb(255, 255, 255)'
						},
							primary: {
							light: '#64748b',
							main: '#1e293b',
							dark: '#0f172a',
							contrastText: darkPaletteText.primary
						},
							secondary: {
							light: '#818cf8',
							main: '#4f46e5',
							dark: '#3730a3',
							contrastText: darkPaletteText.primary
						},
							background: {
							paper: '#FFFFFF',
							default: '#f1f5f9'
						},
							error: {
							light: '#ffcdd2',
							main: '#f44336',
							dark: '#b71c1c',
							contrastText: darkPaletteText.primary
						}
					}
				}`}
			</FuseHighlight>
		</>
	);
}

export default ThemeShemesDoc;
