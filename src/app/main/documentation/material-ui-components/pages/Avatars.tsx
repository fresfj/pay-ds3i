import FuseExample from '@fuse/core/FuseExample';
                   import FuseHighlight from '@fuse/core/FuseHighlight';
                   import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
                   import Button from '@mui/material/Button';
                   import Icon from '@mui/material/Icon';
                   import Typography from '@mui/material/Typography';
				   import DocumentationPageBreadcrumb from '../../DocumentationPageBreadcrumb';
                   import ImageAvatarsComponent from '../components/avatars/ImageAvatars';
import ImageAvatarsRaw from '../components/avatars/ImageAvatars.tsx?raw';
import LetterAvatarsComponent from '../components/avatars/LetterAvatars';
import LetterAvatarsRaw from '../components/avatars/LetterAvatars.tsx?raw';
import BackgroundLetterAvatarsComponent from '../components/avatars/BackgroundLetterAvatars';
import BackgroundLetterAvatarsRaw from '../components/avatars/BackgroundLetterAvatars.tsx?raw';
import SizeAvatarsComponent from '../components/avatars/SizeAvatars';
import SizeAvatarsRaw from '../components/avatars/SizeAvatars.tsx?raw';
import IconAvatarsComponent from '../components/avatars/IconAvatars';
import IconAvatarsRaw from '../components/avatars/IconAvatars.tsx?raw';
import VariantAvatarsComponent from '../components/avatars/VariantAvatars';
import VariantAvatarsRaw from '../components/avatars/VariantAvatars.tsx?raw';
import FallbackAvatarsComponent from '../components/avatars/FallbackAvatars';
import FallbackAvatarsRaw from '../components/avatars/FallbackAvatars.tsx?raw';
import GroupAvatarsComponent from '../components/avatars/GroupAvatars';
import GroupAvatarsRaw from '../components/avatars/GroupAvatars.tsx?raw';
import TotalAvatarsComponent from '../components/avatars/TotalAvatars';
import TotalAvatarsRaw from '../components/avatars/TotalAvatars.tsx?raw';
import CustomSurplusAvatarsComponent from '../components/avatars/CustomSurplusAvatars';
import CustomSurplusAvatarsRaw from '../components/avatars/CustomSurplusAvatars.tsx?raw';
import BadgeAvatarsComponent from '../components/avatars/BadgeAvatars';
import BadgeAvatarsRaw from '../components/avatars/BadgeAvatars.tsx?raw';
                   
                   function AvatarsDoc(props) {
                     return (
                       
                <>
					<div className="flex flex-1 sm:flex-row flex-col items-start justify-center grow-0 md:items-center md:justify-end md:space-between">
					  <DocumentationPageBreadcrumb />
					  <Button 
							className="normal-case"
							variant="contained"
                            color="secondary"
							component="a" 
							href="https://mui.com/components/avatars" 
							target="_blank"
							role="button"
							size="small"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:external-link</FuseSvgIcon>}
							>
							Reference
						</Button>
					</div>
                     <Typography className="text-32 my-16 font-700" component="h1">Avatar</Typography>
<Typography className="description">Avatars are found throughout material design with uses in everything from tables to dialog menus.</Typography>



<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Image avatars</Typography>
<Typography className="text-14 mb-32" component="div">Image avatars can be created by passing standard <code>{`img`}</code> props <code>{`src`}</code> or <code>{`srcSet`}</code> to the component.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ImageAvatars.js"
                    className="my-16"
                    iframe={false}
                    component={ImageAvatarsComponent} 
                    raw={ImageAvatarsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Letter avatars</Typography>
<Typography className="text-14 mb-32" component="div">Avatars containing simple characters can be created by passing a string as <code>{`children`}</code>.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="LetterAvatars.js"
                    className="my-16"
                    iframe={false}
                    component={LetterAvatarsComponent} 
                    raw={LetterAvatarsRaw}
                    /></Typography>
<Typography className="text-14 mb-32" component="div">You can use different background colors for the avatar.
The following demo generates the color based on the name of the person.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="BackgroundLetterAvatars.js"
                    className="my-16"
                    iframe={false}
                    component={BackgroundLetterAvatarsComponent} 
                    raw={BackgroundLetterAvatarsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Sizes</Typography>
<Typography className="text-14 mb-32" component="div">You can change the size of the avatar with the <code>{`height`}</code> and <code>{`width`}</code> CSS properties.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="SizeAvatars.js"
                    className="my-16"
                    iframe={false}
                    component={SizeAvatarsComponent} 
                    raw={SizeAvatarsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Icon avatars</Typography>
<Typography className="text-14 mb-32" component="div">Icon avatars are created by passing an icon as <code>{`children`}</code>.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="IconAvatars.js"
                    className="my-16"
                    iframe={false}
                    component={IconAvatarsComponent} 
                    raw={IconAvatarsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Variants</Typography>
<Typography className="text-14 mb-32" component="div">If you need square or rounded avatars, use the <code>{`variant`}</code> prop.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="VariantAvatars.js"
                    className="my-16"
                    iframe={false}
                    component={VariantAvatarsComponent} 
                    raw={VariantAvatarsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Fallbacks</Typography>
<Typography className="text-14 mb-32" component="div">If there is an error loading the avatar image, the component falls back to an alternative in the following order:</Typography>
<ul className="space-y-16">
<li>the provided children</li>
<li>the first letter of the <code>{`alt`}</code> text</li>
<li>a generic avatar icon</li>
</ul>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="FallbackAvatars.js"
                    className="my-16"
                    iframe={false}
                    component={FallbackAvatarsComponent} 
                    raw={FallbackAvatarsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Grouped</Typography>
<Typography className="text-14 mb-32" component="div"><code>{`AvatarGroup`}</code> renders its children as a stack. Use the <code>{`max`}</code> prop to limit the number of avatars.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="GroupAvatars.js"
                    className="my-16"
                    iframe={false}
                    component={GroupAvatarsComponent} 
                    raw={GroupAvatarsRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Total avatars</Typography>
<Typography className="text-14 mb-32" component="div">If you need to control the total number of avatars not shown, you can use the <code>{`total`}</code> prop.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="TotalAvatars.js"
                    className="my-16"
                    iframe={false}
                    component={TotalAvatarsComponent} 
                    raw={TotalAvatarsRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Custom surplus</Typography>
<Typography className="text-14 mb-32" component="div">Set the <code>{`renderSurplus`}</code> prop as a callback to customize the surplus avatar. The callback will receive the surplus number as an argument based on the children and the <code>{`max`}</code> prop, and should return a <code>{`React.ReactNode`}</code>.</Typography>
<Typography className="text-14 mb-32" component="div">The <code>{`renderSurplus`}</code> prop is useful when you need to render the surplus based on the data sent from the server.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="CustomSurplusAvatars.js"
                    className="my-16"
                    iframe={false}
                    component={CustomSurplusAvatarsComponent} 
                    raw={CustomSurplusAvatarsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">With badge</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="BadgeAvatars.js"
                    className="my-16"
                    iframe={false}
                    component={BadgeAvatarsComponent} 
                    raw={BadgeAvatarsRaw}
                    /></Typography>

                </>
    
                     );
                   }
                   
                   export default AvatarsDoc;
                   