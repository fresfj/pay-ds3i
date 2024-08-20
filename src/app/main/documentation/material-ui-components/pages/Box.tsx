import FuseExample from '@fuse/core/FuseExample';
                   import FuseHighlight from '@fuse/core/FuseHighlight';
                   import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
                   import Button from '@mui/material/Button';
                   import Icon from '@mui/material/Icon';
                   import Typography from '@mui/material/Typography';
				   import DocumentationPageBreadcrumb from '../../DocumentationPageBreadcrumb';
                   
                   
                   function BoxDoc(props) {
                     return (
                       
                <>
					<div className="flex flex-1 sm:flex-row flex-col items-start justify-center grow-0 md:items-center md:justify-end md:space-between">
					  <DocumentationPageBreadcrumb />
					  <Button 
							className="normal-case"
							variant="contained"
                            color="secondary"
							component="a" 
							href="https://mui.com/components/box" 
							target="_blank"
							role="button"
							size="small"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:external-link</FuseSvgIcon>}
							>
							Reference
						</Button>
					</div>
                     <Typography className="text-32 my-16 font-700" component="h1">Box</Typography>
<Typography className="description">The Box component is a generic, theme-aware container with access to CSS utilities from MUI System.</Typography>

<Typography className="text-14 mb-32" component="div">:::warning
Please refer to the <a href="/system/react-box/">Box</a> component page in the MUI System docs for demos and details on usage.</Typography>
<Typography className="text-14 mb-32" component="div">The Box component is a part of the standalone <a href="/system/getting-started/">MUI System</a> utility library.
It is re-exported from <code>{`@mui/material`}</code> for your convenience.
:::</Typography>

                </>
    
                     );
                   }
                   
                   export default BoxDoc;
                   