import FuseExample from '@fuse/core/FuseExample';
                   import FuseHighlight from '@fuse/core/FuseHighlight';
                   import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
                   import Button from '@mui/material/Button';
                   import Icon from '@mui/material/Icon';
                   import Typography from '@mui/material/Typography';
				   import DocumentationPageBreadcrumb from '../../DocumentationPageBreadcrumb';
                   import BasicTableComponent from '../components/table/BasicTable';
import BasicTableRaw from '../components/table/BasicTable.tsx?raw';
import DataTableComponent from '../components/table/DataTable';
import DataTableRaw from '../components/table/DataTable.tsx?raw';
import DenseTableComponent from '../components/table/DenseTable';
import DenseTableRaw from '../components/table/DenseTable.tsx?raw';
import EnhancedTableComponent from '../components/table/EnhancedTable';
import EnhancedTableRaw from '../components/table/EnhancedTable.tsx?raw';
import CustomizedTablesComponent from '../components/table/CustomizedTables';
import CustomizedTablesRaw from '../components/table/CustomizedTables.tsx?raw';
import CustomPaginationActionsTableComponent from '../components/table/CustomPaginationActionsTable';
import CustomPaginationActionsTableRaw from '../components/table/CustomPaginationActionsTable.tsx?raw';
import StickyHeadTableComponent from '../components/table/StickyHeadTable';
import StickyHeadTableRaw from '../components/table/StickyHeadTable.tsx?raw';
import ColumnGroupingTableComponent from '../components/table/ColumnGroupingTable';
import ColumnGroupingTableRaw from '../components/table/ColumnGroupingTable.tsx?raw';
import CollapsibleTableComponent from '../components/table/CollapsibleTable';
import CollapsibleTableRaw from '../components/table/CollapsibleTable.tsx?raw';
import SpanningTableComponent from '../components/table/SpanningTable';
import SpanningTableRaw from '../components/table/SpanningTable.tsx?raw';
import ReactVirtualizedTableComponent from '../components/table/ReactVirtualizedTable';
import ReactVirtualizedTableRaw from '../components/table/ReactVirtualizedTable.tsx?raw';
import AccessibleTableComponent from '../components/table/AccessibleTable';
import AccessibleTableRaw from '../components/table/AccessibleTable.tsx?raw';
                   
                   function TableDoc(props) {
                     return (
                       
                <>
					<div className="flex flex-1 sm:flex-row flex-col items-start justify-center grow-0 md:items-center md:justify-end md:space-between">
					  <DocumentationPageBreadcrumb />
					  <Button 
							className="normal-case"
							variant="contained"
                            color="secondary"
							component="a" 
							href="https://mui.com/components/table" 
							target="_blank"
							role="button"
							size="small"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:external-link</FuseSvgIcon>}
							>
							Reference
						</Button>
					</div>
                     <Typography className="text-32 my-16 font-700" component="h1">Table</Typography>
<Typography className="description">Tables display sets of data. They can be fully customized.</Typography>

<Typography className="text-14 mb-32" component="div">Tables display information in a way that&#39;s easy to scan, so that users can look for patterns and insights. They can be embedded in primary content, such as cards. They can include:</Typography>
<ul className="space-y-16">
<li>A corresponding visualization</li>
<li>Navigation</li>
<li>Tools to query and manipulate data</li>
</ul>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Basic table</Typography>
<Typography className="text-14 mb-32" component="div">A simple example with no frills.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="BasicTable.js"
                    className="my-16"
                    iframe={false}
                    component={BasicTableComponent} 
                    raw={BasicTableRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Data table</Typography>
<Typography className="text-14 mb-32" component="div">The <code>{`Table`}</code> component has a close mapping to the native <code>{`<table>`}</code> elements.
This constraint makes building rich data tables challenging.</Typography>
<Typography className="text-14 mb-32" component="div">The <a href="/x/react-data-grid/"><code>{`DataGrid`}</code> component</a> is designed for use-cases that are focused on handling large amounts of tabular data.
While it comes with a more rigid structure, in exchange, you gain more powerful features.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="DataTable.js"
                    className="my-16"
                    iframe={false}
                    component={DataTableComponent} 
                    raw={DataTableRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Dense table</Typography>
<Typography className="text-14 mb-32" component="div">A simple example of a dense table with no frills.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="DenseTable.js"
                    className="my-16"
                    iframe={false}
                    component={DenseTableComponent} 
                    raw={DenseTableRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Sorting &amp; selecting</Typography>
<Typography className="text-14 mb-32" component="div">This example demonstrates the use of <code>{`Checkbox`}</code> and clickable rows for selection, with a custom <code>{`Toolbar`}</code>. It uses the <code>{`TableSortLabel`}</code> component to help style column headings.</Typography>
<Typography className="text-14 mb-32" component="div">The Table has been given a fixed width to demonstrate horizontal scrolling. In order to prevent the pagination controls from scrolling, the TablePagination component is used outside of the Table. (The <a href="#custom-pagination-actions">&#39;Custom Table Pagination Action&#39; example</a> below shows the pagination within the TableFooter.)</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="EnhancedTable.js"
                    className="my-16"
                    iframe={false}
                    component={EnhancedTableComponent} 
                    raw={EnhancedTableRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Customization</Typography>
<Typography className="text-14 mb-32" component="div">Here is an example of customizing the component.
You can learn more about this in the <a href="/material-ui/customization/how-to-customize/">overrides documentation page</a>.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="CustomizedTables.js"
                    className="my-16"
                    iframe={false}
                    component={CustomizedTablesComponent} 
                    raw={CustomizedTablesRaw}
                    /></Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Custom pagination options</Typography>
<Typography className="text-14 mb-32" component="div">It&#39;s possible to customize the options shown in the &quot;Rows per page&quot; select using the <code>{`rowsPerPageOptions`}</code> prop.
You should either provide an array of:</Typography>
<ul className="space-y-16">
<li><Typography className="text-14 mb-32" component="div"><strong>numbers</strong>, each number will be used for the option&#39;s label and value.</Typography>

<FuseHighlight component="pre" className="language-jsx">
{` 
<TablePagination rowsPerPageOptions={[10, 50]} />
`}
</FuseHighlight>
</li>
<li><Typography className="text-14 mb-32" component="div"><strong>objects</strong>, the <code>{`value`}</code> and <code>{`label`}</code> keys will be used respectively for the value and label of the option (useful for language strings such as &#39;All&#39;).</Typography>

<FuseHighlight component="pre" className="language-jsx">
{` 
<TablePagination rowsPerPageOptions={[10, 50, { value: -1, label: 'All' }]} />
`}
</FuseHighlight>
</li>
</ul>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Custom pagination actions</Typography>
<Typography className="text-14 mb-32" component="div">The <code>{`ActionsComponent`}</code> prop of the <code>{`TablePagination`}</code> component allows the implementation of custom actions.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="CustomPaginationActionsTable.js"
                    className="my-16"
                    iframe={false}
                    component={CustomPaginationActionsTableComponent} 
                    raw={CustomPaginationActionsTableRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Sticky header</Typography>
<Typography className="text-14 mb-32" component="div">Here is an example of a table with scrollable rows and fixed column headers.
It leverages the <code>{`stickyHeader`}</code> prop.
(⚠️ no IE 11 support)</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="StickyHeadTable.js"
                    className="my-16"
                    iframe={false}
                    component={StickyHeadTableComponent} 
                    raw={StickyHeadTableRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Column grouping</Typography>
<Typography className="text-14 mb-32" component="div">You can group column headers by rendering multiple table rows inside a table head:</Typography>

<FuseHighlight component="pre" className="language-jsx">
{` 
<TableHead>
  <TableRow />
  <TableRow />
</TableHead>
`}
</FuseHighlight>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ColumnGroupingTable.js"
                    className="my-16"
                    iframe={false}
                    component={ColumnGroupingTableComponent} 
                    raw={ColumnGroupingTableRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Collapsible table</Typography>
<Typography className="text-14 mb-32" component="div">An example of a table with expandable rows, revealing more information.
It utilizes the <a href="/material-ui/api/collapse/"><code>{`Collapse`}</code></a> component.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="CollapsibleTable.js"
                    className="my-16"
                    iframe={false}
                    component={CollapsibleTableComponent} 
                    raw={CollapsibleTableRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Spanning table</Typography>
<Typography className="text-14 mb-32" component="div">A simple example with spanning rows &amp; columns.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="SpanningTable.js"
                    className="my-16"
                    iframe={false}
                    component={SpanningTableComponent} 
                    raw={SpanningTableRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Virtualized table</Typography>
<Typography className="text-14 mb-32" component="div">In the following example, we demonstrate how to use <a href="https://github.com/petyosi/react-virtuoso">react-virtuoso</a> with the <code>{`Table`}</code> component.
It renders 200 rows and can easily handle more.
Virtualization helps with performance issues.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="ReactVirtualizedTable.js"
                    className="my-16"
                    iframe={false}
                    component={ReactVirtualizedTableComponent} 
                    raw={ReactVirtualizedTableRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Accessibility</Typography>
<Typography className="text-14 mb-32" component="div">(WAI tutorial: <a href="https://www.w3.org/WAI/tutorials/tables/">https://www.w3.org/WAI/tutorials/tables/</a>)</Typography>
<Typography className="text-16 mt-20 mb-10 font-700" component="h3">Caption</Typography>
<Typography className="text-14 mb-32" component="div">A caption functions like a heading for a table. Most screen readers announce the content of captions. Captions help users to find a table and understand what it&#39;s about and decide if they want to read it.</Typography>
<Typography className="text-14 mb-32" component="div"><FuseExample
                    name="AccessibleTable.js"
                    className="my-16"
                    iframe={false}
                    component={AccessibleTableComponent} 
                    raw={AccessibleTableRaw}
                    /></Typography>
<Typography className="text-24 mt-24 mb-10 font-700" component="h2">Unstyled</Typography>
<Typography className="text-14 mb-32" component="div">If you would like to use an unstyled Table, you can use the primitive HTML elements and enhance the table with the TablePaginationUnstyled component.
See the demos in the <a href="/base-ui/react-table-pagination/">unstyled table pagination docs</a></Typography>

                </>
    
                     );
                   }
                   
                   export default TableDoc;
                   