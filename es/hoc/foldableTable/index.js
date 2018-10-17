var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import left from './left.svg';
import right from './right.svg';

var defaultFoldIconComponent = function defaultFoldIconComponent(_ref) {
    var collapsed = _ref.collapsed;

    var style = { width: 25 };

    if (collapsed) return React.createElement('img', { src: right, style: style, alt: 'right' });
    return React.createElement('img', { src: left, style: style, alt: 'left' });
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

    return React.createElement(
        'div',
        null,
        React.createElement(
            'div',
            { style: style, onClick: onClick },
            icon
        ),
        !collapsed && React.createElement(
            'div',
            null,
            header
        )
    );
};

export default (function (ReactTable) {

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
                var icon = React.createElement(FoldIconComponent, { collapsed: collapsed });
                var onClick = function onClick() {
                    return _this.foldingHandler(column);
                };

                return React.createElement(FoldButtonComponent, { header: column.original_Header, collapsed: collapsed, icon: icon, onClick: onClick });
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

                return React.createElement(ReactTable, _extends({}, rest, extra, { ref: function ref(r) {
                        return _this2.wrappedInstance = r;
                    } }));
            }
        }]);

        return RTFoldableTable;
    }(React.Component);

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
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvZm9sZGFibGVUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsImxlZnQiLCJyaWdodCIsImRlZmF1bHRGb2xkSWNvbkNvbXBvbmVudCIsImNvbGxhcHNlZCIsInN0eWxlIiwid2lkdGgiLCJkZWZhdWx0Rm9sZEJ1dHRvbkNvbXBvbmVudCIsImhlYWRlciIsImljb24iLCJvbkNsaWNrIiwibWFyZ2luTGVmdCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsImZsb2F0IiwiY3Vyc29yIiwiUmVhY3RUYWJsZSIsIndyYXBwZXIiLCJwcm9wcyIsImNvbnRleHQiLCJvblJlc2l6ZWRDaGFuZ2UiLCJyZXNpemVkIiwic2V0U3RhdGUiLCJyZW1vdmVSZXNpemVkIiwiaWQiLCJjb2x1bW4iLCJzdGF0ZSIsInJzIiwiZmluZCIsInIiLCJuZXdSZXNpemVkIiwiZmlsdGVyIiwiZ2V0V3JhcHBlZEluc3RhbmNlIiwid3JhcHBlZEluc3RhbmNlIiwiY29uc29sZSIsIndhcm4iLCJnZXRDb3BpZWRLZXkiLCJmb2xkYWJsZU9yaWdpbmFsS2V5Iiwia2V5IiwiY29weU9yaWdpbmFscyIsIkZvbGRlZENvbHVtbiIsIm9yaWdpbmFsX0hlYWRlciIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiY29waWVkS2V5IiwiayIsImMiLCJ2YWx1ZSIsImNvbHVtbnMiLCJvcmlnaW5hbF9Db2x1bW5zIiwiSGVhZGVyIiwicmVzdG9yZVRvT3JpZ2luYWwiLCJnZXRTdGF0ZSIsIm9uRm9sZENoYW5nZSIsImZvbGRlZCIsImlzRm9sZGVkIiwiY29sIiwiZm9sZGluZ0hhbmRsZXIiLCJuZXdGb2xkIiwiYXNzaWduIiwiZm9sZGFibGVIZWFkZXJSZW5kZXIiLCJjZWxsIiwiRm9sZEJ1dHRvbkNvbXBvbmVudCIsIkZvbGRJY29uQ29tcG9uZW50IiwiY3JlYXRlRWxlbWVudCIsImFwcGx5Rm9sZGFibGVGb3JDb2x1bW4iLCJhcHBseUZvbGRhYmxlRm9yQ29sdW1ucyIsIm1hcCIsImluZGV4IiwiZm9sZGFibGUiLCJ1bmRlZmluZWQiLCJuZXdQcm9wcyIsIm9yaWdpbmFsQ29scyIsInJlc3QiLCJleHRyYSIsIkNvbXBvbmVudCIsImRpc3BsYXlOYW1lIiwiZGVmYXVsdFByb3BzIiwiQ2VsbCIsInNvcnRhYmxlIiwicmVzaXphYmxlIiwiZmlsdGVyYWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPQSxLQUFQLE1BQWtCLE9BQWxCO0FBQ0EsT0FBT0MsSUFBUCxNQUFpQixZQUFqQjtBQUNBLE9BQU9DLEtBQVAsTUFBa0IsYUFBbEI7O0FBRUEsSUFBTUMsMkJBQTJCLFNBQTNCQSx3QkFBMkIsT0FBbUI7QUFBQSxRQUFoQkMsU0FBZ0IsUUFBaEJBLFNBQWdCOztBQUNoRCxRQUFNQyxRQUFRLEVBQUVDLE9BQU8sRUFBVCxFQUFkOztBQUVBLFFBQUlGLFNBQUosRUFDSSxPQUFPLDZCQUFLLEtBQUtGLEtBQVYsRUFBaUIsT0FBT0csS0FBeEIsRUFBK0IsS0FBSSxPQUFuQyxHQUFQO0FBQ0osV0FBTyw2QkFBSyxLQUFLSixJQUFWLEVBQWdCLE9BQU9JLEtBQXZCLEVBQThCLEtBQUksTUFBbEMsR0FBUDtBQUNILENBTkQ7O0FBUUEsSUFBTUUsNkJBQTZCLFNBQTdCQSwwQkFBNkIsUUFBMEM7QUFBQSxRQUF2Q0MsTUFBdUMsU0FBdkNBLE1BQXVDO0FBQUEsUUFBL0JKLFNBQStCLFNBQS9CQSxTQUErQjtBQUFBLFFBQXBCSyxJQUFvQixTQUFwQkEsSUFBb0I7QUFBQSxRQUFkQyxPQUFjLFNBQWRBLE9BQWM7O0FBQ3pFLFFBQU1MLFFBQVE7QUFDVk0sb0JBQVksS0FERjtBQUVWQyxtQkFBVyxNQUZEO0FBR1ZDLHNCQUFjLE1BSEo7QUFJVkMsZUFBTyxNQUpHO0FBS1ZDLGdCQUFRO0FBTEUsS0FBZDs7QUFRQSxXQUFRO0FBQUE7QUFBQTtBQUNKO0FBQUE7QUFBQSxjQUFLLE9BQU9WLEtBQVosRUFBbUIsU0FBU0ssT0FBNUI7QUFDS0Q7QUFETCxT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RSxPQUFQO0FBQ0gsQ0FuTUQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgbGVmdCBmcm9tICcuL2xlZnQuc3ZnJztcclxuaW1wb3J0IHJpZ2h0IGZyb20gJy4vcmlnaHQuc3ZnJztcclxuXHJcbmNvbnN0IGRlZmF1bHRGb2xkSWNvbkNvbXBvbmVudCA9ICh7IGNvbGxhcHNlZCB9KSA9PiB7XHJcbiAgICBjb25zdCBzdHlsZSA9IHsgd2lkdGg6IDI1IH07XHJcblxyXG4gICAgaWYgKGNvbGxhcHNlZClcclxuICAgICAgICByZXR1cm4gPGltZyBzcmM9e3JpZ2h0fSBzdHlsZT17c3R5bGV9IGFsdD1cInJpZ2h0XCIgLz5cclxuICAgIHJldHVybiA8aW1nIHNyYz17bGVmdH0gc3R5bGU9e3N0eWxlfSBhbHQ9XCJsZWZ0XCIgLz5cclxufVxyXG5cclxuY29uc3QgZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQgPSAoeyBoZWFkZXIsIGNvbGxhcHNlZCwgaWNvbiwgb25DbGljayB9KSA9PiB7XHJcbiAgICBjb25zdCBzdHlsZSA9IHtcclxuICAgICAgICBtYXJnaW5MZWZ0OiBcIjBweFwiLFxyXG4gICAgICAgIG1hcmdpblRvcDogXCItNXB4XCIsXHJcbiAgICAgICAgbWFyZ2luQm90dG9tOiBcIi04cHhcIixcclxuICAgICAgICBmbG9hdDogXCJsZWZ0XCIsXHJcbiAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIlxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gKDxkaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17c3R5bGV9IG9uQ2xpY2s9e29uQ2xpY2t9PlxyXG4gICAgICAgICAgICB7aWNvbn1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICB7IWNvbGxhcHNlZCAmJiA8ZGl2PntoZWFkZXJ9PC9kaXY+fVxyXG4gICAgPC9kaXY+KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKFJlYWN0VGFibGUpID0+IHtcclxuXHJcbiAgICBjb25zdCB3cmFwcGVyID0gY2xhc3MgUlRGb2xkYWJsZVRhYmxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgZm9sZGVkOiBwcm9wcy5vbkZvbGRDaGFuZ2UgPyB1bmRlZmluZWQgOiB7fSxcclxuICAgICAgICAgICAgICAgIHJlc2l6ZWQ6IHByb3BzLnJlc2l6ZWQgfHwgW11cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV3UHJvcHMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUucmVzaXplZCAhPT0gbmV3UHJvcHMucmVzaXplZClcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUocCA9PiB7IHJldHVybiB7IHJlc2l6ZWQ6IG5ld1Byb3BzLnJlc2l6ZWQgfSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9uUmVzaXplZENoYW5nZSA9IHJlc2l6ZWQgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7IG9uUmVzaXplZENoYW5nZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgaWYgKG9uUmVzaXplZENoYW5nZSlcclxuICAgICAgICAgICAgICAgIG9uUmVzaXplZENoYW5nZShyZXNpemVkKTtcclxuICAgICAgICAgICAgZWxzZSB0aGlzLnNldFN0YXRlKHAgPT4geyByZXR1cm4geyByZXNpemVkIH0gfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZW1vdmVSZXNpemVkID0gY29sdW1uID0+IHtcclxuICAgICAgICAgICAgY29uc3QgeyBpZCB9ID0gY29sdW1uO1xyXG4gICAgICAgICAgICBpZiAoIWlkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBjb25zdCB7IHJlc2l6ZWQgfSA9IHRoaXMuc3RhdGU7XHJcbiAgICAgICAgICAgIGlmICghcmVzaXplZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcnMgPSByZXNpemVkLmZpbmQociA9PiByLmlkID09PSBpZCk7XHJcbiAgICAgICAgICAgIGlmICghcnMpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1Jlc2l6ZWQgPSByZXNpemVkLmZpbHRlcihyID0+IHIgIT09IHJzKTtcclxuICAgICAgICAgICAgdGhpcy5vblJlc2l6ZWRDaGFuZ2UobmV3UmVzaXplZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0aGlzIGlzIHNvIHdlIGNhbiBleHBvc2UgdGhlIHVuZGVybHlpbmcgUmVhY3RUYWJsZS5cclxuICAgICAgICBnZXRXcmFwcGVkSW5zdGFuY2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy53cmFwcGVkSW5zdGFuY2UpIGNvbnNvbGUud2FybignUlRGb2xkYWJsZVRhYmxlIC0gTm8gd3JhcHBlZCBpbnN0YW5jZScpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKSByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKCk7XHJcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIHRoaXMud3JhcHBlZEluc3RhbmNlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRDb3BpZWRLZXkgPSBrZXkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7IGZvbGRhYmxlT3JpZ2luYWxLZXkgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgIHJldHVybiBgJHtmb2xkYWJsZU9yaWdpbmFsS2V5fSR7a2V5fWA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb3B5T3JpZ2luYWxzID0gY29sdW1uID0+IHtcclxuICAgICAgICAgICAgY29uc3QgeyBGb2xkZWRDb2x1bW4gfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgICAgICAvL1N0b3AgY29weSBpZiB0aGUgY29sdW1uIGFscmVhZHkgY29waWVkXHJcbiAgICAgICAgICAgIGlmIChjb2x1bW4ub3JpZ2luYWxfSGVhZGVyKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhGb2xkZWRDb2x1bW4pLmZvckVhY2goayA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb3BpZWRLZXkgPSB0aGlzLmdldENvcGllZEtleShrKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoayA9PT0gXCJDZWxsXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uW2NvcGllZEtleV0gPSBjb2x1bW5ba10gPyBjb2x1bW5ba10gOiBjID0+IGMudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGNvbHVtbltjb3BpZWRLZXldID0gY29sdW1uW2tdO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vQ29weSBzdWIgQ29sdW1uc1xyXG4gICAgICAgICAgICBpZiAoY29sdW1uLmNvbHVtbnMgJiYgIWNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zKVxyXG4gICAgICAgICAgICAgICAgY29sdW1uLm9yaWdpbmFsX0NvbHVtbnMgPSBjb2x1bW4uY29sdW1ucztcclxuXHJcbiAgICAgICAgICAgIC8vQ29weSBIZWFkZXJcclxuICAgICAgICAgICAgaWYgKCFjb2x1bW4ub3JpZ2luYWxfSGVhZGVyKVxyXG4gICAgICAgICAgICAgICAgY29sdW1uLm9yaWdpbmFsX0hlYWRlciA9IGNvbHVtbi5IZWFkZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXN0b3JlVG9PcmlnaW5hbCA9IGNvbHVtbiA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgRm9sZGVkQ29sdW1uIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoRm9sZGVkQ29sdW1uKS5mb3JFYWNoKGsgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy9pZ25vcmUgaGVhZGVyIGFzIGhhbmRsaW5nIGJ5IGZvbGRhYmxlSGVhZGVyUmVuZGVyXHJcbiAgICAgICAgICAgICAgICBpZiAoayA9PT0gXCJIZWFkZXJcIikgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvcGllZEtleSA9IHRoaXMuZ2V0Q29waWVkS2V5KGspO1xyXG4gICAgICAgICAgICAgICAgY29sdW1uW2tdID0gY29sdW1uW2NvcGllZEtleV07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zICYmIGNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zKVxyXG4gICAgICAgICAgICAgICAgY29sdW1uLmNvbHVtbnMgPSBjb2x1bW4ub3JpZ2luYWxfQ29sdW1ucztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldFN0YXRlID0gKCkgPT4gdGhpcy5wcm9wcy5vbkZvbGRDaGFuZ2UgPyB0aGlzLnByb3BzLmZvbGRlZCA6IHRoaXMuc3RhdGUuZm9sZGVkO1xyXG5cclxuICAgICAgICBpc0ZvbGRlZCA9IGNvbCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvbGRlZCA9IHRoaXMuZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZvbGRlZFtjb2wuaWRdID09PSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9sZGluZ0hhbmRsZXIgPSBjb2wgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWNvbCB8fCAhY29sLmlkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBjb25zdCB7IG9uRm9sZENoYW5nZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgY29uc3QgZm9sZGVkID0gdGhpcy5nZXRTdGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zdCB7IGlkIH0gPSBjb2w7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3Rm9sZCA9IE9iamVjdC5hc3NpZ24oe30sIGZvbGRlZCk7XHJcbiAgICAgICAgICAgIG5ld0ZvbGRbaWRdID0gIW5ld0ZvbGRbaWRdO1xyXG5cclxuICAgICAgICAgICAgLy9SZW1vdmUgdGhlIFJlc2l6ZWQgaWYgaGF2ZVxyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVJlc2l6ZWQoY29sKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvbkZvbGRDaGFuZ2UpXHJcbiAgICAgICAgICAgICAgICBvbkZvbGRDaGFuZ2UobmV3Rm9sZCk7XHJcbiAgICAgICAgICAgIGVsc2UgdGhpcy5zZXRTdGF0ZShwcmV2aW91cyA9PiB7IHJldHVybiB7IGZvbGRlZDogbmV3Rm9sZCB9OyB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvbGRhYmxlSGVhZGVyUmVuZGVyID0gKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgeyBGb2xkQnV0dG9uQ29tcG9uZW50LCBGb2xkSWNvbkNvbXBvbmVudCB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICAgICAgY29uc3QgeyBjb2x1bW4gfSA9IGNlbGw7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbGxhcHNlZCA9IHRoaXMuaXNGb2xkZWQoY29sdW1uKTtcclxuICAgICAgICAgICAgY29uc3QgaWNvbiA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9sZEljb25Db21wb25lbnQsIHsgY29sbGFwc2VkIH0pO1xyXG4gICAgICAgICAgICBjb25zdCBvbkNsaWNrID0gKCkgPT4gdGhpcy5mb2xkaW5nSGFuZGxlcihjb2x1bW4pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9sZEJ1dHRvbkNvbXBvbmVudCwgeyBoZWFkZXI6IGNvbHVtbi5vcmlnaW5hbF9IZWFkZXIsIGNvbGxhcHNlZCwgaWNvbiwgb25DbGljayB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFwcGx5Rm9sZGFibGVGb3JDb2x1bW4gPSBjb2x1bW4gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb2xsYXBzZWQgPSB0aGlzLmlzRm9sZGVkKGNvbHVtbik7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgRm9sZGVkQ29sdW1uIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgICAgICAgICAgLy9IYW5kbGUgQ29sdW1uIEhlYWRlclxyXG4gICAgICAgICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb2xsYXBzZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW4uY29sdW1ucyA9IFtGb2xkZWRDb2x1bW5dO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbi53aWR0aCA9IEZvbGRlZENvbHVtbi53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW4uc3R5bGUgPSBGb2xkZWRDb2x1bW4uc3R5bGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMucmVzdG9yZVRvT3JpZ2luYWwoY29sdW1uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL0hhbmRsZSBOb3JtYWwgQ29sdW1uLlxyXG4gICAgICAgICAgICBlbHNlIGlmIChjb2xsYXBzZWQpXHJcbiAgICAgICAgICAgICAgICBjb2x1bW4gPSBPYmplY3QuYXNzaWduKGNvbHVtbiwgRm9sZGVkQ29sdW1uKTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVUb09yaWdpbmFsKGNvbHVtbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFwcGx5Rm9sZGFibGVGb3JDb2x1bW5zID0gY29sdW1ucyA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2x1bW5zLm1hcCgoY29sLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjb2wuZm9sZGFibGUpIHJldHVybiBjb2w7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9JZiBjb2wgZG9uJ3QgaGF2ZSBpZCB0aGVuIGdlbmVyYXRlIGlkIGJhc2VkIG9uIGluZGV4XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNvbC5pZClcclxuICAgICAgICAgICAgICAgICAgICBjb2wuaWQgPSBgY29sXyR7aW5kZXh9YDtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvcHlPcmlnaW5hbHMoY29sKTtcclxuICAgICAgICAgICAgICAgIC8vUmVwbGFjZSBjdXJyZW50IGhlYWRlciB3aXRoIGludGVybmFsIGhlYWRlciByZW5kZXIuXHJcbiAgICAgICAgICAgICAgICBjb2wuSGVhZGVyID0gYyA9PiB0aGlzLmZvbGRhYmxlSGVhZGVyUmVuZGVyKGMpO1xyXG4gICAgICAgICAgICAgICAgLy9hcHBseSBmb2xkYWJsZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUZvbGRhYmxlRm9yQ29sdW1uKGNvbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gdGhlIG5ldyBjb2x1bW4gb3V0XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlbmRlcigpIHtcclxuICAgICAgICAgICAgY29uc3QgeyBjb2x1bW5zOiBvcmlnaW5hbENvbHMsIEZvbGRCdXR0b25Db21wb25lbnQsIEZvbGRJY29uQ29tcG9uZW50LCBGb2xkZWRDb2x1bW4sIC4uLnJlc3QgfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbnMgPSB0aGlzLmFwcGx5Rm9sZGFibGVGb3JDb2x1bW5zKFsuLi5vcmlnaW5hbENvbHNdKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGV4dHJhID0ge1xyXG4gICAgICAgICAgICAgICAgY29sdW1ucyxcclxuICAgICAgICAgICAgICAgIG9uUmVzaXplZENoYW5nZTogdGhpcy5vblJlc2l6ZWRDaGFuZ2UsXHJcbiAgICAgICAgICAgICAgICByZXNpemVkOiB0aGlzLnN0YXRlLnJlc2l6ZWRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8UmVhY3RUYWJsZSB7Li4ucmVzdH0gey4uLmV4dHJhfSByZWY9e3IgPT4gdGhpcy53cmFwcGVkSW5zdGFuY2UgPSByfSAvPlxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHdyYXBwZXIuZGlzcGxheU5hbWUgPSAnUlRGb2xkYWJsZVRhYmxlJztcclxuICAgIHdyYXBwZXIuZGVmYXVsdFByb3BzID1cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEZvbGRJY29uQ29tcG9uZW50OiBkZWZhdWx0Rm9sZEljb25Db21wb25lbnQsXHJcbiAgICAgICAgICAgIEZvbGRCdXR0b25Db21wb25lbnQ6IGRlZmF1bHRGb2xkQnV0dG9uQ29tcG9uZW50LFxyXG4gICAgICAgICAgICBmb2xkYWJsZU9yaWdpbmFsS2V5OiAnb3JpZ2luYWxfJyxcclxuICAgICAgICAgICAgRm9sZGVkQ29sdW1uOiB7XHJcbiAgICAgICAgICAgICAgICBDZWxsOiBjID0+ICcnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcmVzaXphYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGZpbHRlcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIHJldHVybiB3cmFwcGVyO1xyXG59Il19