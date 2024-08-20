import FuseExample from '@fuse/core/FuseExample';
                   import FuseHighlight from '@fuse/core/FuseHighlight';
                   import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
                   import Button from '@mui/material/Button';
                   import Icon from '@mui/material/Icon';
                   import Typography from '@mui/material/Typography';
				   import DocumentationPageBreadcrumb from '../../DocumentationPageBreadcrumb';
                   import BasicSelectComponent from '../components/selects/BasicSelect';
import BasicSelectRaw from '../components/selects/BasicSelect.tsx?raw';
import SelectVariantsComponent from '../components/selects/SelectVariants';
import SelectVariantsRaw from '../components/selects/SelectVariants.tsx?raw';
import SelectLabelsComponent from '../components/selects/SelectLabels';
import SelectLabelsRaw from '../components/selects/SelectLabels.tsx?raw';
import SelectAutoWidthComponent from '../components/selects/SelectAutoWidth';
import SelectAutoWidthRaw from '../components/selects/SelectAutoWidth.tsx?raw';
import SelectSmallComponent from '../components/selects/SelectSmall';
import SelectSmallRaw from '../components/selects/SelectSmall.tsx?raw';
import SelectOtherPropsComponent from '../components/selects/SelectOtherProps';
import SelectOtherPropsRaw from '../components/selects/SelectOtherProps.tsx?raw';
import NativeSelectDemoComponent from '../components/selects/NativeSelectDemo';
import NativeSelectDemoRaw from '../components/selects/NativeSelectDemo.tsx?raw';
import CustomizedSelectsComponent from '../components/selects/CustomizedSelects';
import CustomizedSelectsRaw from '../components/selects/CustomizedSelects.tsx?raw';
import MultipleSelectComponent from '../components/selects/MultipleSelect';
import MultipleSelectRaw from '../components/selects/MultipleSelect.tsx?raw';
import MultipleSelectCheckmarksComponent from '../components/selects/MultipleSelectCheckmarks';
import MultipleSelectCheckmarksRaw from '../components/selects/MultipleSelectCheckmarks.tsx?raw';
import MultipleSelectChipComponent from '../components/selects/MultipleSelectChip';
import MultipleSelectChipRaw from '../components/selects/MultipleSelectChip.tsx?raw';
import MultipleSelectPlaceholderComponent from '../components/selects/MultipleSelectPlaceholder';
import MultipleSelectPlaceholderRaw from '../components/selects/MultipleSelectPlaceholder.tsx?raw';
import MultipleSelectNativeComponent from '../components/selects/MultipleSelectNative';
import MultipleSelectNativeRaw from '../components/selects/MultipleSelectNative.tsx?raw';
import ControlledOpenSelectComponent from '../components/selects/ControlledOpenSelect';
import ControlledOpenSelectRaw from '../components/selects/ControlledOpenSelect.tsx?raw';
import DialogSelectComponent from '../components/selects/DialogSelect';
import DialogSelectRaw from '../components/selects/DialogSelect.tsx?raw';
import GroupedSelectComponent from '../components/selects/GroupedSelect';
import GroupedSelectRaw from '../components/selects/GroupedSelect.tsx?raw';
                   
                   function SelectsDoc(props) {
                     return (
                       
                <>
					<div className="flex flex-1 sm:flex-row flex-col items-start justify-center grow-0 md:items-center md:justify-end md:space-between">
					  <DocumentationPageBreadcrumb />
					  <Button 
							className="normal-case"
							variant="contained"
                            color="secondary"
							component="a" 
							href="https://mui.com/components/selects" 
							target="_blank"
							role="button"
							size="small"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:external-link</FuseSvgIcon>}
							>
							Reference
						</Button>
					</div>
                     <Typography className="text-32 my-16 font-700" component="h1">Select</Typography>
<Typography className="description">Select components are used for collecting user provided information from a list of options.</Typography>



<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Basic select</Typography>
<Typography className="text-14 mb-32" component="div">Menus are positioned under their emitting elements, unless they are close to the bottom of the viewport.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="BasicSelect.js"
                    className="my-16"
                    iframe={false}
                    component={BasicSelectComponent} 
                    raw={BasicSelectRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Advanced features</Typography>
<Typography className="text-14 mb-32" component="div">The Select component is meant to be interchangeable with a native <code>{`<select>`}</code> element.</Typography>
<Typography className="text-14 mb-32" component="div">If you are looking for more advanced features, like combobox, multiselect, autocomplete, async or creatable support, head to the <a href="/material-ui/react-autocomplete/"><code>{`Autocomplete`}</code> component</a>.
It&#39;s meant to be an improved version of the &quot;react-select&quot; and &quot;downshift&quot; packages.</Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Props</Typography>
<Typography className="text-14 mb-32" component="div">The Select component is implemented as a custom <code>{`<input>`}</code> element of the <a href="/material-ui/api/input-base/">InputBase</a>.
It extends the <a href="/material-ui/react-text-field/">text field components</a> subcomponents, either the <a href="/material-ui/api/outlined-input/">OutlinedInput</a>, <a href="/material-ui/api/input/">Input</a>, or <a href="/material-ui/api/filled-input/">FilledInput</a>, depending on the variant selected.
It shares the same styles and many of the same props. Refer to the respective component&#39;s API page for details.</Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Filled and standard variants</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="SelectVariants.js"
                    className="my-16"
                    iframe={false}
                    component={SelectVariantsComponent} 
                    raw={SelectVariantsRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Labels and helper text</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="SelectLabels.js"
                    className="my-16"
                    iframe={false}
                    component={SelectLabelsComponent} 
                    raw={SelectLabelsRaw}
                    /></Typography>
<Typography className="text-14 mb-32" component="div">:::warning
Note that when using FormControl with the outlined variant of the Select, you need to provide a label in two places: in the InputLabel component and in the <code>{`label`}</code> prop of the Select component (see the above demo).
:::</Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Auto width</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="SelectAutoWidth.js"
                    className="my-16"
                    iframe={false}
                    component={SelectAutoWidthComponent} 
                    raw={SelectAutoWidthRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Small Size</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="SelectSmall.js"
                    className="my-16"
                    iframe={false}
                    component={SelectSmallComponent} 
                    raw={SelectSmallRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Other props</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="SelectOtherProps.js"
                    className="my-16"
                    iframe={false}
                    component={SelectOtherPropsComponent} 
                    raw={SelectOtherPropsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Native select</Typography>
<Typography className="text-14 mb-32" component="div">As the user experience can be improved on mobile using the native select of the platform,
we allow such pattern.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="NativeSelectDemo.js"
                    className="my-16"
                    iframe={false}
                    component={NativeSelectDemoComponent} 
                    raw={NativeSelectDemoRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">TextField</Typography>
<Typography className="text-14 mb-32" component="div">The <code>{`TextField`}</code> wrapper component is a complete form control including a label, input and help text.
You can find an example with the select mode <a href="/material-ui/react-text-field/#select">in this section</a>.</Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Customization</Typography>
<Typography className="text-14 mb-32" component="div">Here are some examples of customizing the component.
You can learn more about this in the <a href="/material-ui/customization/how-to-customize/">overrides documentation page</a>.</Typography>
<Typography className="text-14 mb-32" component="div">The first step is to style the <code>{`InputBase`}</code> component.
Once it&#39;s styled, you can either use it directly as a text field or provide it to the select <code>{`input`}</code> prop to have a <code>{`select`}</code> field.
Notice that the <code>{`"standard"`}</code> variant is easier to customize, since it does not wrap the contents in a <code>{`fieldset`}</code>/<code>{`legend`}</code> markup.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="CustomizedSelects.js"
                    className="my-16"
                    iframe={false}
                    component={CustomizedSelectsComponent} 
                    raw={CustomizedSelectsRaw}
                    /></Typography>
<Typography className="text-14 mb-32" component="div">🎨 If you are looking for inspiration, you can check <a href="https://mui-treasury.com/?path=/docs/select-introduction--docs">MUI Treasury&#39;s customization examples</a>.</Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Multiple select</Typography>
<Typography className="text-14 mb-32" component="div">The <code>{`Select`}</code> component can handle multiple selections.
It&#39;s enabled with the <code>{`multiple`}</code> prop.</Typography>
<Typography className="text-14 mb-32" component="div">Like with the single selection, you can pull out the new value by accessing <code>{`event.target.value`}</code> in the <code>{`onChange`}</code> callback. It&#39;s always an array.</Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Default</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="MultipleSelect.js"
                    className="my-16"
                    iframe={false}
                    component={MultipleSelectComponent} 
                    raw={MultipleSelectRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Checkmarks</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="MultipleSelectCheckmarks.js"
                    className="my-16"
                    iframe={false}
                    component={MultipleSelectCheckmarksComponent} 
                    raw={MultipleSelectCheckmarksRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Chip</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="MultipleSelectChip.js"
                    className="my-16"
                    iframe={false}
                    component={MultipleSelectChipComponent} 
                    raw={MultipleSelectChipRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Placeholder</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="MultipleSelectPlaceholder.js"
                    className="my-16"
                    iframe={false}
                    component={MultipleSelectPlaceholderComponent} 
                    raw={MultipleSelectPlaceholderRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Native</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="MultipleSelectNative.js"
                    className="my-16"
                    iframe={false}
                    component={MultipleSelectNativeComponent} 
                    raw={MultipleSelectNativeRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Controlling the open state</Typography>
<Typography className="text-14 mb-32" component="div">You can control the open state of the select with the <code>{`open`}</code> prop. Alternatively, it is also possible to set the initial (uncontrolled) open state of the component with the <code>{`defaultOpen`}</code> prop.</Typography>
<div className="border border-1 p-16 rounded-16 my-12">


<ul className="space-y-16">
<li>A component is <strong>controlled</strong> when it&#39;s managed by its parent using props.</li>
<li>A component is <strong>uncontrolled</strong> when it&#39;s managed by its own local state.</li>
</ul>
<Typography className="text-14 mb-32" component="div">Learn more about controlled and uncontrolled components in the <a href="https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components">React documentation</a>.</Typography>
</div>


<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ControlledOpenSelect.js"
                    className="my-16"
                    iframe={false}
                    component={ControlledOpenSelectComponent} 
                    raw={ControlledOpenSelectRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">With a dialog</Typography>
<Typography className="text-14 mb-32" component="div">While it&#39;s discouraged by the Material Design guidelines, you can use a select inside a dialog.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="DialogSelect.js"
                    className="my-16"
                    iframe={false}
                    component={DialogSelectComponent} 
                    raw={DialogSelectRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Grouping</Typography>
<Typography className="text-14 mb-32" component="div">Display categories with the <code>{`ListSubheader`}</code> component or the native <code>{`<optgroup>`}</code> element.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="GroupedSelect.js"
                    className="my-16"
                    iframe={false}
                    component={GroupedSelectComponent} 
                    raw={GroupedSelectRaw}
                    /></Typography>
<Typography className="text-14 mb-32" component="div">:::warning
If you wish to wrap the ListSubheader in a custom component, you&#39;ll have to annotate it so Material UI can handle it properly when determining focusable elements.</Typography>
<Typography className="text-14 mb-32" component="div">You have two options for solving this:
Option 1: Define a static boolean field called <code>{`muiSkipListHighlight`}</code> on your component function, and set it to <code>{`true`}</code>:</Typography>

<FuseHighlight component="pre" className="language-tsx">
{` 
function MyListSubheader(props: ListSubheaderProps) {
  return <ListSubheader {...props} />;
}

MyListSubheader.muiSkipListHighlight = true;
export default MyListSubheader;

// elsewhere:

return (
  <Select>
    <MyListSubheader>Group 1</MyListSubheader>
    <MenuItem value={1}>Option 1</MenuItem>
    <MenuItem value={2}>Option 2</MenuItem>
    <MyListSubheader>Group 2</MyListSubheader>
    <MenuItem value={3}>Option 3</MenuItem>
    <MenuItem value={4}>Option 4</MenuItem>
    {/* ... */}
  </Select>
`}
</FuseHighlight>
<Typography className="text-14 mb-32" component="div">Option 2: Place a <code>{`muiSkipListHighlight`}</code> prop on each instance of your component.
The prop doesn&#39;t have to be forwarded to the ListSubheader, nor present in the underlying DOM element.
It just has to be placed on a component that&#39;s used as a subheader.</Typography>

<FuseHighlight component="pre" className="language-tsx">
{` 
export default function MyListSubheader(
  props: ListSubheaderProps & { muiSkipListHighlight: boolean },
) {
  const { muiSkipListHighlight, ...other } = props;
  return <ListSubheader {...other} />;
}

// elsewhere:

return (
  <Select>
    <MyListSubheader muiSkipListHighlight>Group 1</MyListSubheader>
    <MenuItem value={1}>Option 1</MenuItem>
    <MenuItem value={2}>Option 2</MenuItem>
    <MyListSubheader muiSkipListHighlight>Group 2</MyListSubheader>
    <MenuItem value={3}>Option 3</MenuItem>
    <MenuItem value={4}>Option 4</MenuItem>
    {/* ... */}
  </Select>
);
`}
</FuseHighlight>
<Typography className="text-14 mb-32" component="div">We recommend the first option as it doesn&#39;t require updating all the usage sites of the component.</Typography>
<Typography className="text-14 mb-32" component="div">Keep in mind this is <strong>only necessary</strong> if you wrap the ListSubheader in a custom component.
If you use the ListSubheader directly, <strong>no additional code is required</strong>.
:::</Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Accessibility</Typography>
<Typography className="text-14 mb-32" component="div">To properly label your <code>{`Select`}</code> input you need an extra element with an <code>{`id`}</code> that contains a label.
That <code>{`id`}</code> needs to match the <code>{`labelId`}</code> of the <code>{`Select`}</code> e.g.</Typography>

<FuseHighlight component="pre" className="language-jsx">
{` 
<InputLabel id="label">Age</InputLabel>
<Select labelId="label" id="select" value="20">
  <MenuItem value="10">Ten</MenuItem>
  <MenuItem value="20">Twenty</MenuItem>
</Select>
`}
</FuseHighlight>
<Typography className="text-14 mb-32" component="div">Alternatively a <code>{`TextField`}</code> with an <code>{`id`}</code> and <code>{`label`}</code> creates the proper markup and
ids for you:</Typography>

<FuseHighlight component="pre" className="language-jsx">
{` 
<TextField id="select" label="Age" value="20" select>
  <MenuItem value="10">Ten</MenuItem>
  <MenuItem value="20">Twenty</MenuItem>
</TextField>
`}
</FuseHighlight>
<Typography className="text-14 mb-32" component="div">For a <a href="#native-select">native select</a>, you should mention a label by giving the value of the <code>{`id`}</code> attribute of the select element to the <code>{`InputLabel`}</code>&#39;s <code>{`htmlFor`}</code> attribute:</Typography>

<FuseHighlight component="pre" className="language-jsx">
{` 
<InputLabel htmlFor="select">Age</InputLabel>
<NativeSelect id="select">
  <option value="10">Ten</option>
  <option value="20">Twenty</option>
</NativeSelect>
`}
</FuseHighlight>

                </>
    
                     );
                   }
                   
                   export default SelectsDoc;
                   