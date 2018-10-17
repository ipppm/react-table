'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//
// import _ from './utils'

var defaultButton = function defaultButton(props) {
  return _react2.default.createElement(
    'button',
    _extends({ type: 'button' }, props, { className: '-btn' }),
    props.children
  );
};

var ReactTablePagination = function (_Component) {
  _inherits(ReactTablePagination, _Component);

  function ReactTablePagination(props) {
    _classCallCheck(this, ReactTablePagination);

    var _this = _possibleConstructorReturn(this, (ReactTablePagination.__proto__ || Object.getPrototypeOf(ReactTablePagination)).call(this));

    _this.getSafePage = _this.getSafePage.bind(_this);
    _this.changePage = _this.changePage.bind(_this);
    _this.applyPage = _this.applyPage.bind(_this);

    _this.state = {
      page: props.page
    };
    return _this;
  }

  _createClass(ReactTablePagination, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({ page: nextProps.page });
    }
  }, {
    key: 'getSafePage',
    value: function getSafePage(page) {
      if (Number.isNaN(page)) {
        page = this.props.page;
      }
      return Math.min(Math.max(page, 0), this.props.pages - 1);
    }
  }, {
    key: 'changePage',
    value: function changePage(page) {
      page = this.getSafePage(page);
      this.setState({ page: page });
      if (this.props.page !== page) {
        this.props.onPageChange(page);
      }
    }
  }, {
    key: 'applyPage',
    value: function applyPage(e) {
      if (e) {
        e.preventDefault();
      }
      var page = this.state.page;
      this.changePage(page === '' ? this.props.page : page);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          pages = _props.pages,
          page = _props.page,
          showPageSizeOptions = _props.showPageSizeOptions,
          pageSizeOptions = _props.pageSizeOptions,
          pageSize = _props.pageSize,
          showPageJump = _props.showPageJump,
          canPrevious = _props.canPrevious,
          canNext = _props.canNext,
          onPageSizeChange = _props.onPageSizeChange,
          className = _props.className,
          _props$PreviousCompon = _props.PreviousComponent,
          PreviousComponent = _props$PreviousCompon === undefined ? defaultButton : _props$PreviousCompon,
          _props$NextComponent = _props.NextComponent,
          NextComponent = _props$NextComponent === undefined ? defaultButton : _props$NextComponent;


      return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(className, '-pagination'), style: this.props.style },
        _react2.default.createElement(
          'div',
          { className: '-previous' },
          _react2.default.createElement(
            PreviousComponent,
            {
              onClick: function onClick() {
                if (!canPrevious) return;
                _this2.changePage(page - 1);
              },
              disabled: !canPrevious
            },
            this.props.previousText
          )
        ),
        _react2.default.createElement(
          'div',
          { className: '-center' },
          _react2.default.createElement(
            'span',
            { className: '-pageInfo' },
            this.props.pageText,
            ' ',
            showPageJump ? _react2.default.createElement(
              'div',
              { className: '-pageJump' },
              _react2.default.createElement('input', {
                type: this.state.page === '' ? 'text' : 'number',
                onChange: function onChange(e) {
                  var val = e.target.value;
                  var page = val - 1;
                  if (val === '') {
                    return _this2.setState({ page: val });
                  }
                  _this2.setState({ page: _this2.getSafePage(page) });
                },
                value: this.state.page === '' ? '' : this.state.page + 1,
                onBlur: this.applyPage,
                onKeyPress: function onKeyPress(e) {
                  if (e.which === 13 || e.keyCode === 13) {
                    _this2.applyPage();
                  }
                }
              })
            ) : _react2.default.createElement(
              'span',
              { className: '-currentPage' },
              page + 1
            ),
            ' ',
            this.props.ofText,
            ' ',
            _react2.default.createElement(
              'span',
              { className: '-totalPages' },
              pages || 1
            )
          ),
          showPageSizeOptions && _react2.default.createElement(
            'span',
            { className: 'select-wrap -pageSizeOptions' },
            _react2.default.createElement(
              'select',
              { onChange: function onChange(e) {
                  return onPageSizeChange(Number(e.target.value));
                }, value: pageSize },
              pageSizeOptions.map(function (option, i) {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  _react2.default.createElement(
                    'option',
                    { key: i, value: option },
                    option + ' ' + _this2.props.rowsText
                  )
                );
              })
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: '-next' },
          _react2.default.createElement(
            NextComponent,
            {
              onClick: function onClick() {
                if (!canNext) return;
                _this2.changePage(page + 1);
              },
              disabled: !canNext
            },
            this.props.nextText
          )
        )
      );
    }
  }]);

  return ReactTablePagination;
}(_react.Component);

exports.default = ReactTablePagination;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWdpbmF0aW9uLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRCdXR0b24iLCJwcm9wcyIsImNoaWxkcmVuIiwiUmVhY3RUYWJsZVBhZ2luYXRpb24iLCJnZXRTYWZlUGFnZSIsImJpbmQiLCJjaGFuZ2VQYWdlIiwiYXBwbHlQYWdlIiwic3RhdGUiLCJwYWdlIiwibmV4dFByb3BzIiwic2V0U3RhdGUiLCJOdW1iZXIiLCJpc05hTiIsIk1hdGgiLCJtaW4iLCJtYXgiLCJwYWdlcyIsIm9uUGFnZUNoYW5nZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInNob3dQYWdlU2l6ZU9wdGlvbnMiLCJwYWdlU2l6ZU9wdGlvbnMiLCJwYWdlU2l6ZSIsInNob3dQYWdlSnVtcCIsImNhblByZXZpb3VzIiwiY2FuTmV4dCIsIm9uUGFnZVNpemVDaGFuZ2UiLCJjbGFzc05hbWUiLCJQcmV2aW91c0NvbXBvbmVudCIsIk5leHRDb21wb25lbnQiLCJzdHlsZSIsInByZXZpb3VzVGV4dCIsInBhZ2VUZXh0IiwidmFsIiwidGFyZ2V0IiwidmFsdWUiLCJ3aGljaCIsImtleUNvZGUiLCJvZlRleHQiLCJtYXAiLCJvcHRpb24iLCJpIiwicm93c1RleHQiLCJuZXh0VGV4dCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7O0FBRUEsSUFBTUEsZ0JBQWdCLFNBQWhCQSxhQUFnQjtBQUFBLFNBQ3BCO0FBQUE7QUFBQSxlQUFRLE1BQUssUUFBYixJQUEwQkMsS0FBMUIsSUFBaUMsV0FBVSxNQUEzQztBQUNHQSxVQUFNQztBQURULEdBRG9CO0FBQUEsQ0FBdEI7O0lBTXFCQyxvQjs7O0FBQ25CLGdDQUFhRixLQUFiLEVBQW9CO0FBQUE7O0FBQUE7O0FBR2xCLFVBQUtHLFdBQUwsR0FBbUIsTUFBS0EsV0FBTCxDQUFpQkMsSUFBakIsT0FBbkI7QUFDQSxVQUFLQyxVQUFMLEdBQWtCLE1BQUtBLFVBQUwsQ0FB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QUwsQ0FBVzBDO0FBRDNCO0FBRm1CO0FBQUEsZUFBcEI7QUFESDtBQURGO0FBOUJKLFNBWkY7QUFzREU7QUFBQTtBQUFBLFlBQUssV0FBVSxPQUFmO0FBQ0U7QUFBQyx5QkFBRDtBQUFBO0FBQ0UsdUJBQVMsbUJBQU07QUFDYixvQkFBSSxDQUFDakIsT0FBTCxFQUFjO0FBQ2QsdUJBQUtwQixVQUFMLENBQWdCRyxPQUFPLENBQXZCO0FBQ0QsZUFKSDtBQUtFLHdCQUFVLENBQUNpQjtBQUxiO0FBT0csaUJBQUt6QixLQUFMLENBQVcyQztBQVBkO0FBREY7QUF0REYsT0FERjtBQW9FRDs7OztFQTlIK0NDLGdCOztrQkFBN0IxQyxvQiIsImZpbGUiOiJwYWdpbmF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJ1xyXG4vL1xyXG4vLyBpbXBvcnQgXyBmcm9tICcuL3V0aWxzJ1xyXG5cclxuY29uc3QgZGVmYXVsdEJ1dHRvbiA9IHByb3BzID0+IChcclxuICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiB7Li4ucHJvcHN9IGNsYXNzTmFtZT1cIi1idG5cIj5cclxuICAgIHtwcm9wcy5jaGlsZHJlbn1cclxuICA8L2J1dHRvbj5cclxuKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVhY3RUYWJsZVBhZ2luYXRpb24gZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xyXG4gICAgc3VwZXIoKVxyXG5cclxuICAgIHRoaXMuZ2V0U2FmZVBhZ2UgPSB0aGlzLmdldFNhZmVQYWdlLmJpbmQodGhpcylcclxuICAgIHRoaXMuY2hhbmdlUGFnZSA9IHRoaXMuY2hhbmdlUGFnZS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmFwcGx5UGFnZSA9IHRoaXMuYXBwbHlQYWdlLmJpbmQodGhpcylcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICBwYWdlOiBwcm9wcy5wYWdlLFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyAobmV4dFByb3BzKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHsgcGFnZTogbmV4dFByb3BzLnBhZ2UgfSlcclxuICB9XHJcblxyXG4gIGdldFNhZmVQYWdlIChwYWdlKSB7XHJcbiAgICBpZiAoTnVtYmVyLmlzTmFOKHBhZ2UpKSB7XHJcbiAgICAgIHBhZ2UgPSB0aGlzLnByb3BzLnBhZ2VcclxuICAgIH1cclxuICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChwYWdlLCAwKSwgdGhpcy5wcm9wcy5wYWdlcyAtIDEpXHJcbiAgfVxyXG5cclxuICBjaGFuZ2VQYWdlIChwYWdlKSB7XHJcbiAgICBwYWdlID0gdGhpcy5nZXRTYWZlUGFnZShwYWdlKVxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHBhZ2UgfSlcclxuICAgIGlmICh0aGlzLnByb3BzLnBhZ2UgIT09IHBhZ2UpIHtcclxuICAgICAgdGhpcy5wcm9wcy5vblBhZ2VDaGFuZ2UocGFnZSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFwcGx5UGFnZSAoZSkge1xyXG4gICAgaWYgKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB9XHJcbiAgICBjb25zdCBwYWdlID0gdGhpcy5zdGF0ZS5wYWdlXHJcbiAgICB0aGlzLmNoYW5nZVBhZ2UocGFnZSA9PT0gJycgPyB0aGlzLnByb3BzLnBhZ2UgOiBwYWdlKVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgLy8gQ29tcHV0ZWRcclxuICAgICAgcGFnZXMsXHJcbiAgICAgIC8vIFByb3BzXHJcbiAgICAgIHBhZ2UsXHJcbiAgICAgIHNob3dQYWdlU2l6ZU9wdGlvbnMsXHJcbiAgICAgIHBhZ2VTaXplT3B0aW9ucyxcclxuICAgICAgcGFnZVNpemUsXHJcbiAgICAgIHNob3dQYWdlSnVtcCxcclxuICAgICAgY2FuUHJldmlvdXMsXHJcbiAgICAgIGNhbk5leHQsXHJcbiAgICAgIG9uUGFnZVNpemVDaGFuZ2UsXHJcbiAgICAgIGNsYXNzTmFtZSxcclxuICAgICAgUHJldmlvdXNDb21wb25lbnQgPSBkZWZhdWx0QnV0dG9uLFxyXG4gICAgICBOZXh0Q29tcG9uZW50ID0gZGVmYXVsdEJ1dHRvbixcclxuICAgIH0gPSB0aGlzLnByb3BzXHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY2xhc3NOYW1lLCAnLXBhZ2luYXRpb24nKX0gc3R5bGU9e3RoaXMucHJvcHMuc3R5bGV9PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiLXByZXZpb3VzXCI+XHJcbiAgICAgICAgICA8UHJldmlvdXNDb21wb25lbnRcclxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmICghY2FuUHJldmlvdXMpIHJldHVyblxyXG4gICAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFnZShwYWdlIC0gMSlcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgZGlzYWJsZWQ9eyFjYW5QcmV2aW91c31cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge3RoaXMucHJvcHMucHJldmlvdXNUZXh0fVxyXG4gICAgICAgICAgPC9QcmV2aW91c0NvbXBvbmVudD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIi1jZW50ZXJcIj5cclxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIi1wYWdlSW5mb1wiPlxyXG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5wYWdlVGV4dH17JyAnfVxyXG4gICAgICAgICAgICB7c2hvd1BhZ2VKdW1wID8gKFxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiLXBhZ2VKdW1wXCI+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgdHlwZT17dGhpcy5zdGF0ZS5wYWdlID09PSAnJyA/ICd0ZXh0JyA6ICdudW1iZXInfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsID0gZS50YXJnZXQudmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWdlID0gdmFsIC0gMVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHBhZ2U6IHZhbCB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcGFnZTogdGhpcy5nZXRTYWZlUGFnZShwYWdlKSB9KVxyXG4gICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5wYWdlID09PSAnJyA/ICcnIDogdGhpcy5zdGF0ZS5wYWdlICsgMX1cclxuICAgICAgICAgICAgICAgICAgb25CbHVyPXt0aGlzLmFwcGx5UGFnZX1cclxuICAgICAgICAgICAgICAgICAgb25LZXlQcmVzcz17ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT09IDEzIHx8IGUua2V5Q29kZSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlQYWdlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIi1jdXJyZW50UGFnZVwiPntwYWdlICsgMX08L3NwYW4+XHJcbiAgICAgICAgICAgICl9eycgJ31cclxuICAgICAgICAgICAge3RoaXMucHJvcHMub2ZUZXh0fSA8c3BhbiBjbGFzc05hbWU9XCItdG90YWxQYWdlc1wiPntwYWdlcyB8fCAxfTwvc3Bhbj5cclxuICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIHtzaG93UGFnZVNpemVPcHRpb25zICYmIChcclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic2VsZWN0LXdyYXAgLXBhZ2VTaXplT3B0aW9uc1wiPlxyXG4gICAgICAgICAgICAgIDxzZWxlY3Qgb25DaGFuZ2U9e2UgPT4gb25QYWdlU2l6ZUNoYW5nZShOdW1iZXIoZS50YXJnZXQudmFsdWUpKX0gdmFsdWU9e3BhZ2VTaXplfT5cclxuICAgICAgICAgICAgICAgIHtwYWdlU2l6ZU9wdGlvbnMubWFwKChvcHRpb24sIGkpID0+IChcclxuICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLWFycmF5LWluZGV4LWtleVxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17aX0gdmFsdWU9e29wdGlvbn0+XHJcbiAgICAgICAgICAgICAgICAgICAge2Ake29wdGlvbn0gJHt0aGlzLnByb3BzLnJvd3NUZXh0fWB9XHJcbiAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItbmV4dFwiPlxyXG4gICAgICAgICAgPE5leHRDb21wb25lbnRcclxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmICghY2FuTmV4dCkgcmV0dXJuXHJcbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHBhZ2UgKyAxKVxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICBkaXNhYmxlZD17IWNhbk5leHR9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHt0aGlzLnByb3BzLm5leHRUZXh0fVxyXG4gICAgICAgICAgPC9OZXh0Q29tcG9uZW50PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIClcclxuICB9XHJcbn1cclxuIl19