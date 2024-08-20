import FuseExample from '@fuse/core/FuseExample';
                   import FuseHighlight from '@fuse/core/FuseHighlight';
                   import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
                   import Button from '@mui/material/Button';
                   import Icon from '@mui/material/Icon';
                   import Typography from '@mui/material/Typography';
				   import DocumentationPageBreadcrumb from '../../DocumentationPageBreadcrumb';
                   import BasicSpeedDialComponent from '../components/speed-dial/BasicSpeedDial';
import BasicSpeedDialRaw from '../components/speed-dial/BasicSpeedDial.tsx?raw';
import PlaygroundSpeedDialComponent from '../components/speed-dial/PlaygroundSpeedDial';
import PlaygroundSpeedDialRaw from '../components/speed-dial/PlaygroundSpeedDial.tsx?raw';
import ControlledOpenSpeedDialComponent from '../components/speed-dial/ControlledOpenSpeedDial';
import ControlledOpenSpeedDialRaw from '../components/speed-dial/ControlledOpenSpeedDial.tsx?raw';
import OpenIconSpeedDialComponent from '../components/speed-dial/OpenIconSpeedDial';
import OpenIconSpeedDialRaw from '../components/speed-dial/OpenIconSpeedDial.tsx?raw';
import SpeedDialTooltipOpenComponent from '../components/speed-dial/SpeedDialTooltipOpen';
import SpeedDialTooltipOpenRaw from '../components/speed-dial/SpeedDialTooltipOpen.tsx?raw';
                   
                   function SpeedDialDoc(props) {
                     return (
                       
                <>
					<div className="flex flex-1 sm:flex-row flex-col items-start justify-center grow-0 md:items-center md:justify-end md:space-between">
					  <DocumentationPageBreadcrumb />
					  <Button 
							className="normal-case"
							variant="contained"
                            color="secondary"
							component="a" 
							href="https://mui.com/components/speed-dial" 
							target="_blank"
							role="button"
							size="small"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:external-link</FuseSvgIcon>}
							>
							Reference
						</Button>
					</div>
                     <Typography className="text-32 my-16 font-700" component="h1">Speed Dial</Typography>
<Typography className="description">When pressed, a floating action button can display three to six related actions in the form of a Speed Dial.</Typography>

<Typography className="text-14 mb-32" component="div">If more than six actions are needed, something other than a FAB should be used to present them.</Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Basic speed dial</Typography>
<Typography className="text-14 mb-32" component="div">The floating action button can display related actions.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="BasicSpeedDial.js"
                    className="my-16"
                    iframe={false}
                    component={BasicSpeedDialComponent} 
                    raw={BasicSpeedDialRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Playground</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="PlaygroundSpeedDial.js"
                    className="my-16"
                    iframe={false}
                    component={PlaygroundSpeedDialComponent} 
                    raw={PlaygroundSpeedDialRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Controlled speed dial</Typography>
<Typography className="text-14 mb-32" component="div">The open state of the component can be controlled with the <code>{`open`}</code>/<code>{`onOpen`}</code>/<code>{`onClose`}</code> props.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ControlledOpenSpeedDial.js"
                    className="my-16"
                    iframe={false}
                    component={ControlledOpenSpeedDialComponent} 
                    raw={ControlledOpenSpeedDialRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Custom close icon</Typography>
<Typography className="text-14 mb-32" component="div">You can provide an alternate icon for the closed and open states using the <code>{`icon`}</code> and <code>{`openIcon`}</code> props
of the <code>{`SpeedDialIcon`}</code> component.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="OpenIconSpeedDial.js"
                    className="my-16"
                    iframe={false}
                    component={OpenIconSpeedDialComponent} 
                    raw={OpenIconSpeedDialRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Persistent action tooltips</Typography>
<Typography className="text-14 mb-32" component="div">The SpeedDialActions tooltips can be displayed persistently so that users don&#39;t have to long-press to see the tooltip on touch devices.</Typography>
<Typography className="text-14 mb-32" component="div">It is enabled here across all devices for demo purposes, but in production it could use the <code>{`isTouch`}</code> logic to conditionally set the prop.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="SpeedDialTooltipOpen.js"
                    className="my-16"
                    iframe={false}
                    component={SpeedDialTooltipOpenComponent} 
                    raw={SpeedDialTooltipOpenRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Accessibility</Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">ARIA</Typography>
<Typography className="text-14 mt-12 mb-10" component="h4">Required</Typography>
<ul className="space-y-16">
<li>You should provide an <code>{`ariaLabel`}</code> for the speed dial component.</li>
<li>You should provide a <code>{`tooltipTitle`}</code> for each speed dial action.</li>
</ul>
<Typography className="text-14 mt-12 mb-10" component="h4">Provided</Typography>
<ul className="space-y-16">
<li>The Fab has <code>{`aria-haspopup`}</code>, <code>{`aria-expanded`}</code> and <code>{`aria-controls`}</code> attributes.</li>
<li>The speed dial actions container has <code>{`role="menu"`}</code> and <code>{`aria-orientation`}</code> set according to the direction.</li>
<li>The speed dial actions have <code>{`role="menuitem"`}</code>, and an <code>{`aria-describedby`}</code> attribute that references the associated tooltip.</li>
</ul>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Keyboard</Typography>
<ul className="space-y-16">
<li>The speed dial opens on focus.</li>
<li>The Space and Enter keys trigger the selected speed dial action, and toggle the speed dial open state.</li>
<li>The cursor keys move focus to the next or previous speed dial action. (Note that any cursor direction can be used initially to open the speed dial. This enables the expected behavior for the actual or perceived orientation of the speed dial, for example for a screen reader user who perceives the speed dial as a drop-down menu.)</li>
<li>The Escape key closes the speed dial and, if a speed dial action was focused, returns focus to the Fab.</li>
</ul>

                </>
    
                     );
                   }
                   
                   export default SpeedDialDoc;
                   