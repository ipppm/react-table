var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable */

import React from 'react';

var defaultSelectInputComponent = function defaultSelectInputComponent(props) {
  return React.createElement('input', {
    type: props.selectType || 'checkbox',
    checked: props.checked,
    onClick: function onClick(e) {
      var shiftKey = e.shiftKey;

      e.stopPropagation();
      props.onClick(props.id, shiftKey, props.row);
    },
    onChange: function onChange() {}
  });
};

export default (function (Component) {
  var wrapper = function (_React$Component) {
    _inherits(RTSelectTable, _React$Component);

    function RTSelectTable(props) {
      _classCallCheck(this, RTSelectTable);

      return _possibleConstructorReturn(this, (RTSelectTable.__proto__ || Object.getPrototypeOf(RTSelectTable)).call(this, props));
    }

    _createClass(RTSelectTable, [{
      key: 'rowSelector',
      value: function rowSelector(row) {
        if (!row || !row.hasOwnProperty(this.props.keyField)) return null;
        var _props = this.props,
            toggleSelection = _props.toggleSelection,
            selectType = _props.selectType,
            keyField = _props.keyField;

        var checked = this.props.isSelected(row[this.props.keyField]);
        var inputProps = {
          checked: checked,
          onClick: toggleSelection,
          selectType: selectType,
          id: row[keyField],
          row: row
        };
        return React.createElement(this.props.SelectInputComponent, inputProps);
      }
    }, {
      key: 'headSelector',
      value: function headSelector(row) {
        var selectType = this.props.selectType;

        if (selectType === 'radio') return null;

        var _props2 = this.props,
            toggleAll = _props2.toggleAll,
            checked = _props2.selectAll,
            SelectAllInputComponent = _props2.SelectAllInputComponent;

        var inputProps = {
          checked: checked,
          onClick: toggleAll,
          selectType: selectType
        };

        return React.createElement(SelectAllInputComponent, inputProps);
      }

      // this is so we can expose the underlying ReactTable to get at the sortedData for selectAll

    }, {
      key: 'getWrappedInstance',
      value: function getWrappedInstance() {
        if (!this.wrappedInstance) console.warn('RTSelectTable - No wrapped instance');
        if (this.wrappedInstance.getWrappedInstance) return this.wrappedInstance.getWrappedInstance();else return this.wrappedInstance;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props3 = this.props,
            originalCols = _props3.columns,
            isSelected = _props3.isSelected,
            toggleSelection = _props3.toggleSelection,
            toggleAll = _props3.toggleAll,
            keyField = _props3.keyField,
            selectAll = _props3.selectAll,
            selectType = _props3.selectType,
            selectWidth = _props3.selectWidth,
            SelectAllInputComponent = _props3.SelectAllInputComponent,
            SelectInputComponent = _props3.SelectInputComponent,
            rest = _objectWithoutProperties(_props3, ['columns', 'isSelected', 'toggleSelection', 'toggleAll', 'keyField', 'selectAll', 'selectType', 'selectWidth', 'SelectAllInputComponent', 'SelectInputComponent']);

        var select = {
          id: '_selector',
          accessor: function accessor() {
            return 'x';
          }, // this value is not important
          Header: this.headSelector.bind(this),
          Cell: function Cell(ci) {
            return _this2.rowSelector.bind(_this2)(ci.original);
          },
          width: selectWidth || 30,
          filterable: false,
          sortable: false,
          resizable: false,
          style: { textAlign: 'center' }
        };
        var columns = [select].concat(_toConsumableArray(originalCols));
        var extra = {
          columns: columns
        };
        return React.createElement(Component, _extends({}, rest, extra, { ref: function ref(r) {
            return _this2.wrappedInstance = r;
          } }));
      }
    }]);

    return RTSelectTable;
  }(React.Component);

  wrapper.displayName = 'RTSelectTable';
  wrapper.defaultProps = {
    keyField: '_id',
    isSelected: function isSelected(key) {
      console.log('No isSelected handler provided:', { key: key });
    },
    selectAll: false,
    toggleSelection: function toggleSelection(key, shift, row) {
      console.log('No toggleSelection handler provided:', { key: key, shift: shift, row: row });
    },
    toggleAll: function toggleAll() {
      console.log('No toggleAll handler provided.');
    },
    selectType: 'check',
    SelectInputComponent: defaultSelectInputComponent,
    SelectAllInputComponent: defaultSelectInputComponent
  };

  return wrapper;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2Mvc2VsZWN0VGFibGUvaW5kZXguanMiXSwibmFtZXMiOlsiUmVhY3QiLCJkZWZhdWx0U2VsZWN0SW5wdXRDb21wb25lbnQiLCJwcm9wcyIsInNlbGVjdFR5cGUiLCJjaGVja2VkIiwic2hpZnRLZXkiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwib25DbGljayIsImlkIiwicm93Iiwid3JhcHBlciIsImhhc093blByb3BlcnR5Iiwia2V5RmllbGQiLCJ0b2dnbGVTZWxlY3Rpb24iLCJpc1NlbGVjdGVkIiwiaW5wdXRQcm9wcyIsImNyZWF0ZUVsZW1lbnQiLCJTZWxlY3RJbnB1dENvbXBvbmVudCIsInRvZ2dsZUFsbCIsInNlbGVjdEFsbCIsIlNlbGVjdEFsbElucHV0Q29tcG9uZW50Iiwid3JhcHBlZEluc3RhbmNlIiwiY29uc29sZSIsIndhcm4iLCJnZXRXcmFwcGVkSW5zdGFuY2UiLCJvcmlnaW5hbENvbHMiLCJjb2x1bW5zIiwic2VsZWN0V2lkdGgiLCJyZXN0Iiwic2VsZWN0IiwiYWNjZXNzb3IiLCJIZWFkZXIiLCJoZWFkU2VsZWN0b3IiLCJiaW5kIiwiQ2VsbCIsInJvd1NlbGVjdG9yIiwiY2kiLCJvcmlnaW5hbCIsIndpZHRoIiwiZmlsdGVyYWJsZSIsInNvcnRhYmxlIiwicmVzaXphYmxlIiwic3R5bGUiLCJ0ZXh0QWxpZ24iLCJleHRyYSIsInIiLCJDb21wb25lbnQiLCJkaXNwbGF5TmFtZSIsImRlZmF1bHRQcm9wcyIsImxvZyIsImtleSIsInNoaWZ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBLE9BQU9BLEtBQVAsTUFBa0IsT0FBbEI7O0FBRUEsSUFBTUMsOEJBQThCLFNBQTlCQSwyQkFBOEIsUUFBUztBQUMzQyxTQUNFO0FBQ0UsVUFBTUMsTUFBTUMsVUFBTixJQUFvQixVQUQ1QjtBQUVFLGFBQVNELE1BQU1FLE9BRmpCO0FBR0UsYUFBUyxvQkFBSztBQUFBLFVBQ0pDLFFBREksR0FDU0Ms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Q0QsQ0EvRkQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG5cclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5cclxuY29uc3QgZGVmYXVsdFNlbGVjdElucHV0Q29tcG9uZW50ID0gcHJvcHMgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgICA8aW5wdXRcclxuICAgICAgdHlwZT17cHJvcHMuc2VsZWN0VHlwZSB8fCAnY2hlY2tib3gnfVxyXG4gICAgICBjaGVja2VkPXtwcm9wcy5jaGVja2VkfVxyXG4gICAgICBvbkNsaWNrPXtlID0+IHtcclxuICAgICAgICBjb25zdCB7IHNoaWZ0S2V5IH0gPSBlXHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIHByb3BzLm9uQ2xpY2socHJvcHMuaWQsIHNoaWZ0S2V5LCBwcm9wcy5yb3cpXHJcbiAgICAgIH19XHJcbiAgICAgIG9uQ2hhbmdlPXsoKSA9PiB7fX1cclxuICAgIC8+XHJcbiAgKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQgPT4ge1xyXG4gIGNvbnN0IHdyYXBwZXIgPSBjbGFzcyBSVFNlbGVjdFRhYmxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgIHN1cGVyKHByb3BzKVxyXG4gICAgfVxyXG5cclxuICAgIHJvd1NlbGVjdG9yKHJvdykge1xyXG4gICAgICBpZiAoIXJvdyB8fCAhcm93Lmhhc093blByb3BlcnR5KHRoaXMucHJvcHMua2V5RmllbGQpKSByZXR1cm4gbnVsbFxyXG4gICAgICBjb25zdCB7IHRvZ2dsZVNlbGVjdGlvbiwgc2VsZWN0VHlwZSwga2V5RmllbGQgfSA9IHRoaXMucHJvcHNcclxuICAgICAgY29uc3QgY2hlY2tlZCA9IHRoaXMucHJvcHMuaXNTZWxlY3RlZChyb3dbdGhpcy5wcm9wcy5rZXlGaWVsZF0pXHJcbiAgICAgIGNvbnN0IGlucHV0UHJvcHMgPSB7XHJcbiAgICAgICAgY2hlY2tlZCxcclxuICAgICAgICBvbkNsaWNrOiB0b2dnbGVTZWxlY3Rpb24sXHJcbiAgICAgICAgc2VsZWN0VHlwZSxcclxuICAgICAgICBpZDogcm93W2tleUZpZWxkXSxcclxuICAgICAgICByb3csXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQodGhpcy5wcm9wcy5TZWxlY3RJbnB1dENvbXBvbmVudCwgaW5wdXRQcm9wcylcclxuICAgIH1cclxuXHJcbiAgICBoZWFkU2VsZWN0b3Iocm93KSB7XHJcbiAgICAgIGNvbnN0IHsgc2VsZWN0VHlwZSB9ID0gdGhpcy5wcm9wc1xyXG4gICAgICBpZiAoc2VsZWN0VHlwZSA9PT0gJ3JhZGlvJykgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgIGNvbnN0IHsgdG9nZ2xlQWxsLCBzZWxlY3RBbGw6IGNoZWNrZWQsIFNlbGVjdEFsbElucHV0Q29tcG9uZW50IH0gPSB0aGlzLnByb3BzXHJcbiAgICAgIGNvbnN0IGlucHV0UHJvcHMgPSB7XHJcbiAgICAgICAgY2hlY2tlZCxcclxuICAgICAgICBvbkNsaWNrOiB0b2dnbGVBbGwsXHJcbiAgICAgICAgc2VsZWN0VHlwZSxcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0QWxsSW5wdXRDb21wb25lbnQsIGlucHV0UHJvcHMpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGhpcyBpcyBzbyB3ZSBjYW4gZXhwb3NlIHRoZSB1bmRlcmx5aW5nIFJlYWN0VGFibGUgdG8gZ2V0IGF0IHRoZSBzb3J0ZWREYXRhIGZvciBzZWxlY3RBbGxcclxuICAgIGdldFdyYXBwZWRJbnN0YW5jZSgpIHtcclxuICAgICAgaWYgKCF0aGlzLndyYXBwZWRJbnN0YW5jZSkgY29uc29sZS53YXJuKCdSVFNlbGVjdFRhYmxlIC0gTm8gd3JhcHBlZCBpbnN0YW5jZScpXHJcbiAgICAgIGlmICh0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UpIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UoKVxyXG4gICAgICBlbHNlIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIGNvbHVtbnM6IG9yaWdpbmFsQ29scyxcclxuICAgICAgICBpc1NlbGVjdGVkLFxyXG4gICAgICAgIHRvZ2dsZVNlbGVjdGlvbixcclxuICAgICAgICB0b2dnbGVBbGwsXHJcbiAgICAgICAga2V5RmllbGQsXHJcbiAgICAgICAgc2VsZWN0QWxsLFxyXG4gICAgICAgIHNlbGVjdFR5cGUsXHJcbiAgICAgICAgc2VsZWN0V2lkdGgsXHJcbiAgICAgICAgU2VsZWN0QWxsSW5wdXRDb21wb25lbnQsXHJcbiAgICAgICAgU2VsZWN0SW5wdXRDb21wb25lbnQsXHJcbiAgICAgICAgLi4ucmVzdFxyXG4gICAgICB9ID0gdGhpcy5wcm9wc1xyXG4gICAgICBjb25zdCBzZWxlY3QgPSB7XHJcbiAgICAgICAgaWQ6ICdfc2VsZWN0b3InLFxyXG4gICAgICAgIGFjY2Vzc29yOiAoKSA9PiAneCcsIC8vIHRoaXMgdmFsdWUgaXMgbm90IGltcG9ydGFudFxyXG4gICAgICAgIEhlYWRlcjogdGhpcy5oZWFkU2VsZWN0b3IuYmluZCh0aGlzKSxcclxuICAgICAgICBDZWxsOiBjaSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5yb3dTZWxlY3Rvci5iaW5kKHRoaXMpKGNpLm9yaWdpbmFsKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2lkdGg6IHNlbGVjdFdpZHRoIHx8IDMwLFxyXG4gICAgICAgIGZpbHRlcmFibGU6IGZhbHNlLFxyXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcclxuICAgICAgICByZXNpemFibGU6IGZhbHNlLFxyXG4gICAgICAgIHN0eWxlOiB7IHRleHRBbGlnbjogJ2NlbnRlcicgfSxcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBjb2x1bW5zID0gW3NlbGVjdCwgLi4ub3JpZ2luYWxDb2xzXVxyXG4gICAgICBjb25zdCBleHRyYSA9IHtcclxuICAgICAgICBjb2x1bW5zLFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiA8Q29tcG9uZW50IHsuLi5yZXN0fSB7Li4uZXh0cmF9IHJlZj17ciA9PiAodGhpcy53cmFwcGVkSW5zdGFuY2UgPSByKX0gLz5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHdyYXBwZXIuZGlzcGxheU5hbWUgPSAnUlRTZWxlY3RUYWJsZSdcclxuICB3cmFwcGVyLmRlZmF1bHRQcm9wcyA9IHtcclxuICAgIGtleUZpZWxkOiAnX2lkJyxcclxuICAgIGlzU2VsZWN0ZWQ6IGtleSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdObyBpc1NlbGVjdGVkIGhhbmRsZXIgcHJvdmlkZWQ6JywgeyBrZXkgfSlcclxuICAgIH0sXHJcbiAgICBzZWxlY3RBbGw6IGZhbHNlLFxyXG4gICAgdG9nZ2xlU2VsZWN0aW9uOiAoa2V5LCBzaGlmdCwgcm93KSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdObyB0b2dnbGVTZWxlY3Rpb24gaGFuZGxlciBwcm92aWRlZDonLCB7IGtleSwgc2hpZnQsIHJvdyB9KVxyXG4gICAgfSxcclxuICAgIHRvZ2dsZUFsbDogKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnTm8gdG9nZ2xlQWxsIGhhbmRsZXIgcHJvdmlkZWQuJylcclxuICAgIH0sXHJcbiAgICBzZWxlY3RUeXBlOiAnY2hlY2snLFxyXG4gICAgU2VsZWN0SW5wdXRDb21wb25lbnQ6IGRlZmF1bHRTZWxlY3RJbnB1dENvbXBvbmVudCxcclxuICAgIFNlbGVjdEFsbElucHV0Q29tcG9uZW50OiBkZWZhdWx0U2VsZWN0SW5wdXRDb21wb25lbnQsXHJcbiAgfVxyXG5cclxuICByZXR1cm4gd3JhcHBlclxyXG59XHJcbiJdfQ==