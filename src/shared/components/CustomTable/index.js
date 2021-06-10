import IMAGE from '@resources';
import {
  formatMoney,
  formatNumberFromCurrency,
  roundFloatNumber,
  scaleSize,
} from '@utils';
import _ from 'ramda';
import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  FlatList,
  View,
  RefreshControl,
} from 'react-native';
import moment from 'moment';
import { Row, Cell, Header, EmptyList } from './widget';
import {
  getValueForColumnKey,
  getUniqueId,
  TABLE_SPECIAL_KEYS,
} from './helpers';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';

import { fonts, colors } from '@shared/themes';

const TABLE_ROW_HEIGHT = 50;
const TABLE_CELL_DEFAULT_WIDTH = 150;
const HEAD_FONT_SIZE = 17;
const CELL_FONT_SIZE = 15;

const TABLE_HEADER_KEY = 'report-header';
const TABLE_SUMMARY_KEY = 'report-summary';
const DATE_FORMAT = 'MM/DD/YYYY';

/**server value string "345,666.89" */
const formatServerNumber = (numStr) => {
  if (!numStr) return 0;

  if (typeof numStr === 'string') {
    return formatNumberFromCurrency(numStr);
  }

  return roundFloatNumber(numStr);
};

/**sum column of object  */
const sumPropertiesKey = (array, key) => {
  if (array?.length > 0) {
    const values = array.map((item) => formatNumberFromCurrency(item[key]));
    return values.reduce((a, b) => a + b);
  }
  return 0;
};

const avgPropertiesKey = (array, key) => {
  if (array?.length <= 0) return 0;
  const sum = sumPropertiesKey(array, key);
  return sum / array.length;
};

const strCompare = (a, b) => {
  // check valid date -> sort date
  if (moment(a).isValid() && moment(b).isValid()) {
    return moment(a, DATE_FORMAT) <= moment(b, DATE_FORMAT);
  }
  return a.toString().localeCompare(b.toString());
};

const SORT_STATE = {
  none: 'NONE',
  desc: 'DESC',
  asc: 'ASC',
};

export function Table({
  items,
  setItems,
  headerKeyLabels,
  widthForKeys, // options cell width  {key: width}
  whiteListKeys, // pick keys show
  primaryKey, // string -> primary key for row
  sortedKeys, // sort {key: "asc|desc"}
  unitKeys, // unit {key: unit}
  formatKeys = {}, // format {key: format}
  formatFunctionKeys = {}, // format {key: format}
  renderActionCell,
  renderCell,
  emptyDescription,
  styleTextKeys = {},
  onSortWithKey,
  onCellPress,
  onRowPress,
  draggable = false,
  // params olds
  sortKey,
  calcSumKeys,
  sumTotalKey,
  priceKeys,
  noHead = false,

  showSumOnBottom,
  renderFooter,
  checkSumItem,
  sortDefault,
  calcAvgKeys,
  isRefreshing = false,
  onRefresh = () => {},
}) {
  /**state */
  const [headerContent, setHeaderContent] = useState(null);
  const [tableData, setData] = useState(null);
  const [sumObject, setSumObject] = useState({});
  const [sortState, setSortState] = useState(SORT_STATE.none);

  const setListData = (sort) => {
    let sortList = items;
    if (sortKey && sortList?.length > 0) {
      sortList.sort((a, b) => {
        if (sort === SORT_STATE.desc) {
          return isPriceCell(sortKey)
            ? formatServerNumber(b[sortKey]) - formatServerNumber(a[sortKey])
            : strCompare(a[sortKey], b[sortKey]);
        } else if (sort === SORT_STATE.asc) {
          return isPriceCell(sortKey)
            ? formatServerNumber(a[sortKey]) - formatServerNumber(b[sortKey])
            : strCompare(b[sortKey], a[sortKey]);
        } else return 0;
      });
    }

    setData(sortList);
  };

  const changeSortData = () => {
    if (!sortKey) {
      setSortState(SORT_STATE.none);
      return;
    }

    let sort = sortState;
    if (sortState === SORT_STATE.desc) {
      sort = SORT_STATE.asc;
    } else {
      sort = SORT_STATE.desc;
    }

    setSortState(sort);
    setListData(sort);
  };

  const getCellValue = (item, key) => {
    // const format = formatKeys[key];
    // let value = item[key];
    // if (format === 'mins' && value > 0) {
    //   const str = parseFloat(value).toFixed(2).toString();
    //   const splits = str.split('.');
    //   if (splits.length === 2) {
    //     return (
    //       parseInt(splits[0]) +
    //       ' hrs ' +
    //       Math.floor((parseInt(splits[1]) / 100) * 60) +
    //       ' mins'
    //     );
    //   }

    //   return value + ' hrs';
    // }

    // return isPriceCell(key)
    //   ? unitKeys && unitKeys[key]
    //     ? value + ' ' + unitKeys[key]
    //     : '$ ' + value
    //   : value;

    let value = item[key];
    if (formatFunctionKeys && value) {
      const formatFunc = formatFunctionKeys[key];
      if (typeof formatFunc === 'function') {
        return formatFunc(value);
      }
    }

    return value;
  };

  const getHeaderCellValue = (value, key) => {
    const format = formatKeys[key];
    if (format === 'mins' && value > 0) {
      const str = parseFloat(value).toFixed(2).toString();
      const splits = str.split('.');
      if (splits.length === 2) {
        return (
          parseInt(splits[0]) +
          ' hrs ' +
          Math.floor((parseInt(splits[1]) / 100) * 60) +
          ' mins'
        );
      }

      return value + ' hrs';
    }

    return isPriceCell(key)
      ? unitKeys && unitKeys[key]
        ? formatServerNumber(sumObject[key]) + ' ' + unitKeys[key]
        : '$ ' + formatMoney(sumObject[key])
      : sumObject[key];
  };

  /**
  |--------------------------------------------------
  | Bind Header
  |--------------------------------------------------
  */
  useEffect(() => {
    if (noHead) {
      setHeaderContent({});
      return;
    }

    // use case no set table head -> get all keys from data
    if (_.isEmpty(headerKeyLabels)) {
      const firstRowKeys = Object.keys(items[0]);
      setHeaderContent(firstRowKeys);
      return;
    }

    setHeaderContent(headerKeyLabels);
  }, [noHead, items, headerKeyLabels]);

  // bind sum row data
  useEffect(() => {
    // calc sum for calcSumKeys
    if (whiteListKeys?.length > 0 && items) {
      let sumObj = {};

      if (calcSumKeys?.length > 0) {
        calcSumKeys.forEach((key) => {
          sumObj[key] =
            checkSumItem && checkSumItem[key]
              ? checkSumItem[key]
              : sumPropertiesKey(items, key);
        });
      }

      if (calcAvgKeys?.length > 0) {
        calcAvgKeys.forEach((key) => {
          sumObj[key] = avgPropertiesKey(items, key);
        });
      }

      setSumObject(sumObj);
    }

    setListData(sortState);
  }, [items, whiteListKeys]);

  useEffect(() => {
    // set data and sort -> render
    if (!sortDefault) {
      setSortState(SORT_STATE.desc);
      setListData(SORT_STATE.desc);
    }
  }, [sortKey]);

  // get width render cell with index or key
  const getCellWidth = (key) => {
    if (widthForKeys && widthForKeys[key]) {
      return widthForKeys[key];
    }
    return TABLE_CELL_DEFAULT_WIDTH;
  };

  const isPriceCell = (key) => {
    return priceKeys?.indexOf(key) >= 0;
  };

  /**
  |--------------------------------------------------
  | RENDER FLAT LIST ROW
  |--------------------------------------------------
  */
  // custom render default cell
  const renderDefaultCell = (cellInfo) => {
    const { columnKey, rowIndex, columnIndex, item } = cellInfo;
    if (renderCell && typeof renderCell === 'function') {
      const cell = renderCell(cellInfo);
      if (cell) {
        return cell;
      }
    }

    return cellInfo ? (
      <Cell
        disabled={!onCellPress}
        onPress={() =>
          onCellPress({ item, row: rowIndex, col: columnIndex, key: columnKey })
        }
        key={getUniqueId(columnKey, rowIndex, 'cell')}
        columnKey={columnKey}
        index={cellInfo.column}
        getWidthForKey={getCellWidth}
        text={getCellValue(item, columnKey)}
        textStyle={styleTextKeys[columnKey] ?? styles.textStyle}
        height={scaleHeight(60)}
      />
    ) : null;
  };

  const renderItem = ({ item, index, move, moveEnd, isActive }) => {
    return (
      <Row
        key={getValueForColumnKey(item, primaryKey)}
        onPress={() => onRowPress({ item, row: index })}
        disabled={!onRowPress}
        height={scaleHeight(60)}
        onLongPress={move}
        onPressOut={moveEnd}
        isDragging={isActive}
        draggable={draggable}
      >
        {whiteListKeys.map((key, keyIndex) => {
          const cellInfo = Object.create({
            columnKey: key,
            rowIndex: index,
            columnIndex: keyIndex,
            item: item,
            cellWidth: getCellWidth(key),
          });

          return renderDefaultCell(cellInfo);
        })}
      </Row>
    );
  };

  // render header
  const renderHeader = () => {
    return !_.isEmpty(headerContent) ? (
      <>
        {/**sum row */}
        {calcSumKeys?.length > 0 && !showSumOnBottom && (
          <Row
            style={{ ...styles.head, backgroundColor: '#E5E5E5' }}
            key={TABLE_SUMMARY_KEY}
          >
            {whiteListKeys.map((key, index) => (
              <Cell
                key={getUniqueId(key, index, 'summary')}
                style={{
                  width: getCellWidth(index, key),
                  ...(isPriceCell(key) && {
                    alignItems: 'flex-end',
                  }),
                }}
              >
                {key === sumTotalKey && (
                  <Text style={styles.txtSum}>{'Total'}</Text>
                )}

                {calcSumKeys?.indexOf(key) > -1 && (
                  <Text style={styles.txtSum}>
                    {getHeaderCellValue(sumObject[key], key)}
                  </Text>
                )}

                {calcAvgKeys?.indexOf(key) > -1 && (
                  <Text style={styles.txtSum}>
                    {isPriceCell(key)
                      ? unitKeys && unitKeys[key]
                        ? formatServerNumber(sumObject[key]) +
                          ' ' +
                          unitKeys[key]
                        : '$ ' + formatMoney(sumObject[key])
                      : sumObject[key]}
                  </Text>
                )}
              </Cell>
            ))}
          </Row>
        )}
      </>
    ) : null;
  };

  // render footer
  const onRenderFooter = () => {
    return renderFooter ? (
      renderFooter({
        whiteListKeys,
        getCellWidth,
        isPriceCell,
        sumTotalKey,
        sumObject,
        calcSumKeys,
      })
    ) : (
      <View />
    );
  };

  const onRenderFooterSpace = () => (
    <View
      style={
        showSumOnBottom && {
          height: TABLE_ROW_HEIGHT,
          backgroundColor: 'transparent',
        }
      }
    />
  );

  // render line spacing
  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  const onHandleChangeData = ({ data }) => {
    setData(data);
    if (setItems && typeof setItems === 'function') {
      setItems(data);
    }
  };

  return (
    <View style={styles.container}>
      {headerContent && (
        <Header
          headerKeyLabels={headerContent}
          whiteListKeys={whiteListKeys}
          sortedKeys={sortedKeys}
          getWidthForKey={getCellWidth}
          height={scaleHeight(40)}
          onSortWithKey={onSortWithKey}
          draggable={draggable}
        />
      )}
      {draggable ? (
        <DraggableFlatList
          data={tableData}
          renderItem={renderItem}
          keyExtractor={(item) => getValueForColumnKey(item, primaryKey)}
          // ListHeaderComponent={renderHeader}
          ListFooterComponent={onRenderFooterSpace}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={() => (
            <EmptyList description={emptyDescription} />
          )}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          onMoveEnd={onHandleChangeData}
        />
      ) : (
        <FlatList
          data={tableData}
          renderItem={renderItem}
          keyExtractor={(item) => getValueForColumnKey(item, primaryKey)}
          // ListHeaderComponent={renderHeader}
          ListFooterComponent={onRenderFooterSpace}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={() => (
            <EmptyList description={emptyDescription} />
          )}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      )}
      {showSumOnBottom && onRenderFooter()}
    </View>
  );
}

//================================
// Component
//================================

Table.Row = Row;
Table.Cell = Cell;

//================================
// Style
//================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  txtCell: {
    fontSize: CELL_FONT_SIZE,
    color: '#6A6A6A',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  txtHead: {
    fontSize: HEAD_FONT_SIZE,
    color: '#0764B0',
    fontWeight: '600',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  txtSum: {
    fontSize: HEAD_FONT_SIZE,
    color: '#404040',
    fontWeight: '600',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  btnSort: {
    width: 30,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },
});
