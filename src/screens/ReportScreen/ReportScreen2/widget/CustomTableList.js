import IMAGE from "@resources";
import {
  formatMoney,
  formatNumberFromCurrency,
  roundFloatNumber,
  scaleSzie,
} from "@utils";
import PropTypes from "prop-types";
import _ from "ramda";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TABLE_HEADER_HEIGHT = 50;
const TABLE_ROW_HEIGHT = 50;
const TABLE_CELL_DEFAULT_WIDTH = 150;
const HEAD_FONT_SIZE = 17;
const CELL_FONT_SIZE = 15;

const TABLE_HEADER_KEY = "report-header";
const TABLE_SUMMARY_KEY = "report-summary";
const TABLE_ACTION_KEY = "action";

const uniqueId = (key, index, defaultPrefix = "key") =>
  defaultPrefix + key + "-index" + index;

/**server value string "345,666.89" */
const formatServerNumber = (numStr) => {
  if (!numStr) return 0;

  if (typeof numStr === "string") {
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

/**get unique key for render row */
const getCellKey = (item, primaryId) => {
  if (!primaryId || primaryId.length <= 0) {
    return item[0];
  }
  return `${item[primaryId]}`;
};

const strCompare = (a, b) => {
  return a.toString().localeCompare(b.toString());
};

const SORT_STATE = {
  none: "NONE",
  desc: "DESC",
  asc: "ASC",
};

function TableList({
  tableData,
  tableHead,
  tableCellWidth,
  whiteKeys,
  calcSumKeys,
  sumTotalKey,
  priceKeys,
  primaryId,
  noHead = false,
  renderCell,
  onCellPress,
  onRowPress,
  showSumOnBottom,
  renderFooter,
  renderActionCell,
  checkSumItem,
  sortKey,
  sortDefault,
  unitKeys,
}) {
  /**state */
  const [headerContent, setHeaderContent] = useState({});
  const [data, setData] = useState(null);
  const [sumObject, setSumObject] = useState({});
  const [sortState, setSortState] = useState(SORT_STATE.none);

  const setListData = (sort) => {
    let sortList = tableData;
    if (sortKey && sortList?.length > 0) {
      sortList.sort((a, b) => {
        if (sort === SORT_STATE.desc) {
          return strCompare(a[sortKey], b[sortKey]);
        } else if (sort === SORT_STATE.asc) {
          return strCompare(b[sortKey], a[sortKey]);
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

  /**effect */

  // bind header - table data
  useEffect(() => {
    if (noHead) {
      setHeaderContent({});
      return;
    }

    // use case no set table head -> get all keys from data
    if (_.isEmpty(tableHead)) {
      const firstRowKeys = Object.keys(tableData[0]);
      setHeaderContent(firstRowKeys);
      return;
    }

    setHeaderContent(tableHead);
  }, [noHead, tableData, tableHead]);

  // bind sum row data
  useEffect(() => {
    // calc sum for calcSumKeys
    if (whiteKeys?.length > 0 && tableData) {
      let sumObj = {};

      if (calcSumKeys?.length > 0) {
        calcSumKeys.forEach((key) => {
          sumObj[key] =
            checkSumItem && checkSumItem[key]
              ? checkSumItem[key]
              : sumPropertiesKey(tableData, key);
        });
        setSumObject(sumObj);
      }
    }

    setListData(sortState);
  }, [tableData, whiteKeys]);

  useEffect(() => {
    // set data and sort -> render
    if (!sortDefault) {
      setSortState(SORT_STATE.desc);
      setListData(SORT_STATE.desc);
    }
  }, [sortKey]);

  // get width render cell with index or key
  const getCellWidth = (index, key) => {
    if (tableCellWidth && tableCellWidth[key]) {
      return tableCellWidth[key];
    }
    return TABLE_CELL_DEFAULT_WIDTH;
  };

  const isPriceCell = (key) => {
    return priceKeys?.indexOf(key) >= 0;
  };

  /**render */
  // render cell
  const renderItem = ({ item, index }) => {
    const cellKey = getCellKey(item, primaryId);

    return (
      <TableRow
        style={{ minHeight: TABLE_ROW_HEIGHT }}
        key={cellKey}
        onPress={() => onRowPress({ item, row: index })}
        disabled={!onRowPress}
      >
        {whiteKeys.map((key, keyIndex) => {
          const keyUnique = uniqueId(key, keyIndex);
          const actProps = Object.create({
            key: key,
            row: index,
            column: keyIndex,
            item: item,
            isPrice: isPriceCell(key),
          });
          const cellRender = renderCell(actProps);
          const cellActionRender =
            renderActionCell && renderActionCell(actProps);

          return (
            <TableCell
              onPress={() => onCellPress(actProps)}
              key={keyUnique}
              style={{
                justifyContent: "center",
                width: getCellWidth(keyIndex, key),
                ...(isPriceCell(key) && { alignItems: "flex-end" }),
              }}
              disabled={!onCellPress}
            >
              {key === TABLE_ACTION_KEY
                ? cellActionRender
                : cellRender ?? (
                    <Text style={styles.txtCell}>
                      {isPriceCell(key)
                        ? unitKeys && unitKeys[key]
                          ? item[key] + " " + unitKeys[key]
                          : "$ " + item[key]
                        : item[key]}
                    </Text>
                  )}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  // render header
  const renderHeader = () => {
    return !_.isEmpty(headerContent) ? (
      <>
        {/**header row */}
        <TableRow style={styles.head} key={TABLE_HEADER_KEY}>
          {whiteKeys.map((key, index) => (
            <TableCell
              key={uniqueId(key, index, "header")}
              style={{
                justifyContent: "center",
                width: getCellWidth(index, key),
                ...(isPriceCell(key) && { alignItems: "flex-end" }),
                ...(sortKey === key && {
                  flexDirection: "row",
                  alignItems: "center",
                }),
              }}
            >
              <Text style={styles.txtHead}>{headerContent[key] ?? ""}</Text>
              {sortKey === key && (
                <TouchableOpacity
                  style={styles.btnSort}
                  onPress={changeSortData}
                >
                  <View>
                    <Image
                      style={{ width: scaleSzie(18), height: scaleSzie(18) }}
                      source={
                        sortState === SORT_STATE.asc
                          ? IMAGE.sortUp
                          : IMAGE.sortDown
                      }
                      resizeMode="center"
                    />
                  </View>
                </TouchableOpacity>
              )}
            </TableCell>
          ))}
        </TableRow>
        {/**sum row */}
        {calcSumKeys?.length > 0 && !showSumOnBottom && (
          <TableRow
            style={{ ...styles.head, backgroundColor: "#E5E5E5" }}
            key={TABLE_SUMMARY_KEY}
          >
            {whiteKeys.map((key, index) => (
              <TableCell
                key={uniqueId(key, index, "summary")}
                style={{
                  width: getCellWidth(index, key),
                  ...(isPriceCell(key) && {
                    alignItems: "flex-end",
                  }),
                }}
              >
                {key === sumTotalKey && (
                  <Text style={styles.txtSum}>{"Total"}</Text>
                )}

                {calcSumKeys.indexOf(key) > -1 && (
                  <Text style={styles.txtSum}>
                    {isPriceCell(key)
                      ? unitKeys && unitKeys[key]
                        ? formatServerNumber(sumObject[key]) +
                          " " +
                          unitKeys[key]
                        : "$ " + formatMoney(sumObject[key])
                      : sumObject[key]}
                  </Text>
                )}
              </TableCell>
            ))}
          </TableRow>
        )}
      </>
    ) : null;
  };

  // render footer
  const onRenderFooter = () => {
    return renderFooter ? (
      renderFooter({
        whiteKeys,
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
          backgroundColor: "transparent",
        }
      }
    />
  );

  // render line spacing
  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };
  const renderListEmpty = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 100,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#6A6A6A" }}>
          No report data
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        styles={{ flex: 1 }}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => getCellKey(item, primaryId)}
        // ListHeaderComponent={renderHeader}
        ListFooterComponent={onRenderFooterSpace}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderListEmpty}
        // extraData={selectedItem}
      />
      {showSumOnBottom && onRenderFooter()}
    </View>
  );
}

export default TableList;

//================================
// Component
//================================

function TableRow({ style, children, onPress, disabled }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View style={[styles.row, style]}>{children && children}</View>
    </TouchableOpacity>
  );
}

function TableCell({ style, children, onPress, disabled }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View style={[styles.cell, style]}>{children && children}</View>
    </TouchableOpacity>
  );
}

TableList.Row = TableRow;
TableList.Cell = TableCell;

//================================
// Style
//================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
  row: {
    backgroundColor: "#FFFFFF",
    // height: TABLE_ROW_HEIGHT,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  head: {
    height: TABLE_HEADER_HEIGHT,
    backgroundColor: "#FAFAFA",
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  txtCell: {
    fontSize: CELL_FONT_SIZE,
    color: "#6A6A6A",
    textAlign: "center",
    flexWrap: "wrap",
  },
  txtHead: {
    fontSize: HEAD_FONT_SIZE,
    color: "#0764B0",
    fontWeight: "600",
    flexWrap: "wrap",
    textAlign: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  txtSum: {
    fontSize: HEAD_FONT_SIZE,
    color: "#404040",
    fontWeight: "600",
    flexWrap: "wrap",
    textAlign: "center",
  },
  btnSort: {
    width: 30,
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
