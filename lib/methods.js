'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (Base) {
  return function (_Base) {
    _inherits(_class, _Base);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'getResolvedState',
      value: function getResolvedState(props, state) {
        var resolvedState = _extends({}, _utils2.default.compactObject(this.state), _utils2.default.compactObject(this.props), _utils2.default.compactObject(state), _utils2.default.compactObject(props));
        return resolvedState;
      }
    }, {
      key: 'getDataModel',
      value: function getDataModel(newState, dataChanged) {
        var _this2 = this;

        var columns = newState.columns,
            _newState$pivotBy = newState.pivotBy,
            pivotBy = _newState$pivotBy === undefined ? [] : _newState$pivotBy,
            data = newState.data,
            resolveData = newState.resolveData,
            pivotIDKey = newState.pivotIDKey,
            pivotValKey = newState.pivotValKey,
            subRowsKey = newState.subRowsKey,
            aggregatedKey = newState.aggregatedKey,
            nestingLevelKey = newState.nestingLevelKey,
            originalKey = newState.originalKey,
            indexKey = newState.indexKey,
            groupedByPivotKey = newState.groupedByPivotKey,
            SubComponent = newState.SubComponent;

        // Determine Header Groups

        var hasHeaderGroups = false;
        columns.forEach(function (column) {
          if (column.columns) {
            hasHeaderGroups = true;
          }
        });

        var columnsWithExpander = [].concat(_toConsumableArray(columns));

        var expanderColumn = columns.find(function (col) {
          return col.expander || col.columns && col.columns.some(function (col2) {
            return col2.expander;
          });
        });
        // The actual expander might be in the columns field of a group column
        if (expanderColumn && !expanderColumn.expander) {
          expanderColumn = expanderColumn.columns.find(function (col) {
            return col.expander;
          });
        }

        // If we have SubComponent's we need to make sure we have an expander column
        if (SubComponent && !expanderColumn) {
          expanderColumn = { expander: true };
          columnsWithExpander = [expanderColumn].concat(_toConsumableArray(columnsWithExpander));
        }

        var makeDecoratedColumn = function makeDecoratedColumn(column, parentColumn) {
          var dcol = void 0;
          if (column.expander) {
            dcol = _extends({}, _this2.props.column, _this2.props.expanderDefaults, column);
          } else {
            dcol = _extends({}, _this2.props.column, column);
          }

          // Ensure minWidth is not greater than maxWidth if set
          if (dcol.maxWidth < dcol.minWidth) {
            dcol.minWidth = dcol.maxWidth;
          }

          if (parentColumn) {
            dcol.parentColumn = parentColumn;
          }

          // First check for string accessor
          if (typeof dcol.accessor === 'string') {
            dcol.id = dcol.id || dcol.accessor;
            var accessorString = dcol.accessor;
            dcol.accessor = function (row) {
              return _utils2.default.get(row, accessorString);
            };
            return dcol;
          }

          // Fall back to functional accessor (but require an ID)
          if (dcol.accessor && !dcol.id) {
            console.warn(dcol);
            throw new Error('A column id is required if using a non-string accessor for column above.');
          }

          // Fall back to an undefined accessor
          if (!dcol.accessor) {
            dcol.accessor = function () {
              return undefined;
            };
          }

          return dcol;
        };

        var allDecoratedColumns = [];

        // Decorate the columns
        var decorateAndAddToAll = function decorateAndAddToAll(column, parentColumn) {
          var decoratedColumn = makeDecoratedColumn(column, parentColumn);
          allDecoratedColumns.push(decoratedColumn);
          return decoratedColumn;
        };

        var decorateColumn = function decorateColumn(column, parent) {
          if (column.columns) {
            return _extends({}, column, {
              columns: column.columns.map(function (d) {
                return decorateColumn(d, column);
              })
            });
          }
          return decorateAndAddToAll(column, parent);
        };

        var decoratedColumns = columnsWithExpander.map(decorateColumn);

        // Build the visible columns, headers and flat column list
        var visibleColumns = decoratedColumns.slice();
        var allVisibleColumns = [];

        var visibleReducer = function visibleReducer(visible, column) {
          if (column.columns) {
            var visibleSubColumns = column.columns.reduce(visibleReducer, []);
            return visibleSubColumns.length ? visible.concat(_extends({}, column, {
              columns: visibleSubColumns
            })) : visible;
          } else if (pivotBy.indexOf(column.id) > -1 ? false : _utils2.default.getFirstDefined(column.show, true)) {
            return visible.concat(column);
          }
          return visible;
        };

        visibleColumns = visibleColumns.reduce(visibleReducer, []);

        // Find any custom pivot location
        var pivotIndex = visibleColumns.findIndex(function (col) {
          return col.pivot;
        });

        // Handle Pivot Columns
        if (pivotBy.length) {
          // Retrieve the pivot columns in the correct pivot order
          var pivotColumns = [];
          pivotBy.forEach(function (pivotID) {
            var found = allDecoratedColumns.find(function (d) {
              return d.id === pivotID;
            });
            if (found) {
              pivotColumns.push(found);
            }
          });

          var PivotParentColumn = pivotColumns.reduce(function (prev, current) {
            return prev && prev === current.parentColumn && current.parentColumn;
          }, pivotColumns[0].parentColumn);

          var PivotGroupHeader = hasHeaderGroups && PivotParentColumn.Header;
          PivotGroupHeader = PivotGroupHeader || function () {
            return _react2.default.createElement(
              'strong',
              null,
              'Pivoted'
            );
          };

          var pivotColumnGroup = {
            Header: PivotGroupHeader,
            columns: pivotColumns.map(function (col) {
              return _extends({}, _this2.props.pivotDefaults, col, {
                pivoted: true
              });
            })

            // Place the pivotColumns back into the visibleColumns
          };if (pivotIndex >= 0) {
            pivotColumnGroup = _extends({}, visibleColumns[pivotIndex], pivotColumnGroup);
            visibleColumns.splice(pivotIndex, 1, pivotColumnGroup);
          } else {
            visibleColumns.unshift(pivotColumnGroup);
          }
        }

        // Build Header Groups
        var headerGroupLayers = [];

        var addToLayer = function addToLayer(columns, layer, totalSpan, column) {
          if (!headerGroupLayers[layer]) {
            headerGroupLayers[layer] = {
              span: totalSpan.length,
              groups: totalSpan.length ? [_extends({}, _this2.props.column, {
                columns: totalSpan
              })] : []
            };
          }
          headerGroupLayers[layer].span += columns.length;
          headerGroupLayers[layer].groups = headerGroupLayers[layer].groups.concat(_extends({}, _this2.props.column, column, {
            columns: columns
          }));
        };

        // Build flast list of allVisibleColumns and HeaderGroups
        var layer = 0;
        var getAllVisibleColumns = function getAllVisibleColumns(_ref, column) {
          var _ref$currentSpan = _ref.currentSpan,
              currentSpan = _ref$currentSpan === undefined ? [] : _ref$currentSpan,
              add = _ref.add,
              _ref$totalSpan = _ref.totalSpan,
              totalSpan = _ref$totalSpan === undefined ? [] : _ref$totalSpan;

          if (column.columns) {
            if (add) {
              addToLayer(add, layer, totalSpan);
              totalSpan = totalSpan.concat(add);
            }

            layer += 1;

            var _column$columns$reduc = column.columns.reduce(getAllVisibleColumns, {
              totalSpan: totalSpan
            }),
                mySpan = _column$columns$reduc.currentSpan;

            layer -= 1;

            addToLayer(mySpan, layer, totalSpan, column);
            return {
              add: false,
              totalSpan: totalSpan.concat(mySpan),
              currentSpan: currentSpan.concat(mySpan)
            };
          }
          allVisibleColumns.push(column);
          return {
            add: (add || []).concat(column),
            totalSpan: totalSpan,
            currentSpan: currentSpan.concat(column)
          };
        };

        var _visibleColumns$reduc = visibleColumns.reduce(getAllVisibleColumns, {}),
            currentSpan = _visibleColumns$reduc.currentSpan;

        if (hasHeaderGroups) {
          headerGroupLayers = headerGroupLayers.map(function (layer) {
            if (layer.span !== currentSpan.length) {
              layer.groups = layer.groups.concat(_extends({}, _this2.props.column, {
                columns: currentSpan.slice(layer.span)
              }));
            }
            return layer.groups;
          });
        }

        // Access the data
        var accessRow = function accessRow(d, i) {
          var _row;

          var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

          var row = (_row = {}, _defineProperty(_row, originalKey, d), _defineProperty(_row, indexKey, i), _defineProperty(_row, subRowsKey, d[subRowsKey]), _defineProperty(_row, nestingLevelKey, level), _row);
          allDecoratedColumns.forEach(function (column) {
            if (column.expander) return;
            row[column.id] = column.accessor(d);
          });
          if (row[subRowsKey]) {
            row[subRowsKey] = row[subRowsKey].map(function (d, i) {
              return accessRow(d, i, level + 1);
            });
          }
          return row;
        };

        // // If the data hasn't changed, just use the cached data
        var resolvedData = this.resolvedData;
        // If the data has changed, run the data resolver and cache the result
        if (!this.resolvedData || dataChanged) {
          resolvedData = resolveData(data);
          this.resolvedData = resolvedData;
        }
        // Use the resolved data
        resolvedData = resolvedData.map(function (d, i) {
          return accessRow(d, i);
        });

        // TODO: Make it possible to fabricate nested rows without pivoting
        var aggregatingColumns = allVisibleColumns.filter(function (d) {
          return !d.expander && d.aggregate;
        });

        // If pivoting, recursively group the data
        var aggregate = function aggregate(rows) {
          var aggregationValues = {};
          aggregatingColumns.forEach(function (column) {
            var values = rows.map(function (d) {
              return d[column.id];
            });
            aggregationValues[column.id] = column.aggregate(values, rows);
          });
          return aggregationValues;
        };
        if (pivotBy.length) {
          var groupRecursively = function groupRecursively(rows, keys) {
            var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            // This is the last level, just return the rows
            if (i === keys.length) {
              return rows;
            }
            // Group the rows together for this level
            var groupedRows = Object.entries(_utils2.default.groupBy(rows, keys[i])).map(function (_ref2) {
              var _ref4;

              var _ref3 = _slicedToArray(_ref2, 2),
                  key = _ref3[0],
                  value = _ref3[1];

              return _ref4 = {}, _defineProperty(_ref4, pivotIDKey, keys[i]), _defineProperty(_ref4, pivotValKey, key), _defineProperty(_ref4, keys[i], key), _defineProperty(_ref4, subRowsKey, value), _defineProperty(_ref4, nestingLevelKey, i), _defineProperty(_ref4, groupedByPivotKey, true), _ref4;
            });
            // Recurse into the subRows
            groupedRows = groupedRows.map(function (rowGroup) {
              var _extends2;

              var subRows = groupRecursively(rowGroup[subRowsKey], keys, i + 1);
              return _extends({}, rowGroup, (_extends2 = {}, _defineProperty(_extends2, subRowsKey, subRows), _defineProperty(_extends2, aggregatedKey, true), _extends2), aggregate(subRows));
            });
            return groupedRows;
          };
          resolvedData = groupRecursively(resolvedData, pivotBy);
        }

        return _extends({}, newState, {
          resolvedData: resolvedData,
          allVisibleColumns: allVisibleColumns,
          headerGroupLayers: headerGroupLayers,
          allDecoratedColumns: allDecoratedColumns,
          hasHeaderGroups: hasHeaderGroups
        });
      }
    }, {
      key: 'getSortedData',
      value: function getSortedData(resolvedState) {
        var manual = resolvedState.manual,
            sorted = resolvedState.sorted,
            filtered = resolvedState.filtered,
            defaultFilterMethod = resolvedState.defaultFilterMethod,
            resolvedData = resolvedState.resolvedData,
            allVisibleColumns = resolvedState.allVisibleColumns,
            allDecoratedColumns = resolvedState.allDecoratedColumns;


        var sortMethodsByColumnID = {};

        allDecoratedColumns.filter(function (col) {
          return col.sortMethod;
        }).forEach(function (col) {
          sortMethodsByColumnID[col.id] = col.sortMethod;
        });

        // Resolve the data from either manual data or sorted data
        return {
          sortedData: manual ? resolvedData : this.sortData(this.filterData(resolvedData, filtered, defaultFilterMethod, allVisibleColumns), sorted, sortMethodsByColumnID)
        };
      }
    }, {
      key: 'fireFetchData',
      value: function fireFetchData() {
        this.props.onFetchData(this.getResolvedState(), this);
      }
    }, {
      key: 'getPropOrState',
      value: function getPropOrState(key) {
        return _utils2.default.getFirstDefined(this.props[key], this.state[key]);
      }
    }, {
      key: 'getStateOrProp',
      value: function getStateOrProp(key) {
        return _utils2.default.getFirstDefined(this.state[key], this.props[key]);
      }
    }, {
      key: 'filterData',
      value: function filterData(data, filtered, defaultFilterMethod, allVisibleColumns) {
        var _this3 = this;

        var filteredData = data;

        if (filtered.length) {
          filteredData = filtered.reduce(function (filteredSoFar, nextFilter) {
            var column = allVisibleColumns.find(function (x) {
              return x.id === nextFilter.id;
            });

            // Don't filter hidden columns or columns that have had their filters disabled
            if (!column || column.filterable === false) {
              return filteredSoFar;
            }

            var filterMethod = column.filterMethod || defaultFilterMethod;

            // If 'filterAll' is set to true, pass the entire dataset to the filter method
            if (column.filterAll) {
              return filterMethod(nextFilter, filteredSoFar, column);
            }
            return filteredSoFar.filter(function (row) {
              return filterMethod(nextFilter, row, column);
            });
          }, filteredData);

          // Apply the filter to the subrows if we are pivoting, and then
          // filter any rows without subcolumns because it would be strange to show
          filteredData = filteredData.map(function (row) {
            if (!row[_this3.props.subRowsKey]) {
              return row;
            }
            return _extends({}, row, _defineProperty({}, _this3.props.subRowsKey, _this3.filterData(row[_this3.props.subRowsKey], filtered, defaultFilterMethod, allVisibleColumns)));
          }).filter(function (row) {
            if (!row[_this3.props.subRowsKey]) {
              return true;
            }
            return row[_this3.props.subRowsKey].length > 0;
          });
        }

        return filteredData;
      }
    }, {
      key: 'sortData',
      value: function sortData(data, sorted) {
        var _this4 = this;

        var sortMethodsByColumnID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        if (!sorted.length) {
          return data;
        }

        var sortedData = (this.props.orderByMethod || _utils2.default.orderBy)(data, sorted.map(function (sort) {
          // Support custom sorting methods for each column
          if (sortMethodsByColumnID[sort.id]) {
            return function (a, b) {
              return sortMethodsByColumnID[sort.id](a[sort.id], b[sort.id], sort.desc);
            };
          }
          return function (a, b) {
            return _this4.props.defaultSortMethod(a[sort.id], b[sort.id], sort.desc);
          };
        }), sorted.map(function (d) {
          return !d.desc;
        }), this.props.indexKey);

        sortedData.forEach(function (row) {
          if (!row[_this4.props.subRowsKey]) {
            return;
          }
          row[_this4.props.subRowsKey] = _this4.sortData(row[_this4.props.subRowsKey], sorted, sortMethodsByColumnID);
        });

        return sortedData;
      }
    }, {
      key: 'getMinRows',
      value: function getMinRows() {
        return _utils2.default.getFirstDefined(this.props.minRows, this.getStateOrProp('pageSize'));
      }

      // User actions

    }, {
      key: 'onPageChange',
      value: function onPageChange(page) {
        var _props = this.props,
            onPageChange = _props.onPageChange,
            collapseOnPageChange = _props.collapseOnPageChange;


        var newState = { page: page };
        if (collapseOnPageChange) {
          newState.expanded = {};
        }
        this.setStateWithData(newState, function () {
          return onPageChange && onPageChange(page);
        });
      }
    }, {
      key: 'onPageSizeChange',
      value: function onPageSizeChange(newPageSize) {
        var onPageSizeChange = this.props.onPageSizeChange;

        var _getResolvedState = this.getResolvedState(),
            pageSize = _getResolvedState.pageSize,
            page = _getResolvedState.page;

        // Normalize the page to display


        var currentRow = pageSize * page;
        var newPage = Math.floor(currentRow / newPageSize);

        this.setStateWithData({
          pageSize: newPageSize,
          page: newPage
        }, function () {
          return onPageSizeChange && onPageSizeChange(newPageSize, newPage);
        });
      }
    }, {
      key: 'sortColumn',
      value: function sortColumn(column, additive) {
        var _getResolvedState2 = this.getResolvedState(),
            sorted = _getResolvedState2.sorted,
            skipNextSort = _getResolvedState2.skipNextSort,
            defaultSortDesc = _getResolvedState2.defaultSortDesc;

        var firstSortDirection = Object.prototype.hasOwnProperty.call(column, 'defaultSortDesc') ? column.defaultSortDesc : defaultSortDesc;
        var secondSortDirection = !firstSortDirection;

        // we can't stop event propagation from the column resize move handlers
        // attached to the document because of react's synthetic events
        // so we have to prevent the sort function from actually sorting
        // if we click on the column resize element within a header.
        if (skipNextSort) {
          this.setStateWithData({
            skipNextSort: false
          });
          return;
        }

        var onSortedChange = this.props.onSortedChange;


        var newSorted = _utils2.default.clone(sorted || []).map(function (d) {
          d.desc = _utils2.default.isSortingDesc(d);
          return d;
        });
        if (!_utils2.default.isArray(column)) {
          // Single-Sort
          var existingIndex = newSorted.findIndex(function (d) {
            return d.id === column.id;
          });
          if (existingIndex > -1) {
            var existing = newSorted[existingIndex];
            if (existing.desc === secondSortDirection) {
              if (additive) {
                newSorted.splice(existingIndex, 1);
              } else {
                existing.desc = firstSortDirection;
                newSorted = [existing];
              }
            } else {
              existing.desc = secondSortDirection;
              if (!additive) {
                newSorted = [existing];
              }
            }
          } else if (additive) {
            newSorted.push({
              id: column.id,
              desc: firstSortDirection
            });
          } else {
            newSorted = [{
              id: column.id,
              desc: firstSortDirection
            }];
          }
        } else {
          // Multi-Sort
          var _existingIndex = newSorted.findIndex(function (d) {
            return d.id === column[0].id;
          });
          // Existing Sorted Column
          if (_existingIndex > -1) {
            var _existing = newSorted[_existingIndex];
            if (_existing.desc === secondSortDirection) {
              if (additive) {
                newSorted.splice(_existingIndex, column.length);
              } else {
                column.forEach(function (d, i) {
                  newSorted[_existingIndex + i].desc = firstSortDirection;
                });
              }
            } else {
              column.forEach(function (d, i) {
                newSorted[_existingIndex + i].desc = secondSortDirection;
              });
            }
            if (!additive) {
              newSorted = newSorted.slice(_existingIndex, column.length);
            }
            // New Sort Column
          } else if (additive) {
            newSorted = newSorted.concat(column.map(function (d) {
              return {
                id: d.id,
                desc: firstSortDirection
              };
            }));
          } else {
            newSorted = column.map(function (d) {
              return {
                id: d.id,
                desc: firstSortDirection
              };
            });
          }
        }

        this.setStateWithData({
          page: !sorted.length && newSorted.length || !additive ? 0 : this.state.page,
          sorted: newSorted
        }, function () {
          return onSortedChange && onSortedChange(newSorted, column, additive);
        });
      }
    }, {
      key: 'filterColumn',
      value: function filterColumn(column, value) {
        var _getResolvedState3 = this.getResolvedState(),
            filtered = _getResolvedState3.filtered;

        var onFilteredChange = this.props.onFilteredChange;

        // Remove old filter first if it exists

        var newFiltering = (filtered || []).filter(function (x) {
          return x.id !== column.id;
        });

        if (value !== '') {
          newFiltering.push({
            id: column.id,
            value: value
          });
        }

        this.setStateWithData({
          filtered: newFiltering
        }, function () {
          return onFilteredChange && onFilteredChange(newFiltering, column, value);
        });
      }
    }, {
      key: 'resizeColumnStart',
      value: function resizeColumnStart(event, column, isTouch) {
        var _this5 = this;

        event.stopPropagation();
        var parentWidth = event.target.parentElement.getBoundingClientRect().width;

        var pageX = void 0;
        if (isTouch) {
          pageX = event.changedTouches[0].pageX;
        } else {
          pageX = event.pageX;
        }

        this.trapEvents = true;
        this.setStateWithData({
          currentlyResizing: {
            id: column.id,
            startX: pageX,
            parentWidth: parentWidth
          }
        }, function () {
          if (isTouch) {
            document.addEventListener('touchmove', _this5.resizeColumnMoving);
            document.addEventListener('touchcancel', _this5.resizeColumnEnd);
            document.addEventListener('touchend', _this5.resizeColumnEnd);
          } else {
            document.addEventListener('mousemove', _this5.resizeColumnMoving);
            document.addEventListener('mouseup', _this5.resizeColumnEnd);
            document.addEventListener('mouseleave', _this5.resizeColumnEnd);
          }
        });
      }
    }, {
      key: 'resizeColumnMoving',
      value: function resizeColumnMoving(event) {
        event.stopPropagation();
        var onResizedChange = this.props.onResizedChange;

        var _getResolvedState4 = this.getResolvedState(),
            resized = _getResolvedState4.resized,
            currentlyResizing = _getResolvedState4.currentlyResizing;

        // Delete old value


        var newResized = resized.filter(function (x) {
          return x.id !== currentlyResizing.id;
        });

        var pageX = void 0;

        if (event.type === 'touchmove') {
          pageX = event.changedTouches[0].pageX;
        } else if (event.type === 'mousemove') {
          pageX = event.pageX;
        }

        // Set the min size to 10 to account for margin and border or else the
        // group headers don't line up correctly
        var newWidth = Math.max(currentlyResizing.parentWidth + pageX - currentlyResizing.startX, 11);

        newResized.push({
          id: currentlyResizing.id,
          value: newWidth
        });

        this.setStateWithData({
          resized: newResized
        }, function () {
          return onResizedChange && onResizedChange(newResized, event);
        });
      }
    }, {
      key: 'resizeColumnEnd',
      value: function resizeColumnEnd(event) {
        event.stopPropagation();
        var isTouch = event.type === 'touchend' || event.type === 'touchcancel';

        if (isTouch) {
          document.removeEventListener('touchmove', this.resizeColumnMoving);
          document.removeEventListener('touchcancel', this.resizeColumnEnd);
          document.removeEventListener('touchend', this.resizeColumnEnd);
        }

        // If its a touch event clear the mouse one's as well because sometimes
        // the mouseDown event gets called as well, but the mouseUp event doesn't
        document.removeEventListener('mousemove', this.resizeColumnMoving);
        document.removeEventListener('mouseup', this.resizeColumnEnd);
        document.removeEventListener('mouseleave', this.resizeColumnEnd);

        // The touch events don't propagate up to the sorting's onMouseDown event so
        // no need to prevent it from happening or else the first click after a touch
        // event resize will not sort the column.
        if (!isTouch) {
          this.setStateWithData({
            skipNextSort: true,
            currentlyResizing: false
          });
        }
      }
    }]);

    return _class;
  }(Base);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tZXRob2RzLmpzIl0sIm5hbWVzIjpbInByb3BzIiwic3RhdGUiLCJyZXNvbHZlZFN0YXRlIiwiXyIsImNvbXBhY3RPYmplY3QiLCJuZXdTdGF0ZSIsImRhdGFDaGFuZ2VkIiwiY29sdW1ucyIsInBpdm90QnkiLCJkYXRhIiwicmVzb2x2ZURhdGEiLCJwaXZvdElES2V5IiwicGl2b3RWYWxLZXkiLCJzdWJSb3dzS2V5IiwiYWdncmVnYXRlZEtleSIsIm5lc3RpbmdMZXZlbEtleSIsIm9yaWdpbmFsS2V5IiwiaW5kZXhLZXkiLCJncm91cGVkQnlQaXZvdEtleSIsIlN1YkNvbXBvbmVudCIsImhhc0hlYWRlckdyb3VwcyIsImZvckVhY2giLCJjb2x1bW4iLCJjb2x1bW5zV2l0aEV4cGFuZGVyIiwiZXhwYW5kZXJDb2x1bW4iLCJmaW5kIiwiY29sIiwiZXhwYW5kZXIiLCJzb21lIiwiY29sMiIsIm1ha2VEZWNvcmF0ZWRDb2x1bW4iLCJwYXJlbnRDb2x1bW4iLCJkY29sIiwiZXhwYW5kZXJEZWZhdWx0cyIsIm1heFdpZHRoIiwibWluV2lkdGgiLCJhY2Nlc3NvciIsImlkIiwiYWNjZXNzb3JTdHJpbmciLCJnZXQiLCJyb3ciLCJjb25zb2xlIiwid2FybiIsIkVycm9yIiwidW5kZWZpbmVkIiwiYWxsRGVjb3JhdGVkQ29sdW1ucyIsImRlY29yYXRlQW5kQWRkVG9BbGwiLCJkZWNvcmF0ZWRDb2x1bW4iLCJwdXNoIiwiZGVjb3JhdGVDb2x1bW4iLCJwYXJlbnQiLCJtYXAiLCJkIiwiZGVjb3JhdGVkQ29sdW1ucyIsInZpc2libGVDb2x1bW5zIiwic2xpY2UiLCJhbGxWaXNpYmxlQ29sdW1ucyIsInZpc2libGVSZWR1Y2VyIiwidmlzaWJsZSIsInZpc2libGVTdWJDb2x1bW5zIiwicmVkdWNlIiwibGVuZ3RoIiwiY29uY2F0IiwiaW5kZXhPZiIsImdldEZpcnN0RGVmaW5lZCIsInNob3ciLCJwaXZvdEluZGV4IiwiZmluZEluZGV4IiwicGl2b3QiLCJwaXZvdENvbHVtbnMiLCJmb3VuZCIsInBpdm90SUQiLCJQaXZvdFBhcmVudENvbHVtbiIsInByZXYiLCJjdXJyZW50IiwiUGl2b3RHcm91cEhlYWRlciIsIkhlYWRlciIsInBpdm90Q29sdW1uR3JvdXAiLCJwaXZvdERlZmF1bHRzIiwicGl2b3RlZCIsInNwbGljZSIsInVuc2hpZnQiLCJoZWFkZXJHcm91cExheWVycyIsImFkZFRvTGF5ZXIiLCJsYXllciIsInRvdGFsU3BhbiIsInNwYW4iLCJncm91cHMiLCJnZXRBbGxWaXNpYmxlQ29sdW1ucyIsImN1cnJlbnRTcGFuIiwiYWRkIiwibXlTcGFuIiwiYWNjZXNzUm93IiwiaSIsImxldmVsIiwicmVzb2x2ZWREYXRhIiwiYWdncmVnYXRpbmdDb2x1bW5zIiwiZmlsdGVyIiwiYWdncmVnYXRlIiwiYWdncmVnYXRpb25WYWx1ZXMiLCJ2YWx1ZXMiLCJyb3dzIiwiZ3JvdXBSZWN1cnNpdmVseSIsImtleXMiLCJncm91cGVkUm93cyIsIk9iamVjdCIsImVudHJpZXMiLCJncm91cEJ5Iiwia2V5IiwidmFsdWUiLCJzdWJSb3dzIiwicm93R3JvdXAiLCJtYW51YWwiLCJzb3J0ZWQiLCJmaWx0ZXJlZCIsImRlZmF1bHRGaWx0ZXJNZXRob2QiLCJzb3J0TWV0aG9kc0J5Q29sdW1uSUQiLCJzb3J0TWV0aG9kIiwic29ydGVkRGF0YSIsInNvcnREYXRhIiwiZmlsdGVyRGF0YSIsIm9uRmV0Y2hEYXRhIiwiZ2V0UmVzb2x2ZWRTdGF0ZSIsImZpbHRlcmVkRGF0YSIsImZpbHRlcmVkU29GYXIiLCJuZXh0RmlsdGVyIiwieCIsImZpbHRlcmFibGUiLCJmaWx0ZXJNZXRob2QiLCJmaWx0ZXJBbGwiLCJvcmRlckJ5TWV0aG9kIiwib3JkZXJCeSIsInNvcnQiLCJhIiwiYiIsImRlc2MiLCJkZWZhdWx0U29ydE1ldGhvZCIsIm1pblJvd3MiLCJnZXRTdGF0ZU9yUHJvcCIsInBhZ2UiLCJvblBhZ2VDaGFuZ2UiLCJjb2xsYXBzZU9uUGFnZUNoYW5nZSIsImV4cGFuZGVkIiwic2V0U3RhdGVXaXRoRGF0YSIsIm5ld1BhZ2VTaXplIiwib25QYWdlU2l6ZUNoYW5nZSIsInBhZ2VTaXplIiwiY3VycmVudFJvdyIsIm5ld1BhZ2UiLCJNYXRoIiwiZmxvb3IiLCJhZGRpdGl2ZSIsInNraXBOZXh0U29ydCIsImRlZmF1bHRTb3J0RGVzYyIsImZpcnN0U29ydERpcmVjdGlvbiIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsInNlY29uZFNvcnREaXJlY3Rpb24iLCJvblNvcnRlZENoYW5nZSIsIm5ld1NvcnRlZCIsImNsb25lIiwiaXNTb3J0aW5nRGVzYyIsImlzQXJyYXkiLCJleGlzdGluZ0luZGV4IiwiZXhpc3RpbmciLCJvbkZpbHRlcmVkQ2hhbmdlIiwibmV3RmlsdGVyaW5nIiwiZXZlbnQiLCJpc1RvdWNoIiwic3RvcFByb3BhZ2F0aW9uIiwicGFyZW50V2lkdGgiLCJ0YXJnZXQiLCJwYXJlbnRFbGVtZW50IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwid2lkdGgiLCJwYWdlWCIsImNoYW5nZWRUb3VjaGVzIiwidHJhcEV2ZW50cyIsImN1cnJlbnRseVJlc2l6aW5nIiwic3RhcnRYIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVzaXplQ29sdW1uTW92aW5nIiwicmVzaXplQ29sdW1uRW5kIiwib25SZXNpemVkQ2hhbmdlIiwicmVzaXplZCIsIm5ld1Jlc2l6ZWQiLCJ0eXBlIiwibmV3V2lkdGgiLCJtYXgiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiQmFzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztrQkFFZTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSx1Q0FFT0EsS0FGUCxFQUVjQyxLQUZkLEVBRXFCO0FBQzlCLFlBQU1DLDZCQUNEQyxnQkFBRUMsYUFBRixDQUFnQixLQUFLSCxLQUFyQixDQURDLEVBRURFLGdCQUFFQyxhQUFGLENBQWdCLEtB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OiJtZXRob2RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgXyBmcm9tICcuL3V0aWxzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFzZSA9PlxyXG4gIGNsYXNzIGV4dGVuZHMgQmFzZSB7XHJcbiAgICBnZXRSZXNvbHZlZFN0YXRlIChwcm9wcywgc3RhdGUpIHtcclxuICAgICAgY29uc3QgcmVzb2x2ZWRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5fLmNvbXBhY3RPYmplY3QodGhpcy5zdGF0ZSksXHJcbiAgICAgICAgLi4uXy5jb21wYWN0T2JqZWN0KHRoaXMucHJvcHMpLFxyXG4gICAgICAgIC4uLl8uY29tcGFjdE9iamVjdChzdGF0ZSksXHJcbiAgICAgICAgLi4uXy5jb21wYWN0T2JqZWN0KHByb3BzKSxcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzb2x2ZWRTdGF0ZVxyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGFNb2RlbCAobmV3U3RhdGUsIGRhdGFDaGFuZ2VkKSB7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBjb2x1bW5zLFxyXG4gICAgICAgIHBpdm90QnkgPSBbXSxcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIHJlc29sdmVEYXRhLFxyXG4gICAgICAgIHBpdm90SURLZXksXHJcbiAgICAgICAgcGl2b3RWYWxLZXksXHJcbiAgICAgICAgc3ViUm93c0tleSxcclxuICAgICAgICBhZ2dyZWdhdGVkS2V5LFxyXG4gICAgICAgIG5lc3RpbmdMZXZlbEtleSxcclxuICAgICAgICBvcmlnaW5hbEtleSxcclxuICAgICAgICBpbmRleEtleSxcclxuICAgICAgICBncm91cGVkQnlQaXZvdEtleSxcclxuICAgICAgICBTdWJDb21wb25lbnQsXHJcbiAgICAgIH0gPSBuZXdTdGF0ZVxyXG5cclxuICAgICAgLy8gRGV0ZXJtaW5lIEhlYWRlciBHcm91cHNcclxuICAgICAgbGV0IGhhc0hlYWRlckdyb3VwcyA9IGZhbHNlXHJcbiAgICAgIGNvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xyXG4gICAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xyXG4gICAgICAgICAgaGFzSGVhZGVyR3JvdXBzID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIGxldCBjb2x1bW5zV2l0aEV4cGFuZGVyID0gWy4uLmNvbHVtbnNdXHJcblxyXG4gICAgICBsZXQgZXhwYW5kZXJDb2x1bW4gPSBjb2x1bW5zLmZpbmQoXHJcbiAgICAgICAgY29sID0+IGNvbC5leHBhbmRlciB8fCAoY29sLmNvbHVtbnMgJiYgY29sLmNvbHVtbnMuc29tZShjb2wyID0+IGNvbDIuZXhwYW5kZXIpKVxyXG4gICAgICApXHJcbiAgICAgIC8vIFRoZSBhY3R1YWwgZXhwYW5kZXIgbWlnaHQgYmUgaW4gdGhlIGNvbHVtbnMgZmllbGQgb2YgYSBncm91cCBjb2x1bW5cclxuICAgICAgaWYgKGV4cGFuZGVyQ29sdW1uICYmICFleHBhbmRlckNvbHVtbi5leHBhbmRlcikge1xyXG4gICAgICAgIGV4cGFuZGVyQ29sdW1uID0gZXhwYW5kZXJDb2x1bW4uY29sdW1ucy5maW5kKGNvbCA9PiBjb2wuZXhwYW5kZXIpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIElmIHdlIGhhdmUgU3ViQ29tcG9uZW50J3Mgd2UgbmVlZCB0byBtYWtlIHN1cmUgd2UgaGF2ZSBhbiBleHBhbmRlciBjb2x1bW5cclxuICAgICAgaWYgKFN1YkNvbXBvbmVudCAmJiAhZXhwYW5kZXJDb2x1bW4pIHtcclxuICAgICAgICBleHBhbmRlckNvbHVtbiA9IHsgZXhwYW5kZXI6IHRydWUgfVxyXG4gICAgICAgIGNvbHVtbnNXaXRoRXhwYW5kZXIgPSBbZXhwYW5kZXJDb2x1bW4sIC4uLmNvbHVtbnNXaXRoRXhwYW5kZXJdXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IG1ha2VEZWNvcmF0ZWRDb2x1bW4gPSAoY29sdW1uLCBwYXJlbnRDb2x1bW4pID0+IHtcclxuICAgICAgICBsZXQgZGNvbFxyXG4gICAgICAgIGlmIChjb2x1bW4uZXhwYW5kZXIpIHtcclxuICAgICAgICAgIGRjb2wgPSB7XHJcbiAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY29sdW1uLFxyXG4gICAgICAgICAgICAuLi50aGlzLnByb3BzLmV4cGFuZGVyRGVmYXVsdHMsXHJcbiAgICAgICAgICAgIC4uLmNvbHVtbixcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGNvbCA9IHtcclxuICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5jb2x1bW4sXHJcbiAgICAgICAgICAgIC4uLmNvbHVtbixcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEVuc3VyZSBtaW5XaWR0aCBpcyBub3QgZ3JlYXRlciB0aGFuIG1heFdpZHRoIGlmIHNldFxyXG4gICAgICAgIGlmIChkY29sLm1heFdpZHRoIDwgZGNvbC5taW5XaWR0aCkge1xyXG4gICAgICAgICAgZGNvbC5taW5XaWR0aCA9IGRjb2wubWF4V2lkdGhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwYXJlbnRDb2x1bW4pIHtcclxuICAgICAgICAgIGRjb2wucGFyZW50Q29sdW1uID0gcGFyZW50Q29sdW1uXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBGaXJzdCBjaGVjayBmb3Igc3RyaW5nIGFjY2Vzc29yXHJcbiAgICAgICAgaWYgKHR5cGVvZiBkY29sLmFjY2Vzc29yID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgZGNvbC5pZCA9IGRjb2wuaWQgfHwgZGNvbC5hY2Nlc3NvclxyXG4gICAgICAgICAgY29uc3QgYWNjZXNzb3JTdHJpbmcgPSBkY29sLmFjY2Vzc29yXHJcbiAgICAgICAgICBkY29sLmFjY2Vzc29yID0gcm93ID0+IF8uZ2V0KHJvdywgYWNjZXNzb3JTdHJpbmcpXHJcbiAgICAgICAgICByZXR1cm4gZGNvbFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRmFsbCBiYWNrIHRvIGZ1bmN0aW9uYWwgYWNjZXNzb3IgKGJ1dCByZXF1aXJlIGFuIElEKVxyXG4gICAgICAgIGlmIChkY29sLmFjY2Vzc29yICYmICFkY29sLmlkKSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oZGNvbClcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgJ0EgY29sdW1uIGlkIGlzIHJlcXVpcmVkIGlmIHVzaW5nIGEgbm9uLXN0cmluZyBhY2Nlc3NvciBmb3IgY29sdW1uIGFib3ZlLidcclxuICAgICAgICAgIClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEZhbGwgYmFjayB0byBhbiB1bmRlZmluZWQgYWNjZXNzb3JcclxuICAgICAgICBpZiAoIWRjb2wuYWNjZXNzb3IpIHtcclxuICAgICAgICAgIGRjb2wuYWNjZXNzb3IgPSAoKSA9PiB1bmRlZmluZWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkY29sXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGFsbERlY29yYXRlZENvbHVtbnMgPSBbXVxyXG5cclxuICAgICAgLy8gRGVjb3JhdGUgdGhlIGNvbHVtbnNcclxuICAgICAgY29uc3QgZGVjb3JhdGVBbmRBZGRUb0FsbCA9IChjb2x1bW4sIHBhcmVudENvbHVtbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRlY29yYXRlZENvbHVtbiA9IG1ha2VEZWNvcmF0ZWRDb2x1bW4oY29sdW1uLCBwYXJlbnRDb2x1bW4pXHJcbiAgICAgICAgYWxsRGVjb3JhdGVkQ29sdW1ucy5wdXNoKGRlY29yYXRlZENvbHVtbilcclxuICAgICAgICByZXR1cm4gZGVjb3JhdGVkQ29sdW1uXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGRlY29yYXRlQ29sdW1uID0gKGNvbHVtbiwgcGFyZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAuLi5jb2x1bW4sXHJcbiAgICAgICAgICAgIGNvbHVtbnM6IGNvbHVtbi5jb2x1bW5zLm1hcChkID0+IGRlY29yYXRlQ29sdW1uKGQsIGNvbHVtbikpLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVjb3JhdGVBbmRBZGRUb0FsbChjb2x1bW4sIHBhcmVudClcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZGVjb3JhdGVkQ29sdW1ucyA9IGNvbHVtbnNXaXRoRXhwYW5kZXIubWFwKGRlY29yYXRlQ29sdW1uKVxyXG5cclxuICAgICAgLy8gQnVpbGQgdGhlIHZpc2libGUgY29sdW1ucywgaGVhZGVycyBhbmQgZmxhdCBjb2x1bW4gbGlzdFxyXG4gICAgICBsZXQgdmlzaWJsZUNvbHVtbnMgPSBkZWNvcmF0ZWRDb2x1bW5zLnNsaWNlKClcclxuICAgICAgY29uc3QgYWxsVmlzaWJsZUNvbHVtbnMgPSBbXVxyXG5cclxuICAgICAgY29uc3QgdmlzaWJsZVJlZHVjZXIgPSAodmlzaWJsZSwgY29sdW1uKSA9PiB7XHJcbiAgICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XHJcbiAgICAgICAgICBjb25zdCB2aXNpYmxlU3ViQ29sdW1ucyA9IGNvbHVtbi5jb2x1bW5zLnJlZHVjZSh2aXNpYmxlUmVkdWNlciwgW10pXHJcbiAgICAgICAgICByZXR1cm4gdmlzaWJsZVN1YkNvbHVtbnMubGVuZ3RoID8gdmlzaWJsZS5jb25jYXQoe1xyXG4gICAgICAgICAgICAuLi5jb2x1bW4sXHJcbiAgICAgICAgICAgIGNvbHVtbnM6IHZpc2libGVTdWJDb2x1bW5zLFxyXG4gICAgICAgICAgfSkgOiB2aXNpYmxlXHJcbiAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgIHBpdm90QnkuaW5kZXhPZihjb2x1bW4uaWQpID4gLTFcclxuICAgICAgICAgICAgPyBmYWxzZVxyXG4gICAgICAgICAgICA6IF8uZ2V0Rmlyc3REZWZpbmVkKGNvbHVtbi5zaG93LCB0cnVlKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgcmV0dXJuIHZpc2libGUuY29uY2F0KGNvbHVtbilcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZpc2libGVcclxuICAgICAgfVxyXG5cclxuICAgICAgdmlzaWJsZUNvbHVtbnMgPSB2aXNpYmxlQ29sdW1ucy5yZWR1Y2UodmlzaWJsZVJlZHVjZXIsIFtdKVxyXG5cclxuICAgICAgLy8gRmluZCBhbnkgY3VzdG9tIHBpdm90IGxvY2F0aW9uXHJcbiAgICAgIGNvbnN0IHBpdm90SW5kZXggPSB2aXNpYmxlQ29sdW1ucy5maW5kSW5kZXgoY29sID0+IGNvbC5waXZvdClcclxuXHJcbiAgICAgIC8vIEhhbmRsZSBQaXZvdCBDb2x1bW5zXHJcbiAgICAgIGlmIChwaXZvdEJ5Lmxlbmd0aCkge1xyXG4gICAgICAgIC8vIFJldHJpZXZlIHRoZSBwaXZvdCBjb2x1bW5zIGluIHRoZSBjb3JyZWN0IHBpdm90IG9yZGVyXHJcbiAgICAgICAgY29uc3QgcGl2b3RDb2x1bW5zID0gW11cclxuICAgICAgICBwaXZvdEJ5LmZvckVhY2gocGl2b3RJRCA9PiB7XHJcbiAgICAgICAgICBjb25zdCBmb3VuZCA9IGFsbERlY29yYXRlZENvbHVtbnMuZmluZChkID0+IGQuaWQgPT09IHBpdm90SUQpXHJcbiAgICAgICAgICBpZiAoZm91bmQpIHtcclxuICAgICAgICAgICAgcGl2b3RDb2x1bW5zLnB1c2goZm91bmQpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgY29uc3QgUGl2b3RQYXJlbnRDb2x1bW4gPSBwaXZvdENvbHVtbnMucmVkdWNlKFxyXG4gICAgICAgICAgKHByZXYsIGN1cnJlbnQpID0+IHByZXYgJiYgcHJldiA9PT0gY3VycmVudC5wYXJlbnRDb2x1bW4gJiYgY3VycmVudC5wYXJlbnRDb2x1bW4sXHJcbiAgICAgICAgICBwaXZvdENvbHVtbnNbMF0ucGFyZW50Q29sdW1uXHJcbiAgICAgICAgKVxyXG5cclxuICAgICAgICBsZXQgUGl2b3RHcm91cEhlYWRlciA9IGhhc0hlYWRlckdyb3VwcyAmJiBQaXZvdFBhcmVudENvbHVtbi5IZWFkZXJcclxuICAgICAgICBQaXZvdEdyb3VwSGVhZGVyID0gUGl2b3RHcm91cEhlYWRlciB8fCAoKCkgPT4gPHN0cm9uZz5QaXZvdGVkPC9zdHJvbmc+KVxyXG5cclxuICAgICAgICBsZXQgcGl2b3RDb2x1bW5Hcm91cCA9IHtcclxuICAgICAgICAgIEhlYWRlcjogUGl2b3RHcm91cEhlYWRlcixcclxuICAgICAgICAgIGNvbHVtbnM6IHBpdm90Q29sdW1ucy5tYXAoY29sID0+ICh7XHJcbiAgICAgICAgICAgIC4uLnRoaXMucHJvcHMucGl2b3REZWZhdWx0cyxcclxuICAgICAgICAgICAgLi4uY29sLFxyXG4gICAgICAgICAgICBwaXZvdGVkOiB0cnVlLFxyXG4gICAgICAgICAgfSkpLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUGxhY2UgdGhlIHBpdm90Q29sdW1ucyBiYWNrIGludG8gdGhlIHZpc2libGVDb2x1bW5zXHJcbiAgICAgICAgaWYgKHBpdm90SW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgcGl2b3RDb2x1bW5Hcm91cCA9IHtcclxuICAgICAgICAgICAgLi4udmlzaWJsZUNvbHVtbnNbcGl2b3RJbmRleF0sXHJcbiAgICAgICAgICAgIC4uLnBpdm90Q29sdW1uR3JvdXAsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB2aXNpYmxlQ29sdW1ucy5zcGxpY2UocGl2b3RJbmRleCwgMSwgcGl2b3RDb2x1bW5Hcm91cClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmlzaWJsZUNvbHVtbnMudW5zaGlmdChwaXZvdENvbHVtbkdyb3VwKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQnVpbGQgSGVhZGVyIEdyb3Vwc1xyXG4gICAgICBsZXQgaGVhZGVyR3JvdXBMYXllcnMgPSBbXVxyXG5cclxuICAgICAgY29uc3QgYWRkVG9MYXllciA9IChjb2x1bW5zLCBsYXllciwgdG90YWxTcGFuLCBjb2x1bW4pID0+IHtcclxuICAgICAgICBpZiAoIWhlYWRlckdyb3VwTGF5ZXJzW2xheWVyXSkge1xyXG4gICAgICAgICAgaGVhZGVyR3JvdXBMYXllcnNbbGF5ZXJdID0ge1xyXG4gICAgICAgICAgICBzcGFuOiB0b3RhbFNwYW4ubGVuZ3RoLFxyXG4gICAgICAgICAgICBncm91cHM6ICh0b3RhbFNwYW4ubGVuZ3RoID8gW3tcclxuICAgICAgICAgICAgICAuLi50aGlzLnByb3BzLmNvbHVtbixcclxuICAgICAgICAgICAgICBjb2x1bW5zOiB0b3RhbFNwYW4sXHJcbiAgICAgICAgICAgIH1dIDogW10pLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBoZWFkZXJHcm91cExheWVyc1tsYXllcl0uc3BhbiArPSBjb2x1bW5zLmxlbmd0aFxyXG4gICAgICAgIGhlYWRlckdyb3VwTGF5ZXJzW2xheWVyXS5ncm91cHMgPSBoZWFkZXJHcm91cExheWVyc1tsYXllcl0uZ3JvdXBzLmNvbmNhdCh7XHJcbiAgICAgICAgICAuLi50aGlzLnByb3BzLmNvbHVtbixcclxuICAgICAgICAgIC4uLmNvbHVtbixcclxuICAgICAgICAgIGNvbHVtbnMsXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQnVpbGQgZmxhc3QgbGlzdCBvZiBhbGxWaXNpYmxlQ29sdW1ucyBhbmQgSGVhZGVyR3JvdXBzXHJcbiAgICAgIGxldCBsYXllciA9IDBcclxuICAgICAgY29uc3QgZ2V0QWxsVmlzaWJsZUNvbHVtbnMgPSAoe1xyXG4gICAgICAgIGN1cnJlbnRTcGFuID0gW10sXHJcbiAgICAgICAgYWRkLFxyXG4gICAgICAgIHRvdGFsU3BhbiA9IFtdLFxyXG4gICAgICB9LCBjb2x1bW4pID0+IHtcclxuICAgICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcclxuICAgICAgICAgIGlmIChhZGQpIHtcclxuICAgICAgICAgICAgYWRkVG9MYXllcihhZGQsIGxheWVyLCB0b3RhbFNwYW4pXHJcbiAgICAgICAgICAgIHRvdGFsU3BhbiA9IHRvdGFsU3Bhbi5jb25jYXQoYWRkKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxheWVyICs9IDFcclxuICAgICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgY3VycmVudFNwYW46IG15U3BhbixcclxuICAgICAgICAgIH0gPSBjb2x1bW4uY29sdW1ucy5yZWR1Y2UoZ2V0QWxsVmlzaWJsZUNvbHVtbnMsIHtcclxuICAgICAgICAgICAgdG90YWxTcGFuLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIGxheWVyIC09IDFcclxuXHJcbiAgICAgICAgICBhZGRUb0xheWVyKG15U3BhbiwgbGF5ZXIsIHRvdGFsU3BhbiwgY29sdW1uKVxyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYWRkOiBmYWxzZSxcclxuICAgICAgICAgICAgdG90YWxTcGFuOiB0b3RhbFNwYW4uY29uY2F0KG15U3BhbiksXHJcbiAgICAgICAgICAgIGN1cnJlbnRTcGFuOiBjdXJyZW50U3Bhbi5jb25jYXQobXlTcGFuKSxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYWxsVmlzaWJsZUNvbHVtbnMucHVzaChjb2x1bW4pXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGFkZDogKGFkZCB8fCBbXSkuY29uY2F0KGNvbHVtbiksXHJcbiAgICAgICAgICB0b3RhbFNwYW4sXHJcbiAgICAgICAgICBjdXJyZW50U3BhbjogY3VycmVudFNwYW4uY29uY2F0KGNvbHVtbiksXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHsgY3VycmVudFNwYW4gfSA9IHZpc2libGVDb2x1bW5zLnJlZHVjZShnZXRBbGxWaXNpYmxlQ29sdW1ucywge30pXHJcbiAgICAgIGlmIChoYXNIZWFkZXJHcm91cHMpIHtcclxuICAgICAgICBoZWFkZXJHcm91cExheWVycyA9IGhlYWRlckdyb3VwTGF5ZXJzLm1hcChsYXllciA9PiB7XHJcbiAgICAgICAgICBpZiAobGF5ZXIuc3BhbiAhPT0gY3VycmVudFNwYW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGxheWVyLmdyb3VwcyA9IGxheWVyLmdyb3Vwcy5jb25jYXQoe1xyXG4gICAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY29sdW1uLFxyXG4gICAgICAgICAgICAgIGNvbHVtbnM6IGN1cnJlbnRTcGFuLnNsaWNlKGxheWVyLnNwYW4pLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGxheWVyLmdyb3Vwc1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEFjY2VzcyB0aGUgZGF0YVxyXG4gICAgICBjb25zdCBhY2Nlc3NSb3cgPSAoZCwgaSwgbGV2ZWwgPSAwKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgcm93ID0ge1xyXG4gICAgICAgICAgW29yaWdpbmFsS2V5XTogZCxcclxuICAgICAgICAgIFtpbmRleEtleV06IGksXHJcbiAgICAgICAgICBbc3ViUm93c0tleV06IGRbc3ViUm93c0tleV0sXHJcbiAgICAgICAgICBbbmVzdGluZ0xldmVsS2V5XTogbGV2ZWwsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFsbERlY29yYXRlZENvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xyXG4gICAgICAgICAgaWYgKGNvbHVtbi5leHBhbmRlcikgcmV0dXJuXHJcbiAgICAgICAgICByb3dbY29sdW1uLmlkXSA9IGNvbHVtbi5hY2Nlc3NvcihkKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYgKHJvd1tzdWJSb3dzS2V5XSkge1xyXG4gICAgICAgICAgcm93W3N1YlJvd3NLZXldID0gcm93W3N1YlJvd3NLZXldLm1hcCgoZCwgaSkgPT4gYWNjZXNzUm93KGQsIGksIGxldmVsICsgMSkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByb3dcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gLy8gSWYgdGhlIGRhdGEgaGFzbid0IGNoYW5nZWQsIGp1c3QgdXNlIHRoZSBjYWNoZWQgZGF0YVxyXG4gICAgICBsZXQgcmVzb2x2ZWREYXRhID0gdGhpcy5yZXNvbHZlZERhdGFcclxuICAgICAgLy8gSWYgdGhlIGRhdGEgaGFzIGNoYW5nZWQsIHJ1biB0aGUgZGF0YSByZXNvbHZlciBhbmQgY2FjaGUgdGhlIHJlc3VsdFxyXG4gICAgICBpZiAoIXRoaXMucmVzb2x2ZWREYXRhIHx8IGRhdGFDaGFuZ2VkKSB7XHJcbiAgICAgICAgcmVzb2x2ZWREYXRhID0gcmVzb2x2ZURhdGEoZGF0YSlcclxuICAgICAgICB0aGlzLnJlc29sdmVkRGF0YSA9IHJlc29sdmVkRGF0YVxyXG4gICAgICB9XHJcbiAgICAgIC8vIFVzZSB0aGUgcmVzb2x2ZWQgZGF0YVxyXG4gICAgICByZXNvbHZlZERhdGEgPSByZXNvbHZlZERhdGEubWFwKChkLCBpKSA9PiBhY2Nlc3NSb3coZCwgaSkpXHJcblxyXG4gICAgICAvLyBUT0RPOiBNYWtlIGl0IHBvc3NpYmxlIHRvIGZhYnJpY2F0ZSBuZXN0ZWQgcm93cyB3aXRob3V0IHBpdm90aW5nXHJcbiAgICAgIGNvbnN0IGFnZ3JlZ2F0aW5nQ29sdW1ucyA9IGFsbFZpc2libGVDb2x1bW5zLmZpbHRlcihkID0+ICFkLmV4cGFuZGVyICYmIGQuYWdncmVnYXRlKVxyXG5cclxuICAgICAgLy8gSWYgcGl2b3RpbmcsIHJlY3Vyc2l2ZWx5IGdyb3VwIHRoZSBkYXRhXHJcbiAgICAgIGNvbnN0IGFnZ3JlZ2F0ZSA9IHJvd3MgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFnZ3JlZ2F0aW9uVmFsdWVzID0ge31cclxuICAgICAgICBhZ2dyZWdhdGluZ0NvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xyXG4gICAgICAgICAgY29uc3QgdmFsdWVzID0gcm93cy5tYXAoZCA9PiBkW2NvbHVtbi5pZF0pXHJcbiAgICAgICAgICBhZ2dyZWdhdGlvblZhbHVlc1tjb2x1bW4uaWRdID0gY29sdW1uLmFnZ3JlZ2F0ZSh2YWx1ZXMsIHJvd3MpXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gYWdncmVnYXRpb25WYWx1ZXNcclxuICAgICAgfVxyXG4gICAgICBpZiAocGl2b3RCeS5sZW5ndGgpIHtcclxuICAgICAgICBjb25zdCBncm91cFJlY3Vyc2l2ZWx5ID0gKHJvd3MsIGtleXMsIGkgPSAwKSA9PiB7XHJcbiAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBsYXN0IGxldmVsLCBqdXN0IHJldHVybiB0aGUgcm93c1xyXG4gICAgICAgICAgaWYgKGkgPT09IGtleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByb3dzXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBHcm91cCB0aGUgcm93cyB0b2dldGhlciBmb3IgdGhpcyBsZXZlbFxyXG4gICAgICAgICAgbGV0IGdyb3VwZWRSb3dzID0gT2JqZWN0LmVudHJpZXMoXy5ncm91cEJ5KHJvd3MsIGtleXNbaV0pKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4gKHtcclxuICAgICAgICAgICAgW3Bpdm90SURLZXldOiBrZXlzW2ldLFxyXG4gICAgICAgICAgICBbcGl2b3RWYWxLZXldOiBrZXksXHJcbiAgICAgICAgICAgIFtrZXlzW2ldXToga2V5LFxyXG4gICAgICAgICAgICBbc3ViUm93c0tleV06IHZhbHVlLFxyXG4gICAgICAgICAgICBbbmVzdGluZ0xldmVsS2V5XTogaSxcclxuICAgICAgICAgICAgW2dyb3VwZWRCeVBpdm90S2V5XTogdHJ1ZSxcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgLy8gUmVjdXJzZSBpbnRvIHRoZSBzdWJSb3dzXHJcbiAgICAgICAgICBncm91cGVkUm93cyA9IGdyb3VwZWRSb3dzLm1hcChyb3dHcm91cCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YlJvd3MgPSBncm91cFJlY3Vyc2l2ZWx5KHJvd0dyb3VwW3N1YlJvd3NLZXldLCBrZXlzLCBpICsgMSlcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAuLi5yb3dHcm91cCxcclxuICAgICAgICAgICAgICBbc3ViUm93c0tleV06IHN1YlJvd3MsXHJcbiAgICAgICAgICAgICAgW2FnZ3JlZ2F0ZWRLZXldOiB0cnVlLFxyXG4gICAgICAgICAgICAgIC4uLmFnZ3JlZ2F0ZShzdWJSb3dzKSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIHJldHVybiBncm91cGVkUm93c1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXNvbHZlZERhdGEgPSBncm91cFJlY3Vyc2l2ZWx5KHJlc29sdmVkRGF0YSwgcGl2b3RCeSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5uZXdTdGF0ZSxcclxuICAgICAgICByZXNvbHZlZERhdGEsXHJcbiAgICAgICAgYWxsVmlzaWJsZUNvbHVtbnMsXHJcbiAgICAgICAgaGVhZGVyR3JvdXBMYXllcnMsXHJcbiAgICAgICAgYWxsRGVjb3JhdGVkQ29sdW1ucyxcclxuICAgICAgICBoYXNIZWFkZXJHcm91cHMsXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRTb3J0ZWREYXRhIChyZXNvbHZlZFN0YXRlKSB7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBtYW51YWwsXHJcbiAgICAgICAgc29ydGVkLFxyXG4gICAgICAgIGZpbHRlcmVkLFxyXG4gICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICAgICAgcmVzb2x2ZWREYXRhLFxyXG4gICAgICAgIGFsbFZpc2libGVDb2x1bW5zLFxyXG4gICAgICAgIGFsbERlY29yYXRlZENvbHVtbnMsXHJcbiAgICAgIH0gPSByZXNvbHZlZFN0YXRlXHJcblxyXG4gICAgICBjb25zdCBzb3J0TWV0aG9kc0J5Q29sdW1uSUQgPSB7fVxyXG5cclxuICAgICAgYWxsRGVjb3JhdGVkQ29sdW1ucy5maWx0ZXIoY29sID0+IGNvbC5zb3J0TWV0aG9kKS5mb3JFYWNoKGNvbCA9PiB7XHJcbiAgICAgICAgc29ydE1ldGhvZHNCeUNvbHVtbklEW2NvbC5pZF0gPSBjb2wuc29ydE1ldGhvZFxyXG4gICAgICB9KVxyXG5cclxuICAgICAgLy8gUmVzb2x2ZSB0aGUgZGF0YSBmcm9tIGVpdGhlciBtYW51YWwgZGF0YSBvciBzb3J0ZWQgZGF0YVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHNvcnRlZERhdGE6IG1hbnVhbFxyXG4gICAgICAgICAgPyByZXNvbHZlZERhdGFcclxuICAgICAgICAgIDogdGhpcy5zb3J0RGF0YShcclxuICAgICAgICAgICAgdGhpcy5maWx0ZXJEYXRhKHJlc29sdmVkRGF0YSwgZmlsdGVyZWQsIGRlZmF1bHRGaWx0ZXJNZXRob2QsIGFsbFZpc2libGVDb2x1bW5zKSxcclxuICAgICAgICAgICAgc29ydGVkLFxyXG4gICAgICAgICAgICBzb3J0TWV0aG9kc0J5Q29sdW1uSURcclxuICAgICAgICAgICksXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaXJlRmV0Y2hEYXRhICgpIHtcclxuICAgICAgdGhpcy5wcm9wcy5vbkZldGNoRGF0YSh0aGlzLmdldFJlc29sdmVkU3RhdGUoKSwgdGhpcylcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9wT3JTdGF0ZSAoa2V5KSB7XHJcbiAgICAgIHJldHVybiBfLmdldEZpcnN0RGVmaW5lZCh0aGlzLnByb3BzW2tleV0sIHRoaXMuc3RhdGVba2V5XSlcclxuICAgIH1cclxuXHJcbiAgICBnZXRTdGF0ZU9yUHJvcCAoa2V5KSB7XHJcbiAgICAgIHJldHVybiBfLmdldEZpcnN0RGVmaW5lZCh0aGlzLnN0YXRlW2tleV0sIHRoaXMucHJvcHNba2V5XSlcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJEYXRhIChkYXRhLCBmaWx0ZXJlZCwgZGVmYXVsdEZpbHRlck1ldGhvZCwgYWxsVmlzaWJsZUNvbHVtbnMpIHtcclxuICAgICAgbGV0IGZpbHRlcmVkRGF0YSA9IGRhdGFcclxuXHJcbiAgICAgIGlmIChmaWx0ZXJlZC5sZW5ndGgpIHtcclxuICAgICAgICBmaWx0ZXJlZERhdGEgPSBmaWx0ZXJlZC5yZWR1Y2UoKGZpbHRlcmVkU29GYXIsIG5leHRGaWx0ZXIpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGNvbHVtbiA9IGFsbFZpc2libGVDb2x1bW5zLmZpbmQoeCA9PiB4LmlkID09PSBuZXh0RmlsdGVyLmlkKVxyXG5cclxuICAgICAgICAgIC8vIERvbid0IGZpbHRlciBoaWRkZW4gY29sdW1ucyBvciBjb2x1bW5zIHRoYXQgaGF2ZSBoYWQgdGhlaXIgZmlsdGVycyBkaXNhYmxlZFxyXG4gICAgICAgICAgaWYgKCFjb2x1bW4gfHwgY29sdW1uLmZpbHRlcmFibGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJlZFNvRmFyXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY29uc3QgZmlsdGVyTWV0aG9kID0gY29sdW1uLmZpbHRlck1ldGhvZCB8fCBkZWZhdWx0RmlsdGVyTWV0aG9kXHJcblxyXG4gICAgICAgICAgLy8gSWYgJ2ZpbHRlckFsbCcgaXMgc2V0IHRvIHRydWUsIHBhc3MgdGhlIGVudGlyZSBkYXRhc2V0IHRvIHRoZSBmaWx0ZXIgbWV0aG9kXHJcbiAgICAgICAgICBpZiAoY29sdW1uLmZpbHRlckFsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyTWV0aG9kKG5leHRGaWx0ZXIsIGZpbHRlcmVkU29GYXIsIGNvbHVtbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBmaWx0ZXJlZFNvRmFyLmZpbHRlcihyb3cgPT4gZmlsdGVyTWV0aG9kKG5leHRGaWx0ZXIsIHJvdywgY29sdW1uKSlcclxuICAgICAgICB9LCBmaWx0ZXJlZERhdGEpXHJcblxyXG4gICAgICAgIC8vIEFwcGx5IHRoZSBmaWx0ZXIgdG8gdGhlIHN1YnJvd3MgaWYgd2UgYXJlIHBpdm90aW5nLCBhbmQgdGhlblxyXG4gICAgICAgIC8vIGZpbHRlciBhbnkgcm93cyB3aXRob3V0IHN1YmNvbHVtbnMgYmVjYXVzZSBpdCB3b3VsZCBiZSBzdHJhbmdlIHRvIHNob3dcclxuICAgICAgICBmaWx0ZXJlZERhdGEgPSBmaWx0ZXJlZERhdGFcclxuICAgICAgICAgIC5tYXAocm93ID0+IHtcclxuICAgICAgICAgICAgaWYgKCFyb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiByb3dcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgIC4uLnJvdyxcclxuICAgICAgICAgICAgICBbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XTogdGhpcy5maWx0ZXJEYXRhKFxyXG4gICAgICAgICAgICAgICAgcm93W3RoaXMucHJvcHMuc3ViUm93c0tleV0sXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZCxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICAgICAgICAgICAgICBhbGxWaXNpYmxlQ29sdW1uc1xyXG4gICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuZmlsdGVyKHJvdyA9PiB7XHJcbiAgICAgICAgICAgIGlmICghcm93W3RoaXMucHJvcHMuc3ViUm93c0tleV0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XS5sZW5ndGggPiAwXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZmlsdGVyZWREYXRhXHJcbiAgICB9XHJcblxyXG4gICAgc29ydERhdGEgKGRhdGEsIHNvcnRlZCwgc29ydE1ldGhvZHNCeUNvbHVtbklEID0ge30pIHtcclxuICAgICAgaWYgKCFzb3J0ZWQubGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgc29ydGVkRGF0YSA9ICh0aGlzLnByb3BzLm9yZGVyQnlNZXRob2QgfHwgXy5vcmRlckJ5KShcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIHNvcnRlZC5tYXAoc29ydCA9PiB7XHJcbiAgICAgICAgICAvLyBTdXBwb3J0IGN1c3RvbSBzb3J0aW5nIG1ldGhvZHMgZm9yIGVhY2ggY29sdW1uXHJcbiAgICAgICAgICBpZiAoc29ydE1ldGhvZHNCeUNvbHVtbklEW3NvcnQuaWRdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoYSwgYikgPT4gc29ydE1ldGhvZHNCeUNvbHVtbklEW3NvcnQuaWRdKGFbc29ydC5pZF0sIGJbc29ydC5pZF0sIHNvcnQuZGVzYylcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiAoYSwgYikgPT4gdGhpcy5wcm9wcy5kZWZhdWx0U29ydE1ldGhvZChhW3NvcnQuaWRdLCBiW3NvcnQuaWRdLCBzb3J0LmRlc2MpXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgc29ydGVkLm1hcChkID0+ICFkLmRlc2MpLFxyXG4gICAgICAgIHRoaXMucHJvcHMuaW5kZXhLZXlcclxuICAgICAgKVxyXG5cclxuICAgICAgc29ydGVkRGF0YS5mb3JFYWNoKHJvdyA9PiB7XHJcbiAgICAgICAgaWYgKCFyb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XSkge1xyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldID0gdGhpcy5zb3J0RGF0YShcclxuICAgICAgICAgIHJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldLFxyXG4gICAgICAgICAgc29ydGVkLFxyXG4gICAgICAgICAgc29ydE1ldGhvZHNCeUNvbHVtbklEXHJcbiAgICAgICAgKVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgcmV0dXJuIHNvcnRlZERhdGFcclxuICAgIH1cclxuXHJcbiAgICBnZXRNaW5Sb3dzICgpIHtcclxuICAgICAgcmV0dXJuIF8uZ2V0Rmlyc3REZWZpbmVkKHRoaXMucHJvcHMubWluUm93cywgdGhpcy5nZXRTdGF0ZU9yUHJvcCgncGFnZVNpemUnKSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBVc2VyIGFjdGlvbnNcclxuICAgIG9uUGFnZUNoYW5nZSAocGFnZSkge1xyXG4gICAgICBjb25zdCB7IG9uUGFnZUNoYW5nZSwgY29sbGFwc2VPblBhZ2VDaGFuZ2UgfSA9IHRoaXMucHJvcHNcclxuXHJcbiAgICAgIGNvbnN0IG5ld1N0YXRlID0geyBwYWdlIH1cclxuICAgICAgaWYgKGNvbGxhcHNlT25QYWdlQ2hhbmdlKSB7XHJcbiAgICAgICAgbmV3U3RhdGUuZXhwYW5kZWQgPSB7fVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShuZXdTdGF0ZSwgKCkgPT4gb25QYWdlQ2hhbmdlICYmIG9uUGFnZUNoYW5nZShwYWdlKSlcclxuICAgIH1cclxuXHJcbiAgICBvblBhZ2VTaXplQ2hhbmdlIChuZXdQYWdlU2l6ZSkge1xyXG4gICAgICBjb25zdCB7IG9uUGFnZVNpemVDaGFuZ2UgfSA9IHRoaXMucHJvcHNcclxuICAgICAgY29uc3QgeyBwYWdlU2l6ZSwgcGFnZSB9ID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcclxuXHJcbiAgICAgIC8vIE5vcm1hbGl6ZSB0aGUgcGFnZSB0byBkaXNwbGF5XHJcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBwYWdlU2l6ZSAqIHBhZ2VcclxuICAgICAgY29uc3QgbmV3UGFnZSA9IE1hdGguZmxvb3IoY3VycmVudFJvdyAvIG5ld1BhZ2VTaXplKVxyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHBhZ2VTaXplOiBuZXdQYWdlU2l6ZSxcclxuICAgICAgICAgIHBhZ2U6IG5ld1BhZ2UsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAoKSA9PiBvblBhZ2VTaXplQ2hhbmdlICYmIG9uUGFnZVNpemVDaGFuZ2UobmV3UGFnZVNpemUsIG5ld1BhZ2UpXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBzb3J0Q29sdW1uIChjb2x1bW4sIGFkZGl0aXZlKSB7XHJcbiAgICAgIGNvbnN0IHsgc29ydGVkLCBza2lwTmV4dFNvcnQsIGRlZmF1bHRTb3J0RGVzYyB9ID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcclxuXHJcbiAgICAgIGNvbnN0IGZpcnN0U29ydERpcmVjdGlvbiA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb2x1bW4sICdkZWZhdWx0U29ydERlc2MnKVxyXG4gICAgICAgID8gY29sdW1uLmRlZmF1bHRTb3J0RGVzY1xyXG4gICAgICAgIDogZGVmYXVsdFNvcnREZXNjXHJcbiAgICAgIGNvbnN0IHNlY29uZFNvcnREaXJlY3Rpb24gPSAhZmlyc3RTb3J0RGlyZWN0aW9uXHJcblxyXG4gICAgICAvLyB3ZSBjYW4ndCBzdG9wIGV2ZW50IHByb3BhZ2F0aW9uIGZyb20gdGhlIGNvbHVtbiByZXNpemUgbW92ZSBoYW5kbGVyc1xyXG4gICAgICAvLyBhdHRhY2hlZCB0byB0aGUgZG9jdW1lbnQgYmVjYXVzZSBvZiByZWFjdCdzIHN5bnRoZXRpYyBldmVudHNcclxuICAgICAgLy8gc28gd2UgaGF2ZSB0byBwcmV2ZW50IHRoZSBzb3J0IGZ1bmN0aW9uIGZyb20gYWN0dWFsbHkgc29ydGluZ1xyXG4gICAgICAvLyBpZiB3ZSBjbGljayBvbiB0aGUgY29sdW1uIHJlc2l6ZSBlbGVtZW50IHdpdGhpbiBhIGhlYWRlci5cclxuICAgICAgaWYgKHNraXBOZXh0U29ydCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YSh7XHJcbiAgICAgICAgICBza2lwTmV4dFNvcnQ6IGZhbHNlLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHsgb25Tb3J0ZWRDaGFuZ2UgfSA9IHRoaXMucHJvcHNcclxuXHJcbiAgICAgIGxldCBuZXdTb3J0ZWQgPSBfLmNsb25lKHNvcnRlZCB8fCBbXSkubWFwKGQgPT4ge1xyXG4gICAgICAgIGQuZGVzYyA9IF8uaXNTb3J0aW5nRGVzYyhkKVxyXG4gICAgICAgIHJldHVybiBkXHJcbiAgICAgIH0pXHJcbiAgICAgIGlmICghXy5pc0FycmF5KGNvbHVtbikpIHtcclxuICAgICAgICAvLyBTaW5nbGUtU29ydFxyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSW5kZXggPSBuZXdTb3J0ZWQuZmluZEluZGV4KGQgPT4gZC5pZCA9PT0gY29sdW1uLmlkKVxyXG4gICAgICAgIGlmIChleGlzdGluZ0luZGV4ID4gLTEpIHtcclxuICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gbmV3U29ydGVkW2V4aXN0aW5nSW5kZXhdXHJcbiAgICAgICAgICBpZiAoZXhpc3RpbmcuZGVzYyA9PT0gc2Vjb25kU29ydERpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoYWRkaXRpdmUpIHtcclxuICAgICAgICAgICAgICBuZXdTb3J0ZWQuc3BsaWNlKGV4aXN0aW5nSW5kZXgsIDEpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgZXhpc3RpbmcuZGVzYyA9IGZpcnN0U29ydERpcmVjdGlvblxyXG4gICAgICAgICAgICAgIG5ld1NvcnRlZCA9IFtleGlzdGluZ11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXhpc3RpbmcuZGVzYyA9IHNlY29uZFNvcnREaXJlY3Rpb25cclxuICAgICAgICAgICAgaWYgKCFhZGRpdGl2ZSkge1xyXG4gICAgICAgICAgICAgIG5ld1NvcnRlZCA9IFtleGlzdGluZ11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoYWRkaXRpdmUpIHtcclxuICAgICAgICAgIG5ld1NvcnRlZC5wdXNoKHtcclxuICAgICAgICAgICAgaWQ6IGNvbHVtbi5pZCxcclxuICAgICAgICAgICAgZGVzYzogZmlyc3RTb3J0RGlyZWN0aW9uLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV3U29ydGVkID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgaWQ6IGNvbHVtbi5pZCxcclxuICAgICAgICAgICAgICBkZXNjOiBmaXJzdFNvcnREaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIE11bHRpLVNvcnRcclxuICAgICAgICBjb25zdCBleGlzdGluZ0luZGV4ID0gbmV3U29ydGVkLmZpbmRJbmRleChkID0+IGQuaWQgPT09IGNvbHVtblswXS5pZClcclxuICAgICAgICAvLyBFeGlzdGluZyBTb3J0ZWQgQ29sdW1uXHJcbiAgICAgICAgaWYgKGV4aXN0aW5nSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBuZXdTb3J0ZWRbZXhpc3RpbmdJbmRleF1cclxuICAgICAgICAgIGlmIChleGlzdGluZy5kZXNjID09PSBzZWNvbmRTb3J0RGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChhZGRpdGl2ZSkge1xyXG4gICAgICAgICAgICAgIG5ld1NvcnRlZC5zcGxpY2UoZXhpc3RpbmdJbmRleCwgY29sdW1uLmxlbmd0aClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjb2x1bW4uZm9yRWFjaCgoZCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbmV3U29ydGVkW2V4aXN0aW5nSW5kZXggKyBpXS5kZXNjID0gZmlyc3RTb3J0RGlyZWN0aW9uXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29sdW1uLmZvckVhY2goKGQsIGkpID0+IHtcclxuICAgICAgICAgICAgICBuZXdTb3J0ZWRbZXhpc3RpbmdJbmRleCArIGldLmRlc2MgPSBzZWNvbmRTb3J0RGlyZWN0aW9uXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoIWFkZGl0aXZlKSB7XHJcbiAgICAgICAgICAgIG5ld1NvcnRlZCA9IG5ld1NvcnRlZC5zbGljZShleGlzdGluZ0luZGV4LCBjb2x1bW4ubGVuZ3RoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gTmV3IFNvcnQgQ29sdW1uXHJcbiAgICAgICAgfSBlbHNlIGlmIChhZGRpdGl2ZSkge1xyXG4gICAgICAgICAgbmV3U29ydGVkID0gbmV3U29ydGVkLmNvbmNhdChcclxuICAgICAgICAgICAgY29sdW1uLm1hcChkID0+ICh7XHJcbiAgICAgICAgICAgICAgaWQ6IGQuaWQsXHJcbiAgICAgICAgICAgICAgZGVzYzogZmlyc3RTb3J0RGlyZWN0aW9uLFxyXG4gICAgICAgICAgICB9KSlcclxuICAgICAgICAgIClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV3U29ydGVkID0gY29sdW1uLm1hcChkID0+ICh7XHJcbiAgICAgICAgICAgIGlkOiBkLmlkLFxyXG4gICAgICAgICAgICBkZXNjOiBmaXJzdFNvcnREaXJlY3Rpb24sXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwYWdlOiAoIXNvcnRlZC5sZW5ndGggJiYgbmV3U29ydGVkLmxlbmd0aCkgfHwgIWFkZGl0aXZlID8gMCA6IHRoaXMuc3RhdGUucGFnZSxcclxuICAgICAgICAgIHNvcnRlZDogbmV3U29ydGVkLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKCkgPT4gb25Tb3J0ZWRDaGFuZ2UgJiYgb25Tb3J0ZWRDaGFuZ2UobmV3U29ydGVkLCBjb2x1bW4sIGFkZGl0aXZlKVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyQ29sdW1uIChjb2x1bW4sIHZhbHVlKSB7XHJcbiAgICAgIGNvbnN0IHsgZmlsdGVyZWQgfSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZSgpXHJcbiAgICAgIGNvbnN0IHsgb25GaWx0ZXJlZENoYW5nZSB9ID0gdGhpcy5wcm9wc1xyXG5cclxuICAgICAgLy8gUmVtb3ZlIG9sZCBmaWx0ZXIgZmlyc3QgaWYgaXQgZXhpc3RzXHJcbiAgICAgIGNvbnN0IG5ld0ZpbHRlcmluZyA9IChmaWx0ZXJlZCB8fCBbXSkuZmlsdGVyKHggPT4geC5pZCAhPT0gY29sdW1uLmlkKVxyXG5cclxuICAgICAgaWYgKHZhbHVlICE9PSAnJykge1xyXG4gICAgICAgIG5ld0ZpbHRlcmluZy5wdXNoKHtcclxuICAgICAgICAgIGlkOiBjb2x1bW4uaWQsXHJcbiAgICAgICAgICB2YWx1ZSxcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmlsdGVyZWQ6IG5ld0ZpbHRlcmluZyxcclxuICAgICAgICB9LFxyXG4gICAgICAgICgpID0+IG9uRmlsdGVyZWRDaGFuZ2UgJiYgb25GaWx0ZXJlZENoYW5nZShuZXdGaWx0ZXJpbmcsIGNvbHVtbiwgdmFsdWUpXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICByZXNpemVDb2x1bW5TdGFydCAoZXZlbnQsIGNvbHVtbiwgaXNUb3VjaCkge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICBjb25zdCBwYXJlbnRXaWR0aCA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXHJcblxyXG4gICAgICBsZXQgcGFnZVhcclxuICAgICAgaWYgKGlzVG91Y2gpIHtcclxuICAgICAgICBwYWdlWCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcGFnZVggPSBldmVudC5wYWdlWFxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnRyYXBFdmVudHMgPSB0cnVlXHJcbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjdXJyZW50bHlSZXNpemluZzoge1xyXG4gICAgICAgICAgICBpZDogY29sdW1uLmlkLFxyXG4gICAgICAgICAgICBzdGFydFg6IHBhZ2VYLFxyXG4gICAgICAgICAgICBwYXJlbnRXaWR0aCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXNUb3VjaCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLnJlc2l6ZUNvbHVtbk1vdmluZylcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMucmVzaXplQ29sdW1uTW92aW5nKVxyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICByZXNpemVDb2x1bW5Nb3ZpbmcgKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgIGNvbnN0IHsgb25SZXNpemVkQ2hhbmdlIH0gPSB0aGlzLnByb3BzXHJcbiAgICAgIGNvbnN0IHsgcmVzaXplZCwgY3VycmVudGx5UmVzaXppbmcgfSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZSgpXHJcblxyXG4gICAgICAvLyBEZWxldGUgb2xkIHZhbHVlXHJcbiAgICAgIGNvbnN0IG5ld1Jlc2l6ZWQgPSByZXNpemVkLmZpbHRlcih4ID0+IHguaWQgIT09IGN1cnJlbnRseVJlc2l6aW5nLmlkKVxyXG5cclxuICAgICAgbGV0IHBhZ2VYXHJcblxyXG4gICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ3RvdWNobW92ZScpIHtcclxuICAgICAgICBwYWdlWCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYXHJcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlbW92ZScpIHtcclxuICAgICAgICBwYWdlWCA9IGV2ZW50LnBhZ2VYXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFNldCB0aGUgbWluIHNpemUgdG8gMTAgdG8gYWNjb3VudCBmb3IgbWFyZ2luIGFuZCBib3JkZXIgb3IgZWxzZSB0aGVcclxuICAgICAgLy8gZ3JvdXAgaGVhZGVycyBkb24ndCBsaW5lIHVwIGNvcnJlY3RseVxyXG4gICAgICBjb25zdCBuZXdXaWR0aCA9IE1hdGgubWF4KFxyXG4gICAgICAgIGN1cnJlbnRseVJlc2l6aW5nLnBhcmVudFdpZHRoICsgcGFnZVggLSBjdXJyZW50bHlSZXNpemluZy5zdGFydFgsXHJcbiAgICAgICAgMTFcclxuICAgICAgKVxyXG5cclxuICAgICAgbmV3UmVzaXplZC5wdXNoKHtcclxuICAgICAgICBpZDogY3VycmVudGx5UmVzaXppbmcuaWQsXHJcbiAgICAgICAgdmFsdWU6IG5ld1dpZHRoLFxyXG4gICAgICB9KVxyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHJlc2l6ZWQ6IG5ld1Jlc2l6ZWQsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAoKSA9PiBvblJlc2l6ZWRDaGFuZ2UgJiYgb25SZXNpemVkQ2hhbmdlKG5ld1Jlc2l6ZWQsIGV2ZW50KVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplQ29sdW1uRW5kIChldmVudCkge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICBjb25zdCBpc1RvdWNoID0gZXZlbnQudHlwZSA9PT0gJ3RvdWNoZW5kJyB8fCBldmVudC50eXBlID09PSAndG91Y2hjYW5jZWwnXHJcblxyXG4gICAgICBpZiAoaXNUb3VjaCkge1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMucmVzaXplQ29sdW1uTW92aW5nKVxyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgaXRzIGEgdG91Y2ggZXZlbnQgY2xlYXIgdGhlIG1vdXNlIG9uZSdzIGFzIHdlbGwgYmVjYXVzZSBzb21ldGltZXNcclxuICAgICAgLy8gdGhlIG1vdXNlRG93biBldmVudCBnZXRzIGNhbGxlZCBhcyB3ZWxsLCBidXQgdGhlIG1vdXNlVXAgZXZlbnQgZG9lc24ndFxyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLnJlc2l6ZUNvbHVtbk1vdmluZylcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXHJcblxyXG4gICAgICAvLyBUaGUgdG91Y2ggZXZlbnRzIGRvbid0IHByb3BhZ2F0ZSB1cCB0byB0aGUgc29ydGluZydzIG9uTW91c2VEb3duIGV2ZW50IHNvXHJcbiAgICAgIC8vIG5vIG5lZWQgdG8gcHJldmVudCBpdCBmcm9tIGhhcHBlbmluZyBvciBlbHNlIHRoZSBmaXJzdCBjbGljayBhZnRlciBhIHRvdWNoXHJcbiAgICAgIC8vIGV2ZW50IHJlc2l6ZSB3aWxsIG5vdCBzb3J0IHRoZSBjb2x1bW4uXHJcbiAgICAgIGlmICghaXNUb3VjaCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YSh7XHJcbiAgICAgICAgICBza2lwTmV4dFNvcnQ6IHRydWUsXHJcbiAgICAgICAgICBjdXJyZW50bHlSZXNpemluZzogZmFsc2UsXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuIl19