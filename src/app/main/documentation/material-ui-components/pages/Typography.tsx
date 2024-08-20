import FuseExample from '@fuse/core/FuseExample';
                   import FuseHighlight from '@fuse/core/FuseHighlight';
                   import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
                   import Button from '@mui/material/Button';
                   import Icon from '@mui/material/Icon';
                   import Typography from '@mui/material/Typography';
				   import DocumentationPageBreadcrumb from '../../DocumentationPageBreadcrumb';
                   import TypesComponent from '../components/typography/Types';
import TypesRaw from '../components/typography/Types.tsx?raw';
import TypographyThemeComponent from '../components/typography/TypographyTheme';
import TypographyThemeRaw from '../components/typography/TypographyTheme.tsx?raw';

                   function TypographyDoc(props) {
                     return (

                <>
					<div className="flex flex-1 sm:flex-row flex-col items-start justify-center grow-0 md:items-center md:justify-end md:space-between">
					  <DocumentationPageBreadcrumb />
					  <Button
							className="normal-case"
							variant="contained"
                            color="secondary"
							component="a"
							href="https://mui.com/components/typography"
							target="_blank"
							role="button"
							size="small"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:external-link</FuseSvgIcon>}
							>
							Reference
						</Button>
					</div>
                     <Typography className="text-32 my-16 font-700" component="h1">Typography</Typography>
<Typography className="description">Use typography to present your design and content as clearly and efficiently as possible.</Typography>



<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Roboto font</Typography>
<Typography className="text-14 mb-32" component="div">Material UI uses the <a href="https://fonts.google.com/specimen/Roboto">Roboto</a> font by default.
Add it to your project via Fontsource, or with the Google Fonts CDN.</Typography>

<FuseHighlight component="pre" className="language-bash npm">
{` 
npm install @fontsource/roboto
`}
</FuseHighlight>

<FuseHighlight component="pre" className="language-bash yarn">
{` 
yarn add @fontsource/roboto
`}
</FuseHighlight>

<FuseHighlight component="pre" className="language-bash pnpm">
{` 
pnpm add @fontsource/roboto
`}
</FuseHighlight>

<Typography className="text-14 mb-32" component="div">Then you can import it in your entry point like this:</Typography>

<FuseHighlight component="pre" className="language-tsx">
{` 
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
`}
</FuseHighlight>
<div className="border border-1 p-16 rounded-16 my-12">

<Typography className="text-14 mb-32" component="div">Fontsource can be configured to load specific subsets, weights, and styles. Material UI&#39;s default typography configuration relies only on the 300, 400, 500, and 700 font weights.</Typography>
</div>

<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Google Web Fonts</Typography>
<Typography className="text-14 mb-32" component="div">To install Roboto through the Google Web Fonts CDN, add the following code inside your project&#39;s <head /> tag:</Typography>

<FuseHighlight component="pre" className="language-html">
{` 
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap"
/>
`}
</FuseHighlight>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Component</Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Usage</Typography>
<Typography className="text-14 mb-32" component="div">The Typography component follows the <a href="https://m2.material.io/design/typography/#type-scale">Material Design typographic scale</a> that provides a limited set of type sizes that work well together for a consistent layout.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="Types.js"
                    className="my-16"
                    iframe={false}
                    component={TypesComponent}
                    raw={TypesRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Theme keys</Typography>
<Typography className="text-14 mb-32" component="div">In some situations you might not be able to use the Typography component.
Hopefully, you might be able to take advantage of the <a href="/material-ui/customization/default-theme/?expand-path=$.typography"><code>{`typography`}</code></a> keys of the theme.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="TypographyTheme.js"
                    className="my-16"
                    iframe={false}
                    component={TypographyThemeComponent}
                    raw={TypographyThemeRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Customization</Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Adding &amp; disabling variants</Typography>
<Typography className="text-14 mb-32" component="div">In addition to using the default typography variants, you can add custom ones, or disable any you don&#39;t need. See the <a href="/material-ui/customization/typography/#adding-amp-disabling-variants">Adding &amp; disabling variants</a> page for more info.</Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Changing the semantic element</Typography>
<Typography className="text-14 mb-32" component="div">The Typography component uses the <code>{`variantMapping`}</code> prop to associate a UI variant with a semantic element.
It&#39;s important to realize that the style of a typography component is independent from the semantic underlying element.</Typography>
<Typography className="text-14 mb-32" component="div">To change the underlying element for a one-off situation, like avoiding two <code>{`h1`}</code> elements in your page, use the <code>{`component`}</code> prop:</Typography>

<FuseHighlight component="pre" className="language-jsx">
{` 
<Typography variant="h1" component="h2">
  h1. Heading
</Typography>
`}
</FuseHighlight>
<Typography className="text-14 mb-32" component="div">To change the typography element mapping globally, <a href="/material-ui/customization/typography/#adding-amp-disabling-variants">use the theme</a>:</Typography>

<FuseHighlight component="pre" className="language-js">
{` 
const theme = createTheme({
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h2',
          h2: 'h2',
          h3: 'h2',
          h4: 'h2',
          h5: 'h2',
          h6: 'h2',
          subtitle1: 'h2',
          subtitle2: 'h2',
          body1: 'span',
          body2: 'span',
        },
      },
    },
  },
});
`}
</FuseHighlight>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">System props</Typography>
<Typography className="text-14 mb-32" component="div">As a CSS utility component, the Typography component supports all <a href="/system/properties/"><code>{`system`}</code></a> properties. You can use them as prop directly on the component.
For example, here&#39;s how you&#39;d add a margin-top:</Typography>

<FuseHighlight component="pre" className="language-jsx">
{` 
<Typography mt={2}>
`}
</FuseHighlight>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Accessibility</Typography>
<Typography className="text-14 mb-32" component="div">Key factors to follow for an accessible typography:</Typography>
<ul className="space-y-16">
<li><strong>Color</strong>. Provide enough contrast between text and its background, check out the minimum recommended <a href="https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html">WCAG 2.0 color contrast ratio</a> (4.5:1).</li>
<li><strong>Font size</strong>. Use <a href="/material-ui/customization/typography/#font-size">relative units (rem)</a>, instead of pixels, to accommodate the user&#39;s browser settings.</li>
<li><strong>Heading hierarchy</strong>. Based on <a href="https://www.w3.org/WAI/tutorials/page-structure/headings/">the W3 guidelines</a>, don&#39;t skip heading levels. Make sure to <a href="#changing-the-semantic-element">separate the semantics from the style</a>.</li>
</ul>

                </>

                     );
                   }

                   export default TypographyDoc;
