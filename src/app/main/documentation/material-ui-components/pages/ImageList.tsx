import FuseExample from '@fuse/core/FuseExample';
                   import FuseHighlight from '@fuse/core/FuseHighlight';
                   import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
                   import Button from '@mui/material/Button';
                   import Icon from '@mui/material/Icon';
                   import Typography from '@mui/material/Typography';
				   import DocumentationPageBreadcrumb from '../../DocumentationPageBreadcrumb';
                   import StandardImageListComponent from '../components/image-list/StandardImageList';
import StandardImageListRaw from '../components/image-list/StandardImageList.tsx?raw';
import QuiltedImageListComponent from '../components/image-list/QuiltedImageList';
import QuiltedImageListRaw from '../components/image-list/QuiltedImageList.tsx?raw';
import WovenImageListComponent from '../components/image-list/WovenImageList';
import WovenImageListRaw from '../components/image-list/WovenImageList.tsx?raw';
import MasonryImageListComponent from '../components/image-list/MasonryImageList';
import MasonryImageListRaw from '../components/image-list/MasonryImageList.tsx?raw';
import TitlebarImageListComponent from '../components/image-list/TitlebarImageList';
import TitlebarImageListRaw from '../components/image-list/TitlebarImageList.tsx?raw';
import TitlebarBelowImageListComponent from '../components/image-list/TitlebarBelowImageList';
import TitlebarBelowImageListRaw from '../components/image-list/TitlebarBelowImageList.tsx?raw';
import TitlebarBelowMasonryImageListComponent from '../components/image-list/TitlebarBelowMasonryImageList';
import TitlebarBelowMasonryImageListRaw from '../components/image-list/TitlebarBelowMasonryImageList.tsx?raw';
import CustomImageListComponent from '../components/image-list/CustomImageList';
import CustomImageListRaw from '../components/image-list/CustomImageList.tsx?raw';
                   
                   function ImageListDoc(props) {
                     return (
                       
                <>
					<div className="flex flex-1 sm:flex-row flex-col items-start justify-center grow-0 md:items-center md:justify-end md:space-between">
					  <DocumentationPageBreadcrumb />
					  <Button 
							className="normal-case"
							variant="contained"
                            color="secondary"
							component="a" 
							href="https://mui.com/components/image-list" 
							target="_blank"
							role="button"
							size="small"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:external-link</FuseSvgIcon>}
							>
							Reference
						</Button>
					</div>
                     <Typography className="text-32 my-16 font-700" component="h1">Image List</Typography>
<Typography className="description">The Image List displays a collection of images in an organized grid.</Typography>

<Typography className="text-14 mb-32" component="div">Image lists represent a collection of items in a repeated pattern. They help improve the visual comprehension of the content they hold.</Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Standard image list</Typography>
<Typography className="text-14 mb-32" component="div">Standard image lists are best for items of equal importance. They have a uniform container size, ratio, and spacing.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="StandardImageList.js"
                    className="my-16"
                    iframe={false}
                    component={StandardImageListComponent} 
                    raw={StandardImageListRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Quilted image list</Typography>
<Typography className="text-14 mb-32" component="div">Quilted image lists emphasize certain items over others in a collection. They create hierarchy using varied container sizes and ratios.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="QuiltedImageList.js"
                    className="my-16"
                    iframe={false}
                    component={QuiltedImageListComponent} 
                    raw={QuiltedImageListRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Woven image list</Typography>
<Typography className="text-14 mb-32" component="div">Woven image lists use alternating container ratios to create a rhythmic layout. A woven image list is best for browsing peer content.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="WovenImageList.js"
                    className="my-16"
                    iframe={false}
                    component={WovenImageListComponent} 
                    raw={WovenImageListRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Masonry image list</Typography>
<Typography className="text-14 mb-32" component="div">Masonry image lists use dynamically sized container heights that reflect the aspect ratio of each image. This image list is best used for browsing uncropped peer content.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="MasonryImageList.js"
                    className="my-16"
                    iframe={false}
                    component={MasonryImageListComponent} 
                    raw={MasonryImageListRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Image list with title bars</Typography>
<Typography className="text-14 mb-32" component="div">This example demonstrates the use of the <code>{`ImageListItemBar`}</code> to add an overlay to each item.
The overlay can accommodate a <code>{`title`}</code>, <code>{`subtitle`}</code> and secondary action - in this example an <code>{`IconButton`}</code>.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="TitlebarImageList.js"
                    className="my-16"
                    iframe={false}
                    component={TitlebarImageListComponent} 
                    raw={TitlebarImageListRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Title bar below image (standard)</Typography>
<Typography className="text-14 mb-32" component="div">The title bar can be placed below the image.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="TitlebarBelowImageList.js"
                    className="my-16"
                    iframe={false}
                    component={TitlebarBelowImageListComponent} 
                    raw={TitlebarBelowImageListRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Title bar below image (masonry)</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="TitlebarBelowMasonryImageList.js"
                    className="my-16"
                    iframe={false}
                    component={TitlebarBelowMasonryImageListComponent} 
                    raw={TitlebarBelowMasonryImageListRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Custom image list</Typography>
<Typography className="text-14 mb-32" component="div">In this example the items have a customized titlebar, positioned at the top and with a custom gradient <code>{`titleBackground`}</code>.
The secondary action <code>{`IconButton`}</code> is positioned on the left. The <code>{`gap`}</code> prop is used to adjust the gap between items.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="CustomImageList.js"
                    className="my-16"
                    iframe={false}
                    component={CustomImageListComponent} 
                    raw={CustomImageListRaw}
                    /></Typography>

                </>
    
                     );
                   }
                   
                   export default ImageListDoc;
                   