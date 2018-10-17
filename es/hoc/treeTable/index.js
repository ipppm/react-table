var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable */

import React from 'react';

export default (function (Component) {
  var _class, _temp, _initialiseProps;

  var wrapper = (_temp = _class = function (_React$Component) {
    _inherits(RTTreeTable, _React$Component);

    function RTTreeTable(props) {
      _classCallCheck(this, RTTreeTable);

      var _this = _possibleConstructorReturn(this, (RTTreeTable.__proto__ || Object.getPrototypeOf(RTTreeTable)).call(this, props));

      _initialiseProps.call(_this);

      _this.getWrappedInstance.bind(_this);
      _this.TrComponent.bind(_this);
      _this.getTrProps.bind(_this);
      return _this;
    }

    // this is so we can expose the underlying ReactTable to get at the sortedData for selectAll


    _createClass(RTTreeTable, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props,
            columns = _props.columns,
            treeTableIndent = _props.treeTableIndent,
            rest = _objectWithoutProperties(_props, ['columns', 'treeTableIndent']);

        var TrComponent = this.TrComponent,
            getTrProps = this.getTrProps;

        var extra = {
          columns: columns.map(function (col) {
            var column = col;
            if (rest.pivotBy && rest.pivotBy.includes(col.accessor)) {
              column = {
                accessor: col.accessor,
                width: treeTableIndent + 'px',
                show: false,
                Header: ''
              };
            }
            return column;
          }),
          TrComponent: TrComponent,
          getTrProps: getTrProps
        };

        return React.createElement(Component, _extends({}, rest, extra, { ref: function ref(r) {
            return _this2.wrappedInstance = r;
          } }));
      }
    }]);

    return RTTreeTable;
  }(React.Component), _initialiseProps = function _initialiseProps() {
    var _this3 = this;

    this.getWrappedInstance = function () {
      if (!_this3.wrappedInstance) console.warn('RTTreeTable - No wrapped instance');
      if (_this3.wrappedInstance.getWrappedInstance) return _this3.wrappedInstance.getWrappedInstance();else return _this3.wrappedInstance;
    };

    this.TrComponent = function (props) {
      var ri = props.ri,
          rest = _objectWithoutProperties(props, ['ri']);

      if (ri && ri.groupedByPivot) {
        var cell = _extends({}, props.children[ri.level]);

        cell.props.style.flex = 'unset';
        cell.props.style.width = '100%';
        cell.props.style.maxWidth = 'unset';
        cell.props.style.paddingLeft = _this3.props.treeTableIndent * ri.level + 'px';
        // cell.props.style.backgroundColor = '#DDD';
        cell.props.style.borderBottom = '1px solid rgba(128,128,128,0.2)';

        return React.createElement(
          'div',
          { className: 'rt-tr ' + rest.className, style: rest.style },
          cell
        );
      }
      return React.createElement(Component.defaultProps.TrComponent, rest);
    };

    this.getTrProps = function (state, ri, ci, instance) {
      return { ri: ri };
    };
  }, _temp);
  wrapper.displayName = 'RTTreeTable';
  wrapper.defaultProps = {
    treeTableIndent: 10
  };

  return wrapper;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvdHJlZVRhYmxlL2luZGV4LmpzIl0sIm5hbWVzIjpbIlJlYWN0Iiwid3JhcHBlciIsInByb3BzIiwiZ2V0V3JhcHBlZEluc3RhbmNlIiwiYmluZCIsIlRyQ29tcG9uZW50IiwiZ2V0VHJQcm9wcyIsImNvbHVtbnMiLCJ0cmVlVGFibGVJbmRlbnQiLCJyZXN0IiwiZXh0cmEiLCJtYXAiLCJjb2x1bW4iLCJjb2wiLCJwaXZvdEJ5IiwiaW5jbHVkZXMiLCJhY2Nlc3NvciIsIndpZHRoIiwic2hvdyIsIkhlYWRlciIsIndyYXBwZWRJbnN0YW5jZSIsInIiLCJDb21wb25lbnQiLCJjb25zb2xlIiwid2FybiIsInJpIiwiZ3JvdXBlZEJ5UGl2b3QiLCJjZWxsIiwiY2hpbGRyZW4iLCJsZXZlbCIsInN0eWxlIiwiZmxleCIsIm1heFdpZHRoIiwicGFkZGluZ0xlZnQiLCJib3JkZXJCb3R0b20iLCJjbGFzc05hbWUiLCJzdGF0ZSIsImNpIiwiaW5zdGFuY2UiLCJkaXNwbGF5TmFtZSIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUEsT0FBT0EsS0FBUCxNQUFrQixPQUFsQjs7QUFFQSxnQkFBZSxxQkFBYTtBQUFBOztBQUMxQixNQUFNQztBQUFBOztBQUNKLHlCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsNEhBQ1hBLEtBRFc7O0FBQUE7O0FBRWpCLFlBQUtDLGtCQUFMLENBQXdCQyxJQUF4QjtBQUNBLFlBQUtDLFdBQUwsQ0FBaUJELElBQWpCO0FBQ0EsWUFBS0UsVUFBTCxDQUFnQkYsSUFBaEI7QUFKaUI7QUFLbEI7O0FBRUQ7OztBQVJJO0FBQUE7QUFBQSwrQkF3Q0s7QUFBQTs7QUFBQSxxQkFDdUMsS0FBS0YsS0FENUM7QUFBQSxZQUNDSyxPQURELFVBQ0NBLE9BREQ7QUFBQSxZQUNVQyxlQURWLFVBQ1VBLGVBRFY7QUFBQSxZQUM4QkMsSUFEOUI7O0FBQUEsWUFFQ0osV0FGRCxHQUU2QixJQUY3QixDQUVDQSxXQUZEO0FBQUEsWUFFY0MsVUFGZCxHQUU2QixJQUY3QixDQUVjQSxVQUZkOztBQUdQLFlBQU1JLFFBQVE7QUFDWkgsbUJBQVNBLFFBQVFJLEdBQVIsQ0FBWSxlQUFPO0FBQzFCLGdCQUFJQyxTQUFTQyxHQUFiO0FBQ0EsZ0JBQUlKLEtBQUtLLE9BQUwsSUFBZ0JMLEtBQUtLLE9BQUwsQ0FBYUMsUUFBYixDQUFzQkYsSUFBSUcsUUFBMUIsQ0FBcEIsRUFBeUQ7QUFDdkRKLHVCQUFTO0FBQ1BJLDBCQUFVSCxJQUFJRyxRQURQO0FBRVBDLHVCQUFVVCxlQUFWLE9BRk87QUFHUFUsc0JBQU0sS0FIQztBQUlQQyx3QkFBUTtBQUpELGVBQVQ7QUFNRDtBQUNELG1CQUFPUCxNQUFQO0FBQ0QsV0FYUSxDQURHO0FBYVpQLGtDQWJZO0FBY1pDO0FBZFksU0FBZDs7QUFpQkEsZUFBTyxvQkFBQyxTQUFELGVBQWVHLElBQWYsRUFBeUJDLEtBQXpCLElBQWdDLEtBQUs7QUFBQSxtQkFBTSxPQUFLVSxlQUFMLEdBQXVCQyxDQUE3QjtBQUFBLFdBQXJDLElBQVA7QUFDRDtBQTdERzs7QUFBQTtBQUFBLElBQW9DckIsTUFBTXNCLFNBQTFDO0FBQUE7O0FBQUEsU0FTSm5CLGtCQVRJLEdBU2lCLFlBQU07QUFDekIsVUFBSSxDQUFDLE9BQUtpQixlQUFWLEVBQTJCRyxRQUFRQyxJQUFSLENBQWEsbUNBQWI7QUFDM0IsVUFBSSxPQUFLSixlQUFMLENBQXFCakIsa0JBQXpCLEVBQTZDLE9BQU8sT0FBS2lCLGVBQUwsQ0FBcUJqQixrQkFBckIsRUFBUCxDQUE3QyxLQUNLLE9BQU8sT0FBS2lCLGVBQVo7QUFDTixLQWJHOztBQUFBLFNBZUpmLFdBZkksR0FlVSxpQkFBUztBQUFBLFVBQ2JvQixFQURhLEdBQ0d2QixLQURILENBQ2J1QixFQURhO0FBQUEsVUFDTmhCLElBRE0sNEJBQ0dQLEtBREg7O0FBRXJCLFVBQUl1QixNQUFNQSxHQUFHQyxjQUFiLEVBQTZCO0FBQzNCLFlBQU1DLG9CQUFZekIsTUFBTTBCLFFBQU4sQ0FBZUgsR0FBR0ksS0FBbEIsQ0FBWixDQUFOOztBQUVBRixhQUFLekIsS0FBTCxDQUFXNEIsS0FBWCxDQUFpQkMsSUFBakIsR0FBd0IsT0FBeEI7QUFDQUosYUFBS3pCLEtBQUwsQ0FBVzRCLEtBQVgsQ0FBaUJiLEtBQWpCLEdBQXlCLE1BQXpCO0FBQ0FVLGFBQUt6QixLQUFMLENBQVc0QixLQUFYLENBQWlCRSxRQUFqQixHQUE0QixPQUE1QjtBQUNBTCxhQUFLekIsS0FBTCxDQUFXNEIsS0FBWCxDQUFpQkcsV0FBakIsR0FBa0MsT0FBSy9CLEtBQUwsQ0FBV00sZUFBWCxHQUE2QmlCLEdBQUdJLEtBQWxFO0FBQ0E7QUFDQUYsYUFBS3pCLEtBQUwsQ0FBVzRCLEtBQVgsQ0FBaUJJLFlBQWpCLEdBQWdDLGlDQUFoQzs7QUFFQSxlQUNFO0FBQUE7QUFBQSxZQUFLLHNCQUFvQnpCLEtBQUswQixTQUE5QixFQUEyQyxPQUFPMUIsS0FBS3FCLEtBQXZEO0FBQ0dIO0FBREgsU0FERjtBQUtEO0FBQ0QsYUFBTyxvQkFBQyxTQUFELENBQVcsWUFBWCxDQUF3QixXQUF4QixFQUF3Q2xCLElBQXhDLENBQVA7QUFDRCxLQWxDRzs7QUFBQSxTQW9DSkgsVUFwQ0ksR0FvQ1MsVUFBQzhCLEtBQUQsRUFBUVgsRUFBUixFQUFZWSxFQUFaLEVBQWdCQyxRQUFoQixFQUE2QjtBQUN4QyxhQUFPLEVBQUViLE1BQUYsRUFBUDtBQUNELEtBdENHO0FBQUEsV0FBTjtBQStEQXhCLFVBQVFzQyxXQUFSLEdBQXNCLGFBQXRCO0FBQ0F0QyxVQUFRdUMsWUFBUixHQUF1QjtBQUNyQmhDLHFCQUFpQjtBQURJLEdBQXZCOztBQUlBLFNBQU9QLE9BQVA7QUFDRCxDQXRFRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlICovXHJcblxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQgPT4ge1xyXG4gIGNvbnN0IHdyYXBwZXIgPSBjbGFzcyBSVFRyZWVUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICBzdXBlcihwcm9wcylcclxuICAgICAgdGhpcy5nZXRXcmFwcGVkSW5zdGFuY2UuYmluZCh0aGlzKVxyXG4gICAgICB0aGlzLlRyQ29tcG9uZW50LmJpbmQodGhpcylcclxuICAgICAgdGhpcy5nZXRUclByb3BzLmJpbmQodGhpcylcclxuICAgIH1cclxuXHJcbiAgICAvLyB0aGlzIGlzIHNvIHdlIGNhbiBleHBvc2UgdGhlIHVuZGVybHlpbmcgUmVhY3RUYWJsZSB0byBnZXQgYXQgdGhlIHNvcnRlZERhdGEgZm9yIHNlbGVjdEFsbFxyXG4gICAgZ2V0V3JhcHBlZEluc3RhbmNlID0gKCkgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMud3JhcHBlZEluc3RhbmNlKSBjb25zb2xlLndhcm4oJ1JUVHJlZVRhYmxlIC0gTm8gd3JhcHBlZCBpbnN0YW5jZScpXHJcbiAgICAgIGlmICh0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UpIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UoKVxyXG4gICAgICBlbHNlIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZVxyXG4gICAgfVxyXG5cclxuICAgIFRyQ29tcG9uZW50ID0gcHJvcHMgPT4ge1xyXG4gICAgICBjb25zdCB7IHJpLCAuLi5yZXN0IH0gPSBwcm9wc1xyXG4gICAgICBpZiAocmkgJiYgcmkuZ3JvdXBlZEJ5UGl2b3QpIHtcclxuICAgICAgICBjb25zdCBjZWxsID0geyAuLi5wcm9wcy5jaGlsZHJlbltyaS5sZXZlbF0gfVxyXG5cclxuICAgICAgICBjZWxsLnByb3BzLnN0eWxlLmZsZXggPSAndW5zZXQnXHJcbiAgICAgICAgY2VsbC5wcm9wcy5zdHlsZS53aWR0aCA9ICcxMDAlJ1xyXG4gICAgICAgIGNlbGwucHJvcHMuc3R5bGUubWF4V2lkdGggPSAndW5zZXQnXHJcbiAgICAgICAgY2VsbC5wcm9wcy5zdHlsZS5wYWRkaW5nTGVmdCA9IGAke3RoaXMucHJvcHMudHJlZVRhYmxlSW5kZW50ICogcmkubGV2ZWx9cHhgXHJcbiAgICAgICAgLy8gY2VsbC5wcm9wcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI0RERCc7XHJcbiAgICAgICAgY2VsbC5wcm9wcy5zdHlsZS5ib3JkZXJCb3R0b20gPSAnMXB4IHNvbGlkIHJnYmEoMTI4LDEyOCwxMjgsMC4yKSdcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgcnQtdHIgJHtyZXN0LmNsYXNzTmFtZX1gfSBzdHlsZT17cmVzdC5zdHlsZX0+XHJcbiAgICAgICAgICAgIHtjZWxsfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiA8Q29tcG9uZW50LmRlZmF1bHRQcm9wcy5UckNvbXBvbmVudCB7Li4ucmVzdH0gLz5cclxuICAgIH1cclxuXHJcbiAgICBnZXRUclByb3BzID0gKHN0YXRlLCByaSwgY2ksIGluc3RhbmNlKSA9PiB7XHJcbiAgICAgIHJldHVybiB7IHJpIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgIGNvbnN0IHsgY29sdW1ucywgdHJlZVRhYmxlSW5kZW50LCAuLi5yZXN0IH0gPSB0aGlzLnByb3BzXHJcbiAgICAgIGNvbnN0IHsgVHJDb21wb25lbnQsIGdldFRyUHJvcHMgfSA9IHRoaXNcclxuICAgICAgY29uc3QgZXh0cmEgPSB7XHJcbiAgICAgICAgY29sdW1uczogY29sdW1ucy5tYXAoY29sID0+IHtcclxuICAgICAgICAgIGxldCBjb2x1bW4gPSBjb2xcclxuICAgICAgICAgIGlmIChyZXN0LnBpdm90QnkgJiYgcmVzdC5waXZvdEJ5LmluY2x1ZGVzKGNvbC5hY2Nlc3NvcikpIHtcclxuICAgICAgICAgICAgY29sdW1uID0ge1xyXG4gICAgICAgICAgICAgIGFjY2Vzc29yOiBjb2wuYWNjZXNzb3IsXHJcbiAgICAgICAgICAgICAgd2lkdGg6IGAke3RyZWVUYWJsZUluZGVudH1weGAsXHJcbiAgICAgICAgICAgICAgc2hvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgSGVhZGVyOiAnJyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGNvbHVtblxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIFRyQ29tcG9uZW50LFxyXG4gICAgICAgIGdldFRyUHJvcHMsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiA8Q29tcG9uZW50IHsuLi5yZXN0fSB7Li4uZXh0cmF9IHJlZj17ciA9PiAodGhpcy53cmFwcGVkSW5zdGFuY2UgPSByKX0gLz5cclxuICAgIH1cclxuICB9XHJcbiAgd3JhcHBlci5kaXNwbGF5TmFtZSA9ICdSVFRyZWVUYWJsZSdcclxuICB3cmFwcGVyLmRlZmF1bHRQcm9wcyA9IHtcclxuICAgIHRyZWVUYWJsZUluZGVudDogMTAsXHJcbiAgfVxyXG5cclxuICByZXR1cm4gd3JhcHBlclxyXG59XHJcbiJdfQ==