import Typography from '@mui/material/Typography';
import FuseHighlight from '@fuse/core/FuseHighlight';

/**
 * Directory Structure Doc
 * This document explains the directory structure and naming conventions used in Fuse React.
 */
function DirectoryStructureDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-40 font-700"
			>
				Directory Structure and Naming Conventions
			</Typography>
			<Typography
				className="mb-16"
				component="p"
			>
				This document explains the directory structure and naming conventions used in Fuse React. Fuse React is
				a modular approach based on route settings determined from config files. The directory structure and
				naming conventions are designed to make it easy to navigate and understand the codebase.
			</Typography>
			<FuseHighlight
				component="pre"
				className="language-jsx my-24"
			>
				{`
				├── contacts
				│   ├── ContactListItem.tsx
				│   ├── ContactsApi.ts
				│   ├── ContactsApp.tsx
				│   ├── ContactsAppConfig.tsx
				│   ├── ContactsHeader.tsx
				│   ├── ContactsList.tsx
				│   ├── ContactsSidebarContent.tsx
				│   ├── contact
				│   │   ├── ContactForm.tsx
				│   │   ├── ContactView.tsx
				│   │   ├── email-selector
				│   │   │   ├── ContactEmailSelector.tsx
				│   │   │   └── EmailInput.tsx
				│   │   └── phone-number-selector
				│   │       ├── CountryCodeSelector.tsx
				│   │       ├── PhoneNumberInput.tsx
				│   │       └── PhoneNumberSelector.tsx
				│   ├── models
				│   │   ├── ContactModel.ts
				│   │   ├── CountryModel.ts
				│   │   └── TagModel.ts
				│   └── store
				│       ├── index.ts
				│       └── searchTextSlice.ts`}
			</FuseHighlight>
			<Typography
				className="mb-16"
				component="p"
			>
				The directory structure of Fuse React is organized by feature, with each feature having its own
				directory. Within each feature directory, there are subdirectories for components, models, sidebars,
				store.
			</Typography>
			<Typography
				className="mb-16"
				component="p"
			>
				<strong>Directories:</strong> named in lowercase and use hyphens to separate words. Example: `chat`,
				`contacts`.
			</Typography>
			<Typography
				className="mb-16"
				component="p"
			>
				<strong>Files:</strong> named in PascalCase and use the name of the component, type, or model they
				represent. Example: ` ContactApp.tsx`.
			</Typography>
			<Typography
				className="mb-16"
				component="p"
			>
				<strong>Components:</strong> named in PascalCase and use the name of the component they represent.
				Example: ` ContactApp.tsx`, ` ContactForm.tsx`.
			</Typography>
			<Typography
				className="mb-16"
				component="p"
			>
				<strong>Models:</strong> named in PascalCase and use the name of the model they represent. Example:
				`ContactModel.tsx`.
			</Typography>
			<Typography
				className="mb-16"
				component="p"
			>
				<strong>Sidebars/Tabs/Sections/Dialogs etc:</strong> For example Sidebar named in PascalCase and use the
				name of the sidebar they represent. The `sidebars` folder is used to store components that represent
				sidebars in the application. Other similar types of components, such as tabs, sections, or dialogs, may
				have their own folders with similar naming conventions. Example: `ContactSidebar.tsx`,
				`MainSidebar.tsx`.
			</Typography>
			<Typography
				className="mb-16"
				component="p"
			>
				<strong>Store files:</strong> named in camelCase and use the name of the slice they represent. Example:
				`contactListSlice.tsx`, `userSlice.tsx`.
			</Typography>
			<Typography
				className="mb-16"
				component="p"
			>
				<strong>Api files:</strong> have api endpoints and named in PascalCase. RTK Query is used for API calls.
				Example: `ContaactsApi.ts`
			</Typography>
			<Typography
				className="mb-16"
				component="p"
			>
				<strong>Config files:</strong> named in PascalCase and use the name of the feature they represent,
				followed by `Config`. Example: ` ContactAppConfig.tsx`.
			</Typography>
			<Typography
				className="mb-16"
				component="p"
			>
				By following these conventions, developers can quickly find the files and components they need and
				understand their purpose. This makes it easier to navigate and maintain the codebase, especially as the
				project grows in size and complexity.
			</Typography>
			<Typography
				className="mb-16"
				component="p"
			>
				Fuse React's directory structure might look overwhelming and intimidating at first, but following this
				page and giving a bit time to understand it before jumping right into code will help immensely.
			</Typography>
		</>
	);
}

export default DirectoryStructureDoc;
