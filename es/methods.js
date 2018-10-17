var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import _ from './utils';

export default (function (Base) {
  return function (_Base) {
    _inherits(_class, _Base);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'getResolvedState',
      value: function getResolvedState(props, state) {
        var resolvedState = _extends({}, _.compactObject(this.state), _.compactObject(this.props), _.compactObject(state), _.compactObject(props));
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
              return _.get(row, accessorString);
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
          } else if (pivotBy.indexOf(column.id) > -1 ? false : _.getFirstDefined(column.show, true)) {
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
            return React.createElement(
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
            var groupedRows = Object.entries(_.groupBy(rows, keys[i])).map(function (_ref2) {
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
        return _.getFirstDefined(this.props[key], this.state[key]);
      }
    }, {
      key: 'getStateOrProp',
      value: function getStateOrProp(key) {
        return _.getFirstDefined(this.state[key], this.props[key]);
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

        var sortedData = (this.props.orderByMethod || _.orderBy)(data, sorted.map(function (sort) {
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
        return _.getFirstDefined(this.props.minRows, this.getStateOrProp('pageSize'));
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


        var newSorted = _.clone(sorted || []).map(function (d) {
          d.desc = _.isSortingDesc(d);
          return d;
        });
        if (!_.isArray(column)) {
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
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tZXRob2RzLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwiXyIsInByb3BzIiwic3RhdGUiLCJyZXNvbHZlZFN0YXRlIiwiY29tcGFjdE9iamVjdCIsIm5ld1N0YXRlIiwiZGF0YUNoYW5nZWQiLCJjb2x1bW5zIiwicGl2b3RCeSIsImRhdGEiLCJyZXNvbHZlRGF0YSIsInBpdm90SURLZXkiLCJwaXZvdFZhbEtleSIsInN1YlJvd3NLZXkiLCJhZ2dyZWdhdGVkS2V5IiwibmVzdGluZ0xldmVsS2V5Iiwib3JpZ2luYWxLZXkiLCJpbmRleEtleSIsImdyb3VwZWRCeVBpdm90S2V5IiwiU3ViQ29tcG9uZW50IiwiaGFzSGVhZGVyR3JvdXBzIiwiZm9yRWFjaCIsImNvbHVtbiIsImNvbHVtbnNXaXRoRXhwYW5kZXIiLCJleHBhbmRlckNvbHVtbiIsImZpbmQiLCJjb2wiLCJleHBhbmRlciIsInNvbWUiLCJjb2wyIiwibWFrZURlY29yYXRlZENvbHVtbiIsInBhcmVudENvbHVtbiIsImRjb2wiLCJleHBhbmRlckRlZmF1bHRzIiwibWF4V2lkdGgiLCJtaW5XaWR0aCIsImFjY2Vzc29yIiwiaWQiLCJhY2Nlc3NvclN0cmluZyIsImdldCIsInJvdyIsImNvbnNvbGUiLCJ3YXJuIiwiRXJyb3IiLCJ1bmRlZmluZWQiLCJhbGxEZWNvcmF0ZWRDb2x1bW5zIiwiZGVjb3JhdGVBbmRBZGRUb0FsbCIsImRlY29yYXRlZENvbHVtbiIsInB1c2giLCJkZWNvcmF0ZUNvbHVtbiIsInBhcmVudCIsIm1hcCIsImQiLCJkZWNvcmF0ZWRDb2x1bW5zIiwidmlzaWJsZUNvbHVtbnMiLCJzbGljZSIsImFsbFZpc2libGVDb2x1bW5zIiwidmlzaWJsZVJlZHVjZXIiLCJ2aXNpYmxlIiwidmlzaWJsZVN1YkNvbHVtbnMiLCJyZWR1Y2UiLCJsZW5ndGgiLCJjb25jYXQiLCJpbmRleE9mIiwiZ2V0Rmlyc3REZWZpbmVkIiwic2hvdyIsInBpdm90SW5kZXgiLCJmaW5kSW5kZXgiLCJwaXZvdCIsInBpdm90Q29sdW1ucyIsImZvdW5kIiwicGl2b3RJRCIsIlBpdm90UGFyZW50Q29sdW1uIiwicHJldiIsImN1cnJlbnQiLCJQaXZvdEdyb3VwSGVhZGVyIiwiSGVhZGVyIiwicGl2b3RDb2x1bW5Hcm91cCIsInBpdm90RGVmYXVsdHMiLCJwaXZvdGVkIiwic3BsaWNlIiwidW5zaGlmdCIsImhlYWRlckdyb3VwTGF5ZXJzIiwiYWRkVG9MYXllciIsImxheWVyIiwidG90YWxTcGFuIiwic3BhbiIsImdyb3VwcyIsImdldEFsbFZpc2libGVDb2x1bW5zIiwiY3VycmVudFNwYW4iLCJhZGQiLCJteVNwYW4iLCJhY2Nlc3NSb3ciLCJpIiwibGV2ZWwiLCJyZXNvbHZlZERhdGEiLCJhZ2dyZWdhdGluZ0NvbHVtbnMiLCJmaWx0ZXIiLCJhZ2dyZWdhdGUiLCJhZ2dyZWdhdGlvblZhbHVlcyIsInZhbHVlcyIsInJvd3MiLCJncm91cFJlY3Vyc2l2ZWx5Iiwia2V5cyIsImdyb3VwZWRSb3dzIiwiT2JqZWN0IiwiZW50cmllcyIsImdyb3VwQnkiLCJrZXkiLCJ2YWx1ZSIsInN1YlJvd3MiLCJyb3dHcm91cCIsIm1hbnVhbCIsInNvcnRlZCIsImZpbHRlcmVkIiwiZGVmYXVsdEZpbHRlck1ldGhvZCIsInNvcnRNZXRob2RzQnlDb2x1bW5JRCIsInNvcnRNZXRob2QiLCJzb3J0ZWREYXRhIiwic29ydERhdGEiLCJmaWx0ZXJEYXRhIiwib25GZXRjaERhdGEiLCJnZXRSZXNvbHZlZFN0YXRlIiwiZmlsdGVyZWREYXRhIiwiZmlsdGVyZWRTb0ZhciIsIm5leHRGaWx0ZXIiLCJ4IiwiZmlsdGVyYWJsZSIsImZpbHRlck1ldGhvZCIsImZpbHRlckFsbCIsIm9yZGVyQnlNZXRob2QiLCJvcmRlckJ5Iiwic29ydCIsImEiLCJiIiwiZGVzYyIsImRlZmF1bHRTb3J0TWV0aG9kIiwibWluUm93cyIsImdldFN0YXRlT3JQcm9wIiwicGFnZSIsIm9uUGFnZUNoYW5nZSIsImNvbGxhcHNlT25QYWdlQ2hhbmdlIiwiZXhwYW5kZWQiLCJzZXRTdGF0ZVdpdGhEYXRhIiwibmV3UGFnZVNpemUiLCJvblBhZ2VTaXplQ2hhbmdlIiwicGFnZVNpemUiLCJjdXJyZW50Um93IiwibmV3UGFnZSIsIk1hdGgiLCJmbG9vciIsImFkZGl0aXZlIiwic2tpcE5leHRTb3J0IiwiZGVmYXVsdFNvcnREZXNjIiwiZmlyc3RTb3J0RGlyZWN0aW9uIiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwic2Vjb25kU29ydERpcmVjdGlvbiIsIm9uU29ydGVkQ2hhbmdlIiwibmV3U29ydGVkIiwiY2xvbmUiLCJpc1NvcnRpbmdEZXNjIiwiaXNBcnJheSIsImV4aXN0aW5nSW5kZXgiLCJleGlzdGluZyIsIm9uRmlsdGVyZWRDaGFuZ2UiLCJuZXdGaWx0ZXJpbmciLCJldmVudCIsImlzVG91Y2giLCJzdG9wUHJvcGFnYXRpb24iLCJwYXJlbnRXaWR0aCIsInRhcmdldCIsInBhcmVudEVsZW1lbnQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ3aWR0aCIsInBhZ2VYIiwiY2hhbmdlZFRvdWNoZXMiLCJ0cmFwRXZlbnRzIiwiY3VycmVudGx5UmVzaXppbmciLCJzdGFydFgiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZXNpemVDb2x1bW5Nb3ZpbmciLCJyZXNpemVDb2x1bW5FbmQiLCJvblJlc2l6ZWRDaGFuZ2UiLCJyZXNpemVkIiwibmV3UmVzaXplZCIsInR5cGUiLCJuZXdXaWR0aCIsIm1heCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJCYXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBT0EsS0FBUCxNQUFrQixPQUFsQjtBQUNBLE9BQU9DLENBQVAsTUFBYyxTQUFkOztBQUVBLGdCQUFlO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLHVDQUVPQyxLQUZQLEVBRWNDLEtBRmQsRUFFcUI7QUFDOUIsWUFBTUMsNkJBQ0RILEVBQUVJLGFBQUYsQ0FBZ0IsS0FBS0YsS0FBckIsQ0FEQyxFQUVERixFQUFFSSxhQUFGLENBQWdCLEtBQUtILEtBQXJCLENBRkMsRUFHREQsRUFBRUksYUFBRixDQUFnQkYsS0FBaEIsQ0FIQyxFQUlERixFQUFFSSxhQUFGLENBQWdCSCxLQUFoQixDQUpDLENBQU47QUFNQSxlQUFPRSxhQUFQO0FBQ0Q7QUFWVTtBQUFBO0FBQUEsbUNBWUdFLFFBWkgsRUFZYUMsV0FaYixFQVkwQjtBQUFBOztBQUFBLFlBRWpDQyxPQUZpQyxHQWUvQkYsUUFmK0IsQ0FFakNFLE9BRmlDO0FBQUEsZ0NBZS9CRixRQWYrQixDQUdqQ0csT0FIaUM7QUFBQSxZQUdqQ0EsT0FIaUMscUNBR3ZCLEVBSHVCO0FBQUEsWUFJakNDLElBSmlDLEdBZS9CSixRQWYrQixDQUlqQ0ksSUFKaUM7QUFBQSxZQUtqQ0MsV0FMaUMsR0FlL0JMLFFBZitCLENBS2pDSyxXQUxpQztBQUFBLFlBTWpDQyxVQU5pQyxHQWUvQk4sUUFmK0IsQ0FNakNNLFVBTmlDO0FBQUEsWUFPakNDLFdBUGlDLEdBZS9CUCxRQWYrQixDQU9qQ08sV0FQaUM7QUFBQSxZQVFqQ0MsVUFSaUMsR0FlL0JSLFFBZitCLENBUWpDUSxVQVJpQztBQUFBLFlBU2pDQyxhQVRpQyxHQWUvQlQsUUFmK0IsQ0FTakNTLGFBVGlDO0FBQUEsWUFVakNDLGVBVmlDLEdBZS9CVixRQWYrQixDQVVqQ1UsZUFWaUM7QUFBQSxZQVdqQ0MsV0FYaUMsR0FlL0JYLFFBZitCLENBV2pDVyxXQVhpQztBQUFBLFlBWWpDQyxRQVppQyxHQWUvQlosUUFmK0IsQ0FZakNZLFFBWmlDO0FBQUEsWUFhakNDLGlCQWJpQyxHQWUvQmIsUUFmK0IsQ0FhakNhLGlCQWJpQztBQUFBLFlBY2pDQyxZQWRpQyxHQWUvQmQsUUFmK0IsQ0FjakNjLFlBZGlDOztBQWlCbkM7O0FBQ0EsWUFBSUMsa0JBQWtCLEtBQXRCO0FBQ0FiLGdCQUFRYyxPQUFSLENBQWdCLGtCQUFVO0FBQ3hCLGNBQUlDLE9BQU9mLE9BQVgsRUFBb0I7QUFDbEJhLDhCQUFrQixJQUFsQjtBQUNEO0FBQ0YsU0FKRDs7QUFNQSxZQUFJRyxtREFBMEJoQixPQUExQixFQUFKOztBQUVBLFlBQUlpQixpQkFBaUJqQixRQUFRa0IsSUFBUixDQUNuQjtBQUFBLGlCQUFPQyxJQUFJQyxRQUFKLElBQWlCRCxJQUFJbkIsT0FBSixJQUFlbUIsSUFBSW5CLE9BQUosQ0FBWXFCLElBQVosQ0FBaUI7QUFBQSxtQkFBUUMsS0FBS0YsUUFBYjtBQUFBLFdBQWpCLENBQXZDO0FBQUEsU0FEbUIsQ0FBckI7QUFHQTtBQUNBLFlBQUlILGtCQUFrQixDQUFDQSxlQUFlRyxRQUF0QyxFQUFnRDtBQUM5Q0gsMkJBQWlCQSxlQUFlakIsT0FBZixDQUF1QmtCLElBQXZCLENBQTRCO0FBQUEsbUJBQU9DLElBQUlDLFFBQVg7QUFBQSxXQUE1QixDQUFqQjtBQUNEOztBQUVEO0FBQ0EsWUFBSVIsZ0JBQWdCLENBQUNLLGNBQXJCLEVBQXFDO0FBQ25DQSwyQkFBaUIsRUFBRUcsVUFBVSxJQUFaLEVBQWpCO0FBQ0FKLGlDQUF1QkMsY0FBdkIsNEJBQTBDRCxtQkFBMUM7QUFDRDs7QUFFRCxZQUFNTyxzQkFBc0IsU0FBdEJBLG1CQUFzQixDQUFDUixNQUFELEVBQVNTLFlBQVQsRUFBMEI7QUFDcEQsY0FBSUMsYUFBSjtBQUNBLGNBQUlWLE9BQU9LLFFBQVgsRUFBcUI7QUFDbkJLLGdDQUNLLE9BQUsvQixLQUFMLENBQVdxQixNQURoQixFQUVLLE9BQUtyQixLQUFMLENBQVdnQyxnQkFGaEIsRUFHS1gsTUFITDtBQUtELFdBTkQsTUFNTztBQUNMVSxnQ0FDSyxPQUFLL0IsS0FBTCxDQUFXcUIsTUFEaEIsRUFFS0EsTUFGTDtBQUlEOztBQUVEO0FBQ0EsY0FBSVUsS0FBS0UsUUFBTCxHQUFnQkYsS0FBS0csUUFBekIsRUFBbUM7QUFDakNILGlCQUFLRyxRQUFMLEdBQWdCSCxLQUFLRSxRQUFyQjtBQUNEOztBQUVELGNBQUlILFlBQUosRUFBa0I7QUFDaEJDLGlCQUFLRCxZQUFMLEdBQW9CQSxZQUFwQjtBQUNEOztBQUVEO0FBQ0EsY0FBSSxPQUFPQyxLQUFLSSxRQUFaLEtBQXlCLFFBQTdCLEVBQXVDO0FBQ3JDSixpQkFBS0ssRUFBTCxHQUFVTCxLQUFLSyxFQUFMLElBQVdMLEtBQUtJLFFBQTFCO0FBQ0EsZ0JBQU1FLGlCQUFpQk4sS0FBS0ksUUFBNUI7QUFDQUosaUJBQUtJLFFBQUwsR0FBZ0I7QUFBQSxxQkFBT3BDLEVBQUV1QyxHQUFGLENBQU1DLEdBQU4sRUFBV0YsY0FBWCxDQUFQO0FBQUEsYUFBaEI7QUFDQSxtQkFBT04sSUFBUDtBQUNEOztBQUVEO0FBQ0EsY0FBSUEsS0FBS0ksUUFBTCxJQUFpQixDQUFDSixLQUFLSyxFQUEzQixFQUErQjtBQUM3Qkksb0JBQVFDLElBQVIsQ0FBYVYsSUFBYjtBQUNBLGtCQUFNLElBQUlXLEtBQUosQ0FDSiwwRUFESSxDQUFOO0FBR0Q7O0FBRUQ7QUFDQSxjQUFJLENBQUNYLEtBQUtJLFFBQVYsRUFBb0I7QUFDbEJKLGlCQUFLSSxRQUFMLEdBQWdCO0FBQUEscUJBQU1RLFNBQU47QUFBQSxhQUFoQjtBQUNEOztBQUVELGlCQUFPWixJQUFQO0FBQ0QsU0E5Q0Q7O0FBZ0RBLFlBQU1hLHNCQUFzQixFQUE1Qjs7QUFFQTtBQUNBLFlBQU1DLHNCQUFzQixTQUF0QkEsbUJBQXNCLENBQUN4QixNQUFELEVBQVNTLFlBQVQsRUFBMEI7QUFDcEQsY0FBTWdCLGtCQUFrQmpCLG9CQUFvQlIsTUFBcEIsRUFBNEJTLFlBQTVCLENBQXhCO0FBQ0FjLDhCQUFvQkcsSUFBcEIsQ0FBeUJELGVBQXpCO0FBQ0EsaUJBQU9BLGVBQVA7QUFDRCxTQUpEOztBQU1BLFlBQU1FLGlCQUFpQixTQUFqQkEsY0FBaUIsQ0FBQzNCLE1BQUQsRUFBUzRCLE1BQVQsRUFBb0I7QUFDekMsY0FBSTVCLE9BQU9mLE9BQVgsRUFBb0I7QUFDbEIsZ0NBQ0tlLE1BREw7QUFFRWYsdUJBQVNlLE9BQU9mLE9BQVAsQ0FBZTRDLEdBQWYsQ0FBbUI7QUFBQSx1QkFBS0YsZUFBZUcsQ0FBZixFQUFrQjlCLE1BQWxCLENBQUw7QUFBQSxlQUFuQjtBQUZYO0FBSUQ7QUFDRCxpQkFBT3dCLG9CQUFvQnhCLE1BQXBCLEVBQTRCNEIsTUFBNUIsQ0FBUDtBQUNELFNBUkQ7O0FBVUEsWUFBTUcsbUJBQW1COUIsb0JBQW9CNEIsR0FBcEIsQ0FBd0JGLGNBQXhCLENBQXpCOztBQUVBO0FBQ0EsWUFBSUssaUJBQWlCRCxpQkFBaUJFLEtBQWpCLEVBQXJCO0FBQ0EsWUFBTUMsb0JBQW9CLEVBQTFCOztBQUVBLFlBQU1DLGlCQUFpQixTQUFqQkEsY0FBaUIsQ0FBQ0MsT0FBRCxFQUFVcEMsTUFBVixFQUFxQjtBQUMxQyxjQUFJQSxPQUFPZixPQUFYLEVBQW9CO0FBQ2xCLGdCQUFNb0Qsb0JBQW9CckMsT0FBT2YsT0FBUCxDQUFlcUQsTUFBZixDQUFzQkgsY0FBdEIsRUFBc0MsRUFBdEMsQ0FBMUI7QUFDQSxtQkFBT0Usa0JBQWtCRSxNQUFsQixHQUEyQkgsUUFBUUksTUFBUixjQUM3QnhDLE1BRDZCO0FBRWhDZix1QkFBU29EO0FBRnVCLGVBQTNCLEdBR0ZELE9BSEw7QUFJRCxXQU5ELE1BTU8sSUFDTGxELFFBQVF1RCxPQUFSLENBQWdCekMsT0FBT2UsRUFBdkIsSUFBNkIsQ0FBQyxDQUE5QixHQUNJLEtBREosR0FFSXJDLEVBQUVnRSxlQUFGLENBQWtCMUMsT0FBTzJDLElBQXpCLEVBQStCLElBQS9CLENBSEMsRUFJTDtBQUNBLG1CQUFPUCxRQUFRSSxNQUFSLENBQWV4QyxNQUFmLENBQVA7QUFDRDtBQUNELGlCQUFPb0MsT0FBUDtBQUNELFNBZkQ7O0FBaUJBSix5QkFBaUJBLGVBQWVNLE1BQWYsQ0FBc0JILGNBQXRCLEVBQXNDLEVBQXRDLENBQWpCOztBQUVBO0FBQ0EsWUFBTVMsYUFBYVosZUFBZWEsU0FBZixDQUF5QjtBQUFBLGlCQUFPekMsSUFBSTBDLEtBQVg7QUFBQSxTQUF6QixDQUFuQjs7QUFFQTtBQUNBLFlBQUk1RCxRQUFRcUQsTUFBWixFQUFvQjtBQUNsQjtBQUNBLGNBQU1RLGVBQWUsRUFBckI7QUFDQTdELGtCQUFRYSxPQUFSLENBQWdCLG1CQUFXO0FBQ3pCLGdCQUFNaUQsUUFBUXpCLG9CQUFvQnBCLElBQXBCLENBQXlCO0FBQUEscUJBQUsyQixFQUFFZixFQUFGLEtBQVNrQyxPQUFkO0FBQUEsYUFBekIsQ0FBZDtBQUNBLGdCQUFJRCxLQUFKLEVBQVc7QUFDVEQsMkJBQWFyQixJQUFiLENBQWtCc0IsS0FBbEI7QUFDRDtBQUNGLFdBTEQ7O0FBT0EsY0FBTUUsb0JBQW9CSCxhQUFhVCxNQUFiLENBQ3hCLFVBQUNhLElBQUQsRUFBT0MsT0FBUDtBQUFBLG1CQUFtQkQsUUFBUUEsU0FBU0MsUUFBUTNDLFlBQXpCLElBQXlDMkMsUUFBUTNDLFlBQXBFO0FBQUEsV0FEd0IsRUFFeEJzQyxhQUFhLENBQWIsRUFBZ0J0QyxZQUZRLENBQTFCOztBQUtBLGNBQUk0QyxtQkFBbUJ2RCxtQkFBbUJvRCxrQkFBa0JJLE1BQTVEO0FBQ0FELDZCQUFtQkEsb0JBQXFCO0FBQUEsbUJBQU07QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUFOO0FBQUEsV0FBeEM7O0FBRUEsY0FBSUUsbUJBQW1CO0FBQ3JCRCxvQkFBUUQsZ0JBRGE7QUFFckJwRSxxQkFBUzhELGFBQWFsQixHQUFiLENBQWlCO0FBQUEsa0NBQ3JCLE9BQUtsRCxLQUFMLENBQVc2RSxhQURVLEVBRXJCcEQsR0FGcUI7QUFHeEJxRCx5QkFBUztBQUhlO0FBQUEsYUFBakI7O0FBT1g7QUFUdUIsV0FBdkIsQ0FVQSxJQUFJYixjQUFjLENBQWxCLEVBQXFCO0FBQ25CVyw0Q0FDS3ZCLGVBQWVZLFVBQWYsQ0FETCxFQUVLVyxnQkFGTDtBQUlBdkIsMkJBQWUwQixNQUFmLENBQXNCZCxVQUF0QixFQUFrQyxDQUFsQyxFQUFxQ1csZ0JBQXJDO0FBQ0QsV0FORCxNQU1PO0FBQ0x2QiwyQkFBZTJCLE9BQWYsQ0FBdUJKLGdCQUF2QjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxZQUFJSyxvQkFBb0IsRUFBeEI7O0FBRUEsWUFBTUMsYUFBYSxTQUFiQSxVQUFhLENBQUM1RSxPQUFELEVBQVU2RSxLQUFWLEVBQWlCQyxTQUFqQixFQUE0Qi9ELE1BQTVCLEVBQXVDO0FBQ3hELGNBQUksQ0FBQzRELGtCQUFrQkUsS0FBbEIsQ0FBTCxFQUErQjtBQUM3QkYsOEJBQWtCRSxLQUFsQixJQUEyQjtBQUN6QkUsb0JBQU1ELFVBQVV4QixNQURTO0FBRXpCMEIsc0JBQVNGLFVBQVV4QixNQUFWLEdBQW1CLGNBQ3ZCLE9BQUs1RCxLQUFMLENBQVdxQixNQURZO0FBRTFCZix5QkFBUzhFO0FBRmlCLGlCQUFuQixHQUdKO0FBTG9CLGFBQTNCO0FBT0Q7QUFDREgsNEJBQWtCRSxLQUFsQixFQUF5QkUsSUFBekIsSUFBaUMvRSxRQUFRc0QsTUFBekM7QUFDQXFCLDRCQUFrQkUsS0FBbEIsRUFBeUJHLE1BQXpCLEdBQWtDTCxrQkFBa0JFLEtBQWxCLEVBQXlCRyxNQUF6QixDQUFnQ3pCLE1BQWhDLGNBQzdCLE9BQUs3RCxLQUFMLENBQVdxQixNQURrQixFQUU3QkEsTUFGNkI7QUFHaENmO0FBSGdDLGFBQWxDO0FBS0QsU0FoQkQ7O0FBa0JBO0FBQ0EsWUFBSTZFLFFBQVEsQ0FBWjtBQUNBLFlBQU1JLHVCQUF1QixTQUF2QkEsb0JBQXVCLE9BSTFCbEUsTUFKMEIsRUFJZjtBQUFBLHNDQUhabUUsV0FHWTtBQUFBLGNBSFpBLFdBR1ksb0NBSEUsRUFHRjtBQUFBLGNBRlpDLEdBRVksUUFGWkEsR0FFWTtBQUFBLG9DQURaTCxTQUNZO0FBQUEsY0FEWkEsU0FDWSxrQ0FEQSxFQUNBOztBQUNaLGNBQUkvRCxPQUFPZixPQUFYLEVBQW9CO0FBQ2xCLGdCQUFJbUYsR0FBSixFQUFTO0FBQ1BQLHlCQUFXTyxHQUFYLEVBQWdCTixLQUFoQixFQUF1QkMsU0FBdkI7QUFDQUEsMEJBQVlBLFVBQVV2QixNQUFWLENBQWlCNEIsR0FBakIsQ0FBWjtBQUNEOztBQUVETixxQkFBUyxDQUFUOztBQU5rQix3Q0FTZDlELE9BQU9mLE9BQVAsQ0FBZXFELE1BQWYsQ0FBc0I0QixvQkFBdEIsRUFBNEM7QUFDOUNIO0FBRDhDLGFBQTVDLENBVGM7QUFBQSxnQkFRSE0sTUFSRyx5QkFRaEJGLFdBUmdCOztBQVlsQkwscUJBQVMsQ0FBVDs7QUFFQUQsdUJBQVdRLE1BQVgsRUFBbUJQLEtBQW5CLEVBQTBCQyxTQUExQixFQUFxQy9ELE1BQXJDO0FBQ0EsbUJBQU87QUFDTG9FLG1CQUFLLEtBREE7QUFFTEwseUJBQVdBLFVBQVV2QixNQUFWLENBQWlCNkIsTUFBakIsQ0FGTjtBQUdMRiwyQkFBYUEsWUFBWTNCLE1BQVosQ0FBbUI2QixNQUFuQjtBQUhSLGFBQVA7QUFLRDtBQUNEbkMsNEJBQWtCUixJQUFsQixDQUF1QjFCLE1BQXZCO0FBQ0EsaUJBQU87QUFDTG9FLGlCQUFLLENBQUNBLE9BQU8sRUFBUixFQUFZNUIsTUFBWixDQUFtQnhDLE1BQW5CLENBREE7QUFFTCtELGdDQUZLO0FBR0xJLHlCQUFhQSxZQUFZM0IsTUFBWixDQUFtQnhDLE1BQW5CO0FBSFIsV0FBUDtBQUtELFNBaENEOztBQXZNbUMsb0NBd09YZ0MsZUFBZU0sTUFBZixDQUFzQjRCLG9CQUF0QixFQUE0QyxFQUE1QyxDQXhPVztBQUFBLFlBd08zQkMsV0F4TzJCLHlCQXdPM0JBLFdBeE8yQjs7QUF5T25DLFlBQUlyRSxlQUFKLEVBQXFCO0FBQ25COEQsOEJBQW9CQSxrQkFBa0IvQixHQUFsQixDQUFzQixpQkFBUztBQUNqRCxnQkFBSWlDLE1BQU1FLElBQU4sS0FBZUcsWUFBWTVCLE1BQS9CLEVBQXVDO0FBQ3JDdUIsb0JBQU1HLE1BQU4sR0FBZUgsTUFBTUcsTUFBTixDQUFhekIsTUFBYixjQUNWLE9BQUs3RCxLQUFMLENBQVdxQixNQUREO0FBRWJmLHlCQUFTa0YsWUFBWWxDLEtBQVosQ0FBa0I2QixNQUFNRSxJQUF4QjtBQUZJLGlCQUFmO0FBSUQ7QUFDRCxtQkFBT0YsTUFBTUcsTUFBYjtBQUNELFdBUm1CLENBQXBCO0FBU0Q7O0FBRUQ7QUFDQSxZQUFNSyxZQUFZLFNBQVpBLFNBQVksQ0FBQ3hDLENBQUQsRUFBSXlDLENBQUosRUFBcUI7QUFBQTs7QUFBQSxjQUFkQyxLQUFjLHVFQUFOLENBQU07O0FBQ3JDLGNBQU10RCx3Q0FDSHhCLFdBREcsRUFDV29DLENBRFgseUJBRUhuQyxRQUZHLEVBRVE0RSxDQUZSLHlCQUdIaEYsVUFIRyxFQUdVdUMsRUFBRXZDLFVBQUYsQ0FIVix5QkFJSEUsZUFKRyxFQUllK0UsS0FKZixRQUFOO0FBTUFqRCw4QkFBb0J4QixPQUFwQixDQUE0QixrQkFBVTtBQUNwQyxnQkFBSUMsT0FBT0ssUUFBWCxFQUFxQjtBQUNyQmEsZ0JBQUlsQixPQUFPZSxFQUFYLElBQWlCZixPQUFPYyxRQUFQLENBQWdCZ0IsQ0FBaEIsQ0FBakI7QUFDRCxXQUhEO0FBSUEsY0FBSVosSUFBSTNCLFVBQUosQ0FBSixFQUFxQjtBQUNuQjJCLGdCQUFJM0IsVUFBSixJQUFrQjJCLElBQUkzQixVQUFKLEVBQWdCc0MsR0FBaEIsQ0FBb0IsVUFBQ0MsQ0FBRCxFQUFJeUMsQ0FBSjtBQUFBLHFCQUFVRCxVQUFVeEMsQ0FBVixFQUFheUMsQ0FBYixFQUFnQkMsUUFBUSxDQUF4QixDQUFWO0FBQUEsYUFBcEIsQ0FBbEI7QUFDRDtBQUNELGlCQUFPdEQsR0FBUDtBQUNELFNBZkQ7O0FBaUJBO0FBQ0EsWUFBSXVELGVBQWUsS0FBS0EsWUFBeEI7QUFDQTtBQUNBLFlBQUksQ0FBQyxLQUFLQSxZQUFOLElBQXNCekYsV0FBMUIsRUFBdUM7QUFDckN5Rix5QkFBZXJGLFlBQVlELElBQVosQ0FBZjtBQUNBLGVBQUtzRixZQUFMLEdBQW9CQSxZQUFwQjtBQUNEO0FBQ0Q7QUFDQUEsdUJBQWVBLGFBQWE1QyxHQUFiLENBQWlCLFVBQUNDLENBQUQsRUFBSXlDLENBQUo7QUFBQSxpQkFBVUQsVUFBVXhDLENBQVYsRUFBYXlDLENBQWIsQ0FBVjtBQUFBLFNBQWpCLENBQWY7O0FBRUE7QUFDQSxZQUFNRyxxQkFBcUJ4QyxrQkFBa0J5QyxNQUFsQixDQUF5QjtBQUFBLGlCQUFLLENBQUM3QyxFQUFFekIsUUFBSCxJQUFleUIsRUFBRThDLFNBQXRCO0FBQUEsU0FBekIsQ0FBM0I7O0FBRUE7QUFDQSxZQUFNQSxZQUFZLFNBQVpBLFNBQVksT0FBUTtBQUN4QixjQUFNQyxvQkFBb0IsRUFBMUI7QUFDQUgsNkJBQW1CM0UsT0FBbkIsQ0FBMkIsa0JBQVU7QUFDbkMsZ0JBQU0rRSxTQUFTQyxLQUFLbEQsR0FBTCxDQUFTO0FBQUEscUJBQUtDLEVBQUU5QixPQUFPZSxFQUFULENBQUw7QUFBQSxhQUFULENBQWY7QUFDQThELDhCQUFrQjdFLE9BQU9lLEVBQXpCLElBQStCZixPQUFPNEUsU0FBUCxDQUFpQkUsTUFBakIsRUFBeUJDLElBQXpCLENBQS9CO0FBQ0QsV0FIRDtBQUlBLGlCQUFPRixpQkFBUDtBQUNELFNBUEQ7QUFRQSxZQUFJM0YsUUFBUXFELE1BQVosRUFBb0I7QUFDbEIsY0FBTXlDLG1CQUFtQixTQUFuQkEsZ0JBQW1CLENBQUNELElBQUQsRUFBT0UsSUFBUCxFQUF1QjtBQUFBLGdCQUFWVixDQUFVLHVFQUFOLENBQU07O0FBQzlDO0FBQ0EsZ0JBQUlBLE1BQU1VLEtBQUsxQyxNQUFmLEVBQXVCO0FBQ3JCLHFCQUFPd0MsSUFBUDtBQUNEO0FBQ0Q7QUFDQSxnQkFBSUcsY0FBY0MsT0FBT0MsT0FBUCxDQUFlMUcsRUFBRTJHLE9BQUYsQ0FBVU4sSUFBVixFQUFnQkUsS0FBS1YsQ0FBTCxDQUFoQixDQUFmLEVBQXlDMUMsR0FBekMsQ0FBNkM7QUFBQTs7QUFBQTtBQUFBLGtCQUFFeUQsR0FBRjtBQUFBLGtCQUFPQyxLQUFQOztBQUFBLHdEQUM1RGxHLFVBRDRELEVBQy9DNEYsS0FBS1YsQ0FBTCxDQUQrQywwQkFFNURqRixXQUY0RCxFQUU5Q2dHLEdBRjhDLDBCQUc1REwsS0FBS1YsQ0FBTCxDQUg0RCxFQUdsRGUsR0FIa0QsMEJBSTVEL0YsVUFKNEQsRUFJL0NnRyxLQUorQywwQkFLNUQ5RixlQUw0RCxFQUsxQzhFLENBTDBDLDBCQU01RDNFLGlCQU40RCxFQU14QyxJQU53QztBQUFBLGFBQTdDLENBQWxCO0FBUUE7QUFDQXNGLDBCQUFjQSxZQUFZckQsR0FBWixDQUFnQixvQkFBWTtBQUFBOztBQUN4QyxrQkFBTTJELFVBQVVSLGlCQUFpQlMsU0FBU2xHLFVBQVQsQ0FBakIsRUFBdUMwRixJQUF2QyxFQUE2Q1YsSUFBSSxDQUFqRCxDQUFoQjtBQUNBLGtDQUNLa0IsUUFETCw4Q0FFR2xHLFVBRkgsRUFFZ0JpRyxPQUZoQiw4QkFHR2hHLGFBSEgsRUFHbUIsSUFIbkIsZUFJS29GLFVBQVVZLE9BQVYsQ0FKTDtBQU1ELGFBUmEsQ0FBZDtBQVNBLG1CQUFPTixXQUFQO0FBQ0QsV0F6QkQ7QUEwQkFULHlCQUFlTyxpQkFBaUJQLFlBQWpCLEVBQStCdkYsT0FBL0IsQ0FBZjtBQUNEOztBQUVELDRCQUNLSCxRQURMO0FBRUUwRixvQ0FGRjtBQUdFdkMsOENBSEY7QUFJRTBCLDhDQUpGO0FBS0VyQyxrREFMRjtBQU1FekI7QUFORjtBQVFEO0FBL1VVO0FBQUE7QUFBQSxvQ0FpVklqQixhQWpWSixFQWlWbUI7QUFBQSxZQUUxQjZHLE1BRjBCLEdBU3hCN0csYUFUd0IsQ0FFMUI2RyxNQUYwQjtBQUFBLFlBRzFCQyxNQUgwQixHQVN4QjlHLGFBVHdCLENBRzFCOEcsTUFIMEI7QUFBQSxZQUkxQkMsUUFKMEIsR0FTeEIvRyxhQVR3QixDQUkxQitHLFFBSjBCO0FBQUEsWUFLMUJDLG1CQUwwQixHQVN4QmhILGFBVHdCLENBSzFCZ0gsbUJBTDBCO0FBQUEsWUFNMUJwQixZQU4wQixHQVN4QjVGLGFBVHdCLENBTTFCNEYsWUFOMEI7QUFBQSxZQU8xQnZDLGlCQVAwQixHQVN4QnJELGFBVHdCLENBTzFCcUQsaUJBUDBCO0FBQUEsWUFRMUJYLG1CQVIwQixHQVN4QjFDLGFBVHdCLENBUTFCMEMsbUJBUjBCOzs7QUFXNUIsWUFBTXVFLHdCQUF3QixFQUE5Qjs7QUFFQXZFLDRCQUFvQm9ELE1BQXBCLENBQTJCO0FBQUEsaUJBQU92RSxJQUFJMkYsVUFBWDtBQUFBLFNBQTNCLEVBQWtEaEcsT0FBbEQsQ0FBMEQsZUFBTztBQUMvRCtGLGdDQUFzQjFGLElBQUlXLEVBQTFCLElBQWdDWCxJQUFJMkYsVUFBcEM7QUFDRCxTQUZEOztBQUlBO0FBQ0EsZUFBTztBQUNMQyxzQkFBWU4sU0FDUmpCLFlBRFEsR0FFUixLQUFLd0IsUUFBTCxDQUNBLEtBQUtDLFVBQUwsQ0FBZ0J6QixZQUFoQixFQUE4Qm1CLFFBQTlCLEVBQXdDQyxtQkFBeEMsRUFBNkQzRCxpQkFBN0QsQ0FEQSxFQUVBeUQsTUFGQSxFQUdBRyxxQkFIQTtBQUhDLFNBQVA7QUFTRDtBQTVXVTtBQUFBO0FBQUEsc0NBOFdNO0FBQ2YsYUFBS25ILEtBQUwsQ0FBV3dILFdBQVgsQ0FBdUIsS0FBS0MsZ0JBQUwsRUFBdkIsRUFBZ0QsSUFBaEQ7QUFDRDtBQWhYVTtBQUFBO0FBQUEscUNBa1hLZCxHQWxYTCxFQWtYVTtBQUNuQixlQUFPNUcsRUFBRWdFLGVBQUYsQ0FBa0IsS0FBSy9ELEtBQUwsQ0FBVzJHLEdBQVgsQ0FBbEIsRUFBbUMsS0FBSzFHLEtBQUwsQ0FBVzBHLEdBQVgsQ0FBbkMsQ0FBUDtBQUNEO0FBcFhVO0FBQUE7QUFBQSxxQ0FzWEtBLEdBdFhMLEVBc1hVO0FBQ25CLGVBQU81RyxFQUFFZ0UsZUFBRixDQUFrQixLQUFLOUQsS0FBTCxDQUFXMEcsR0FBWCxDQUFsQixFQUFtQyxLQUFLM0csS0FBTCxDQUFXMkcsR0FBWCxDQUFuQyxDQUFQO0FBQ0Q7QUF4WFU7QUFBQTtBQUFBLGlDQTBYQ25HLElBMVhELEVBMFhPeUcsUUExWFAsRUEwWGlCQyxtQkExWGpCLEVBMFhzQzNELGlCQTFYdEMsRUEwWHlEO0FBQUE7O0FBQ2xFLFlBQUltRSxlQUFlbEgsSUFBbkI7O0FBRUEsWUFBSXlHLFNBQVNyRCxNQUFiLEVBQXFCO0FBQ25COEQseUJBQWVULFNBQVN0RCxNQUFULENBQWdCLFVBQUNnRSxhQUFELEVBQWdCQyxVQUFoQixFQUErQjtBQUM1RCxnQkFBTXZHLFNBQVNrQyxrQkFBa0IvQixJQUFsQixDQUF1QjtBQUFBLHFCQUFLcUcsRUFBRXpGLEVBQUYsS0FBU3dGLFdBQVd4RixFQUF6QjtBQUFBLGFBQXZCLENBQWY7O0FBRUE7QUFDQSxnQkFBSSxDQUFDZixNQUFELElBQVdBLE9BQU95RyxVQUFQLEtBQXNCLEtBQXJDLEVBQTRDO0FBQzFDLHFCQUFPSCxhQUFQO0FBQ0Q7O0FBRUQsZ0JBQU1JLGVBQWUxRyxPQUFPMEcsWUFBUCxJQUF1QmIsbUJBQTVDOztBQUVBO0FBQ0EsZ0JBQUk3RixPQUFPMkcsU0FBWCxFQUFzQjtBQUNwQixxQkFBT0QsYUFBYUgsVUFBYixFQUF5QkQsYUFBekIsRUFBd0N0RyxNQUF4QyxDQUFQO0FBQ0Q7QUFDRCxtQkFBT3NHLGNBQWMzQixNQUFkLENBQXFCO0FBQUEscUJBQU8rQixhQUFhSCxVQUFiLEVBQXlCckYsR0FBekIsRUFBOEJsQixNQUE5QixDQUFQO0FBQUEsYUFBckIsQ0FBUDtBQUNELFdBZmMsRUFlWnFHLFlBZlksQ0FBZjs7QUFpQkE7QUFDQTtBQUNBQSx5QkFBZUEsYUFDWnhFLEdBRFksQ0FDUixlQUFPO0FBQ1YsZ0JBQUksQ0FBQ1gsSUFBSSxPQUFLdkMsS0FBTCxDQUFXWSxVQUFmLENBQUwsRUFBaUM7QUFDL0IscUJBQU8yQixHQUFQO0FBQ0Q7QUFDRCxnQ0FDS0EsR0FETCxzQkFFRyxPQUFLdkMsS0FBTCxDQUFXWSxVQUZkLEVBRTJCLE9BQUsyRyxVQUFMLENBQ3ZCaEYsSUFBSSxPQUFLdkMsS0FBTCxDQUFXWSxVQUFmLENBRHVCLEVBRXZCcUcsUUFGdUIsRUFHdkJDLG1CQUh1QixFQUl2QjNELGlCQUp1QixDQUYzQjtBQVNELFdBZFksRUFlWnlDLE1BZlksQ0FlTCxlQUFPO0FBQ2IsZ0JBQUksQ0FBQ3pELElBQUksT0FBS3ZDLEtBQUwsQ0FBV1ksVUFBZixDQUFMLEVBQWlDO0FBQy9CLHFCQUFPLElBQVA7QUFDRDtBQUNELG1CQUFPMkIsSUFBSSxPQUFLdkMsS0FBTCxDQUFXWSxVQUFmLEVBQTJCZ0QsTUFBM0IsR0FBb0MsQ0FBM0M7QUFDRCxXQXBCWSxDQUFmO0FBcUJEOztBQUVELGVBQU84RCxZQUFQO0FBQ0Q7QUF6YVU7QUFBQTtBQUFBLCtCQTJhRGxILElBM2FDLEVBMmFLd0csTUEzYUwsRUEyYXlDO0FBQUE7O0FBQUEsWUFBNUJHLHFCQUE0Qix1RUFBSixFQUFJOztBQUNsRCxZQUFJLENBQUNILE9BQU9wRCxNQUFaLEVBQW9CO0FBQ2xCLGlCQUFPcEQsSUFBUDtBQUNEOztBQUVELFlBQU02RyxhQUFhLENBQUMsS0FBS3JILEtBQUwsQ0FBV2lJLGFBQVgsSUFBNEJsSSxFQUFFbUksT0FBL0IsRUFDakIxSCxJQURpQixFQUVqQndHLE9BQU85RCxHQUFQLENBQVcsZ0JBQVE7QUFDakI7QUFDQSxjQUFJaUUsc0JBQXNCZ0IsS0FBSy9GLEVBQTNCLENBQUosRUFBb0M7QUFDbEMsbUJBQU8sVUFBQ2dHLENBQUQsRUFBSUMsQ0FBSjtBQUFBLHFCQUFVbEIsc0JBQXNCZ0IsS0FBSy9GLEVBQTNCLEVBQStCZ0csRUFBRUQsS0FBSy9GLEVBQVAsQ0FBL0IsRUFBMkNpRyxFQUFFRixLQUFLL0YsRUFBUCxDQUEzQyxFQUF1RCtGLEtBQUtHLElBQTVELENBQVY7QUFBQSxhQUFQO0FBQ0Q7QUFDRCxpQkFBTyxVQUFDRixDQUFELEVBQUlDLENBQUo7QUFBQSxtQkFBVSxPQUFLckksS0FBTCxDQUFXdUksaUJBQVgsQ0FBNkJILEVBQUVELEtBQUsvRixFQUFQLENBQTdCLEVBQXlDaUcsRUFBRUYsS0FBSy9GLEVBQVAsQ0FBekMsRUFBcUQrRixLQUFLRyxJQUExRCxDQUFWO0FBQUEsV0FBUDtBQUNELFNBTkQsQ0FGaUIsRUFTakJ0QixPQUFPOUQsR0FBUCxDQUFXO0FBQUEsaUJBQUssQ0FBQ0MsRUFBRW1GLElBQVI7QUFBQSxTQUFYLENBVGlCLEVBVWpCLEtBQUt0SSxLQUFMLENBQVdnQixRQVZNLENBQW5COztBQWFBcUcsbUJBQVdqRyxPQUFYLENBQW1CLGVBQU87QUFDeEIsY0FBSSxDQUFDbUIsSUFBSSxPQUFLdkMsS0FBTCxDQUFXWSxVQUFmLENBQUwsRUFBaUM7QUFDL0I7QUFDRDtBQUNEMkIsY0FBSSxPQUFLdkMsS0FBTCxDQUFXWSxVQUFmLElBQTZCLE9BQUswRyxRQUFMLENBQzNCL0UsSUFBSSxPQUFLdkMsS0FBTCxDQUFXWSxVQUFmLENBRDJCLEVBRTNCb0csTUFGMkIsRUFHM0JHLHFCQUgyQixDQUE3QjtBQUtELFNBVEQ7O0FBV0EsZUFBT0UsVUFBUDtBQUNEO0FBemNVO0FBQUE7QUFBQSxtQ0EyY0c7QUFDWixlQUFPdEgsRUFBRWdFLGVBQUYsQ0FBa0IsS0FBSy9ELEtBQUwsQ0FBV3dJLE9BQTdCLEVBQXNDLEtBQUtDLGNBQUwsQ0FBb0IsVUFBcEIsQ0FBdEMsQ0FBUDtBQUNEOztBQUVEOztBQS9jVztBQUFBO0FBQUEsbUNBZ2RHQyxJQWhkSCxFQWdkUztBQUFBLHFCQUM2QixLQUFLMUksS0FEbEM7QUFBQSxZQUNWMkksWUFEVSxVQUNWQSxZQURVO0FBQUEsWUFDSUMsb0JBREosVUFDSUEsb0JBREo7OztBQUdsQixZQUFNeEksV0FBVyxFQUFFc0ksVUFBRixFQUFqQjtBQUNBLFlBQUlFLG9CQUFKLEVBQTBCO0FBQ3hCeEksbUJBQVN5SSxRQUFULEdBQW9CLEVBQXBCO0FBQ0Q7QUFDRCxhQUFLQyxnQkFBTCxDQUFzQjFJLFFBQXRCLEVBQWdDO0FBQUEsaUJBQU11SSxnQkFBZ0JBLGFBQWFELElBQWIsQ0FBdEI7QUFBQSxTQUFoQztBQUNEO0FBeGRVO0FBQUE7QUFBQSx1Q0EwZE9LLFdBMWRQLEVBMGRvQjtBQUFBLFlBQ3JCQyxnQkFEcUIsR0FDQSxLQUFLaEosS0FETCxDQUNyQmdKLGdCQURxQjs7QUFBQSxnQ0FFRixLQUFLdkIsZ0JBQUwsRUFGRTtBQUFBLFlBRXJCd0IsUUFGcUIscUJBRXJCQSxRQUZxQjtBQUFBLFlBRVhQLElBRlcscUJBRVhBLElBRlc7O0FBSTdCOzs7QUFDQSxZQUFNUSxhQUFhRCxXQUFXUCxJQUE5QjtBQUNBLFlBQU1TLFVBQVVDLEtBQUtDLEtBQUwsQ0FBV0gsYUFBYUgsV0FBeEIsQ0FBaEI7O0FBRUEsYUFBS0QsZ0JBQUwsQ0FDRTtBQUNFRyxvQkFBVUYsV0FEWjtBQUVFTCxnQkFBTVM7QUFGUixTQURGLEVBS0U7QUFBQSxpQkFBTUgsb0JBQW9CQSxpQkFBaUJELFdBQWpCLEVBQThCSSxPQUE5QixDQUExQjtBQUFBLFNBTEY7QUFPRDtBQXplVTtBQUFBO0FBQUEsaUNBMmVDOUgsTUEzZUQsRUEyZVNpSSxRQTNlVCxFQTJlbUI7QUFBQSxpQ0FDc0IsS0FBSzdCLGdCQUFMLEVBRHRCO0FBQUEsWUFDcEJULE1BRG9CLHNCQUNwQkEsTUFEb0I7QUFBQSxZQUNadUMsWUFEWSxzQkFDWkEsWUFEWTtBQUFBLFlBQ0VDLGVBREYsc0JBQ0VBLGVBREY7O0FBRzVCLFlBQU1DLHFCQUFxQmpELE9BQU9rRCxTQUFQLENBQWlCQyxjQUFqQixDQUFnQ0MsSUFBaEMsQ0FBcUN2SSxNQUFyQyxFQUE2QyxpQkFBN0MsSUFDdkJBLE9BQU9tSSxlQURnQixHQUV2QkEsZUFGSjtBQUdBLFlBQU1LLHNCQUFzQixDQUFDSixrQkFBN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJRixZQUFKLEVBQWtCO0FBQ2hCLGVBQUtULGdCQUFMLENBQXNCO0FBQ3BCUywwQkFBYztBQURNLFdBQXRCO0FBR0E7QUFDRDs7QUFqQjJCLFlBbUJwQk8sY0FuQm9CLEdBbUJELEtBQUs5SixLQW5CSixDQW1CcEI4SixjQW5Cb0I7OztBQXFCNUIsWUFBSUMsWUFBWWhLLEVBQUVpSyxLQUFGLENBQVFoRCxVQUFVLEVBQWxCLEVBQXNCOUQsR0FBdEIsQ0FBMEIsYUFBSztBQUM3Q0MsWUFBRW1GLElBQUYsR0FBU3ZJLEVBQUVrSyxhQUFGLENBQWdCOUcsQ0FBaEIsQ0FBVDtBQUNBLGlCQUFPQSxDQUFQO0FBQ0QsU0FIZSxDQUFoQjtBQUlBLFlBQUksQ0FBQ3BELEVBQUVtSyxPQUFGLENBQVU3SSxNQUFWLENBQUwsRUFBd0I7QUFDdEI7QUFDQSxjQUFNOEksZ0JBQWdCSixVQUFVN0YsU0FBVixDQUFvQjtBQUFBLG1CQUFLZixFQUFFZixFQUFGLEtBQVNmLE9BQU9lLEVBQXJCO0FBQUEsV0FBcEIsQ0FBdEI7QUFDQSxjQUFJK0gsZ0JBQWdCLENBQUMsQ0FBckIsRUFBd0I7QUFDdEIsZ0JBQU1DLFdBQVdMLFVBQVVJLGFBQVYsQ0FBakI7QUFDQSxnQkFBSUMsU0FBUzlCLElBQVQsS0FBa0J1QixtQkFBdEIsRUFBMkM7QUFDekMsa0JBQUlQLFFBQUosRUFBYztBQUNaUywwQkFBVWhGLE1BQVYsQ0FBaUJvRixhQUFqQixFQUFnQyxDQUFoQztBQUNELGVBRkQsTUFFTztBQUNMQyx5QkFBUzlCLElBQVQsR0FBZ0JtQixrQkFBaEI7QUFDQU0sNEJBQVksQ0FBQ0ssUUFBRCxDQUFaO0FBQ0Q7QUFDRixhQVBELE1BT087QUFDTEEsdUJBQVM5QixJQUFULEdBQWdCdUIsbUJBQWhCO0FBQ0Esa0JBQUksQ0FBQ1AsUUFBTCxFQUFlO0FBQ2JTLDRCQUFZLENBQUNLLFFBQUQsQ0FBWjtBQUNEO0FBQ0Y7QUFDRixXQWZELE1BZU8sSUFBSWQsUUFBSixFQUFjO0FBQ25CUyxzQkFBVWhILElBQVYsQ0FBZTtBQUNiWCxrQkFBSWYsT0FBT2UsRUFERTtBQUVia0csb0JBQU1tQjtBQUZPLGFBQWY7QUFJRCxXQUxNLE1BS0E7QUFDTE0sd0JBQVksQ0FDVjtBQUNFM0gsa0JBQUlmLE9BQU9lLEVBRGI7QUFFRWtHLG9CQUFNbUI7QUFGUixhQURVLENBQVo7QUFNRDtBQUNGLFNBL0JELE1BK0JPO0FBQ0w7QUFDQSxjQUFNVSxpQkFBZ0JKLFVBQVU3RixTQUFWLENBQW9CO0FBQUEsbUJBQUtmLEVBQUVmLEVBQUYsS0FBU2YsT0FBTyxDQUFQLEVBQVVlLEVBQXhCO0FBQUEsV0FBcEIsQ0FBdEI7QUFDQTtBQUNBLGNBQUkrSCxpQkFBZ0IsQ0FBQyxDQUFyQixFQUF3QjtBQUN0QixnQkFBTUMsWUFBV0wsVUFBVUksY0FBVixDQUFqQjtBQUNBLGdCQUFJQyxVQUFTOUIsSUFBVCxLQUFrQnVCLG1CQUF0QixFQUEyQztBQUN6QyxrQkFBSVAsUUFBSixFQUFjO0FBQ1pTLDBCQUFVaEYsTUFBVixDQUFpQm9GLGNBQWpCLEVBQWdDOUksT0FBT3VDLE1BQXZDO0FBQ0QsZUFGRCxNQUVPO0FBQ0x2Qyx1QkFBT0QsT0FBUCxDQUFlLFVBQUMrQixDQUFELEVBQUl5QyxDQUFKLEVBQVU7QUFDdkJtRSw0QkFBVUksaUJBQWdCdkUsQ0FBMUIsRUFBNkIwQyxJQUE3QixHQUFvQ21CLGtCQUFwQztBQUNELGlCQUZEO0FBR0Q7QUFDRixhQVJELE1BUU87QUFDTHBJLHFCQUFPRCxPQUFQLENBQWUsVUFBQytCLENBQUQsRUFBSXlDLENBQUosRUFBVTtBQUN2Qm1FLDBCQUFVSSxpQkFBZ0J2RSxDQUExQixFQUE2QjBDLElBQTdCLEdBQW9DdUIsbUJBQXBDO0FBQ0QsZUFGRDtBQUdEO0FBQ0QsZ0JBQUksQ0FBQ1AsUUFBTCxFQUFlO0FBQ2JTLDBCQUFZQSxVQUFVekcsS0FBVixDQUFnQjZHLGNBQWhCLEVBQStCOUksT0FBT3VDLE1BQXRDLENBQVo7QUFDRDtBQUNEO0FBQ0QsV0FuQkQsTUFtQk8sSUFBSTBGLFFBQUosRUFBYztBQUNuQlMsd0JBQVlBLFVBQVVsRyxNQUFWLENBQ1Z4QyxPQUFPNkIsR0FBUCxDQUFXO0FBQUEscUJBQU07QUFDZmQsb0JBQUllLEVBQUVmLEVBRFM7QUFFZmtHLHNCQUFNbUI7QUFGUyxlQUFOO0FBQUEsYUFBWCxDQURVLENBQVo7QUFNRCxXQVBNLE1BT0E7QUFDTE0sd0JBQVkxSSxPQUFPNkIsR0FBUCxDQUFXO0FBQUEscUJBQU07QUFDM0JkLG9CQUFJZSxFQUFFZixFQURxQjtBQUUzQmtHLHNCQUFNbUI7QUFGcUIsZUFBTjtBQUFBLGFBQVgsQ0FBWjtBQUlEO0FBQ0Y7O0FBRUQsYUFBS1gsZ0JBQUwsQ0FDRTtBQUNFSixnQkFBTyxDQUFDMUIsT0FBT3BELE1BQVIsSUFBa0JtRyxVQUFVbkcsTUFBN0IsSUFBd0MsQ0FBQzBGLFFBQXpDLEdBQW9ELENBQXBELEdBQXdELEtBQUtySixLQUFMLENBQVd5SSxJQUQzRTtBQUVFMUIsa0JBQVErQztBQUZWLFNBREYsRUFLRTtBQUFBLGlCQUFNRCxrQkFBa0JBLGVBQWVDLFNBQWYsRUFBMEIxSSxNQUExQixFQUFrQ2lJLFFBQWxDLENBQXhCO0FBQUEsU0FMRjtBQU9EO0FBaGxCVTtBQUFBO0FBQUEsbUNBa2xCR2pJLE1BbGxCSCxFQWtsQld1RixLQWxsQlgsRUFrbEJrQjtBQUFBLGlDQUNOLEtBQUthLGdCQUFMLEVBRE07QUFBQSxZQUNuQlIsUUFEbUIsc0JBQ25CQSxRQURtQjs7QUFBQSxZQUVuQm9ELGdCQUZtQixHQUVFLEtBQUtySyxLQUZQLENBRW5CcUssZ0JBRm1COztBQUkzQjs7QUFDQSxZQUFNQyxlQUFlLENBQUNyRCxZQUFZLEVBQWIsRUFBaUJqQixNQUFqQixDQUF3QjtBQUFBLGlCQUFLNkIsRUFBRXpGLEVBQUYsS0FBU2YsT0FBT2UsRUFBckI7QUFBQSxTQUF4QixDQUFyQjs7QUFFQSxZQUFJd0UsVUFBVSxFQUFkLEVBQWtCO0FBQ2hCMEQsdUJBQWF2SCxJQUFiLENBQWtCO0FBQ2hCWCxnQkFBSWYsT0FBT2UsRUFESztBQUVoQndFO0FBRmdCLFdBQWxCO0FBSUQ7O0FBRUQsYUFBS2tDLGdCQUFMLENBQ0U7QUFDRTdCLG9CQUFVcUQ7QUFEWixTQURGLEVBSUU7QUFBQSxpQkFBTUQsb0JBQW9CQSxpQkFBaUJDLFlBQWpCLEVBQStCakosTUFBL0IsRUFBdUN1RixLQUF2QyxDQUExQjtBQUFBLFNBSkY7QUFNRDtBQXRtQlU7QUFBQTtBQUFBLHdDQXdtQlEyRCxLQXhtQlIsRUF3bUJlbEosTUF4bUJmLEVBd21CdUJtSixPQXhtQnZCLEVBd21CZ0M7QUFBQTs7QUFDekNELGNBQU1FLGVBQU47QUFDQSxZQUFNQyxjQUFjSCxNQUFNSSxNQUFOLENBQWFDLGFBQWIsQ0FBMkJDLHFCQUEzQixHQUFtREMsS0FBdkU7O0FBRUEsWUFBSUMsY0FBSjtBQUNBLFlBQUlQLE9BQUosRUFBYTtBQUNYTyxrQkFBUVIsTUFBTVMsY0FBTixDQUFxQixDQUFyQixFQUF3QkQsS0FBaEM7QUFDRCxTQUZELE1BRU87QUFDTEEsa0JBQVFSLE1BQU1RLEtBQWQ7QUFDRDs7QUFFRCxhQUFLRSxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsYUFBS25DLGdCQUFMLENBQ0U7QUFDRW9DLDZCQUFtQjtBQUNqQjlJLGdCQUFJZixPQUFPZSxFQURNO0FBRWpCK0ksb0JBQVFKLEtBRlM7QUFHakJMO0FBSGlCO0FBRHJCLFNBREYsRUFRRSxZQUFNO0FBQ0osY0FBSUYsT0FBSixFQUFhO0FBQ1hZLHFCQUFTQyxnQkFBVCxDQUEwQixXQUExQixFQUF1QyxPQUFLQyxrQkFBNUM7QUFDQUYscUJBQVNDLGdCQUFULENBQTBCLGFBQTFCLEVBQXlDLE9BQUtFLGVBQTlDO0FBQ0FILHFCQUFTQyxnQkFBVCxDQUEwQixVQUExQixFQUFzQyxPQUFLRSxlQUEzQztBQUNELFdBSkQsTUFJTztBQUNMSCxxQkFBU0MsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBdUMsT0FBS0Msa0JBQTVDO0FBQ0FGLHFCQUFTQyxnQkFBVCxDQUEwQixTQUExQixFQUFxQyxPQUFLRSxlQUExQztBQUNBSCxxQkFBU0MsZ0JBQVQsQ0FBMEIsWUFBMUIsRUFBd0MsT0FBS0UsZUFBN0M7QUFDRDtBQUNGLFNBbEJIO0FBb0JEO0FBeG9CVTtBQUFBO0FBQUEseUNBMG9CU2hCLEtBMW9CVCxFQTBvQmdCO0FBQ3pCQSxjQUFNRSxlQUFOO0FBRHlCLFlBRWpCZSxlQUZpQixHQUVHLEtBQUt4TCxLQUZSLENBRWpCd0wsZUFGaUI7O0FBQUEsaUNBR2MsS0FBSy9ELGdCQUFMLEVBSGQ7QUFBQSxZQUdqQmdFLE9BSGlCLHNCQUdqQkEsT0FIaUI7QUFBQSxZQUdSUCxpQkFIUSxzQkFHUkEsaUJBSFE7O0FBS3pCOzs7QUFDQSxZQUFNUSxhQUFhRCxRQUFRekYsTUFBUixDQUFlO0FBQUEsaUJBQUs2QixFQUFFekYsRUFBRixLQUFTOEksa0JBQWtCOUksRUFBaEM7QUFBQSxTQUFmLENBQW5COztBQUVBLFlBQUkySSxjQUFKOztBQUVBLFlBQUlSLE1BQU1vQixJQUFOLEtBQWUsV0FBbkIsRUFBZ0M7QUFDOUJaLGtCQUFRUixNQUFNUyxjQUFOLENBQXFCLENBQXJCLEVBQXdCRCxLQUFoQztBQUNELFNBRkQsTUFFTyxJQUFJUixNQUFNb0IsSUFBTixLQUFlLFdBQW5CLEVBQWdDO0FBQ3JDWixrQkFBUVIsTUFBTVEsS0FBZDtBQUNEOztBQUVEO0FBQ0E7QUFDQSxZQUFNYSxXQUFXeEMsS0FBS3lDLEdBQUwsQ0FDZlgsa0JBQWtCUixXQUFsQixHQUFnQ0ssS0FBaEMsR0FBd0NHLGtCQUFrQkMsTUFEM0MsRUFFZixFQUZlLENBQWpCOztBQUtBTyxtQkFBVzNJLElBQVgsQ0FBZ0I7QUFDZFgsY0FBSThJLGtCQUFrQjlJLEVBRFI7QUFFZHdFLGlCQUFPZ0Y7QUFGTyxTQUFoQjs7QUFLQSxhQUFLOUMsZ0JBQUwsQ0FDRTtBQUNFMkMsbUJBQVNDO0FBRFgsU0FERixFQUlFO0FBQUEsaUJBQU1GLG1CQUFtQkEsZ0JBQWdCRSxVQUFoQixFQUE0Qm5CLEtBQTVCLENBQXpCO0FBQUEsU0FKRjtBQU1EO0FBNXFCVTtBQUFBO0FBQUEsc0NBOHFCTUEsS0E5cUJOLEVBOHFCYTtBQUN0QkEsY0FBTUUsZUFBTjtBQUNBLFlBQU1ELFVBQVVELE1BQU1vQixJQUFOLEtBQWUsVUFBZixJQUE2QnBCLE1BQU1vQixJQUFOLEtBQWUsYUFBNUQ7O0FBRUEsWUFBSW5CLE9BQUosRUFBYTtBQUNYWSxtQkFBU1UsbUJBQVQsQ0FBNkIsV0FBN0IsRUFBMEMsS0FBS1Isa0JBQS9DO0FBQ0FGLG1CQUFTVSxtQkFBVCxDQUE2QixhQUE3QixFQUE0QyxLQUFLUCxlQUFqRDtBQUNBSCxtQkFBU1UsbUJBQVQsQ0FBNkIsVUFBN0IsRUFBeUMsS0FBS1AsZUFBOUM7QUFDRDs7QUFFRDtBQUNBO0FBQ0FILGlCQUFTVSxtQkFBVCxDQUE2QixXQUE3QixFQUEwQyxLQUFLUixrQkFBL0M7QUFDQUYsaUJBQVNVLG1CQUFULENBQTZCLFNBQTdCLEVBQXdDLEtBQUtQLGVBQTdDO0FBQ0FILGlCQUFTVSxtQkFBVCxDQUE2QixZQUE3QixFQUEyQyxLQUFLUCxlQUFoRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJLENBQUNmLE9BQUwsRUFBYztBQUNaLGVBQUsxQixnQkFBTCxDQUFzQjtBQUNwQlMsMEJBQWMsSUFETTtBQUVwQjJCLCtCQUFtQjtBQUZDLFdBQXRCO0FBSUQ7QUFDRjtBQXZzQlU7O0FBQUE7QUFBQSxJQUNDYSxJQUREO0FBQUEsQ0FBZiIsImZpbGUiOiJtZXRob2RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgXyBmcm9tICcuL3V0aWxzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFzZSA9PlxyXG4gIGNsYXNzIGV4dGVuZHMgQmFzZSB7XHJcbiAgICBnZXRSZXNvbHZlZFN0YXRlIChwcm9wcywgc3RhdGUpIHtcclxuICAgICAgY29uc3QgcmVzb2x2ZWRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5fLmNvbXBhY3RPYmplY3QodGhpcy5zdGF0ZSksXHJcbiAgICAgICAgLi4uXy5jb21wYWN0T2JqZWN0KHRoaXMucHJvcHMpLFxyXG4gICAgICAgIC4uLl8uY29tcGFjdE9iamVjdChzdGF0ZSksXHJcbiAgICAgICAgLi4uXy5jb21wYWN0T2JqZWN0KHByb3BzKSxcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzb2x2ZWRTdGF0ZVxyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGFNb2RlbCAobmV3U3RhdGUsIGRhdGFDaGFuZ2VkKSB7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBjb2x1bW5zLFxyXG4gICAgICAgIHBpdm90QnkgPSBbXSxcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIHJlc29sdmVEYXRhLFxyXG4gICAgICAgIHBpdm90SURLZXksXHJcbiAgICAgICAgcGl2b3RWYWxLZXksXHJcbiAgICAgICAgc3ViUm93c0tleSxcclxuICAgICAgICBhZ2dyZWdhdGVkS2V5LFxyXG4gICAgICAgIG5lc3RpbmdMZXZlbEtleSxcclxuICAgICAgICBvcmlnaW5hbEtleSxcclxuICAgICAgICBpbmRleEtleSxcclxuICAgICAgICBncm91cGVkQnlQaXZvdEtleSxcclxuICAgICAgICBTdWJDb21wb25lbnQsXHJcbiAgICAgIH0gPSBuZXdTdGF0ZVxyXG5cclxuICAgICAgLy8gRGV0ZXJtaW5lIEhlYWRlciBHcm91cHNcclxuICAgICAgbGV0IGhhc0hlYWRlckdyb3VwcyA9IGZhbHNlXHJcbiAgICAgIGNvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xyXG4gICAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xyXG4gICAgICAgICAgaGFzSGVhZGVyR3JvdXBzID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIGxldCBjb2x1bW5zV2l0aEV4cGFuZGVyID0gWy4uLmNvbHVtbnNdXHJcblxyXG4gICAgICBsZXQgZXhwYW5kZXJDb2x1bW4gPSBjb2x1bW5zLmZpbmQoXHJcbiAgICAgICAgY29sID0+IGNvbC5leHBhbmRlciB8fCAoY29sLmNvbHVtbnMgJiYgY29sLmNvbHVtbnMuc29tZShjb2wyID0+IGNvbDIuZXhwYW5kZXIpKVxyXG4gICAgICApXHJcbiAgICAgIC8vIFRoZSBhY3R1YWwgZXhwYW5kZXIgbWlnaHQgYmUgaW4gdGhlIGNvbHVtbnMgZmllbGQgb2YgYSBncm91cCBjb2x1bW5cclxuICAgICAgaWYgKGV4cGFuZGVyQ29sdW1uICYmICFleHBhbmRlckNvbHVtbi5leHBhbmRlcikge1xyXG4gICAgICAgIGV4cGFuZGVyQ29sdW1uID0gZXhwYW5kZXJDb2x1bW4uY29sdW1ucy5maW5kKGNvbCA9PiBjb2wuZXhwYW5kZXIpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIElmIHdlIGhhdmUgU3ViQ29tcG9uZW50J3Mgd2UgbmVlZCB0byBtYWtlIHN1cmUgd2UgaGF2ZSBhbiBleHBhbmRlciBjb2x1bW5cclxuICAgICAgaWYgKFN1YkNvbXBvbmVudCAmJiAhZXhwYW5kZXJDb2x1bW4pIHtcclxuICAgICAgICBleHBhbmRlckNvbHVtbiA9IHsgZXhwYW5kZXI6IHRydWUgfVxyXG4gICAgICAgIGNvbHVtbnNXaXRoRXhwYW5kZXIgPSBbZXhwYW5kZXJDb2x1bW4sIC4uLmNvbHVtbnNXaXRoRXhwYW5kZXJdXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IG1ha2VEZWNvcmF0ZWRDb2x1bW4gPSAoY29sdW1uLCBwYXJlbnRDb2x1bW4pID0+IHtcclxuICAgICAgICBsZXQgZGNvbFxyXG4gICAgICAgIGlmIChjb2x1bW4uZXhwYW5kZXIpIHtcclxuICAgICAgICAgIGRjb2wgPSB7XHJcbiAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY29sdW1uLFxyXG4gICAgICAgICAgICAuLi50aGlzLnByb3BzLmV4cGFuZGVyRGVmYXVsdHMsXHJcbiAgICAgICAgICAgIC4uLmNvbHVtbixcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGNvbCA9IHtcclxuICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5jb2x1bW4sXHJcbiAgICAgICAgICAgIC4uLmNvbHVtbixcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEVuc3VyZSBtaW5XaWR0aCBpcyBub3QgZ3JlYXRlciB0aGFuIG1heFdpZHRoIGlmIHNldFxyXG4gICAgICAgIGlmIChkY29sLm1heFdpZHRoIDwgZGNvbC5taW5XaWR0aCkge1xyXG4gICAgICAgICAgZGNvbC5taW5XaWR0aCA9IGRjb2wubWF4V2lkdGhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwYXJlbnRDb2x1bW4pIHtcclxuICAgICAgICAgIGRjb2wucGFyZW50Q29sdW1uID0gcGFyZW50Q29sdW1uXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBGaXJzdCBjaGVjayBmb3Igc3RyaW5nIGFjY2Vzc29yXHJcbiAgICAgICAgaWYgKHR5cGVvZiBkY29sLmFjY2Vzc29yID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgZGNvbC5pZCA9IGRjb2wuaWQgfHwgZGNvbC5hY2Nlc3NvclxyXG4gICAgICAgICAgY29uc3QgYWNjZXNzb3JTdHJpbmcgPSBkY29sLmFjY2Vzc29yXHJcbiAgICAgICAgICBkY29sLmFjY2Vzc29yID0gcm93ID0+IF8uZ2V0KHJvdywgYWNjZXNzb3JTdHJpbmcpXHJcbiAgICAgICAgICByZXR1cm4gZGNvbFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRmFsbCBiYWNrIHRvIGZ1bmN0aW9uYWwgYWNjZXNzb3IgKGJ1dCByZXF1aXJlIGFuIElEKVxyXG4gICAgICAgIGlmIChkY29sLmFjY2Vzc29yICYmICFkY29sLmlkKSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oZGNvbClcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgJ0EgY29sdW1uIGlkIGlzIHJlcXVpcmVkIGlmIHVzaW5nIGEgbm9uLXN0cmluZyBhY2Nlc3NvciBmb3IgY29sdW1uIGFib3ZlLidcclxuICAgICAgICAgIClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEZhbGwgYmFjayB0byBhbiB1bmRlZmluZWQgYWNjZXNzb3JcclxuICAgICAgICBpZiAoIWRjb2wuYWNjZXNzb3IpIHtcclxuICAgICAgICAgIGRjb2wuYWNjZXNzb3IgPSAoKSA9PiB1bmRlZmluZWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkY29sXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGFsbERlY29yYXRlZENvbHVtbnMgPSBbXVxyXG5cclxuICAgICAgLy8gRGVjb3JhdGUgdGhlIGNvbHVtbnNcclxuICAgICAgY29uc3QgZGVjb3JhdGVBbmRBZGRUb0FsbCA9IChjb2x1bW4sIHBhcmVudENvbHVtbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRlY29yYXRlZENvbHVtbiA9IG1ha2VEZWNvcmF0ZWRDb2x1bW4oY29sdW1uLCBwYXJlbnRDb2x1bW4pXHJcbiAgICAgICAgYWxsRGVjb3JhdGVkQ29sdW1ucy5wdXNoKGRlY29yYXRlZENvbHVtbilcclxuICAgICAgICByZXR1cm4gZGVjb3JhdGVkQ29sdW1uXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGRlY29yYXRlQ29sdW1uID0gKGNvbHVtbiwgcGFyZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAuLi5jb2x1bW4sXHJcbiAgICAgICAgICAgIGNvbHVtbnM6IGNvbHVtbi5jb2x1bW5zLm1hcChkID0+IGRlY29yYXRlQ29sdW1uKGQsIGNvbHVtbikpLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVjb3JhdGVBbmRBZGRUb0FsbChjb2x1bW4sIHBhcmVudClcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZGVjb3JhdGVkQ29sdW1ucyA9IGNvbHVtbnNXaXRoRXhwYW5kZXIubWFwKGRlY29yYXRlQ29sdW1uKVxyXG5cclxuICAgICAgLy8gQnVpbGQgdGhlIHZpc2libGUgY29sdW1ucywgaGVhZGVycyBhbmQgZmxhdCBjb2x1bW4gbGlzdFxyXG4gICAgICBsZXQgdmlzaWJsZUNvbHVtbnMgPSBkZWNvcmF0ZWRDb2x1bW5zLnNsaWNlKClcclxuICAgICAgY29uc3QgYWxsVmlzaWJsZUNvbHVtbnMgPSBbXVxyXG5cclxuICAgICAgY29uc3QgdmlzaWJsZVJlZHVjZXIgPSAodmlzaWJsZSwgY29sdW1uKSA9PiB7XHJcbiAgICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XHJcbiAgICAgICAgICBjb25zdCB2aXNpYmxlU3ViQ29sdW1ucyA9IGNvbHVtbi5jb2x1bW5zLnJlZHVjZSh2aXNpYmxlUmVkdWNlciwgW10pXHJcbiAgICAgICAgICByZXR1cm4gdmlzaWJsZVN1YkNvbHVtbnMubGVuZ3RoID8gdmlzaWJsZS5jb25jYXQoe1xyXG4gICAgICAgICAgICAuLi5jb2x1bW4sXHJcbiAgICAgICAgICAgIGNvbHVtbnM6IHZpc2libGVTdWJDb2x1bW5zLFxyXG4gICAgICAgICAgfSkgOiB2aXNpYmxlXHJcbiAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgIHBpdm90QnkuaW5kZXhPZihjb2x1bW4uaWQpID4gLTFcclxuICAgICAgICAgICAgPyBmYWxzZVxyXG4gICAgICAgICAgICA6IF8uZ2V0Rmlyc3REZWZpbmVkKGNvbHVtbi5zaG93LCB0cnVlKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgcmV0dXJuIHZpc2libGUuY29uY2F0KGNvbHVtbilcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZpc2libGVcclxuICAgICAgfVxyXG5cclxuICAgICAgdmlzaWJsZUNvbHVtbnMgPSB2aXNpYmxlQ29sdW1ucy5yZWR1Y2UodmlzaWJsZVJlZHVjZXIsIFtdKVxyXG5cclxuICAgICAgLy8gRmluZCBhbnkgY3VzdG9tIHBpdm90IGxvY2F0aW9uXHJcbiAgICAgIGNvbnN0IHBpdm90SW5kZXggPSB2aXNpYmxlQ29sdW1ucy5maW5kSW5kZXgoY29sID0+IGNvbC5waXZvdClcclxuXHJcbiAgICAgIC8vIEhhbmRsZSBQaXZvdCBDb2x1bW5zXHJcbiAgICAgIGlmIChwaXZvdEJ5Lmxlbmd0aCkge1xyXG4gICAgICAgIC8vIFJldHJpZXZlIHRoZSBwaXZvdCBjb2x1bW5zIGluIHRoZSBjb3JyZWN0IHBpdm90IG9yZGVyXHJcbiAgICAgICAgY29uc3QgcGl2b3RDb2x1bW5zID0gW11cclxuICAgICAgICBwaXZvdEJ5LmZvckVhY2gocGl2b3RJRCA9PiB7XHJcbiAgICAgICAgICBjb25zdCBmb3VuZCA9IGFsbERlY29yYXRlZENvbHVtbnMuZmluZChkID0+IGQuaWQgPT09IHBpdm90SUQpXHJcbiAgICAgICAgICBpZiAoZm91bmQpIHtcclxuICAgICAgICAgICAgcGl2b3RDb2x1bW5zLnB1c2goZm91bmQpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgY29uc3QgUGl2b3RQYXJlbnRDb2x1bW4gPSBwaXZvdENvbHVtbnMucmVkdWNlKFxyXG4gICAgICAgICAgKHByZXYsIGN1cnJlbnQpID0+IHByZXYgJiYgcHJldiA9PT0gY3VycmVudC5wYXJlbnRDb2x1bW4gJiYgY3VycmVudC5wYXJlbnRDb2x1bW4sXHJcbiAgICAgICAgICBwaXZvdENvbHVtbnNbMF0ucGFyZW50Q29sdW1uXHJcbiAgICAgICAgKVxyXG5cclxuICAgICAgICBsZXQgUGl2b3RHcm91cEhlYWRlciA9IGhhc0hlYWRlckdyb3VwcyAmJiBQaXZvdFBhcmVudENvbHVtbi5IZWFkZXJcclxuICAgICAgICBQaXZvdEdyb3VwSGVhZGVyID0gUGl2b3RHcm91cEhlYWRlciB8fCAoKCkgPT4gPHN0cm9uZz5QaXZvdGVkPC9zdHJvbmc+KVxyXG5cclxuICAgICAgICBsZXQgcGl2b3RDb2x1bW5Hcm91cCA9IHtcclxuICAgICAgICAgIEhlYWRlcjogUGl2b3RHcm91cEhlYWRlcixcclxuICAgICAgICAgIGNvbHVtbnM6IHBpdm90Q29sdW1ucy5tYXAoY29sID0+ICh7XHJcbiAgICAgICAgICAgIC4uLnRoaXMucHJvcHMucGl2b3REZWZhdWx0cyxcclxuICAgICAgICAgICAgLi4uY29sLFxyXG4gICAgICAgICAgICBwaXZvdGVkOiB0cnVlLFxyXG4gICAgICAgICAgfSkpLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUGxhY2UgdGhlIHBpdm90Q29sdW1ucyBiYWNrIGludG8gdGhlIHZpc2libGVDb2x1bW5zXHJcbiAgICAgICAgaWYgKHBpdm90SW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgcGl2b3RDb2x1bW5Hcm91cCA9IHtcclxuICAgICAgICAgICAgLi4udmlzaWJsZUNvbHVtbnNbcGl2b3RJbmRleF0sXHJcbiAgICAgICAgICAgIC4uLnBpdm90Q29sdW1uR3JvdXAsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB2aXNpYmxlQ29sdW1ucy5zcGxpY2UocGl2b3RJbmRleCwgMSwgcGl2b3RDb2x1bW5Hcm91cClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmlzaWJsZUNvbHVtbnMudW5zaGlmdChwaXZvdENvbHVtbkdyb3VwKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQnVpbGQgSGVhZGVyIEdyb3Vwc1xyXG4gICAgICBsZXQgaGVhZGVyR3JvdXBMYXllcnMgPSBbXVxyXG5cclxuICAgICAgY29uc3QgYWRkVG9MYXllciA9IChjb2x1bW5zLCBsYXllciwgdG90YWxTcGFuLCBjb2x1bW4pID0+IHtcclxuICAgICAgICBpZiAoIWhlYWRlckdyb3VwTGF5ZXJzW2xheWVyXSkge1xyXG4gICAgICAgICAgaGVhZGVyR3JvdXBMYXllcnNbbGF5ZXJdID0ge1xyXG4gICAgICAgICAgICBzcGFuOiB0b3RhbFNwYW4ubGVuZ3RoLFxyXG4gICAgICAgICAgICBncm91cHM6ICh0b3RhbFNwYW4ubGVuZ3RoID8gW3tcclxuICAgICAgICAgICAgICAuLi50aGlzLnByb3BzLmNvbHVtbixcclxuICAgICAgICAgICAgICBjb2x1bW5zOiB0b3RhbFNwYW4sXHJcbiAgICAgICAgICAgIH1dIDogW10pLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBoZWFkZXJHcm91cExheWVyc1tsYXllcl0uc3BhbiArPSBjb2x1bW5zLmxlbmd0aFxyXG4gICAgICAgIGhlYWRlckdyb3VwTGF5ZXJzW2xheWVyXS5ncm91cHMgPSBoZWFkZXJHcm91cExheWVyc1tsYXllcl0uZ3JvdXBzLmNvbmNhdCh7XHJcbiAgICAgICAgICAuLi50aGlzLnByb3BzLmNvbHVtbixcclxuICAgICAgICAgIC4uLmNvbHVtbixcclxuICAgICAgICAgIGNvbHVtbnMsXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQnVpbGQgZmxhc3QgbGlzdCBvZiBhbGxWaXNpYmxlQ29sdW1ucyBhbmQgSGVhZGVyR3JvdXBzXHJcbiAgICAgIGxldCBsYXllciA9IDBcclxuICAgICAgY29uc3QgZ2V0QWxsVmlzaWJsZUNvbHVtbnMgPSAoe1xyXG4gICAgICAgIGN1cnJlbnRTcGFuID0gW10sXHJcbiAgICAgICAgYWRkLFxyXG4gICAgICAgIHRvdGFsU3BhbiA9IFtdLFxyXG4gICAgICB9LCBjb2x1bW4pID0+IHtcclxuICAgICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcclxuICAgICAgICAgIGlmIChhZGQpIHtcclxuICAgICAgICAgICAgYWRkVG9MYXllcihhZGQsIGxheWVyLCB0b3RhbFNwYW4pXHJcbiAgICAgICAgICAgIHRvdGFsU3BhbiA9IHRvdGFsU3Bhbi5jb25jYXQoYWRkKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxheWVyICs9IDFcclxuICAgICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgY3VycmVudFNwYW46IG15U3BhbixcclxuICAgICAgICAgIH0gPSBjb2x1bW4uY29sdW1ucy5yZWR1Y2UoZ2V0QWxsVmlzaWJsZUNvbHVtbnMsIHtcclxuICAgICAgICAgICAgdG90YWxTcGFuLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIGxheWVyIC09IDFcclxuXHJcbiAgICAgICAgICBhZGRUb0xheWVyKG15U3BhbiwgbGF5ZXIsIHRvdGFsU3BhbiwgY29sdW1uKVxyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYWRkOiBmYWxzZSxcclxuICAgICAgICAgICAgdG90YWxTcGFuOiB0b3RhbFNwYW4uY29uY2F0KG15U3BhbiksXHJcbiAgICAgICAgICAgIGN1cnJlbnRTcGFuOiBjdXJyZW50U3Bhbi5jb25jYXQobXlTcGFuKSxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYWxsVmlzaWJsZUNvbHVtbnMucHVzaChjb2x1bW4pXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGFkZDogKGFkZCB8fCBbXSkuY29uY2F0KGNvbHVtbiksXHJcbiAgICAgICAgICB0b3RhbFNwYW4sXHJcbiAgICAgICAgICBjdXJyZW50U3BhbjogY3VycmVudFNwYW4uY29uY2F0KGNvbHVtbiksXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHsgY3VycmVudFNwYW4gfSA9IHZpc2libGVDb2x1bW5zLnJlZHVjZShnZXRBbGxWaXNpYmxlQ29sdW1ucywge30pXHJcbiAgICAgIGlmIChoYXNIZWFkZXJHcm91cHMpIHtcclxuICAgICAgICBoZWFkZXJHcm91cExheWVycyA9IGhlYWRlckdyb3VwTGF5ZXJzLm1hcChsYXllciA9PiB7XHJcbiAgICAgICAgICBpZiAobGF5ZXIuc3BhbiAhPT0gY3VycmVudFNwYW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGxheWVyLmdyb3VwcyA9IGxheWVyLmdyb3Vwcy5jb25jYXQoe1xyXG4gICAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY29sdW1uLFxyXG4gICAgICAgICAgICAgIGNvbHVtbnM6IGN1cnJlbnRTcGFuLnNsaWNlKGxheWVyLnNwYW4pLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGxheWVyLmdyb3Vwc1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEFjY2VzcyB0aGUgZGF0YVxyXG4gICAgICBjb25zdCBhY2Nlc3NSb3cgPSAoZCwgaSwgbGV2ZWwgPSAwKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgcm93ID0ge1xyXG4gICAgICAgICAgW29yaWdpbmFsS2V5XTogZCxcclxuICAgICAgICAgIFtpbmRleEtleV06IGksXHJcbiAgICAgICAgICBbc3ViUm93c0tleV06IGRbc3ViUm93c0tleV0sXHJcbiAgICAgICAgICBbbmVzdGluZ0xldmVsS2V5XTogbGV2ZWwsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFsbERlY29yYXRlZENvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xyXG4gICAgICAgICAgaWYgKGNvbHVtbi5leHBhbmRlcikgcmV0dXJuXHJcbiAgICAgICAgICByb3dbY29sdW1uLmlkXSA9IGNvbHVtbi5hY2Nlc3NvcihkKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYgKHJvd1tzdWJSb3dzS2V5XSkge1xyXG4gICAgICAgICAgcm93W3N1YlJvd3NLZXldID0gcm93W3N1YlJvd3NLZXldLm1hcCgoZCwgaSkgPT4gYWNjZXNzUm93KGQsIGksIGxldmVsICsgMSkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByb3dcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gLy8gSWYgdGhlIGRhdGEgaGFzbid0IGNoYW5nZWQsIGp1c3QgdXNlIHRoZSBjYWNoZWQgZGF0YVxyXG4gICAgICBsZXQgcmVzb2x2ZWREYXRhID0gdGhpcy5yZXNvbHZlZERhdGFcclxuICAgICAgLy8gSWYgdGhlIGRhdGEgaGFzIGNoYW5nZWQsIHJ1biB0aGUgZGF0YSByZXNvbHZlciBhbmQgY2FjaGUgdGhlIHJlc3VsdFxyXG4gICAgICBpZiAoIXRoaXMucmVzb2x2ZWREYXRhIHx8IGRhdGFDaGFuZ2VkKSB7XHJcbiAgICAgICAgcmVzb2x2ZWREYXRhID0gcmVzb2x2ZURhdGEoZGF0YSlcclxuICAgICAgICB0aGlzLnJlc29sdmVkRGF0YSA9IHJlc29sdmVkRGF0YVxyXG4gICAgICB9XHJcbiAgICAgIC8vIFVzZSB0aGUgcmVzb2x2ZWQgZGF0YVxyXG4gICAgICByZXNvbHZlZERhdGEgPSByZXNvbHZlZERhdGEubWFwKChkLCBpKSA9PiBhY2Nlc3NSb3coZCwgaSkpXHJcblxyXG4gICAgICAvLyBUT0RPOiBNYWtlIGl0IHBvc3NpYmxlIHRvIGZhYnJpY2F0ZSBuZXN0ZWQgcm93cyB3aXRob3V0IHBpdm90aW5nXHJcbiAgICAgIGNvbnN0IGFnZ3JlZ2F0aW5nQ29sdW1ucyA9IGFsbFZpc2libGVDb2x1bW5zLmZpbHRlcihkID0+ICFkLmV4cGFuZGVyICYmIGQuYWdncmVnYXRlKVxyXG5cclxuICAgICAgLy8gSWYgcGl2b3RpbmcsIHJlY3Vyc2l2ZWx5IGdyb3VwIHRoZSBkYXRhXHJcbiAgICAgIGNvbnN0IGFnZ3JlZ2F0ZSA9IHJvd3MgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFnZ3JlZ2F0aW9uVmFsdWVzID0ge31cclxuICAgICAgICBhZ2dyZWdhdGluZ0NvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xyXG4gICAgICAgICAgY29uc3QgdmFsdWVzID0gcm93cy5tYXAoZCA9PiBkW2NvbHVtbi5pZF0pXHJcbiAgICAgICAgICBhZ2dyZWdhdGlvblZhbHVlc1tjb2x1bW4uaWRdID0gY29sdW1uLmFnZ3JlZ2F0ZSh2YWx1ZXMsIHJvd3MpXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gYWdncmVnYXRpb25WYWx1ZXNcclxuICAgICAgfVxyXG4gICAgICBpZiAocGl2b3RCeS5sZW5ndGgpIHtcclxuICAgICAgICBjb25zdCBncm91cFJlY3Vyc2l2ZWx5ID0gKHJvd3MsIGtleXMsIGkgPSAwKSA9PiB7XHJcbiAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBsYXN0IGxldmVsLCBqdXN0IHJldHVybiB0aGUgcm93c1xyXG4gICAgICAgICAgaWYgKGkgPT09IGtleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByb3dzXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBHcm91cCB0aGUgcm93cyB0b2dldGhlciBmb3IgdGhpcyBsZXZlbFxyXG4gICAgICAgICAgbGV0IGdyb3VwZWRSb3dzID0gT2JqZWN0LmVudHJpZXMoXy5ncm91cEJ5KHJvd3MsIGtleXNbaV0pKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4gKHtcclxuICAgICAgICAgICAgW3Bpdm90SURLZXldOiBrZXlzW2ldLFxyXG4gICAgICAgICAgICBbcGl2b3RWYWxLZXldOiBrZXksXHJcbiAgICAgICAgICAgIFtrZXlzW2ldXToga2V5LFxyXG4gICAgICAgICAgICBbc3ViUm93c0tleV06IHZhbHVlLFxyXG4gICAgICAgICAgICBbbmVzdGluZ0xldmVsS2V5XTogaSxcclxuICAgICAgICAgICAgW2dyb3VwZWRCeVBpdm90S2V5XTogdHJ1ZSxcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgLy8gUmVjdXJzZSBpbnRvIHRoZSBzdWJSb3dzXHJcbiAgICAgICAgICBncm91cGVkUm93cyA9IGdyb3VwZWRSb3dzLm1hcChyb3dHcm91cCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YlJvd3MgPSBncm91cFJlY3Vyc2l2ZWx5KHJvd0dyb3VwW3N1YlJvd3NLZXldLCBrZXlzLCBpICsgMSlcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAuLi5yb3dHcm91cCxcclxuICAgICAgICAgICAgICBbc3ViUm93c0tleV06IHN1YlJvd3MsXHJcbiAgICAgICAgICAgICAgW2FnZ3JlZ2F0ZWRLZXldOiB0cnVlLFxyXG4gICAgICAgICAgICAgIC4uLmFnZ3JlZ2F0ZShzdWJSb3dzKSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIHJldHVybiBncm91cGVkUm93c1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXNvbHZlZERhdGEgPSBncm91cFJlY3Vyc2l2ZWx5KHJlc29sdmVkRGF0YSwgcGl2b3RCeSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5uZXdTdGF0ZSxcclxuICAgICAgICByZXNvbHZlZERhdGEsXHJcbiAgICAgICAgYWxsVmlzaWJsZUNvbHVtbnMsXHJcbiAgICAgICAgaGVhZGVyR3JvdXBMYXllcnMsXHJcbiAgICAgICAgYWxsRGVjb3JhdGVkQ29sdW1ucyxcclxuICAgICAgICBoYXNIZWFkZXJHcm91cHMsXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRTb3J0ZWREYXRhIChyZXNvbHZlZFN0YXRlKSB7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBtYW51YWwsXHJcbiAgICAgICAgc29ydGVkLFxyXG4gICAgICAgIGZpbHRlcmVkLFxyXG4gICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICAgICAgcmVzb2x2ZWREYXRhLFxyXG4gICAgICAgIGFsbFZpc2libGVDb2x1bW5zLFxyXG4gICAgICAgIGFsbERlY29yYXRlZENvbHVtbnMsXHJcbiAgICAgIH0gPSByZXNvbHZlZFN0YXRlXHJcblxyXG4gICAgICBjb25zdCBzb3J0TWV0aG9kc0J5Q29sdW1uSUQgPSB7fVxyXG5cclxuICAgICAgYWxsRGVjb3JhdGVkQ29sdW1ucy5maWx0ZXIoY29sID0+IGNvbC5zb3J0TWV0aG9kKS5mb3JFYWNoKGNvbCA9PiB7XHJcbiAgICAgICAgc29ydE1ldGhvZHNCeUNvbHVtbklEW2NvbC5pZF0gPSBjb2wuc29ydE1ldGhvZFxyXG4gICAgICB9KVxyXG5cclxuICAgICAgLy8gUmVzb2x2ZSB0aGUgZGF0YSBmcm9tIGVpdGhlciBtYW51YWwgZGF0YSBvciBzb3J0ZWQgZGF0YVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHNvcnRlZERhdGE6IG1hbnVhbFxyXG4gICAgICAgICAgPyByZXNvbHZlZERhdGFcclxuICAgICAgICAgIDogdGhpcy5zb3J0RGF0YShcclxuICAgICAgICAgICAgdGhpcy5maWx0ZXJEYXRhKHJlc29sdmVkRGF0YSwgZmlsdGVyZWQsIGRlZmF1bHRGaWx0ZXJNZXRob2QsIGFsbFZpc2libGVDb2x1bW5zKSxcclxuICAgICAgICAgICAgc29ydGVkLFxyXG4gICAgICAgICAgICBzb3J0TWV0aG9kc0J5Q29sdW1uSURcclxuICAgICAgICAgICksXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaXJlRmV0Y2hEYXRhICgpIHtcclxuICAgICAgdGhpcy5wcm9wcy5vbkZldGNoRGF0YSh0aGlzLmdldFJlc29sdmVkU3RhdGUoKSwgdGhpcylcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9wT3JTdGF0ZSAoa2V5KSB7XHJcbiAgICAgIHJldHVybiBfLmdldEZpcnN0RGVmaW5lZCh0aGlzLnByb3BzW2tleV0sIHRoaXMuc3RhdGVba2V5XSlcclxuICAgIH1cclxuXHJcbiAgICBnZXRTdGF0ZU9yUHJvcCAoa2V5KSB7XHJcbiAgICAgIHJldHVybiBfLmdldEZpcnN0RGVmaW5lZCh0aGlzLnN0YXRlW2tleV0sIHRoaXMucHJvcHNba2V5XSlcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJEYXRhIChkYXRhLCBmaWx0ZXJlZCwgZGVmYXVsdEZpbHRlck1ldGhvZCwgYWxsVmlzaWJsZUNvbHVtbnMpIHtcclxuICAgICAgbGV0IGZpbHRlcmVkRGF0YSA9IGRhdGFcclxuXHJcbiAgICAgIGlmIChmaWx0ZXJlZC5sZW5ndGgpIHtcclxuICAgICAgICBmaWx0ZXJlZERhdGEgPSBmaWx0ZXJlZC5yZWR1Y2UoKGZpbHRlcmVkU29GYXIsIG5leHRGaWx0ZXIpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGNvbHVtbiA9IGFsbFZpc2libGVDb2x1bW5zLmZpbmQoeCA9PiB4LmlkID09PSBuZXh0RmlsdGVyLmlkKVxyXG5cclxuICAgICAgICAgIC8vIERvbid0IGZpbHRlciBoaWRkZW4gY29sdW1ucyBvciBjb2x1bW5zIHRoYXQgaGF2ZSBoYWQgdGhlaXIgZmlsdGVycyBkaXNhYmxlZFxyXG4gICAgICAgICAgaWYgKCFjb2x1bW4gfHwgY29sdW1uLmZpbHRlcmFibGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJlZFNvRmFyXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY29uc3QgZmlsdGVyTWV0aG9kID0gY29sdW1uLmZpbHRlck1ldGhvZCB8fCBkZWZhdWx0RmlsdGVyTWV0aG9kXHJcblxyXG4gICAgICAgICAgLy8gSWYgJ2ZpbHRlckFsbCcgaXMgc2V0IHRvIHRydWUsIHBhc3MgdGhlIGVudGlyZSBkYXRhc2V0IHRvIHRoZSBmaWx0ZXIgbWV0aG9kXHJcbiAgICAgICAgICBpZiAoY29sdW1uLmZpbHRlckFsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyTWV0aG9kKG5leHRGaWx0ZXIsIGZpbHRlcmVkU29GYXIsIGNvbHVtbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBmaWx0ZXJlZFNvRmFyLmZpbHRlcihyb3cgPT4gZmlsdGVyTWV0aG9kKG5leHRGaWx0ZXIsIHJvdywgY29sdW1uKSlcclxuICAgICAgICB9LCBmaWx0ZXJlZERhdGEpXHJcblxyXG4gICAgICAgIC8vIEFwcGx5IHRoZSBmaWx0ZXIgdG8gdGhlIHN1YnJvd3MgaWYgd2UgYXJlIHBpdm90aW5nLCBhbmQgdGhlblxyXG4gICAgICAgIC8vIGZpbHRlciBhbnkgcm93cyB3aXRob3V0IHN1YmNvbHVtbnMgYmVjYXVzZSBpdCB3b3VsZCBiZSBzdHJhbmdlIHRvIHNob3dcclxuICAgICAgICBmaWx0ZXJlZERhdGEgPSBmaWx0ZXJlZERhdGFcclxuICAgICAgICAgIC5tYXAocm93ID0+IHtcclxuICAgICAgICAgICAgaWYgKCFyb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiByb3dcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgIC4uLnJvdyxcclxuICAgICAgICAgICAgICBbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XTogdGhpcy5maWx0ZXJEYXRhKFxyXG4gICAgICAgICAgICAgICAgcm93W3RoaXMucHJvcHMuc3ViUm93c0tleV0sXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZCxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICAgICAgICAgICAgICBhbGxWaXNpYmxlQ29sdW1uc1xyXG4gICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuZmlsdGVyKHJvdyA9PiB7XHJcbiAgICAgICAgICAgIGlmICghcm93W3RoaXMucHJvcHMuc3ViUm93c0tleV0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XS5sZW5ndGggPiAwXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZmlsdGVyZWREYXRhXHJcbiAgICB9XHJcblxyXG4gICAgc29ydERhdGEgKGRhdGEsIHNvcnRlZCwgc29ydE1ldGhvZHNCeUNvbHVtbklEID0ge30pIHtcclxuICAgICAgaWYgKCFzb3J0ZWQubGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgc29ydGVkRGF0YSA9ICh0aGlzLnByb3BzLm9yZGVyQnlNZXRob2QgfHwgXy5vcmRlckJ5KShcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIHNvcnRlZC5tYXAoc29ydCA9PiB7XHJcbiAgICAgICAgICAvLyBTdXBwb3J0IGN1c3RvbSBzb3J0aW5nIG1ldGhvZHMgZm9yIGVhY2ggY29sdW1uXHJcbiAgICAgICAgICBpZiAoc29ydE1ldGhvZHNCeUNvbHVtbklEW3NvcnQuaWRdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoYSwgYikgPT4gc29ydE1ldGhvZHNCeUNvbHVtbklEW3NvcnQuaWRdKGFbc29ydC5pZF0sIGJbc29ydC5pZF0sIHNvcnQuZGVzYylcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiAoYSwgYikgPT4gdGhpcy5wcm9wcy5kZWZhdWx0U29ydE1ldGhvZChhW3NvcnQuaWRdLCBiW3NvcnQuaWRdLCBzb3J0LmRlc2MpXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgc29ydGVkLm1hcChkID0+ICFkLmRlc2MpLFxyXG4gICAgICAgIHRoaXMucHJvcHMuaW5kZXhLZXlcclxuICAgICAgKVxyXG5cclxuICAgICAgc29ydGVkRGF0YS5mb3JFYWNoKHJvdyA9PiB7XHJcbiAgICAgICAgaWYgKCFyb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XSkge1xyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldID0gdGhpcy5zb3J0RGF0YShcclxuICAgICAgICAgIHJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldLFxyXG4gICAgICAgICAgc29ydGVkLFxyXG4gICAgICAgICAgc29ydE1ldGhvZHNCeUNvbHVtbklEXHJcbiAgICAgICAgKVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgcmV0dXJuIHNvcnRlZERhdGFcclxuICAgIH1cclxuXHJcbiAgICBnZXRNaW5Sb3dzICgpIHtcclxuICAgICAgcmV0dXJuIF8uZ2V0Rmlyc3REZWZpbmVkKHRoaXMucHJvcHMubWluUm93cywgdGhpcy5nZXRTdGF0ZU9yUHJvcCgncGFnZVNpemUnKSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBVc2VyIGFjdGlvbnNcclxuICAgIG9uUGFnZUNoYW5nZSAocGFnZSkge1xyXG4gICAgICBjb25zdCB7IG9uUGFnZUNoYW5nZSwgY29sbGFwc2VPblBhZ2VDaGFuZ2UgfSA9IHRoaXMucHJvcHNcclxuXHJcbiAgICAgIGNvbnN0IG5ld1N0YXRlID0geyBwYWdlIH1cclxuICAgICAgaWYgKGNvbGxhcHNlT25QYWdlQ2hhbmdlKSB7XHJcbiAgICAgICAgbmV3U3RhdGUuZXhwYW5kZWQgPSB7fVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShuZXdTdGF0ZSwgKCkgPT4gb25QYWdlQ2hhbmdlICYmIG9uUGFnZUNoYW5nZShwYWdlKSlcclxuICAgIH1cclxuXHJcbiAgICBvblBhZ2VTaXplQ2hhbmdlIChuZXdQYWdlU2l6ZSkge1xyXG4gICAgICBjb25zdCB7IG9uUGFnZVNpemVDaGFuZ2UgfSA9IHRoaXMucHJvcHNcclxuICAgICAgY29uc3QgeyBwYWdlU2l6ZSwgcGFnZSB9ID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcclxuXHJcbiAgICAgIC8vIE5vcm1hbGl6ZSB0aGUgcGFnZSB0byBkaXNwbGF5XHJcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBwYWdlU2l6ZSAqIHBhZ2VcclxuICAgICAgY29uc3QgbmV3UGFnZSA9IE1hdGguZmxvb3IoY3VycmVudFJvdyAvIG5ld1BhZ2VTaXplKVxyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHBhZ2VTaXplOiBuZXdQYWdlU2l6ZSxcclxuICAgICAgICAgIHBhZ2U6IG5ld1BhZ2UsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAoKSA9PiBvblBhZ2VTaXplQ2hhbmdlICYmIG9uUGFnZVNpemVDaGFuZ2UobmV3UGFnZVNpemUsIG5ld1BhZ2UpXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBzb3J0Q29sdW1uIChjb2x1bW4sIGFkZGl0aXZlKSB7XHJcbiAgICAgIGNvbnN0IHsgc29ydGVkLCBza2lwTmV4dFNvcnQsIGRlZmF1bHRTb3J0RGVzYyB9ID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcclxuXHJcbiAgICAgIGNvbnN0IGZpcnN0U29ydERpcmVjdGlvbiA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb2x1bW4sICdkZWZhdWx0U29ydERlc2MnKVxyXG4gICAgICAgID8gY29sdW1uLmRlZmF1bHRTb3J0RGVzY1xyXG4gICAgICAgIDogZGVmYXVsdFNvcnREZXNjXHJcbiAgICAgIGNvbnN0IHNlY29uZFNvcnREaXJlY3Rpb24gPSAhZmlyc3RTb3J0RGlyZWN0aW9uXHJcblxyXG4gICAgICAvLyB3ZSBjYW4ndCBzdG9wIGV2ZW50IHByb3BhZ2F0aW9uIGZyb20gdGhlIGNvbHVtbiByZXNpemUgbW92ZSBoYW5kbGVyc1xyXG4gICAgICAvLyBhdHRhY2hlZCB0byB0aGUgZG9jdW1lbnQgYmVjYXVzZSBvZiByZWFjdCdzIHN5bnRoZXRpYyBldmVudHNcclxuICAgICAgLy8gc28gd2UgaGF2ZSB0byBwcmV2ZW50IHRoZSBzb3J0IGZ1bmN0aW9uIGZyb20gYWN0dWFsbHkgc29ydGluZ1xyXG4gICAgICAvLyBpZiB3ZSBjbGljayBvbiB0aGUgY29sdW1uIHJlc2l6ZSBlbGVtZW50IHdpdGhpbiBhIGhlYWRlci5cclxuICAgICAgaWYgKHNraXBOZXh0U29ydCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YSh7XHJcbiAgICAgICAgICBza2lwTmV4dFNvcnQ6IGZhbHNlLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHsgb25Tb3J0ZWRDaGFuZ2UgfSA9IHRoaXMucHJvcHNcclxuXHJcbiAgICAgIGxldCBuZXdTb3J0ZWQgPSBfLmNsb25lKHNvcnRlZCB8fCBbXSkubWFwKGQgPT4ge1xyXG4gICAgICAgIGQuZGVzYyA9IF8uaXNTb3J0aW5nRGVzYyhkKVxyXG4gICAgICAgIHJldHVybiBkXHJcbiAgICAgIH0pXHJcbiAgICAgIGlmICghXy5pc0FycmF5KGNvbHVtbikpIHtcclxuICAgICAgICAvLyBTaW5nbGUtU29ydFxyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSW5kZXggPSBuZXdTb3J0ZWQuZmluZEluZGV4KGQgPT4gZC5pZCA9PT0gY29sdW1uLmlkKVxyXG4gICAgICAgIGlmIChleGlzdGluZ0luZGV4ID4gLTEpIHtcclxuICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gbmV3U29ydGVkW2V4aXN0aW5nSW5kZXhdXHJcbiAgICAgICAgICBpZiAoZXhpc3RpbmcuZGVzYyA9PT0gc2Vjb25kU29ydERpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoYWRkaXRpdmUpIHtcclxuICAgICAgICAgICAgICBuZXdTb3J0ZWQuc3BsaWNlKGV4aXN0aW5nSW5kZXgsIDEpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgZXhpc3RpbmcuZGVzYyA9IGZpcnN0U29ydERpcmVjdGlvblxyXG4gICAgICAgICAgICAgIG5ld1NvcnRlZCA9IFtleGlzdGluZ11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXhpc3RpbmcuZGVzYyA9IHNlY29uZFNvcnREaXJlY3Rpb25cclxuICAgICAgICAgICAgaWYgKCFhZGRpdGl2ZSkge1xyXG4gICAgICAgICAgICAgIG5ld1NvcnRlZCA9IFtleGlzdGluZ11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoYWRkaXRpdmUpIHtcclxuICAgICAgICAgIG5ld1NvcnRlZC5wdXNoKHtcclxuICAgICAgICAgICAgaWQ6IGNvbHVtbi5pZCxcclxuICAgICAgICAgICAgZGVzYzogZmlyc3RTb3J0RGlyZWN0aW9uLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV3U29ydGVkID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgaWQ6IGNvbHVtbi5pZCxcclxuICAgICAgICAgICAgICBkZXNjOiBmaXJzdFNvcnREaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIE11bHRpLVNvcnRcclxuICAgICAgICBjb25zdCBleGlzdGluZ0luZGV4ID0gbmV3U29ydGVkLmZpbmRJbmRleChkID0+IGQuaWQgPT09IGNvbHVtblswXS5pZClcclxuICAgICAgICAvLyBFeGlzdGluZyBTb3J0ZWQgQ29sdW1uXHJcbiAgICAgICAgaWYgKGV4aXN0aW5nSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBuZXdTb3J0ZWRbZXhpc3RpbmdJbmRleF1cclxuICAgICAgICAgIGlmIChleGlzdGluZy5kZXNjID09PSBzZWNvbmRTb3J0RGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChhZGRpdGl2ZSkge1xyXG4gICAgICAgICAgICAgIG5ld1NvcnRlZC5zcGxpY2UoZXhpc3RpbmdJbmRleCwgY29sdW1uLmxlbmd0aClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjb2x1bW4uZm9yRWFjaCgoZCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbmV3U29ydGVkW2V4aXN0aW5nSW5kZXggKyBpXS5kZXNjID0gZmlyc3RTb3J0RGlyZWN0aW9uXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29sdW1uLmZvckVhY2goKGQsIGkpID0+IHtcclxuICAgICAgICAgICAgICBuZXdTb3J0ZWRbZXhpc3RpbmdJbmRleCArIGldLmRlc2MgPSBzZWNvbmRTb3J0RGlyZWN0aW9uXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoIWFkZGl0aXZlKSB7XHJcbiAgICAgICAgICAgIG5ld1NvcnRlZCA9IG5ld1NvcnRlZC5zbGljZShleGlzdGluZ0luZGV4LCBjb2x1bW4ubGVuZ3RoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gTmV3IFNvcnQgQ29sdW1uXHJcbiAgICAgICAgfSBlbHNlIGlmIChhZGRpdGl2ZSkge1xyXG4gICAgICAgICAgbmV3U29ydGVkID0gbmV3U29ydGVkLmNvbmNhdChcclxuICAgICAgICAgICAgY29sdW1uLm1hcChkID0+ICh7XHJcbiAgICAgICAgICAgICAgaWQ6IGQuaWQsXHJcbiAgICAgICAgICAgICAgZGVzYzogZmlyc3RTb3J0RGlyZWN0aW9uLFxyXG4gICAgICAgICAgICB9KSlcclxuICAgICAgICAgIClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV3U29ydGVkID0gY29sdW1uLm1hcChkID0+ICh7XHJcbiAgICAgICAgICAgIGlkOiBkLmlkLFxyXG4gICAgICAgICAgICBkZXNjOiBmaXJzdFNvcnREaXJlY3Rpb24sXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwYWdlOiAoIXNvcnRlZC5sZW5ndGggJiYgbmV3U29ydGVkLmxlbmd0aCkgfHwgIWFkZGl0aXZlID8gMCA6IHRoaXMuc3RhdGUucGFnZSxcclxuICAgICAgICAgIHNvcnRlZDogbmV3U29ydGVkLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKCkgPT4gb25Tb3J0ZWRDaGFuZ2UgJiYgb25Tb3J0ZWRDaGFuZ2UobmV3U29ydGVkLCBjb2x1bW4sIGFkZGl0aXZlKVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyQ29sdW1uIChjb2x1bW4sIHZhbHVlKSB7XHJcbiAgICAgIGNvbnN0IHsgZmlsdGVyZWQgfSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZSgpXHJcbiAgICAgIGNvbnN0IHsgb25GaWx0ZXJlZENoYW5nZSB9ID0gdGhpcy5wcm9wc1xyXG5cclxuICAgICAgLy8gUmVtb3ZlIG9sZCBmaWx0ZXIgZmlyc3QgaWYgaXQgZXhpc3RzXHJcbiAgICAgIGNvbnN0IG5ld0ZpbHRlcmluZyA9IChmaWx0ZXJlZCB8fCBbXSkuZmlsdGVyKHggPT4geC5pZCAhPT0gY29sdW1uLmlkKVxyXG5cclxuICAgICAgaWYgKHZhbHVlICE9PSAnJykge1xyXG4gICAgICAgIG5ld0ZpbHRlcmluZy5wdXNoKHtcclxuICAgICAgICAgIGlkOiBjb2x1bW4uaWQsXHJcbiAgICAgICAgICB2YWx1ZSxcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmlsdGVyZWQ6IG5ld0ZpbHRlcmluZyxcclxuICAgICAgICB9LFxyXG4gICAgICAgICgpID0+IG9uRmlsdGVyZWRDaGFuZ2UgJiYgb25GaWx0ZXJlZENoYW5nZShuZXdGaWx0ZXJpbmcsIGNvbHVtbiwgdmFsdWUpXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICByZXNpemVDb2x1bW5TdGFydCAoZXZlbnQsIGNvbHVtbiwgaXNUb3VjaCkge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICBjb25zdCBwYXJlbnRXaWR0aCA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXHJcblxyXG4gICAgICBsZXQgcGFnZVhcclxuICAgICAgaWYgKGlzVG91Y2gpIHtcclxuICAgICAgICBwYWdlWCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcGFnZVggPSBldmVudC5wYWdlWFxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnRyYXBFdmVudHMgPSB0cnVlXHJcbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjdXJyZW50bHlSZXNpemluZzoge1xyXG4gICAgICAgICAgICBpZDogY29sdW1uLmlkLFxyXG4gICAgICAgICAgICBzdGFydFg6IHBhZ2VYLFxyXG4gICAgICAgICAgICBwYXJlbnRXaWR0aCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXNUb3VjaCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLnJlc2l6ZUNvbHVtbk1vdmluZylcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMucmVzaXplQ29sdW1uTW92aW5nKVxyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICByZXNpemVDb2x1bW5Nb3ZpbmcgKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgIGNvbnN0IHsgb25SZXNpemVkQ2hhbmdlIH0gPSB0aGlzLnByb3BzXHJcbiAgICAgIGNvbnN0IHsgcmVzaXplZCwgY3VycmVudGx5UmVzaXppbmcgfSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZSgpXHJcblxyXG4gICAgICAvLyBEZWxldGUgb2xkIHZhbHVlXHJcbiAgICAgIGNvbnN0IG5ld1Jlc2l6ZWQgPSByZXNpemVkLmZpbHRlcih4ID0+IHguaWQgIT09IGN1cnJlbnRseVJlc2l6aW5nLmlkKVxyXG5cclxuICAgICAgbGV0IHBhZ2VYXHJcblxyXG4gICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ3RvdWNobW92ZScpIHtcclxuICAgICAgICBwYWdlWCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYXHJcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlbW92ZScpIHtcclxuICAgICAgICBwYWdlWCA9IGV2ZW50LnBhZ2VYXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFNldCB0aGUgbWluIHNpemUgdG8gMTAgdG8gYWNjb3VudCBmb3IgbWFyZ2luIGFuZCBib3JkZXIgb3IgZWxzZSB0aGVcclxuICAgICAgLy8gZ3JvdXAgaGVhZGVycyBkb24ndCBsaW5lIHVwIGNvcnJlY3RseVxyXG4gICAgICBjb25zdCBuZXdXaWR0aCA9IE1hdGgubWF4KFxyXG4gICAgICAgIGN1cnJlbnRseVJlc2l6aW5nLnBhcmVudFdpZHRoICsgcGFnZVggLSBjdXJyZW50bHlSZXNpemluZy5zdGFydFgsXHJcbiAgICAgICAgMTFcclxuICAgICAgKVxyXG5cclxuICAgICAgbmV3UmVzaXplZC5wdXNoKHtcclxuICAgICAgICBpZDogY3VycmVudGx5UmVzaXppbmcuaWQsXHJcbiAgICAgICAgdmFsdWU6IG5ld1dpZHRoLFxyXG4gICAgICB9KVxyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHJlc2l6ZWQ6IG5ld1Jlc2l6ZWQsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAoKSA9PiBvblJlc2l6ZWRDaGFuZ2UgJiYgb25SZXNpemVkQ2hhbmdlKG5ld1Jlc2l6ZWQsIGV2ZW50KVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplQ29sdW1uRW5kIChldmVudCkge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICBjb25zdCBpc1RvdWNoID0gZXZlbnQudHlwZSA9PT0gJ3RvdWNoZW5kJyB8fCBldmVudC50eXBlID09PSAndG91Y2hjYW5jZWwnXHJcblxyXG4gICAgICBpZiAoaXNUb3VjaCkge1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMucmVzaXplQ29sdW1uTW92aW5nKVxyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgaXRzIGEgdG91Y2ggZXZlbnQgY2xlYXIgdGhlIG1vdXNlIG9uZSdzIGFzIHdlbGwgYmVjYXVzZSBzb21ldGltZXNcclxuICAgICAgLy8gdGhlIG1vdXNlRG93biBldmVudCBnZXRzIGNhbGxlZCBhcyB3ZWxsLCBidXQgdGhlIG1vdXNlVXAgZXZlbnQgZG9lc24ndFxyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLnJlc2l6ZUNvbHVtbk1vdmluZylcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXHJcblxyXG4gICAgICAvLyBUaGUgdG91Y2ggZXZlbnRzIGRvbid0IHByb3BhZ2F0ZSB1cCB0byB0aGUgc29ydGluZydzIG9uTW91c2VEb3duIGV2ZW50IHNvXHJcbiAgICAgIC8vIG5vIG5lZWQgdG8gcHJldmVudCBpdCBmcm9tIGhhcHBlbmluZyBvciBlbHNlIHRoZSBmaXJzdCBjbGljayBhZnRlciBhIHRvdWNoXHJcbiAgICAgIC8vIGV2ZW50IHJlc2l6ZSB3aWxsIG5vdCBzb3J0IHRoZSBjb2x1bW4uXHJcbiAgICAgIGlmICghaXNUb3VjaCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YSh7XHJcbiAgICAgICAgICBza2lwTmV4dFNvcnQ6IHRydWUsXHJcbiAgICAgICAgICBjdXJyZW50bHlSZXNpemluZzogZmFsc2UsXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuIl19