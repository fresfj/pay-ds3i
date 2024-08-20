import FuseExample from '@fuse/core/FuseExample';
                   import FuseHighlight from '@fuse/core/FuseHighlight';
                   import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
                   import Button from '@mui/material/Button';
                   import Icon from '@mui/material/Icon';
                   import Typography from '@mui/material/Typography';
				   import DocumentationPageBreadcrumb from '../../DocumentationPageBreadcrumb';
                   import BasicBreadcrumbsComponent from '../components/breadcrumbs/BasicBreadcrumbs';
import BasicBreadcrumbsRaw from '../components/breadcrumbs/BasicBreadcrumbs.tsx?raw';
import ActiveLastBreadcrumbComponent from '../components/breadcrumbs/ActiveLastBreadcrumb';
import ActiveLastBreadcrumbRaw from '../components/breadcrumbs/ActiveLastBreadcrumb.tsx?raw';
import CustomSeparatorComponent from '../components/breadcrumbs/CustomSeparator';
import CustomSeparatorRaw from '../components/breadcrumbs/CustomSeparator.tsx?raw';
import IconBreadcrumbsComponent from '../components/breadcrumbs/IconBreadcrumbs';
import IconBreadcrumbsRaw from '../components/breadcrumbs/IconBreadcrumbs.tsx?raw';
import CollapsedBreadcrumbsComponent from '../components/breadcrumbs/CollapsedBreadcrumbs';
import CollapsedBreadcrumbsRaw from '../components/breadcrumbs/CollapsedBreadcrumbs.tsx?raw';
import CustomizedBreadcrumbsComponent from '../components/breadcrumbs/CustomizedBreadcrumbs';
import CustomizedBreadcrumbsRaw from '../components/breadcrumbs/CustomizedBreadcrumbs.tsx?raw';
                   
                   function BreadcrumbsDoc(props) {
                     return (
                       
                <>
					<div className="flex flex-1 sm:flex-row flex-col items-start justify-center grow-0 md:items-center md:justify-end md:space-between">
					  <DocumentationPageBreadcrumb />
					  <Button 
							className="normal-case"
							variant="contained"
                            color="secondary"
							component="a" 
							href="https://mui.com/components/breadcrumbs" 
							target="_blank"
							role="button"
							size="small"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:external-link</FuseSvgIcon>}
							>
							Reference
						</Button>
					</div>
                     <Typography className="text-32 my-16 font-700" component="h1">Breadcrumbs</Typography>
<Typography className="description">A breadcrumbs is a list of links that help visualize a page's location within a site's hierarchical structure, it allows navigation up to any of the ancestors.</Typography>



<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Basic breadcrumbs</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="BasicBreadcrumbs.js"
                    className="my-16"
                    iframe={false}
                    component={BasicBreadcrumbsComponent} 
                    raw={BasicBreadcrumbsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Active last breadcrumb</Typography>
<Typography className="text-14 mb-32" component="div">Keep the last breadcrumb interactive.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ActiveLastBreadcrumb.js"
                    className="my-16"
                    iframe={false}
                    component={ActiveLastBreadcrumbComponent} 
                    raw={ActiveLastBreadcrumbRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Custom separator</Typography>
<Typography className="text-14 mb-32" component="div">In the following examples, we are using two string separators and an SVG icon.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="CustomSeparator.js"
                    className="my-16"
                    iframe={false}
                    component={CustomSeparatorComponent} 
                    raw={CustomSeparatorRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Breadcrumbs with icons</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="IconBreadcrumbs.js"
                    className="my-16"
                    iframe={false}
                    component={IconBreadcrumbsComponent} 
                    raw={IconBreadcrumbsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Collapsed breadcrumbs</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="CollapsedBreadcrumbs.js"
                    className="my-16"
                    iframe={false}
                    component={CollapsedBreadcrumbsComponent} 
                    raw={CollapsedBreadcrumbsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Customization</Typography>
<Typography className="text-14 mb-32" component="div">Here is an example of customizing the component.
You can learn more about this in the <a href="/material-ui/customization/how-to-customize/">overrides documentation page</a>.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="CustomizedBreadcrumbs.js"
                    className="my-16"
                    iframe={false}
                    component={CustomizedBreadcrumbsComponent} 
                    raw={CustomizedBreadcrumbsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Accessibility</Typography>
<Typography className="text-14 mb-32" component="div">(WAI-ARIA: <a href="https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/">https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/</a>)</Typography>
<Typography className="text-14 mb-32" component="div">Be sure to add a <code>{`aria-label`}</code> description on the <code>{`Breadcrumbs`}</code> component.</Typography>
<Typography className="text-14 mb-32" component="div">The accessibility of this component relies on:</Typography>
<ul className="space-y-16">
<li>The set of links is structured using an ordered list (<code>{`<ol>`}</code> element).</li>
<li>To prevent screen reader announcement of the visual separators between links, they are hidden with <code>{`aria-hidden`}</code>.</li>
<li>A nav element labeled with <code>{`aria-label`}</code> identifies the structure as a breadcrumb trail and makes it a navigation landmark so that it is easy to locate.</li>
</ul>

                </>
    
                     );
                   }
                   
                   export default BreadcrumbsDoc;
                   