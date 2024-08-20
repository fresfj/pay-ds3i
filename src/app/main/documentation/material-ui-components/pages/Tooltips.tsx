import FuseExample from '@fuse/core/FuseExample';
                   import FuseHighlight from '@fuse/core/FuseHighlight';
                   import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
                   import Button from '@mui/material/Button';
                   import Icon from '@mui/material/Icon';
                   import Typography from '@mui/material/Typography';
				   import DocumentationPageBreadcrumb from '../../DocumentationPageBreadcrumb';
                   import BasicTooltipComponent from '../components/tooltips/BasicTooltip';
import BasicTooltipRaw from '../components/tooltips/BasicTooltip.tsx?raw';
import PositionedTooltipsComponent from '../components/tooltips/PositionedTooltips';
import PositionedTooltipsRaw from '../components/tooltips/PositionedTooltips.tsx?raw';
import CustomizedTooltipsComponent from '../components/tooltips/CustomizedTooltips';
import CustomizedTooltipsRaw from '../components/tooltips/CustomizedTooltips.tsx?raw';
import ArrowTooltipsComponent from '../components/tooltips/ArrowTooltips';
import ArrowTooltipsRaw from '../components/tooltips/ArrowTooltips.tsx?raw';
import TooltipOffsetComponent from '../components/tooltips/TooltipOffset';
import TooltipOffsetRaw from '../components/tooltips/TooltipOffset.tsx?raw';
import TooltipMarginComponent from '../components/tooltips/TooltipMargin';
import TooltipMarginRaw from '../components/tooltips/TooltipMargin.tsx?raw';
import TriggersTooltipsComponent from '../components/tooltips/TriggersTooltips';
import TriggersTooltipsRaw from '../components/tooltips/TriggersTooltips.tsx?raw';
import ControlledTooltipsComponent from '../components/tooltips/ControlledTooltips';
import ControlledTooltipsRaw from '../components/tooltips/ControlledTooltips.tsx?raw';
import VariableWidthComponent from '../components/tooltips/VariableWidth';
import VariableWidthRaw from '../components/tooltips/VariableWidth.tsx?raw';
import NonInteractiveTooltipsComponent from '../components/tooltips/NonInteractiveTooltips';
import NonInteractiveTooltipsRaw from '../components/tooltips/NonInteractiveTooltips.tsx?raw';
import DisabledTooltipsComponent from '../components/tooltips/DisabledTooltips';
import DisabledTooltipsRaw from '../components/tooltips/DisabledTooltips.tsx?raw';
import TransitionsTooltipsComponent from '../components/tooltips/TransitionsTooltips';
import TransitionsTooltipsRaw from '../components/tooltips/TransitionsTooltips.tsx?raw';
import FollowCursorTooltipsComponent from '../components/tooltips/FollowCursorTooltips';
import FollowCursorTooltipsRaw from '../components/tooltips/FollowCursorTooltips.tsx?raw';
import AnchorElTooltipsComponent from '../components/tooltips/AnchorElTooltips';
import AnchorElTooltipsRaw from '../components/tooltips/AnchorElTooltips.tsx?raw';
import DelayTooltipsComponent from '../components/tooltips/DelayTooltips';
import DelayTooltipsRaw from '../components/tooltips/DelayTooltips.tsx?raw';
import AccessibilityTooltipsComponent from '../components/tooltips/AccessibilityTooltips';
import AccessibilityTooltipsRaw from '../components/tooltips/AccessibilityTooltips.tsx?raw';
                   
                   function TooltipsDoc(props) {
                     return (
                       
                <>
					<div className="flex flex-1 sm:flex-row flex-col items-start justify-center grow-0 md:items-center md:justify-end md:space-between">
					  <DocumentationPageBreadcrumb />
					  <Button 
							className="normal-case"
							variant="contained"
                            color="secondary"
							component="a" 
							href="https://mui.com/components/tooltips" 
							target="_blank"
							role="button"
							size="small"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:external-link</FuseSvgIcon>}
							>
							Reference
						</Button>
					</div>
                     <Typography className="text-32 my-16 font-700" component="h1">Tooltip</Typography>
<Typography className="description">Tooltips display informative text when users hover over, focus on, or tap an element.</Typography>

<Typography className="text-14 mb-32" component="div">When activated, Tooltips display a text label identifying an element, such as a description of its function.</Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Basic tooltip</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="BasicTooltip.js"
                    className="my-16"
                    iframe={false}
                    component={BasicTooltipComponent} 
                    raw={BasicTooltipRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Positioned tooltips</Typography>
<Typography className="text-14 mb-32" component="div">The <code>{`Tooltip`}</code> has 12 <strong>placement</strong> choices.
They don&#39;t have directional arrows; instead, they rely on motion emanating from the source to convey direction.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="PositionedTooltips.js"
                    className="my-16"
                    iframe={false}
                    component={PositionedTooltipsComponent} 
                    raw={PositionedTooltipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Customization</Typography>
<Typography className="text-14 mb-32" component="div">Here are some examples of customizing the component.
You can learn more about this in the <a href="/material-ui/customization/how-to-customize/">overrides documentation page</a>.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="CustomizedTooltips.js"
                    className="my-16"
                    iframe={false}
                    component={CustomizedTooltipsComponent} 
                    raw={CustomizedTooltipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Arrow tooltips</Typography>
<Typography className="text-14 mb-32" component="div">You can use the <code>{`arrow`}</code> prop to give your tooltip an arrow indicating which element it refers to.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ArrowTooltips.js"
                    className="my-16"
                    iframe={false}
                    component={ArrowTooltipsComponent} 
                    raw={ArrowTooltipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Distance from anchor</Typography>
<Typography className="text-14 mb-32" component="div">To adjust the distance between the tooltip and its anchor, you can use the <code>{`slotProps`}</code> prop to modify the <a href="https://popper.js.org/docs/v2/modifiers/offset/">offset</a> of the popper.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="TooltipOffset.js"
                    className="my-16"
                    iframe={false}
                    component={TooltipOffsetComponent} 
                    raw={TooltipOffsetRaw}
                    /></Typography>
<Typography className="text-14 mb-32" component="div">Alternatively, you can use the <code>{`slotProps`}</code> prop to customize the margin of the popper.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="TooltipMargin.js"
                    className="my-16"
                    iframe={false}
                    component={TooltipMarginComponent} 
                    raw={TooltipMarginRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Custom child element</Typography>
<Typography className="text-14 mb-32" component="div">The tooltip needs to apply DOM event listeners to its child element.
If the child is a custom React element, you need to make sure that it spreads its props to the underlying DOM element.</Typography>

<FuseHighlight component="pre" className="language-jsx">
{` 
const MyComponent = React.forwardRef(function MyComponent(props, ref) {
  //  Spread the props to the underlying DOM element.
  return (
    <div {...props} ref={ref}>
      Bin
    </div>
  );
});

// ...

<Tooltip title="Delete">
  <MyComponent />
</Tooltip>;
`}
</FuseHighlight>
<Typography className="text-14 mb-32" component="div">You can find a similar concept in the <a href="/material-ui/guides/composition/#wrapping-components">wrapping components</a> guide.</Typography>
<Typography className="text-14 mb-32" component="div">If using a class component as a child, you&#39;ll also need to ensure that the ref is forwarded to the underlying DOM element. (A ref to the class component itself will not work.)</Typography>

<FuseHighlight component="pre" className="language-jsx">
{` 
class MyComponent extends React.Component {
  render() {
    const { innerRef, ...props } = this.props;
    //  Spread the props to the underlying DOM element.
    return (
      <div {...props} ref={innerRef}>
        Bin
      </div>
    );
  }
}

// Wrap MyComponent to forward the ref as expected by Tooltip
const WrappedMyComponent = React.forwardRef(function WrappedMyComponent(props, ref) {
  return <MyComponent {...props} innerRef={ref} />;
});

// ...

<Tooltip title="Delete">
  <WrappedMyComponent />
</Tooltip>;
`}
</FuseHighlight>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Triggers</Typography>
<Typography className="text-14 mb-32" component="div">You can define the types of events that cause a tooltip to show.</Typography>
<Typography className="text-14 mb-32" component="div">The touch action requires a long press due to the <code>{`enterTouchDelay`}</code> prop being set to <code>{`700`}</code>ms by default.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="TriggersTooltips.js"
                    className="my-16"
                    iframe={false}
                    component={TriggersTooltipsComponent} 
                    raw={TriggersTooltipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Controlled tooltips</Typography>
<Typography className="text-14 mb-32" component="div">You can use the <code>{`open`}</code>, <code>{`onOpen`}</code> and <code>{`onClose`}</code> props to control the behavior of the tooltip.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ControlledTooltips.js"
                    className="my-16"
                    iframe={false}
                    component={ControlledTooltipsComponent} 
                    raw={ControlledTooltipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Variable width</Typography>
<Typography className="text-14 mb-32" component="div">The <code>{`Tooltip`}</code> wraps long text by default to make it readable.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="VariableWidth.js"
                    className="my-16"
                    iframe={false}
                    component={VariableWidthComponent} 
                    raw={VariableWidthRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Interactive</Typography>
<Typography className="text-14 mb-32" component="div">Tooltips are interactive by default (to pass <a href="https://www.w3.org/TR/WCAG21/#content-on-hover-or-focus">WCAG 2.1 success criterion 1.4.13</a>).
It won&#39;t close when the user hovers over the tooltip before the <code>{`leaveDelay`}</code> is expired.
You can disable this behavior (thus failing the success criterion which is required to reach level AA) by passing <code>{`disableInteractive`}</code>.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="NonInteractiveTooltips.js"
                    className="my-16"
                    iframe={false}
                    component={NonInteractiveTooltipsComponent} 
                    raw={NonInteractiveTooltipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Disabled elements</Typography>
<Typography className="text-14 mb-32" component="div">By default disabled elements like <code>{`<button>`}</code> do not trigger user interactions so a <code>{`Tooltip`}</code> will not activate on normal events like hover. To accommodate disabled elements, add a simple wrapper element, such as a <code>{`span`}</code>.</Typography>
<Typography className="text-14 mb-32" component="div">:::warning
In order to work with Safari, you need at least one display block or flex item below the tooltip wrapper.
:::</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="DisabledTooltips.js"
                    className="my-16"
                    iframe={false}
                    component={DisabledTooltipsComponent} 
                    raw={DisabledTooltipsRaw}
                    /></Typography>
<Typography className="text-14 mb-32" component="div">:::warning
If you&#39;re not wrapping a Material UI component that inherits from <code>{`ButtonBase`}</code>, for instance, a native <code>{`<button>`}</code> element, you should also add the CSS property <em>pointer-events: none;</em> to your element when disabled:
:::</Typography>

<FuseHighlight component="pre" className="language-jsx">
{` 
<Tooltip title="You don't have permission to do this">
  <span>
    <button disabled={disabled} style={disabled ? { pointerEvents: 'none' } : {}}>
      A disabled button
    </button>
  </span>
</Tooltip>
`}
</FuseHighlight>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Transitions</Typography>
<Typography className="text-14 mb-32" component="div">Use a different transition.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="TransitionsTooltips.js"
                    className="my-16"
                    iframe={false}
                    component={TransitionsTooltipsComponent} 
                    raw={TransitionsTooltipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Follow cursor</Typography>
<Typography className="text-14 mb-32" component="div">You can enable the tooltip to follow the cursor by setting <code>{`followCursor={true}`}</code>.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="FollowCursorTooltips.js"
                    className="my-16"
                    iframe={false}
                    component={FollowCursorTooltipsComponent} 
                    raw={FollowCursorTooltipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Virtual element</Typography>
<Typography className="text-14 mb-32" component="div">In the event you need to implement a custom placement, you can use the <code>{`anchorEl`}</code> prop:
The value of the <code>{`anchorEl`}</code> prop can be a reference to a fake DOM element.
You need to create an object shaped like the <a href="https://popper.js.org/docs/v2/virtual-elements/"><code>{`VirtualElement`}</code></a>.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="AnchorElTooltips.js"
                    className="my-16"
                    iframe={false}
                    component={AnchorElTooltipsComponent} 
                    raw={AnchorElTooltipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Showing and hiding</Typography>
<Typography className="text-14 mb-32" component="div">The tooltip is normally shown immediately when the user&#39;s mouse hovers over the element, and hides immediately when the user&#39;s mouse leaves. A delay in showing or hiding the tooltip can be added through the <code>{`enterDelay`}</code> and <code>{`leaveDelay`}</code> props.</Typography>
<Typography className="text-14 mb-32" component="div">On mobile, the tooltip is displayed when the user longpresses the element and hides after a delay of 1500ms. You can disable this feature with the <code>{`disableTouchListener`}</code> prop.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="DelayTooltips.js"
                    className="my-16"
                    iframe={false}
                    component={DelayTooltipsComponent} 
                    raw={DelayTooltipsRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Accessibility</Typography>
<Typography className="text-14 mb-32" component="div">(WAI-ARIA: <a href="https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/">https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/</a>)</Typography>
<Typography className="text-14 mb-32" component="div">By default, the tooltip only labels its child element.
This is notably different from <code>{`title`}</code> which can either label <strong>or</strong> describe its child depending on whether the child already has a label.
For example, in:</Typography>

<FuseHighlight component="pre" className="language-html">
{` 
<button title="some more information">A button</button>
`}
</FuseHighlight>
<Typography className="text-14 mb-32" component="div">the <code>{`title`}</code> acts as an accessible description.
If you want the tooltip to act as an accessible description you can pass <code>{`describeChild`}</code>.
Note that you shouldn&#39;t use <code>{`describeChild`}</code> if the tooltip provides the only visual label. Otherwise, the child would have no accessible name and the tooltip would violate <a href="https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html">success criterion 2.5.3 in WCAG 2.1</a>.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="AccessibilityTooltips.js"
                    className="my-16"
                    iframe={false}
                    component={AccessibilityTooltipsComponent} 
                    raw={AccessibilityTooltipsRaw}
                    /></Typography>

                </>
    
                     );
                   }
                   
                   export default TooltipsDoc;
                   