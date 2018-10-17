'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _pagination = require('./pagination');

var _pagination2 = _interopRequireDefault(_pagination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
//


var emptyObj = function emptyObj() {
  return {};
};

exports.default = {
  // General
  data: [],
  resolveData: function resolveData(data) {
    return data;
  },
  loading: false,
  showPagination: true,
  showPaginationTop: false,
  showPaginationBottom: true,
  showPageSizeOptions: true,
  pageSizeOptions: [5, 10, 20, 25, 50, 100],
  defaultPage: 0,
  defaultPageSize: 20,
  showPageJump: true,
  collapseOnSortingChange: true,
  collapseOnPageChange: true,
  collapseOnDataChange: true,
  freezeWhenExpanded: false,
  sortable: true,
  multiSort: true,
  resizable: true,
  filterable: false,
  defaultSortDesc: false,
  defaultSorted: [],
  defaultFiltered: [],
  defaultResized: [],
  defaultExpanded: {},
  // eslint-disable-next-line no-unused-vars
  defaultFilterMethod: function defaultFilterMethod(filter, row, column) {
    var id = filter.pivotId || filter.id;
    return row[id] !== undefined ? String(row[id]).startsWith(filter.value) : true;
  },
  // eslint-disable-next-line no-unused-vars
  defaultSortMethod: function defaultSortMethod(a, b, desc) {
    // force null and undefined to the bottom
    a = a === null || a === undefined ? '' : a;
    b = b === null || b === undefined ? '' : b;
    // force any string values to lowercase
    a = typeof a === 'string' ? a.toLowerCase() : a;
    b = typeof b === 'string' ? b.toLowerCase() : b;
    // Return either 1 or -1 to indicate a sort priority
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    // returning 0, undefined or any falsey value will use subsequent sorts or
    // the index as a tiebreaker
    return 0;
  },

  // Controlled State Props
  // page: undefined,
  // pageSize: undefined,
  // sorted: [],
  // filtered: [],
  // resized: [],
  // expanded: {},

  // Controlled State Callbacks
  onPageChange: undefined,
  onPageSizeChange: undefined,
  onSortedChange: undefined,
  onFilteredChange: undefined,
  onResizedChange: undefined,
  onExpandedChange: undefined,

  // Pivoting
  pivotBy: undefined,

  // Key Constants
  pivotValKey: '_pivotVal',
  pivotIDKey: '_pivotID',
  subRowsKey: '_subRows',
  aggregatedKey: '_aggregated',
  nestingLevelKey: '_nestingLevel',
  originalKey: '_original',
  indexKey: '_index',
  groupedByPivotKey: '_groupedByPivot',

  // Server-side Callbacks
  onFetchData: function onFetchData() {
    return null;
  },

  // Classes
  className: '',
  style: {},

  // Component decorators
  getProps: emptyObj,
  getTableProps: emptyObj,
  getTheadGroupProps: emptyObj,
  getTheadGroupTrProps: emptyObj,
  getTheadGroupThProps: emptyObj,
  getTheadProps: emptyObj,
  getTheadTrProps: emptyObj,
  getTheadThProps: emptyObj,
  getTheadFilterProps: emptyObj,
  getTheadFilterTrProps: emptyObj,
  getTheadFilterThProps: emptyObj,
  getTbodyProps: emptyObj,
  getTrGroupProps: emptyObj,
  getTrProps: emptyObj,
  getTdProps: emptyObj,
  getTfootProps: emptyObj,
  getTfootTrProps: emptyObj,
  getTfootTdProps: emptyObj,
  getPaginationProps: emptyObj,
  getLoadingProps: emptyObj,
  getNoDataProps: emptyObj,
  getResizerProps: emptyObj,

  // Global Column Defaults
  column: {
    // Renderers
    Cell: undefined,
    Header: undefined,
    Footer: undefined,
    Aggregated: undefined,
    Pivot: undefined,
    PivotValue: undefined,
    Expander: undefined,
    Filter: undefined,
    // All Columns
    sortable: undefined, // use table default
    resizable: undefined, // use table default
    filterable: undefined, // use table default
    show: true,
    minWidth: 100,
    // Cells only
    className: '',
    style: {},
    getProps: emptyObj,
    // Pivot only
    aggregate: undefined,
    // Headers only
    headerClassName: '',
    headerStyle: {},
    getHeaderProps: emptyObj,
    // Footers only
    footerClassName: '',
    footerStyle: {},
    getFooterProps: emptyObj,
    filterMethod: undefined,
    filterAll: false,
    sortMethod: undefined
  },

  // Global Expander Column Defaults
  expanderDefaults: {
    sortable: false,
    resizable: false,
    filterable: false,
    width: 35
  },

  pivotDefaults: {
    // extend the defaults for pivoted columns here
  },

  // Text
  previousText: 'Previous',
  nextText: 'Next',
  loadingText: 'Loading...',
  noDataText: 'No rows found',
  pageText: 'Page',
  ofText: 'of',
  rowsText: 'rows',

  // Components
  TableComponent: function TableComponent(_ref) {
    var children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties(_ref, ['children', 'className']);

    return _react2.default.createElement(
      'div',
      _extends({
        className: (0, _classnames2.default)('rt-table', className),
        role: 'grid'
        // tabIndex='0'
      }, rest),
      children
    );
  },
  TheadComponent: _utils2.default.makeTemplateComponent('rt-thead', 'Thead'),
  TbodyComponent: _utils2.default.makeTemplateComponent('rt-tbody', 'Tbody'),
  TrGroupComponent: function TrGroupComponent(_ref2) {
    var children = _ref2.children,
        className = _ref2.className,
        rest = _objectWithoutProperties(_ref2, ['children', 'className']);

    return _react2.default.createElement(
      'div',
      _extends({ className: (0, _classnames2.default)('rt-tr-group', className), role: 'rowgroup' }, rest),
      children
    );
  },
  TrComponent: function TrComponent(_ref3) {
    var children = _ref3.children,
        className = _ref3.className,
        rest = _objectWithoutProperties(_ref3, ['children', 'className']);

    return _react2.default.createElement(
      'div',
      _extends({ className: (0, _classnames2.default)('rt-tr', className), role: 'row' }, rest),
      children
    );
  },
  ThComponent: function ThComponent(_ref4) {
    var toggleSort = _ref4.toggleSort,
        className = _ref4.className,
        children = _ref4.children,
        rest = _objectWithoutProperties(_ref4, ['toggleSort', 'className', 'children']);

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      _react2.default.createElement(
        'div',
        _extends({
          className: (0, _classnames2.default)('rt-th', className),
          onClick: function onClick(e) {
            return toggleSort && toggleSort(e);
          },
          role: 'columnheader',
          tabIndex: '-1' // Resolves eslint issues without implementing keyboard navigation incorrectly
        }, rest),
        children
      )
    );
  },
  TdComponent: function TdComponent(_ref5) {
    var toggleSort = _ref5.toggleSort,
        className = _ref5.className,
        children = _ref5.children,
        rest = _objectWithoutProperties(_ref5, ['toggleSort', 'className', 'children']);

    return _react2.default.createElement(
      'div',
      _extends({ className: (0, _classnames2.default)('rt-td', className), role: 'gridcell' }, rest),
      children
    );
  },
  TfootComponent: _utils2.default.makeTemplateComponent('rt-tfoot', 'Tfoot'),
  FilterComponent: function FilterComponent(_ref6) {
    var filter = _ref6.filter,
        _onChange = _ref6.onChange;
    return _react2.default.createElement('input', {
      type: 'text',
      style: {
        width: '100%'
      },
      value: filter ? filter.value : '',
      onChange: function onChange(event) {
        return _onChange(event.target.value);
      }
    });
  },
  ExpanderComponent: function ExpanderComponent(_ref7) {
    var isExpanded = _ref7.isExpanded;
    return _react2.default.createElement(
      'div',
      { className: (0, _classnames2.default)('rt-expander', isExpanded && '-open') },
      '\u2022'
    );
  },
  PivotValueComponent: function PivotValueComponent(_ref8) {
    var subRows = _ref8.subRows,
        value = _ref8.value;
    return _react2.default.createElement(
      'span',
      null,
      value,
      ' ',
      subRows && '(' + subRows.length + ')'
    );
  },
  AggregatedComponent: function AggregatedComponent(_ref9) {
    var subRows = _ref9.subRows,
        column = _ref9.column;

    var previewValues = subRows.filter(function (d) {
      return typeof d[column.id] !== 'undefined';
    }).map(function (row, i) {
      return (
        // eslint-disable-next-line react/no-array-index-key
        _react2.default.createElement(
          'span',
          { key: i },
          row[column.id],
          i < subRows.length - 1 ? ', ' : ''
        )
      );
    });
    return _react2.default.createElement(
      'span',
      null,
      previewValues
    );
  },
  PivotComponent: undefined, // this is a computed default generated using
  // the ExpanderComponent and PivotValueComponent at run-time in methods.js
  PaginationComponent: _pagination2.default,
  PreviousComponent: undefined,
  NextComponent: undefined,
  LoadingComponent: function LoadingComponent(_ref10) {
    var className = _ref10.className,
        loading = _ref10.loading,
        loadingText = _ref10.loadingText,
        rest = _objectWithoutProperties(_ref10, ['className', 'loading', 'loadingText']);

    return _react2.default.createElement(
      'div',
      _extends({ className: (0, _classnames2.default)('-loading', { '-active': loading }, className) }, rest),
      _react2.default.createElement(
        'div',
        { className: '-loading-inner' },
        loadingText
      )
    );
  },
  NoDataComponent: _utils2.default.makeTemplateComponent('rt-noData', 'NoData'),
  ResizerComponent: _utils2.default.makeTemplateComponent('rt-resizer', 'Resizer'),
  PadRowComponent: function PadRowComponent() {
    return _react2.default.createElement(
      'span',
      null,
      '\xA0'
    );
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWZhdWx0UHJvcHMuanMiXSwibmFtZXMiOlsiZW1wdHlPYmoiLCJkYXRhIiwicmVzb2x2ZURhdGEiLCJsb2FkaW5nIiwic2hvd1BhZ2luYXRpb24iLCJzaG93UGFnaW5hdGlvblRvcCIsInNob3dQYWdpbmF0aW9uQm90dG9tIiwic2hvd1BhZ2VTaXplT3B0aW9ucyIsInBhZ2VTaXplT3B0aW9ucyIsImRlZmF1bHRQYWdlIiwiZGVmYXVsdFBhZ2VTaXplIiwic2hvd1BhZ2VKdW1wIiwiY29sbGFwc2VPblNvcnRpbmdDaGFuZ2UiLCJjb2xsYXBzZU9uUGFnZUNoYW5nZSIsImNvbGxhcHNlT25EYXRhQ2hhbmdlIiwiZnJlZXplV2hlbkV4cGFuZGVkIiwic29ydGFibGUiLCJtdWx0aVNvcnQiLCJyZXNpemFibGUiLCJmaWx0ZXJhYmxlIiwiZGVmYXVsdFNvcnREZXNjIiwiZGVmYXVsdFNvcnRlZCIsImRlZmF1bHRGaWx0ZXJlZCIsImRlZmF1bHRSZXNpemVkIiwiZGVmYXVsdEV4cGFuZGVkIiwiZGVmYXVsdEZpbHRlck1ldGhvZCIsImZpbHRlciIsInJvdyIsImNvbHVtbiIsImlkIiwicGl2b3RJZCIsInVuZGVmaW5lZCIsIlN0cmluZyIsInN0YXJ0c1dpdGgiLCJ2YWx1ZSIsImRlZmF1bHRTb3J0TWV0aG9kIiwiYSIsImIiLCJkZXNjIiwidG9Mb3dlckNhc2UiLCJvblBhZ2VDaGFuZ2UiLCJvblBhZ2VTaXplQ2hhbmdlIiwib25Tb3J0ZWRDaGFuZ2UiLCJvbkZpbHRlcmVkQ2hhbmdlIiwib25SZXNpemVkQ2hhbmdlIiwib25FeHBhbmRlZENoYW5nZSIsInBpdm90QnkiLCJwaXZvdFZhbEtleSIsInBpdm90SURLZXkiLCJzdWJSb3dzS2V5IiwiYWdncmVnYXRlZEtleSIsIm5lc3RpbmdMZXZlbEtleSIsIm9yaWdpbmFsS2V5IiwiaW5kZXhLZXkiLCJncm91cGVkQnlQaXZvdEtleSIsIm9uRmV0Y2hEYXRhIiwiY2xhc3NOYW1lIiwic3R5bGUiLCJnZXRQcm9wcyIsImdldFRhYmxlUHJvcHMiLCJnZXRUaGVhZEdyb3VwUHJvcHMiLCJnZXRUaGVhZEdyb3VwVHJQcm9wcyIsImdldFRoZWFkR3JvdXBUaFByb3BzIiwiZ2V0VGhlYWRQcm9wcyIsImdldFRoZWFkVHJQcm9wcyIsImdldFRoZWFkVGhQcm9wcyIsImdldFRoZWFkRmlsdGVyUHJvcHMiLCJnZXRUaGVhZEZpbHRlclRyUHJvcHMiLCJnZXRUaGVhZEZpbHRlclRoUHJvcHMiLCJnZXRUYm9keVByb3BzIiwiZ2V0VHJHcm91cFByb3BzIiwiZ2V0VHJQcm9wcyIsImdldFRkUHJvcHMiLCJnZXRUZm9vdFByb3BzIiwiZ2V0VGZvb3RUclByb3BzIiwiZ2V0VGZvb3RUZFByb3BzIiwiZ2V0UGFnaW5hdGlvblByb3BzIiwiZ2V0TG9hZGluZ1Byb3BzIiwiZ2V0Tm9EYXRhUHJvcHMiLCJnZXRSZXNpemVyUHJvcHMiLCJDZWxsIiwiSGVhZGVyIiwiRm9vdGVyIiwiQWdncmVnYXRlZCIsIlBpdm90IiwiUGl2b3RWYWx1ZSIsIkV4cGFuZGVyIiwiRmlsdGVyIiwic2hvdyIsIm1pbldpZHRoIiwiYWdncmVnYXRlIiwiaGVhZGVyQ2xhc3NOYW1lIiwiaGVhZGVyU3R5bGUiLCJnZXRIZWFkZXJQcm9wcyIsImZvb3RlckNsYXNzTmFtZSIsImZvb3RlclN0eWxlIiwiZ2V0Rm9vdGVyUHJvcHMiLCJmaWx0ZXJNZXRob2QiLCJmaWx0ZXJBbGwiLCJzb3J0TWV0aG9kIiwiZXhwYW5kZXJEZWZhdWx0cyIsIndpZHRoIiwicGl2b3REZWZhdWx0cyIsInByZXZpb3VzVGV4dCIsIm5leHRUZXh0IiwibG9hZGluZ1RleHQiLCJub0RhdGFUZXh0IiwicGFnZVRleHQiLCJvZlRleHQiLCJyb3dzVGV4dCIsIlRhYmxlQ29tcG9uZW50IiwiY2hpbGRyZW4iLCJyZXN0IiwiVGhlYWRDb21wb25lbnQiLCJfIiwibWFrZVRlbXBsYXRlQ29tcG9uZW50IiwiVGJvZHlDb21wb25lbnQiLCJUckdyb3VwQ29tcG9uZW50IiwiVHJDb21wb25lbnQiLCJUaENvbXBvbmVudCIsInRvZ2dsZVNvcnQiLCJlIiwiVGRDb21wb25lbnQiLCJUZm9vdENvbXBvbmVudCIsIkZpbHRlckNvbXBvbmVudCIsIm9uQ2hhbmdlIiwiZXZlbnQiLCJ0YXJnZXQiLCJFeHBhbmRlckNvbXBvbmVudCIsImlzRXhwYW5kZWQiLCJQaXZvdFZhbHVlQ29tcG9uZW50Iiwic3ViUm93cyIsImxlbmd0aCIsIkFnZ3JlZ2F0ZWRDb21wb25lbnQiLCJwcmV2aWV3VmFsdWVzIiwiZCIsIm1hcCIsImkiLCJQaXZvdENvbXBvbmVudCIsIlBhZ2luYXRpb25Db21wb25lbnQiLCJQYWdpbmF0aW9uIiwiUHJldmlvdXNDb21wb25lbnQiLCJOZXh0Q29tcG9uZW50IiwiTG9hZGluZ0NvbXBvbmVudCIsIk5vRGF0YUNvbXBvbmVudCIsIlJlc2l6ZXJDb21wb25lbnQiLCJQYWRSb3dDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7QUFGQTs7O0FBSUEsSUFBTUEsV0FBVyxTQUFYQSxRQUFXO0FBQUEsU0FBTyxFQUFQO0FBQUEsQ0FBakI7O2tCQUVlO0FBQ2I7QUFDQUMsUUFBTSxFQUZPO0FBR2JDLGVBQWE7QUFBQSxXQUFRRCxJQUFSO0FBQUEsR0FIQTtBQUliRSxXQUFTLEtBSkk7QUFLYkMsa0JBQWdCLElBTEg7QUFNYkMscUJBQW1CLEtBTk47QUFPYkMsd0JBQXNCLElBUFQ7QUFRYkMsdUJBQXFCLElBUlI7QUFTYkMsbUJBQWlCLENBQUMsQ0FBRCxFQUFJLEVBQUosRUFBUSxFQUFSLEVBQVksRUFBWixFQUFnQixFQUFoQixFQUFvQixHQUFwQixDQVRKO0FBVWJDLGVBQWEsQ0FWQTtBQVdiQyxtQkFBaUIsRUFYSjtBQVliQyxnQkFBYyxJQVpEO0FBYWJDLDJCQUF5QixJQWJaO0FBY2JDLHdCQUFzQixJQWRUO0FBZWJDLHdCQUFzQixJQWZUO0FBZ0JiQyxzQkFBb0IsS0FoQlA7QUFpQmJDLFlBQVUsSUFqQkc7QUFrQmJD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UUFBckMsQ0E3UEo7QUE4UGI4QixvQkFBa0IvQixnQkFBRUMscUJBQUYsQ0FBd0IsWUFBeEIsRUFBc0MsU0FBdEMsQ0E5UEw7QUErUGIrQixtQkFBaUI7QUFBQSxXQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBTjtBQUFBO0FBL1BKLEMiLCJmaWxlIjoiZGVmYXVsdFByb3BzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJ1xyXG4vL1xyXG5pbXBvcnQgXyBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQgUGFnaW5hdGlvbiBmcm9tICcuL3BhZ2luYXRpb24nXHJcblxyXG5jb25zdCBlbXB0eU9iaiA9ICgpID0+ICh7fSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAvLyBHZW5lcmFsXHJcbiAgZGF0YTogW10sXHJcbiAgcmVzb2x2ZURhdGE6IGRhdGEgPT4gZGF0YSxcclxuICBsb2FkaW5nOiBmYWxzZSxcclxuICBzaG93UGFnaW5hdGlvbjogdHJ1ZSxcclxuICBzaG93UGFnaW5hdGlvblRvcDogZmFsc2UsXHJcbiAgc2hvd1BhZ2luYXRpb25Cb3R0b206IHRydWUsXHJcbiAgc2hvd1BhZ2VTaXplT3B0aW9uczogdHJ1ZSxcclxuICBwYWdlU2l6ZU9wdGlvbnM6IFs1LCAxMCwgMjAsIDI1LCA1MCwgMTAwXSxcclxuICBkZWZhdWx0UGFnZTogMCxcclxuICBkZWZhdWx0UGFnZVNpemU6IDIwLFxyXG4gIHNob3dQYWdlSnVtcDogdHJ1ZSxcclxuICBjb2xsYXBzZU9uU29ydGluZ0NoYW5nZTogdHJ1ZSxcclxuICBjb2xsYXBzZU9uUGFnZUNoYW5nZTogdHJ1ZSxcclxuICBjb2xsYXBzZU9uRGF0YUNoYW5nZTogdHJ1ZSxcclxuICBmcmVlemVXaGVuRXhwYW5kZWQ6IGZhbHNlLFxyXG4gIHNvcnRhYmxlOiB0cnVlLFxyXG4gIG11bHRpU29ydDogdHJ1ZSxcclxuICByZXNpemFibGU6IHRydWUsXHJcbiAgZmlsdGVyYWJsZTogZmFsc2UsXHJcbiAgZGVmYXVsdFNvcnREZXNjOiBmYWxzZSxcclxuICBkZWZhdWx0U29ydGVkOiBbXSxcclxuICBkZWZhdWx0RmlsdGVyZWQ6IFtdLFxyXG4gIGRlZmF1bHRSZXNpemVkOiBbXSxcclxuICBkZWZhdWx0RXhwYW5kZWQ6IHt9LFxyXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gIGRlZmF1bHRGaWx0ZXJNZXRob2Q6IChmaWx0ZXIsIHJvdywgY29sdW1uKSA9PiB7XHJcbiAgICBjb25zdCBpZCA9IGZpbHRlci5waXZvdElkIHx8IGZpbHRlci5pZFxyXG4gICAgcmV0dXJuIHJvd1tpZF0gIT09IHVuZGVmaW5lZCA/IFN0cmluZyhyb3dbaWRdKS5zdGFydHNXaXRoKGZpbHRlci52YWx1ZSkgOiB0cnVlXHJcbiAgfSxcclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcclxuICBkZWZhdWx0U29ydE1ldGhvZDogKGEsIGIsIGRlc2MpID0+IHtcclxuICAgIC8vIGZvcmNlIG51bGwgYW5kIHVuZGVmaW5lZCB0byB0aGUgYm90dG9tXHJcbiAgICBhID0gYSA9PT0gbnVsbCB8fCBhID09PSB1bmRlZmluZWQgPyAnJyA6IGFcclxuICAgIGIgPSBiID09PSBudWxsIHx8IGIgPT09IHVuZGVmaW5lZCA/ICcnIDogYlxyXG4gICAgLy8gZm9yY2UgYW55IHN0cmluZyB2YWx1ZXMgdG8gbG93ZXJjYXNlXHJcbiAgICBhID0gdHlwZW9mIGEgPT09ICdzdHJpbmcnID8gYS50b0xvd2VyQ2FzZSgpIDogYVxyXG4gICAgYiA9IHR5cGVvZiBiID09PSAnc3RyaW5nJyA/IGIudG9Mb3dlckNhc2UoKSA6IGJcclxuICAgIC8vIFJldHVybiBlaXRoZXIgMSBvciAtMSB0byBpbmRpY2F0ZSBhIHNvcnQgcHJpb3JpdHlcclxuICAgIGlmIChhID4gYikge1xyXG4gICAgICByZXR1cm4gMVxyXG4gICAgfVxyXG4gICAgaWYgKGEgPCBiKSB7XHJcbiAgICAgIHJldHVybiAtMVxyXG4gICAgfVxyXG4gICAgLy8gcmV0dXJuaW5nIDAsIHVuZGVmaW5lZCBvciBhbnkgZmFsc2V5IHZhbHVlIHdpbGwgdXNlIHN1YnNlcXVlbnQgc29ydHMgb3JcclxuICAgIC8vIHRoZSBpbmRleCBhcyBhIHRpZWJyZWFrZXJcclxuICAgIHJldHVybiAwXHJcbiAgfSxcclxuXHJcbiAgLy8gQ29udHJvbGxlZCBTdGF0ZSBQcm9wc1xyXG4gIC8vIHBhZ2U6IHVuZGVmaW5lZCxcclxuICAvLyBwYWdlU2l6ZTogdW5kZWZpbmVkLFxyXG4gIC8vIHNvcnRlZDogW10sXHJcbiAgLy8gZmlsdGVyZWQ6IFtdLFxyXG4gIC8vIHJlc2l6ZWQ6IFtdLFxyXG4gIC8vIGV4cGFuZGVkOiB7fSxcclxuXHJcbiAgLy8gQ29udHJvbGxlZCBTdGF0ZSBDYWxsYmFja3NcclxuICBvblBhZ2VDaGFuZ2U6IHVuZGVmaW5lZCxcclxuICBvblBhZ2VTaXplQ2hhbmdlOiB1bmRlZmluZWQsXHJcbiAgb25Tb3J0ZWRDaGFuZ2U6IHVuZGVmaW5lZCxcclxuICBvbkZpbHRlcmVkQ2hhbmdlOiB1bmRlZmluZWQsXHJcbiAgb25SZXNpemVkQ2hhbmdlOiB1bmRlZmluZWQsXHJcbiAgb25FeHBhbmRlZENoYW5nZTogdW5kZWZpbmVkLFxyXG5cclxuICAvLyBQaXZvdGluZ1xyXG4gIHBpdm90Qnk6IHVuZGVmaW5lZCxcclxuXHJcbiAgLy8gS2V5IENvbnN0YW50c1xyXG4gIHBpdm90VmFsS2V5OiAnX3Bpdm90VmFsJyxcclxuICBwaXZvdElES2V5OiAnX3Bpdm90SUQnLFxyXG4gIHN1YlJvd3NLZXk6ICdfc3ViUm93cycsXHJcbiAgYWdncmVnYXRlZEtleTogJ19hZ2dyZWdhdGVkJyxcclxuICBuZXN0aW5nTGV2ZWxLZXk6ICdfbmVzdGluZ0xldmVsJyxcclxuICBvcmlnaW5hbEtleTogJ19vcmlnaW5hbCcsXHJcbiAgaW5kZXhLZXk6ICdfaW5kZXgnLFxyXG4gIGdyb3VwZWRCeVBpdm90S2V5OiAnX2dyb3VwZWRCeVBpdm90JyxcclxuXHJcbiAgLy8gU2VydmVyLXNpZGUgQ2FsbGJhY2tzXHJcbiAgb25GZXRjaERhdGE6ICgpID0+IG51bGwsXHJcblxyXG4gIC8vIENsYXNzZXNcclxuICBjbGFzc05hbWU6ICcnLFxyXG4gIHN0eWxlOiB7fSxcclxuXHJcbiAgLy8gQ29tcG9uZW50IGRlY29yYXRvcnNcclxuICBnZXRQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGFibGVQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGhlYWRHcm91cFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUaGVhZEdyb3VwVHJQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGhlYWRHcm91cFRoUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRoZWFkUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRoZWFkVHJQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGhlYWRUaFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUaGVhZEZpbHRlclByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUaGVhZEZpbHRlclRyUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRoZWFkRmlsdGVyVGhQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGJvZHlQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VHJHcm91cFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUclByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUZFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUZm9vdFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUZm9vdFRyUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRmb290VGRQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0UGFnaW5hdGlvblByb3BzOiBlbXB0eU9iaixcclxuICBnZXRMb2FkaW5nUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldE5vRGF0YVByb3BzOiBlbXB0eU9iaixcclxuICBnZXRSZXNpemVyUHJvcHM6IGVtcHR5T2JqLFxyXG5cclxuICAvLyBHbG9iYWwgQ29sdW1uIERlZmF1bHRzXHJcbiAgY29sdW1uOiB7XHJcbiAgICAvLyBSZW5kZXJlcnNcclxuICAgIENlbGw6IHVuZGVmaW5lZCxcclxuICAgIEhlYWRlcjogdW5kZWZpbmVkLFxyXG4gICAgRm9vdGVyOiB1bmRlZmluZWQsXHJcbiAgICBBZ2dyZWdhdGVkOiB1bmRlZmluZWQsXHJcbiAgICBQaXZvdDogdW5kZWZpbmVkLFxyXG4gICAgUGl2b3RWYWx1ZTogdW5kZWZpbmVkLFxyXG4gICAgRXhwYW5kZXI6IHVuZGVmaW5lZCxcclxuICAgIEZpbHRlcjogdW5kZWZpbmVkLFxyXG4gICAgLy8gQWxsIENvbHVtbnNcclxuICAgIHNvcnRhYmxlOiB1bmRlZmluZWQsIC8vIHVzZSB0YWJsZSBkZWZhdWx0XHJcbiAgICByZXNpemFibGU6IHVuZGVmaW5lZCwgLy8gdXNlIHRhYmxlIGRlZmF1bHRcclxuICAgIGZpbHRlcmFibGU6IHVuZGVmaW5lZCwgLy8gdXNlIHRhYmxlIGRlZmF1bHRcclxuICAgIHNob3c6IHRydWUsXHJcbiAgICBtaW5XaWR0aDogMTAwLFxyXG4gICAgLy8gQ2VsbHMgb25seVxyXG4gICAgY2xhc3NOYW1lOiAnJyxcclxuICAgIHN0eWxlOiB7fSxcclxuICAgIGdldFByb3BzOiBlbXB0eU9iaixcclxuICAgIC8vIFBpdm90IG9ubHlcclxuICAgIGFnZ3JlZ2F0ZTogdW5kZWZpbmVkLFxyXG4gICAgLy8gSGVhZGVycyBvbmx5XHJcbiAgICBoZWFkZXJDbGFzc05hbWU6ICcnLFxyXG4gICAgaGVhZGVyU3R5bGU6IHt9LFxyXG4gICAgZ2V0SGVhZGVyUHJvcHM6IGVtcHR5T2JqLFxyXG4gICAgLy8gRm9vdGVycyBvbmx5XHJcbiAgICBmb290ZXJDbGFzc05hbWU6ICcnLFxyXG4gICAgZm9vdGVyU3R5bGU6IHt9LFxyXG4gICAgZ2V0Rm9vdGVyUHJvcHM6IGVtcHR5T2JqLFxyXG4gICAgZmlsdGVyTWV0aG9kOiB1bmRlZmluZWQsXHJcbiAgICBmaWx0ZXJBbGw6IGZhbHNlLFxyXG4gICAgc29ydE1ldGhvZDogdW5kZWZpbmVkLFxyXG4gIH0sXHJcblxyXG4gIC8vIEdsb2JhbCBFeHBhbmRlciBDb2x1bW4gRGVmYXVsdHNcclxuICBleHBhbmRlckRlZmF1bHRzOiB7XHJcbiAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICByZXNpemFibGU6IGZhbHNlLFxyXG4gICAgZmlsdGVyYWJsZTogZmFsc2UsXHJcbiAgICB3aWR0aDogMzUsXHJcbiAgfSxcclxuXHJcbiAgcGl2b3REZWZhdWx0czoge1xyXG4gICAgLy8gZXh0ZW5kIHRoZSBkZWZhdWx0cyBmb3IgcGl2b3RlZCBjb2x1bW5zIGhlcmVcclxuICB9LFxyXG5cclxuICAvLyBUZXh0XHJcbiAgcHJldmlvdXNUZXh0OiAnUHJldmlvdXMnLFxyXG4gIG5leHRUZXh0OiAnTmV4dCcsXHJcbiAgbG9hZGluZ1RleHQ6ICdMb2FkaW5nLi4uJyxcclxuICBub0RhdGFUZXh0OiAnTm8gcm93cyBmb3VuZCcsXHJcbiAgcGFnZVRleHQ6ICdQYWdlJyxcclxuICBvZlRleHQ6ICdvZicsXHJcbiAgcm93c1RleHQ6ICdyb3dzJyxcclxuXHJcbiAgLy8gQ29tcG9uZW50c1xyXG4gIFRhYmxlQ29tcG9uZW50OiAoeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCAuLi5yZXN0IH0pID0+IChcclxuICAgIDxkaXZcclxuICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdydC10YWJsZScsIGNsYXNzTmFtZSl9XHJcbiAgICAgIHJvbGU9XCJncmlkXCJcclxuICAgICAgLy8gdGFiSW5kZXg9JzAnXHJcbiAgICAgIHsuLi5yZXN0fVxyXG4gICAgPlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApLFxyXG4gIFRoZWFkQ29tcG9uZW50OiBfLm1ha2VUZW1wbGF0ZUNvbXBvbmVudCgncnQtdGhlYWQnLCAnVGhlYWQnKSxcclxuICBUYm9keUNvbXBvbmVudDogXy5tYWtlVGVtcGxhdGVDb21wb25lbnQoJ3J0LXRib2R5JywgJ1Rib2R5JyksXHJcbiAgVHJHcm91cENvbXBvbmVudDogKHsgY2hpbGRyZW4sIGNsYXNzTmFtZSwgLi4ucmVzdCB9KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygncnQtdHItZ3JvdXAnLCBjbGFzc05hbWUpfSByb2xlPVwicm93Z3JvdXBcIiB7Li4ucmVzdH0+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICksXHJcbiAgVHJDb21wb25lbnQ6ICh7IGNoaWxkcmVuLCBjbGFzc05hbWUsIC4uLnJlc3QgfSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3J0LXRyJywgY2xhc3NOYW1lKX0gcm9sZT1cInJvd1wiIHsuLi5yZXN0fT5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKSxcclxuICBUaENvbXBvbmVudDogKHtcclxuICAgIHRvZ2dsZVNvcnQsIGNsYXNzTmFtZSwgY2hpbGRyZW4sIC4uLnJlc3RcclxuICB9KSA9PiAoXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUganN4LWExMXkvY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50c1xyXG4gICAgPGRpdlxyXG4gICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3J0LXRoJywgY2xhc3NOYW1lKX1cclxuICAgICAgb25DbGljaz17ZSA9PiB0b2dnbGVTb3J0ICYmIHRvZ2dsZVNvcnQoZSl9XHJcbiAgICAgIHJvbGU9XCJjb2x1bW5oZWFkZXJcIlxyXG4gICAgICB0YWJJbmRleD1cIi0xXCIgLy8gUmVzb2x2ZXMgZXNsaW50IGlzc3VlcyB3aXRob3V0IGltcGxlbWVudGluZyBrZXlib2FyZCBuYXZpZ2F0aW9uIGluY29ycmVjdGx5XHJcbiAgICAgIHsuLi5yZXN0fVxyXG4gICAgPlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApLFxyXG4gIFRkQ29tcG9uZW50OiAoe1xyXG4gICAgdG9nZ2xlU29ydCwgY2xhc3NOYW1lLCBjaGlsZHJlbiwgLi4ucmVzdFxyXG4gIH0pID0+IChcclxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdydC10ZCcsIGNsYXNzTmFtZSl9IHJvbGU9XCJncmlkY2VsbFwiIHsuLi5yZXN0fT5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKSxcclxuICBUZm9vdENvbXBvbmVudDogXy5tYWtlVGVtcGxhdGVDb21wb25lbnQoJ3J0LXRmb290JywgJ1Rmb290JyksXHJcbiAgRmlsdGVyQ29tcG9uZW50OiAoeyBmaWx0ZXIsIG9uQ2hhbmdlIH0pID0+IChcclxuICAgIDxpbnB1dFxyXG4gICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgfX1cclxuICAgICAgdmFsdWU9e2ZpbHRlciA/IGZpbHRlci52YWx1ZSA6ICcnfVxyXG4gICAgICBvbkNoYW5nZT17ZXZlbnQgPT4gb25DaGFuZ2UoZXZlbnQudGFyZ2V0LnZhbHVlKX1cclxuICAgIC8+XHJcbiAgKSxcclxuICBFeHBhbmRlckNvbXBvbmVudDogKHsgaXNFeHBhbmRlZCB9KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygncnQtZXhwYW5kZXInLCBpc0V4cGFuZGVkICYmICctb3BlbicpfT4mYnVsbDs8L2Rpdj5cclxuICApLFxyXG4gIFBpdm90VmFsdWVDb21wb25lbnQ6ICh7IHN1YlJvd3MsIHZhbHVlIH0pID0+IChcclxuICAgIDxzcGFuPlxyXG4gICAgICB7dmFsdWV9IHtzdWJSb3dzICYmIGAoJHtzdWJSb3dzLmxlbmd0aH0pYH1cclxuICAgIDwvc3Bhbj5cclxuICApLFxyXG4gIEFnZ3JlZ2F0ZWRDb21wb25lbnQ6ICh7IHN1YlJvd3MsIGNvbHVtbiB9KSA9PiB7XHJcbiAgICBjb25zdCBwcmV2aWV3VmFsdWVzID0gc3ViUm93cy5maWx0ZXIoZCA9PiB0eXBlb2YgZFtjb2x1bW4uaWRdICE9PSAndW5kZWZpbmVkJykubWFwKChyb3csIGkpID0+IChcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLWFycmF5LWluZGV4LWtleVxyXG4gICAgICA8c3BhbiBrZXk9e2l9PlxyXG4gICAgICAgIHtyb3dbY29sdW1uLmlkXX1cclxuICAgICAgICB7aSA8IHN1YlJvd3MubGVuZ3RoIC0gMSA/ICcsICcgOiAnJ31cclxuICAgICAgPC9zcGFuPlxyXG4gICAgKSlcclxuICAgIHJldHVybiA8c3Bhbj57cHJldmlld1ZhbHVlc308L3NwYW4+XHJcbiAgfSxcclxuICBQaXZvdENvbXBvbmVudDogdW5kZWZpbmVkLCAvLyB0aGlzIGlzIGEgY29tcHV0ZWQgZGVmYXVsdCBnZW5lcmF0ZWQgdXNpbmdcclxuICAvLyB0aGUgRXhwYW5kZXJDb21wb25lbnQgYW5kIFBpdm90VmFsdWVDb21wb25lbnQgYXQgcnVuLXRpbWUgaW4gbWV0aG9kcy5qc1xyXG4gIFBhZ2luYXRpb25Db21wb25lbnQ6IFBhZ2luYXRpb24sXHJcbiAgUHJldmlvdXNDb21wb25lbnQ6IHVuZGVmaW5lZCxcclxuICBOZXh0Q29tcG9uZW50OiB1bmRlZmluZWQsXHJcbiAgTG9hZGluZ0NvbXBvbmVudDogKHtcclxuICAgIGNsYXNzTmFtZSwgbG9hZGluZywgbG9hZGluZ1RleHQsIC4uLnJlc3RcclxuICB9KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnLWxvYWRpbmcnLCB7ICctYWN0aXZlJzogbG9hZGluZyB9LCBjbGFzc05hbWUpfSB7Li4ucmVzdH0+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiLWxvYWRpbmctaW5uZXJcIj57bG9hZGluZ1RleHR9PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApLFxyXG4gIE5vRGF0YUNvbXBvbmVudDogXy5tYWtlVGVtcGxhdGVDb21wb25lbnQoJ3J0LW5vRGF0YScsICdOb0RhdGEnKSxcclxuICBSZXNpemVyQ29tcG9uZW50OiBfLm1ha2VUZW1wbGF0ZUNvbXBvbmVudCgncnQtcmVzaXplcicsICdSZXNpemVyJyksXHJcbiAgUGFkUm93Q29tcG9uZW50OiAoKSA9PiA8c3Bhbj4mbmJzcDs8L3NwYW4+LFxyXG59XHJcbiJdfQ==