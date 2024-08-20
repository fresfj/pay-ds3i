import FuseExample from '@fuse/core/FuseExample';
                   import FuseHighlight from '@fuse/core/FuseHighlight';
                   import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
                   import Button from '@mui/material/Button';
                   import Icon from '@mui/material/Icon';
                   import Typography from '@mui/material/Typography';
				   import DocumentationPageBreadcrumb from '../../DocumentationPageBreadcrumb';
                   import BasicChipsComponent from '../components/chips/BasicChips';
import BasicChipsRaw from '../components/chips/BasicChips.tsx?raw';
import ClickableChipsComponent from '../components/chips/ClickableChips';
import ClickableChipsRaw from '../components/chips/ClickableChips.tsx?raw';
import DeletableChipsComponent from '../components/chips/DeletableChips';
import DeletableChipsRaw from '../components/chips/DeletableChips.tsx?raw';
import ClickableAndDeletableChipsComponent from '../components/chips/ClickableAndDeletableChips';
import ClickableAndDeletableChipsRaw from '../components/chips/ClickableAndDeletableChips.tsx?raw';
import ClickableLinkChipsComponent from '../components/chips/ClickableLinkChips';
import ClickableLinkChipsRaw from '../components/chips/ClickableLinkChips.tsx?raw';
import CustomDeleteIconChipsComponent from '../components/chips/CustomDeleteIconChips';
import CustomDeleteIconChipsRaw from '../components/chips/CustomDeleteIconChips.tsx?raw';
import AvatarChipsComponent from '../components/chips/AvatarChips';
import AvatarChipsRaw from '../components/chips/AvatarChips.tsx?raw';
import IconChipsComponent from '../components/chips/IconChips';
import IconChipsRaw from '../components/chips/IconChips.tsx?raw';
import ColorChipsComponent from '../components/chips/ColorChips';
import ColorChipsRaw from '../components/chips/ColorChips.tsx?raw';
import SizesChipsComponent from '../components/chips/SizesChips';
import SizesChipsRaw from '../components/chips/SizesChips.tsx?raw';
import MultilineChipsComponent from '../components/chips/MultilineChips';
import MultilineChipsRaw from '../components/chips/MultilineChips.tsx?raw';
import ChipsArrayComponent from '../components/chips/ChipsArray';
import ChipsArrayRaw from '../components/chips/ChipsArray.tsx?raw';
                   
                   function ChipsDoc(props) {
                     return (
                       
                <>
					<div className="flex flex-1 sm:flex-row flex-col items-start justify-center grow-0 md:items-center md:justify-end md:space-between">
					  <DocumentationPageBreadcrumb />
					  <Button 
							className="normal-case"
							variant="contained"
                            color="secondary"
							component="a" 
							href="https://mui.com/components/chips" 
							target="_blank"
							role="button"
							size="small"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:external-link</FuseSvgIcon>}
							>
							Reference
						</Button>
					</div>
                     <Typography className="text-32 my-16 font-700" component="h1">Chip</Typography>
<Typography className="description">Chips are compact elements that represent an input, attribute, or action.</Typography>

<Typography className="text-14 mb-32" component="div">Chips allow users to enter information, make selections, filter content, or trigger actions.</Typography>
<Typography className="text-14 mb-32" component="div">While included here as a standalone component, the most common use will
be in some form of input, so some of the behavior demonstrated here is
not shown in context.</Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Basic chip</Typography>
<Typography className="text-14 mb-32" component="div">The <code>{`Chip`}</code> component supports outlined and filled styling.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="BasicChips.js"
                    className="my-16"
                    iframe={false}
                    component={BasicChipsComponent} 
                    raw={BasicChipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Chip actions</Typography>
<Typography className="text-14 mb-32" component="div">You can use the following actions.</Typography>
<ul className="space-y-16">
<li>Chips with the <code>{`onClick`}</code> prop defined change appearance on focus, hover, and click.</li>
<li>Chips with the <code>{`onDelete`}</code> prop defined will display a delete icon which changes appearance on hover.</li>
</ul>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Clickable</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ClickableChips.js"
                    className="my-16"
                    iframe={false}
                    component={ClickableChipsComponent} 
                    raw={ClickableChipsRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Deletable</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="DeletableChips.js"
                    className="my-16"
                    iframe={false}
                    component={DeletableChipsComponent} 
                    raw={DeletableChipsRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Clickable and deletable</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ClickableAndDeletableChips.js"
                    className="my-16"
                    iframe={false}
                    component={ClickableAndDeletableChipsComponent} 
                    raw={ClickableAndDeletableChipsRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Clickable link</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ClickableLinkChips.js"
                    className="my-16"
                    iframe={false}
                    component={ClickableLinkChipsComponent} 
                    raw={ClickableLinkChipsRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Custom delete icon</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="CustomDeleteIconChips.js"
                    className="my-16"
                    iframe={false}
                    component={CustomDeleteIconChipsComponent} 
                    raw={CustomDeleteIconChipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Chip adornments</Typography>
<Typography className="text-14 mb-32" component="div">You can add ornaments to the beginning of the component.</Typography>
<Typography className="text-14 mb-32" component="div">Use the <code>{`avatar`}</code> prop to add an avatar or use the <code>{`icon`}</code> prop to add an icon.</Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Avatar chip</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="AvatarChips.js"
                    className="my-16"
                    iframe={false}
                    component={AvatarChipsComponent} 
                    raw={AvatarChipsRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Icon chip</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="IconChips.js"
                    className="my-16"
                    iframe={false}
                    component={IconChipsComponent} 
                    raw={IconChipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Color chip</Typography>
<Typography className="text-14 mb-32" component="div">You can use the <code>{`color`}</code> prop to define a color from theme palette.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ColorChips.js"
                    className="my-16"
                    iframe={false}
                    component={ColorChipsComponent} 
                    raw={ColorChipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Sizes chip</Typography>
<Typography className="text-14 mb-32" component="div">You can use the <code>{`size`}</code> prop to define a small Chip.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="SizesChips.js"
                    className="my-16"
                    iframe={false}
                    component={SizesChipsComponent} 
                    raw={SizesChipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Multiline chip</Typography>
<Typography className="text-14 mb-32" component="div">By default, Chips displays labels only in a single line.
To have them support multiline content, use the <code>{`sx`}</code> prop to add <code>{`height:auto`}</code> to the Chip component, and <code>{`whiteSpace: normal`}</code> to the <code>{`label`}</code> styles.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="MultilineChips.js"
                    className="my-16"
                    iframe={false}
                    component={MultilineChipsComponent} 
                    raw={MultilineChipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Chip array</Typography>
<Typography className="text-14 mb-32" component="div">An example of rendering multiple chips from an array of values.
Deleting a chip removes it from the array. Note that since no
<code>{`onClick`}</code> prop is defined, the <code>{`Chip`}</code> can be focused, but does not
gain depth while clicked or touched.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ChipsArray.js"
                    className="my-16"
                    iframe={false}
                    component={ChipsArrayComponent} 
                    raw={ChipsArrayRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Chip playground</Typography>

                </>
    
                     );
                   }
                   
                   export default ChipsDoc;
                   