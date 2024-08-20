import Typography from '@mui/material/Typography';
import ChangelogCard from './ChangelogCard';
import changelogData from './ChangelogData';

/**
 * The changelog doc page.
 * Changelog records all notable changes made to Fuse React.
 */
function ChangelogDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-40 font-700"
			>
				Changelog
			</Typography>

			{changelogData.map((item) => (
				<ChangelogCard
					className="shrink-0 mb-24 w-full"
					key={item.version}
					{...item}
				/>
			))}
		</>
	);
}

export const fuseReactLatestVersion = changelogData[0].version;

export default ChangelogDoc;
