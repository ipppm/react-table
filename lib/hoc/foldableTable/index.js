'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _left = require('./left.svg');

var _left2 = _interopRequireDefault(_left);

var _right = require('./right.svg');

var _right2 = _interopRequireDefault(_right);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultFoldIconComponent = function defaultFoldIconComponent(_ref) {
    var collapsed = _ref.collapsed;

    var style = { width: 25 };

    if (collapsed) return _react2.default.createElement('img', { src: _right2.default, style: style, alt: 'right' });
    return _react2.default.createElement('img', { src: _left2.default, style: style, alt: 'left' });
};

var defaultFoldButtonComponent = function defaultFoldButtonComponent(_ref2) {
    var header = _ref2.header,
        collapsed = _ref2.collapsed,
        icon = _ref2.icon,
        onClick = _ref2.onClick;

    var style = {
        marginLeft: "0px",
        marginTop: "-5px",
        marginBottom: "-8px",
        float: "left",
        cursor: "pointer"
    };

    return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
            'div',
            { style: style, onClick: onClick },
            icon
        ),
        !collapsed && _react2.default.createElement(
            'div',
            null,
            header
        )
    );
};

exports.default = function (ReactTable) {

    var wrapper = function (_React$Component) {
        _inherits(RTFoldableTable, _React$Component);

        function RTFoldableTable(props, context) {
            _classCallCheck(this, RTFoldableTable);

            var _this = _possibleConstructorReturn(this, (RTFoldableTable.__proto__ || Object.getPrototypeOf(RTFoldableTable)).call(this, props, context));

            _this.onResizedChange = function (resized) {
                var onResizedChange = _this.props.onResizedChange;

                if (onResizedChange) onResizedChange(resized);else _this.setState(function (p) {
                    return { resized: resized };
                });
            };

            _this.removeResized = function (column) {
                var id = column.id;

                if (!id) return;

                var resized = _this.state.resized;

                if (!resized) return;

                var rs = resized.find(function (r) {
                    return r.id === id;
                });
                if (!rs) return;

                var newResized = resized.filter(function (r) {
                    return r !== rs;
                });
                _this.onResizedChange(newResized);
            };

            _this.getWrappedInstance = function () {
                if (!_this.wrappedInstance) console.warn('RTFoldableTable - No wrapped instance');
                if (_this.wrappedInstance.getWrappedInstance) return _this.wrappedInstance.getWrappedInstance();else return _this.wrappedInstance;
            };

            _this.getCopiedKey = function (key) {
                var foldableOriginalKey = _this.props.foldableOriginalKey;

                return '' + foldableOriginalKey + key;
            };

            _this.copyOriginals = function (column) {
                var FoldedColumn = _this.props.FoldedColumn;

                //Stop copy if the column already copied

                if (column.original_Header) return;

                Object.keys(FoldedColumn).forEach(function (k) {
                    var copiedKey = _this.getCopiedKey(k);

                    if (k === "Cell") column[copiedKey] = column[k] ? column[k] : function (c) {
                        return c.value;
                    };else column[copiedKey] = column[k];
                });

                //Copy sub Columns
                if (column.columns && !column.original_Columns) column.original_Columns = column.columns;

                //Copy Header
                if (!column.original_Header) column.original_Header = column.Header;
            };

            _this.restoreToOriginal = function (column) {
                var FoldedColumn = _this.props.FoldedColumn;


                Object.keys(FoldedColumn).forEach(function (k) {
                    //ignore header as handling by foldableHeaderRender
                    if (k === "Header") return;

                    var copiedKey = _this.getCopiedKey(k);
                    column[k] = column[copiedKey];
                });

                if (column.columns && column.original_Columns) column.columns = column.original_Columns;
            };

            _this.getState = function () {
                return _this.props.onFoldChange ? _this.props.folded : _this.state.folded;
            };

            _this.isFolded = function (col) {
                var folded = _this.getState();
                return folded[col.id] === true;
            };

            _this.foldingHandler = function (col) {
                if (!col || !col.id) return;

                var onFoldChange = _this.props.onFoldChange;

                var folded = _this.getState();
                var id = col.id;


                var newFold = Object.assign({}, folded);
                newFold[id] = !newFold[id];

                //Remove the Resized if have
                _this.removeResized(col);

                if (onFoldChange) onFoldChange(newFold);else _this.setState(function (previous) {
                    return { folded: newFold };
                });
            };

            _this.foldableHeaderRender = function (cell) {
                var _this$props = _this.props,
                    FoldButtonComponent = _this$props.FoldButtonComponent,
                    FoldIconComponent = _this$props.FoldIconComponent;
                var column = cell.column;

                var collapsed = _this.isFolded(column);
                var icon = _react2.default.createElement(FoldIconComponent, { collapsed: collapsed });
                var onClick = function onClick() {
                    return _this.foldingHandler(column);
                };

                return _react2.default.createElement(FoldButtonComponent, { header: column.original_Header, collapsed: collapsed, icon: icon, onClick: onClick });
            };

            _this.applyFoldableForColumn = function (column) {
                var collapsed = _this.isFolded(column);
                var FoldedColumn = _this.props.FoldedColumn;

                //Handle Column Header

                if (column.columns) {
                    if (collapsed) {
                        column.columns = [FoldedColumn];
                        column.width = FoldedColumn.width;
                        column.style = FoldedColumn.style;
                    } else _this.restoreToOriginal(column);
                }
                //Handle Normal Column.
                else if (collapsed) column = Object.assign(column, FoldedColumn);else {
                        _this.restoreToOriginal(column);
                    }
            };

            _this.applyFoldableForColumns = function (columns) {
                return columns.map(function (col, index) {
                    if (!col.foldable) return col;

                    //If col don't have id then generate id based on index
                    if (!col.id) col.id = 'col_' + index;

                    _this.copyOriginals(col);
                    //Replace current header with internal header render.
                    col.Header = function (c) {
                        return _this.foldableHeaderRender(c);
                    };
                    //apply foldable
                    _this.applyFoldableForColumn(col);

                    //return the new column out
                    return col;
                });
            };

            _this.state = {
                folded: props.onFoldChange ? undefined : {},
                resized: props.resized || []
            };
            return _this;
        }

        _createClass(RTFoldableTable, [{
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(newProps) {
                if (this.state.resized !== newProps.resized) this.setState(function (p) {
                    return { resized: newProps.resized };
                });
            }

            // this is so we can expose the underlying ReactTable.

        }, {
            key: 'render',
            value: function render() {
                var _this2 = this;

                var _props = this.props,
                    originalCols = _props.columns,
                    FoldButtonComponent = _props.FoldButtonComponent,
                    FoldIconComponent = _props.FoldIconComponent,
                    FoldedColumn = _props.FoldedColumn,
                    rest = _objectWithoutProperties(_props, ['columns', 'FoldButtonComponent', 'FoldIconComponent', 'FoldedColumn']);

                var columns = this.applyFoldableForColumns([].concat(_toConsumableArray(originalCols)));

                var extra = {
                    columns: columns,
                    onResizedChange: this.onResizedChange,
                    resized: this.state.resized
                };

                return _react2.default.createElement(ReactTable, _extends({}, rest, extra, { ref: function ref(r) {
                        return _this2.wrappedInstance = r;
                    } }));
            }
        }]);

        return RTFoldableTable;
    }(_react2.default.Component);

    wrapper.displayName = 'RTFoldableTable';
    wrapper.defaultProps = {
        FoldIconComponent: defaultFoldIconComponent,
        FoldButtonComponent: defaultFoldButtonComponent,
        foldableOriginalKey: 'original_',
        FoldedColumn: {
            Cell: function Cell(c) {
                return '';
            },
            width: 30,
            sortable: false,
            resizable: false,
            filterable: false
        }
    };

    return wrapper;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvZm9sZGFibGVUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Rm9sZEljb25Db21wb25lbnQiLCJjb2xsYXBzZWQiLCJzdHlsZSIsIndpZHRoIiwicmlnaHQiLCJsZWZ0IiwiZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQiLCJoZWFkZXIiLCJpY29uIiwib25DbGljayIsIm1hcmdpbkxlZnQiLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJmbG9hdCIsImN1cnNvciIsIlJlYWN0VGFibGUiLCJ3cmFwcGVyIiwicHJvcHMiLCJjb250ZXh0Iiwib25SZXNpemVkQ2hhbmdlIiwicmVzaXplZCIsInNldFN0YXRlIiwicmVtb3ZlUmVzaXplZCIsImlkIiwiY29sdW1uIiwic3RhdGUiLCJycyIsImZpbmQiLCJyIiwibmV3UmVzaXplZCIsImZpbHRlciIsImdldFdyYXBwZWRJbnN0YW5jZSIsIndyYXBwZWRJbnN0YW5jZSIsImNvbnNvbGUiLCJ3YXJuIiwiZ2V0Q29waWVkS2V5IiwiZm9sZGFibGVPcmlnaW5hbEtleSIsImtleSIsImNvcHlPcmlnaW5hbHMiLCJGb2xkZWRDb2x1bW4iLCJvcmlnaW5hbF9IZWFkZXIiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImNvcGllZEtleSIsImsiLCJjIiwidmFsdWUiLCJjb2x1bW5zIiwib3JpZ2luYWxfQ29sdW1ucyIsIkhlYWRlciIsInJlc3RvcmVUb09yaWdpbmFsIiwiZ2V0U3RhdGUiLCJvbkZvbGRDaGFuZ2UiLCJmb2xkZWQiLCJpc0ZvbGRlZCIsImNvbCIsImZvbGRpbmdIYW5kbGVyIiwibmV3Rm9sZCIsImFzc2lnbiIsImZvbGRhYmxlSGVhZGVyUmVuZGVyIiwiY2VsbCIsIkZvbGRCdXR0b25Db21wb25lbnQiLCJGb2xkSWNvbkNvbXBvbmVudCIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsImFwcGx5Rm9sZGFibGVGb3JDb2x1bW4iLCJhcHBseUZvbGRhYmxlRm9yQ29sdW1ucyIsIm1hcCIsImluZGV4IiwiZm9sZGFibGUiLCJ1bmRlZmluZWQiLCJuZXdQcm9wcyIsIm9yaWdpbmFsQ29scyIsInJlc3QiLCJleHRyYSIsIkNvbXBvbmVudCIsImRpc3BsYXlOYW1lIiwiZGVmYXVsdFByb3BzIiwiQ2VsbCIsInNvcnRhYmxlIiwicmVzaXphYmxlIiwiZmlsdGVyYWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLDJCQUEyQixTQUEzQkEsd0JBQTJCLE9BQW1CO0FBQUEsUUFBaEJDLFNBQWdCLFFBQWhCQSxTQUFnQjs7QUFDaEQsUUFBTUMsUUFBUSxFQUFFQyxPQUFPLEVBQVQsRUFBZDs7QUFFQSxRQUFJRixTQUFKLEVBQ0ksT0FBTyx1Q0FBSyxLQUFLRyxlQUFWLEVBQWlCLE9BQU9GLEtBQXhCLEVBQStCLEtBQUksT0FBbkMsR0FBUDtBQUNKLFdBQU8sdUNBQUssS0FBS0csY0FBVixFQUFnQixPQUFPSCxLQUF2QixFQUE4QixLQUFJLE1BQWxDLEdBQVA7QUFDSCxDQU5EOztBQVFBLElBQU1JLDZCQUE2QixTQUE3QkEsMEJBQTZCLFFBQTBDO0FBQUEsUUFBdkNDLE1BQXVDLFNBQXZDQSxNQUF1QztBQUFBLFFBQS9CTixTQUErQixTQUEvQkEsU0FBK0I7QUFBQSxRQUFwQk8sSUFBb0IsU0FBcEJBLElBQW9CO0FBQUEsUUFBZEMsT0FBYyxTQUFkQSxPQUFjOztBQUN6RSxRQUFNUCxRQUFRO0FBQ1ZRLG9CQUFZLEtBREY7QUFFVkMsbUJBQVcsTUFGRDtBQUdWQyxzQkFBYyxNQUhKO0FBSVZDLGVBQU8sTUFKRztBQUtWQyxnQkFBUTtBQUxFLEtBQWQ7O0FBUUEsV0FBUTtBQUFBO0FBQUE7QUFDSjtBQUFBO0FBQUEsY0FBSyxPQUFPWixLQUFaLEVBQW1CLFNBQVNPLE9BQTVCO0FBQ0tEO0FBREwsU0FESTtBQUlILFNBQUNQLFNBQUQsSUFBYztBQUFBO0FBQUE7QUFBTU07QUFBTjtBQUpYLEtB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dCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBsZWZ0IGZyb20gJy4vbGVmdC5zdmcnO1xyXG5pbXBvcnQgcmlnaHQgZnJvbSAnLi9yaWdodC5zdmcnO1xyXG5cclxuY29uc3QgZGVmYXVsdEZvbGRJY29uQ29tcG9uZW50ID0gKHsgY29sbGFwc2VkIH0pID0+IHtcclxuICAgIGNvbnN0IHN0eWxlID0geyB3aWR0aDogMjUgfTtcclxuXHJcbiAgICBpZiAoY29sbGFwc2VkKVxyXG4gICAgICAgIHJldHVybiA8aW1nIHNyYz17cmlnaHR9IHN0eWxlPXtzdHlsZX0gYWx0PVwicmlnaHRcIiAvPlxyXG4gICAgcmV0dXJuIDxpbWcgc3JjPXtsZWZ0fSBzdHlsZT17c3R5bGV9IGFsdD1cImxlZnRcIiAvPlxyXG59XHJcblxyXG5jb25zdCBkZWZhdWx0Rm9sZEJ1dHRvbkNvbXBvbmVudCA9ICh7IGhlYWRlciwgY29sbGFwc2VkLCBpY29uLCBvbkNsaWNrIH0pID0+IHtcclxuICAgIGNvbnN0IHN0eWxlID0ge1xyXG4gICAgICAgIG1hcmdpbkxlZnQ6IFwiMHB4XCIsXHJcbiAgICAgICAgbWFyZ2luVG9wOiBcIi01cHhcIixcclxuICAgICAgICBtYXJnaW5Cb3R0b206IFwiLThweFwiLFxyXG4gICAgICAgIGZsb2F0OiBcImxlZnRcIixcclxuICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiAoPGRpdj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZX0gb25DbGljaz17b25DbGlja30+XHJcbiAgICAgICAgICAgIHtpY29ufVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHshY29sbGFwc2VkICYmIDxkaXY+e2hlYWRlcn08L2Rpdj59XHJcbiAgICA8L2Rpdj4pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoUmVhY3RUYWJsZSkgPT4ge1xyXG5cclxuICAgIGNvbnN0IHdyYXBwZXIgPSBjbGFzcyBSVEZvbGRhYmxlVGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBmb2xkZWQ6IHByb3BzLm9uRm9sZENoYW5nZSA/IHVuZGVmaW5lZCA6IHt9LFxyXG4gICAgICAgICAgICAgICAgcmVzaXplZDogcHJvcHMucmVzaXplZCB8fCBbXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXdQcm9wcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5yZXNpemVkICE9PSBuZXdQcm9wcy5yZXNpemVkKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShwID0+IHsgcmV0dXJuIHsgcmVzaXplZDogbmV3UHJvcHMucmVzaXplZCB9IH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb25SZXNpemVkQ2hhbmdlID0gcmVzaXplZCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgb25SZXNpemVkQ2hhbmdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgICAgICBpZiAob25SZXNpemVkQ2hhbmdlKVxyXG4gICAgICAgICAgICAgICAgb25SZXNpemVkQ2hhbmdlKHJlc2l6ZWQpO1xyXG4gICAgICAgICAgICBlbHNlIHRoaXMuc2V0U3RhdGUocCA9PiB7IHJldHVybiB7IHJlc2l6ZWQgfSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlbW92ZVJlc2l6ZWQgPSBjb2x1bW4gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7IGlkIH0gPSBjb2x1bW47XHJcbiAgICAgICAgICAgIGlmICghaWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHsgcmVzaXplZCB9ID0gdGhpcy5zdGF0ZTtcclxuICAgICAgICAgICAgaWYgKCFyZXNpemVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBjb25zdCBycyA9IHJlc2l6ZWQuZmluZChyID0+IHIuaWQgPT09IGlkKTtcclxuICAgICAgICAgICAgaWYgKCFycykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV3UmVzaXplZCA9IHJlc2l6ZWQuZmlsdGVyKHIgPT4gciAhPT0gcnMpO1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVzaXplZENoYW5nZShuZXdSZXNpemVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRoaXMgaXMgc28gd2UgY2FuIGV4cG9zZSB0aGUgdW5kZXJseWluZyBSZWFjdFRhYmxlLlxyXG4gICAgICAgIGdldFdyYXBwZWRJbnN0YW5jZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLndyYXBwZWRJbnN0YW5jZSkgY29uc29sZS53YXJuKCdSVEZvbGRhYmxlVGFibGUgLSBObyB3cmFwcGVkIGluc3RhbmNlJyk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UpIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UoKTtcclxuICAgICAgICAgICAgZWxzZSByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2VcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldENvcGllZEtleSA9IGtleSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgZm9sZGFibGVPcmlnaW5hbEtleSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgcmV0dXJuIGAke2ZvbGRhYmxlT3JpZ2luYWxLZXl9JHtrZXl9YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvcHlPcmlnaW5hbHMgPSBjb2x1bW4gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7IEZvbGRlZENvbHVtbiB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgICAgIC8vU3RvcCBjb3B5IGlmIHRoZSBjb2x1bW4gYWxyZWFkeSBjb3BpZWRcclxuICAgICAgICAgICAgaWYgKGNvbHVtbi5vcmlnaW5hbF9IZWFkZXIpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKEZvbGRlZENvbHVtbikuZm9yRWFjaChrID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvcGllZEtleSA9IHRoaXMuZ2V0Q29waWVkS2V5KGspO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChrID09PSBcIkNlbGxcIilcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5bY29waWVkS2V5XSA9IGNvbHVtbltrXSA/IGNvbHVtbltrXSA6IGMgPT4gYy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGVsc2UgY29sdW1uW2NvcGllZEtleV0gPSBjb2x1bW5ba107XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy9Db3B5IHN1YiBDb2x1bW5zXHJcbiAgICAgICAgICAgIGlmIChjb2x1bW4uY29sdW1ucyAmJiAhY29sdW1uLm9yaWdpbmFsX0NvbHVtbnMpXHJcbiAgICAgICAgICAgICAgICBjb2x1bW4ub3JpZ2luYWxfQ29sdW1ucyA9IGNvbHVtbi5jb2x1bW5zO1xyXG5cclxuICAgICAgICAgICAgLy9Db3B5IEhlYWRlclxyXG4gICAgICAgICAgICBpZiAoIWNvbHVtbi5vcmlnaW5hbF9IZWFkZXIpXHJcbiAgICAgICAgICAgICAgICBjb2x1bW4ub3JpZ2luYWxfSGVhZGVyID0gY29sdW1uLkhlYWRlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc3RvcmVUb09yaWdpbmFsID0gY29sdW1uID0+IHtcclxuICAgICAgICAgICAgY29uc3QgeyBGb2xkZWRDb2x1bW4gfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhGb2xkZWRDb2x1bW4pLmZvckVhY2goayA9PiB7XHJcbiAgICAgICAgICAgICAgICAvL2lnbm9yZSBoZWFkZXIgYXMgaGFuZGxpbmcgYnkgZm9sZGFibGVIZWFkZXJSZW5kZXJcclxuICAgICAgICAgICAgICAgIGlmIChrID09PSBcIkhlYWRlclwiKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgY29waWVkS2V5ID0gdGhpcy5nZXRDb3BpZWRLZXkoayk7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5ba10gPSBjb2x1bW5bY29waWVkS2V5XTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29sdW1uLmNvbHVtbnMgJiYgY29sdW1uLm9yaWdpbmFsX0NvbHVtbnMpXHJcbiAgICAgICAgICAgICAgICBjb2x1bW4uY29sdW1ucyA9IGNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0U3RhdGUgPSAoKSA9PiB0aGlzLnByb3BzLm9uRm9sZENoYW5nZSA/IHRoaXMucHJvcHMuZm9sZGVkIDogdGhpcy5zdGF0ZS5mb2xkZWQ7XHJcblxyXG4gICAgICAgIGlzRm9sZGVkID0gY29sID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZm9sZGVkID0gdGhpcy5nZXRTdGF0ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gZm9sZGVkW2NvbC5pZF0gPT09IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb2xkaW5nSGFuZGxlciA9IGNvbCA9PiB7XHJcbiAgICAgICAgICAgIGlmICghY29sIHx8ICFjb2wuaWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHsgb25Gb2xkQ2hhbmdlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgICAgICBjb25zdCBmb2xkZWQgPSB0aGlzLmdldFN0YXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgaWQgfSA9IGNvbDtcclxuXHJcbiAgICAgICAgICAgIGxldCBuZXdGb2xkID0gT2JqZWN0LmFzc2lnbih7fSwgZm9sZGVkKTtcclxuICAgICAgICAgICAgbmV3Rm9sZFtpZF0gPSAhbmV3Rm9sZFtpZF07XHJcblxyXG4gICAgICAgICAgICAvL1JlbW92ZSB0aGUgUmVzaXplZCBpZiBoYXZlXHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUmVzaXplZChjb2wpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9uRm9sZENoYW5nZSlcclxuICAgICAgICAgICAgICAgIG9uRm9sZENoYW5nZShuZXdGb2xkKTtcclxuICAgICAgICAgICAgZWxzZSB0aGlzLnNldFN0YXRlKHByZXZpb3VzID0+IHsgcmV0dXJuIHsgZm9sZGVkOiBuZXdGb2xkIH07IH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9sZGFibGVIZWFkZXJSZW5kZXIgPSAoY2VsbCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7IEZvbGRCdXR0b25Db21wb25lbnQsIEZvbGRJY29uQ29tcG9uZW50IH0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgICAgICBjb25zdCB7IGNvbHVtbiB9ID0gY2VsbDtcclxuICAgICAgICAgICAgY29uc3QgY29sbGFwc2VkID0gdGhpcy5pc0ZvbGRlZChjb2x1bW4pO1xyXG4gICAgICAgICAgICBjb25zdCBpY29uID0gUmVhY3QuY3JlYXRlRWxlbWVudChGb2xkSWNvbkNvbXBvbmVudCwgeyBjb2xsYXBzZWQgfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG9uQ2xpY2sgPSAoKSA9PiB0aGlzLmZvbGRpbmdIYW5kbGVyKGNvbHVtbik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChGb2xkQnV0dG9uQ29tcG9uZW50LCB7IGhlYWRlcjogY29sdW1uLm9yaWdpbmFsX0hlYWRlciwgY29sbGFwc2VkLCBpY29uLCBvbkNsaWNrIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXBwbHlGb2xkYWJsZUZvckNvbHVtbiA9IGNvbHVtbiA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbGxhcHNlZCA9IHRoaXMuaXNGb2xkZWQoY29sdW1uKTtcclxuICAgICAgICAgICAgY29uc3QgeyBGb2xkZWRDb2x1bW4gfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgICAgICAvL0hhbmRsZSBDb2x1bW4gSGVhZGVyXHJcbiAgICAgICAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbGxhcHNlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbi5jb2x1bW5zID0gW0ZvbGRlZENvbHVtbl07XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uLndpZHRoID0gRm9sZGVkQ29sdW1uLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbi5zdHlsZSA9IEZvbGRlZENvbHVtbi5zdHlsZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5yZXN0b3JlVG9PcmlnaW5hbChjb2x1bW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vSGFuZGxlIE5vcm1hbCBDb2x1bW4uXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbGxhcHNlZClcclxuICAgICAgICAgICAgICAgIGNvbHVtbiA9IE9iamVjdC5hc3NpZ24oY29sdW1uLCBGb2xkZWRDb2x1bW4pO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzdG9yZVRvT3JpZ2luYWwoY29sdW1uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXBwbHlGb2xkYWJsZUZvckNvbHVtbnMgPSBjb2x1bW5zID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbHVtbnMubWFwKChjb2wsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNvbC5mb2xkYWJsZSkgcmV0dXJuIGNvbDtcclxuXHJcbiAgICAgICAgICAgICAgICAvL0lmIGNvbCBkb24ndCBoYXZlIGlkIHRoZW4gZ2VuZXJhdGUgaWQgYmFzZWQgb24gaW5kZXhcclxuICAgICAgICAgICAgICAgIGlmICghY29sLmlkKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbC5pZCA9IGBjb2xfJHtpbmRleH1gO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY29weU9yaWdpbmFscyhjb2wpO1xyXG4gICAgICAgICAgICAgICAgLy9SZXBsYWNlIGN1cnJlbnQgaGVhZGVyIHdpdGggaW50ZXJuYWwgaGVhZGVyIHJlbmRlci5cclxuICAgICAgICAgICAgICAgIGNvbC5IZWFkZXIgPSBjID0+IHRoaXMuZm9sZGFibGVIZWFkZXJSZW5kZXIoYyk7XHJcbiAgICAgICAgICAgICAgICAvL2FwcGx5IGZvbGRhYmxlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5Rm9sZGFibGVGb3JDb2x1bW4oY29sKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3JldHVybiB0aGUgbmV3IGNvbHVtbiBvdXRcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb2w7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVuZGVyKCkge1xyXG4gICAgICAgICAgICBjb25zdCB7IGNvbHVtbnM6IG9yaWdpbmFsQ29scywgRm9sZEJ1dHRvbkNvbXBvbmVudCwgRm9sZEljb25Db21wb25lbnQsIEZvbGRlZENvbHVtbiwgLi4ucmVzdCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgY29uc3QgY29sdW1ucyA9IHRoaXMuYXBwbHlGb2xkYWJsZUZvckNvbHVtbnMoWy4uLm9yaWdpbmFsQ29sc10pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZXh0cmEgPSB7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5zLFxyXG4gICAgICAgICAgICAgICAgb25SZXNpemVkQ2hhbmdlOiB0aGlzLm9uUmVzaXplZENoYW5nZSxcclxuICAgICAgICAgICAgICAgIHJlc2l6ZWQ6IHRoaXMuc3RhdGUucmVzaXplZFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxSZWFjdFRhYmxlIHsuLi5yZXN0fSB7Li4uZXh0cmF9IHJlZj17ciA9PiB0aGlzLndyYXBwZWRJbnN0YW5jZSA9IHJ9IC8+XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgd3JhcHBlci5kaXNwbGF5TmFtZSA9ICdSVEZvbGRhYmxlVGFibGUnO1xyXG4gICAgd3JhcHBlci5kZWZhdWx0UHJvcHMgPVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRm9sZEljb25Db21wb25lbnQ6IGRlZmF1bHRGb2xkSWNvbkNvbXBvbmVudCxcclxuICAgICAgICAgICAgRm9sZEJ1dHRvbkNvbXBvbmVudDogZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQsXHJcbiAgICAgICAgICAgIGZvbGRhYmxlT3JpZ2luYWxLZXk6ICdvcmlnaW5hbF8nLFxyXG4gICAgICAgICAgICBGb2xkZWRDb2x1bW46IHtcclxuICAgICAgICAgICAgICAgIENlbGw6IGMgPT4gJycsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICByZXNpemFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgcmV0dXJuIHdyYXBwZXI7XHJcbn0iXX0=