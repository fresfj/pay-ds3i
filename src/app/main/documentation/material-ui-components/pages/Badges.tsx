import FuseExample from '@fuse/core/FuseExample';
                   import FuseHighlight from '@fuse/core/FuseHighlight';
                   import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
                   import Button from '@mui/material/Button';
                   import Icon from '@mui/material/Icon';
                   import Typography from '@mui/material/Typography';
				   import DocumentationPageBreadcrumb from '../../DocumentationPageBreadcrumb';
                   import SimpleBadgeComponent from '../components/badges/SimpleBadge';
import SimpleBadgeRaw from '../components/badges/SimpleBadge.tsx?raw';
import ColorBadgeComponent from '../components/badges/ColorBadge';
import ColorBadgeRaw from '../components/badges/ColorBadge.tsx?raw';
import CustomizedBadgesComponent from '../components/badges/CustomizedBadges';
import CustomizedBadgesRaw from '../components/badges/CustomizedBadges.tsx?raw';
import BadgeVisibilityComponent from '../components/badges/BadgeVisibility';
import BadgeVisibilityRaw from '../components/badges/BadgeVisibility.tsx?raw';
import ShowZeroBadgeComponent from '../components/badges/ShowZeroBadge';
import ShowZeroBadgeRaw from '../components/badges/ShowZeroBadge.tsx?raw';
import BadgeMaxComponent from '../components/badges/BadgeMax';
import BadgeMaxRaw from '../components/badges/BadgeMax.tsx?raw';
import DotBadgeComponent from '../components/badges/DotBadge';
import DotBadgeRaw from '../components/badges/DotBadge.tsx?raw';
import BadgeOverlapComponent from '../components/badges/BadgeOverlap';
import BadgeOverlapRaw from '../components/badges/BadgeOverlap.tsx?raw';
import AccessibleBadgesComponent from '../components/badges/AccessibleBadges';
import AccessibleBadgesRaw from '../components/badges/AccessibleBadges.tsx?raw';
                   
                   function BadgesDoc(props) {
                     return (
                       
                <>
					<div className="flex flex-1 sm:flex-row flex-col items-start justify-center grow-0 md:items-center md:justify-end md:space-between">
					  <DocumentationPageBreadcrumb />
					  <Button 
							className="normal-case"
							variant="contained"
                            color="secondary"
							component="a" 
							href="https://mui.com/components/badges" 
							target="_blank"
							role="button"
							size="small"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:external-link</FuseSvgIcon>}
							>
							Reference
						</Button>
					</div>
                     <Typography className="text-32 my-16 font-700" component="h1">Badge</Typography>
<Typography className="description">Badge generates a small badge to the top-right of its child(ren).</Typography>



<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Basic badge</Typography>
<Typography className="text-14 mb-32" component="div">Examples of badges containing text, using primary and secondary colors. The badge is applied to its children.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="SimpleBadge.js"
                    className="my-16"
                    iframe={false}
                    component={SimpleBadgeComponent} 
                    raw={SimpleBadgeRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Color</Typography>
<Typography className="text-14 mb-32" component="div">Use <code>{`color`}</code> prop to apply theme palette to component.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ColorBadge.js"
                    className="my-16"
                    iframe={false}
                    component={ColorBadgeComponent} 
                    raw={ColorBadgeRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Customization</Typography>
<Typography className="text-14 mb-32" component="div">Here is an example of customizing the component.
You can learn more about this in the <a href="/material-ui/customization/how-to-customize/">overrides documentation page</a>.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="CustomizedBadges.js"
                    className="my-16"
                    iframe={false}
                    component={CustomizedBadgesComponent} 
                    raw={CustomizedBadgesRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Badge visibility</Typography>
<Typography className="text-14 mb-32" component="div">The visibility of badges can be controlled using the <code>{`invisible`}</code> prop.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="BadgeVisibility.js"
                    className="my-16"
                    iframe={false}
                    component={BadgeVisibilityComponent} 
                    raw={BadgeVisibilityRaw}
                    /></Typography>
<Typography className="text-14 mb-32" component="div">The badge hides automatically when <code>{`badgeContent`}</code> is zero. You can override this with the <code>{`showZero`}</code> prop.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ShowZeroBadge.js"
                    className="my-16"
                    iframe={false}
                    component={ShowZeroBadgeComponent} 
                    raw={ShowZeroBadgeRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Maximum value</Typography>
<Typography className="text-14 mb-32" component="div">You can use the <code>{`max`}</code> prop to cap the value of the badge content.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="BadgeMax.js"
                    className="my-16"
                    iframe={false}
                    component={BadgeMaxComponent} 
                    raw={BadgeMaxRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Dot badge</Typography>
<Typography className="text-14 mb-32" component="div">The <code>{`dot`}</code> prop changes a badge into a small dot. This can be used as a notification that something has changed without giving a count.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="DotBadge.js"
                    className="my-16"
                    iframe={false}
                    component={DotBadgeComponent} 
                    raw={DotBadgeRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Badge overlap</Typography>
<Typography className="text-14 mb-32" component="div">You can use the <code>{`overlap`}</code> prop to place the badge relative to the corner of the wrapped element.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="BadgeOverlap.js"
                    className="my-16"
                    iframe={false}
                    component={BadgeOverlapComponent} 
                    raw={BadgeOverlapRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Badge alignment</Typography>
<Typography className="text-14 mb-32" component="div">You can use the <code>{`anchorOrigin`}</code> prop to move the badge to any corner of the wrapped element.</Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Accessibility</Typography>
<Typography className="text-14 mb-32" component="div">You can&#39;t rely on the content of the badge to be announced correctly.
You should provide a full description, for instance, with <code>{`aria-label`}</code>:</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="AccessibleBadges.js"
                    className="my-16"
                    iframe={false}
                    component={AccessibleBadgesComponent} 
                    raw={AccessibleBadgesRaw}
                    /></Typography>

                </>
    
                     );
                   }
                   
                   export default BadgesDoc;
                   