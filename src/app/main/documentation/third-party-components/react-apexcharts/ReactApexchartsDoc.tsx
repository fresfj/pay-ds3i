import FuseExample from '@fuse/core/FuseExample';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import AreaComponent from './examples/Area';
import AreaRaw from './examples/Area.tsx?raw';

import BarComponent from './examples/Bar';
import BarRaw from './examples/Bar.tsx?raw';

import ColumnComponent from './examples/Column';
import ColumnRaw from './examples/Column.tsx?raw';

import DonutComponent from './examples/Donut';
import DonutRaw from './examples/Donut.tsx?raw';

import LineComponent from './examples/Line';
import LineRaw from './examples/Line.tsx?raw';

import RadialBarComponent from './examples/RadialBar';
import RadialBarRaw from './examples/RadialBar.tsx?raw';

/**
 * GoogleMapReact Doc
 * This document provides information on how to use GoogleMapReact.
 */
function ReactApexchartsDoc() {
	return (
		<>
			<div className="flex w-full items-center justify-between mb-24">
				<Typography variant="h4">react-apexcharts</Typography>
				<Button
					variant="contained"
					color="secondary"
					component="a"
					href="https://github.com/apexcharts/react-apexcharts"
					target="_blank"
					role="button"
					startIcon={<FuseSvgIcon>heroicons-outline:external-link</FuseSvgIcon>}
				>
					Reference
				</Button>
			</div>

			<Typography
				className="mb-16"
				component="p"
			>
				React.js wrapper for ApexCharts to build interactive visualizations in react.
			</Typography>

			<hr />

			<Typography
				className="text-32 mt-32 mb-8"
				component="h2"
			>
				Example Usages
			</Typography>

			<FuseExample
				className="mb-64"
				component={AreaComponent}
				raw={AreaRaw}
			/>

			<FuseExample
				className="mb-64"
				component={BarComponent}
				raw={BarRaw}
			/>

			<FuseExample
				className="mb-64"
				component={ColumnComponent}
				raw={ColumnRaw}
			/>

			<FuseExample
				className="mb-64"
				component={DonutComponent}
				raw={DonutRaw}
			/>

			<FuseExample
				className="mb-64"
				component={LineComponent}
				raw={LineRaw}
			/>

			<FuseExample
				className="mb-64"
				component={RadialBarComponent}
				raw={RadialBarRaw}
			/>

			<Typography
				className="text-32 mt-32 mb-8"
				component="h2"
			>
				Demos
			</Typography>

			<ul>
				<li className="mb-8">
					<Link to="/dashboards/analytics">Analytics Dashboard</Link>
				</li>
				<li className="mb-8">
					<Link to="/dashboards/project">Project Dashboard</Link>
				</li>
			</ul>
		</>
	);
}

export default ReactApexchartsDoc;
