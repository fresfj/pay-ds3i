import FuseExample from '@fuse/core/FuseExample';
                   import FuseHighlight from '@fuse/core/FuseHighlight';
                   import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
                   import Button from '@mui/material/Button';
                   import Icon from '@mui/material/Icon';
                   import Typography from '@mui/material/Typography';
				   import DocumentationPageBreadcrumb from '../../DocumentationPageBreadcrumb';
                   import AccordionUsageComponent from '../components/accordion/AccordionUsage';
import AccordionUsageRaw from '../components/accordion/AccordionUsage.tsx?raw';
import AccordionExpandIconComponent from '../components/accordion/AccordionExpandIcon';
import AccordionExpandIconRaw from '../components/accordion/AccordionExpandIcon.tsx?raw';
import AccordionExpandDefaultComponent from '../components/accordion/AccordionExpandDefault';
import AccordionExpandDefaultRaw from '../components/accordion/AccordionExpandDefault.tsx?raw';
import AccordionTransitionComponent from '../components/accordion/AccordionTransition';
import AccordionTransitionRaw from '../components/accordion/AccordionTransition.tsx?raw';
import DisabledAccordionComponent from '../components/accordion/DisabledAccordion';
import DisabledAccordionRaw from '../components/accordion/DisabledAccordion.tsx?raw';
import ControlledAccordionsComponent from '../components/accordion/ControlledAccordions';
import ControlledAccordionsRaw from '../components/accordion/ControlledAccordions.tsx?raw';
import CustomizedAccordionsComponent from '../components/accordion/CustomizedAccordions';
import CustomizedAccordionsRaw from '../components/accordion/CustomizedAccordions.tsx?raw';
                   
                   function AccordionDoc(props) {
                     return (
                       
                <>
					<div className="flex flex-1 sm:flex-row flex-col items-start justify-center grow-0 md:items-center md:justify-end md:space-between">
					  <DocumentationPageBreadcrumb />
					  <Button 
							className="normal-case"
							variant="contained"
                            color="secondary"
							component="a" 
							href="https://mui.com/components/accordion" 
							target="_blank"
							role="button"
							size="small"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:external-link</FuseSvgIcon>}
							>
							Reference
						</Button>
					</div>
                     <Typography className="text-32 my-16 font-700" component="h1">Accordion</Typography>
<Typography className="description">The Accordion component lets users show and hide sections of related content on a page.</Typography>



<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Introduction</Typography>
<Typography className="text-14 mb-32" component="div">The Material UI Accordion component includes several complementary utility components to handle various use cases:</Typography>
<ul className="space-y-16">
<li>Accordion: the wrapper for grouping related components.</li>
<li>Accordion Summary: the wrapper for the Accordion header, which expands or collapses the content when clicked.</li>
<li>Accordion Details: the wrapper for the Accordion content.</li>
<li>Accordion Actions: an optional wrapper that groups a set of buttons.</li>
</ul>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="AccordionUsage.js"
                    className="my-16"
                    iframe={false}
                    component={AccordionUsageComponent} 
                    raw={AccordionUsageRaw}
                    /></Typography>
<div className="border border-1 p-16 rounded-16 my-12">

<Typography className="text-14 mb-32" component="div">This component is no longer documented in the <a href="https://m2.material.io/">Material Design guidelines</a>, but Material UI will continue to support it.</Typography>
</div>

<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Basics</Typography>

<FuseHighlight component="pre" className="language-jsx">
{` 
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
`}
</FuseHighlight>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Expand icon</Typography>
<Typography className="text-14 mb-32" component="div">Use the <code>{`expandIcon`}</code> prop on the Accordion Summary component to change the expand indicator icon.
The component handles the turning upside-down transition automatically.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="AccordionExpandIcon.js"
                    className="my-16"
                    iframe={false}
                    component={AccordionExpandIconComponent} 
                    raw={AccordionExpandIconRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Expanded by default</Typography>
<Typography className="text-14 mb-32" component="div">Use the <code>{`defaultExpanded`}</code> prop on the Accordion component to have it opened by default.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="AccordionExpandDefault.js"
                    className="my-16"
                    iframe={false}
                    component={AccordionExpandDefaultComponent} 
                    raw={AccordionExpandDefaultRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Transition</Typography>
<Typography className="text-14 mb-32" component="div">Use the <code>{`slots.transition`}</code> and <code>{`slotProps.transition`}</code> props to change the Accordion&#39;s default transition.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="AccordionTransition.js"
                    className="my-16"
                    iframe={false}
                    component={AccordionTransitionComponent} 
                    raw={AccordionTransitionRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Disabled item</Typography>
<Typography className="text-14 mb-32" component="div">Use the <code>{`disabled`}</code> prop on the Accordion component to disable interaction and focus.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="DisabledAccordion.js"
                    className="my-16"
                    iframe={false}
                    component={DisabledAccordionComponent} 
                    raw={DisabledAccordionRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Controlled Accordion</Typography>
<Typography className="text-14 mb-32" component="div">The Accordion component can be controlled or uncontrolled.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ControlledAccordions.js"
                    className="my-16"
                    iframe={false}
                    component={ControlledAccordionsComponent} 
                    raw={ControlledAccordionsRaw}
                    /></Typography>
<div className="border border-1 p-16 rounded-16 my-12">


<ul className="space-y-16">
<li>A component is <strong>controlled</strong> when it&#39;s managed by its parent using props.</li>
<li>A component is <strong>uncontrolled</strong> when it&#39;s managed by its own local state.</li>
</ul>
<Typography className="text-14 mb-32" component="div">Learn more about controlled and uncontrolled components in the <a href="https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components">React documentation</a>.</Typography>
</div>

<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Customization</Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Only one expanded at a time</Typography>
<Typography className="text-14 mb-32" component="div">Use the <code>{`expanded`}</code> prop with React&#39;s <code>{`useState`}</code> hook to allow only one Accordion item to be expanded at a time.
The demo below also shows a bit of visual customziation.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="CustomizedAccordions.js"
                    className="my-16"
                    iframe={false}
                    component={CustomizedAccordionsComponent} 
                    raw={CustomizedAccordionsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Performance</Typography>
<Typography className="text-14 mb-32" component="div">The Accordion content is mounted by default even if it&#39;s not expanded.
This default behavior has server-side rendering and SEO in mind.</Typography>
<Typography className="text-14 mb-32" component="div">If you render the Accordion Details with a big component tree nested inside, or if you have many Accordions, you may want to change this behavior by setting <code>{`unmountOnExit`}</code> to <code>{`true`}</code> inside the <code>{`slotProps.transition`}</code> prop to improve performance:</Typography>

<FuseHighlight component="pre" className="language-jsx">
{` 
<Accordion slotProps={{ transition: { unmountOnExit: true } }} />
`}
</FuseHighlight>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Accessibility</Typography>
<Typography className="text-14 mb-32" component="div">The <a href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/">WAI-ARIA guidelines for accordions</a> recommend setting an <code>{`id`}</code> and <code>{`aria-controls`}</code>, which in this case would apply to the Accordion Summary component.
The Accordion component then derives the necessary <code>{`aria-labelledby`}</code> and <code>{`id`}</code> from its content.</Typography>

<FuseHighlight component="pre" className="language-jsx">
{` 
<Accordion>
  <AccordionSummary id="panel-header" aria-controls="panel-content">
    Header
  </AccordionSummary>
  <AccordionDetails>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </AccordionDetails>
</Accordion>
`}
</FuseHighlight>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Anatomy</Typography>
<Typography className="text-14 mb-32" component="div">The Accordion component is composed of a root <code>{`<div>`}</code> that houses interior elements like the Accordion Summary and other optional components (such as buttons or decorators).</Typography>

<FuseHighlight component="pre" className="language-jsx">
{` 
<div className="MuiAccordion-root">
  <div className="MuiButtonBase-root MuiAccordionSummary-root" role="button" aria-expanded="">
      <!-- Accordion header button goes here -->
  </div>
  <div className="MuiAccordion-region" role="region">
    <div className="MuiAccordionDetails-root">
      <!-- Accordion content goes here -->
    </div>
  </div>
</div>
`}
</FuseHighlight>

                </>
    
                     );
                   }
                   
                   export default AccordionDoc;
                   