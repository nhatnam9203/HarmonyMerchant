import PropTypes from "prop-types";
import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import _ from "ramda";
import {
  roundFloatNumber,
  formatNumberFromCurrency,
  formatMoney,
  scaleSzie,
} from "@utils";
import IMAGE from "@resources";
import { StickyForm } from "react-native-largelist-v3";

const TABLE_HEADER_HEIGHT = 50;
const TABLE_ROW_HEIGHT = 50;
const TABLE_CELL_DEFAULT_WIDTH = 160;
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

/**filter object for keys input */
const pickObjectFromKeys = (array, keys) => {
  return array.map((obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => keys.includes(key))
    );
  });
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

/**
 * !error: header long bug ui
 * !error: calcSum -> pagination bug
 * */
function TableListExtended(
  {
    tableData,
    tableHead,
    tableCellWidth,
    whiteKeys,
    calcSumKeys,
    sumTotalKey,
    priceKeys,
    primaryId,
    extraData,
    noHead = false,
    renderCell,
    onCellPress,
    onRowPress,
    showSumOnBottom,
    renderFooter,
    renderActionCell,
    checkSumItem,
    sortKey
  },
  ref
) {
  /**state */
  const [headerContent, setHeaderContent] = useState({});
  const [data, setData] = useState([]);
  const [dataFactory, setDataFactory] = useState([]);
  const [sumObject, setSumObject] = useState({});
  const [tableWidth, setTableWidth] = useState(0);
  const [sortState, setSortState] = useState(SORT_STATE.none);

  const setListData = (sort) => {
    let sortList = tableData;
    if (sortKey && sortList.length > 0) {
      sortList.sort((a, b) => {
        if (sort === SORT_STATE.desc) {
          return strCompare(a[sortKey], b[sortKey]);
        } else {
          return strCompare(b[sortKey], a[sortKey]);
        }
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

    if (_.isEmpty(tableHead)) {
      const firstRowKeys = Object.keys(tableData[0]);
      setHeaderContent(firstRowKeys);
      return;
    }

    setHeaderContent(tableHead);
  }, [noHead, tableData, tableHead]);

  // bind sum row data
  useEffect(() => {
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

      setListData(sortState);
      const valueObject = pickObjectFromKeys(
        tableData,
        whiteKeys.filter((x) => x !== sumTotalKey)
      );

      let factoryItems = [];
      let width = 0;
      tableData.forEach((item, index) => {
        let itemObject = Object.create({});
        itemObject["title"] = item[sumTotalKey];
        itemObject["data"] = Object.values(valueObject[index]);
        factoryItems.push(itemObject);
      });
      const data = Object.create({
        sectionTitle: "",
        items: factoryItems,
      });
      let dataArr = [];
      dataArr.push(data);
      setDataFactory(dataArr);

      whiteKeys.forEach((key, index) => {
        width += getCellWidth(index, key);
      });
      setTableWidth(width);
    }
  }, [tableData, whiteKeys]);

  useEffect(() => {
    // set data and sort -> render
    setSortState(SORT_STATE.desc);
    setListData(SORT_STATE.desc);
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

  const renderItem = ({ row }) => {
    const item = data[row];
    const cellKey = getCellKey(item, primaryId);

    return (
      <TableRow
        style={{ flexDirection: "row" }}
        key={cellKey}
        onPress={() => onRowPress({ item, row })}
        disabled={!onRowPress}
      >
        {whiteKeys.map((key, keyIndex) => {
          const keyUnique = uniqueId(key, keyIndex);
          const actProps = Object.create({
            key: key,
            row: row,
            column: keyIndex,
            item: item,
            isPrice: isPriceCell(key),
          });
          const cellRender = renderCell(actProps);
          const cellActionRender =
            renderActionCell && renderActionCell(actProps);

          return keyIndex === 0 ? (
            <View
              style={[styles.headName, { backgroundColor: "#fff" }]}
              key={keyUnique}
            >
              <TableCell
                onPress={() => onCellPress(actProps)}
                style={{
                  width: getCellWidth(keyIndex, key),
                  ...(isPriceCell(key) && { alignItems: "flex-end" }),
                }}
                disabled={!onCellPress}
              >
                {key === TABLE_ACTION_KEY
                  ? cellActionRender
                  : cellRender ?? (
                      <Text style={styles.txtCell}>
                        {isPriceCell(key) ? "$ " + item[key] : item[key]}
                      </Text>
                    )}
              </TableCell>
            </View>
          ) : (
            <TableCell
              onPress={() => onCellPress(actProps)}
              key={keyUnique}
              style={{
                width: getCellWidth(keyIndex, key),
                ...(isPriceCell(key) && { alignItems: "flex-end" }),
              }}
              disabled={!onCellPress}
            >
              {key === TABLE_ACTION_KEY
                ? cellActionRender
                : cellRender ?? (
                    <Text style={styles.txtCell}>
                      {isPriceCell(key) ? "$ " + item[key] : item[key]}
                    </Text>
                  )}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  const renderHeader = () => (
    <TableRow
      style={[styles.head, { flexDirection: "row" }]}
      key={TABLE_HEADER_KEY}
    >
      {whiteKeys.map((key, index) => {
        return index === 0 ? (
          <View style={styles.headName} key={uniqueId(key, index, "header")}>
            <TableCell
              style={{
                width: getCellWidth(index, key),
                ...(isPriceCell(key) && { alignItems: "flex-end" }),
                ...(sortKey === key && { flexDirection: "row" }),
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
          </View>
        ) : (
          <TableCell
            key={uniqueId(key, index, "header")}
            style={{
              width: getCellWidth(index, key),
              ...(isPriceCell(key) && { alignItems: "flex-end" }),
              ...(sortKey === key && { flexDirection: "row" }),
            }}
          >
            <Text style={styles.txtHead}>{headerContent[key] ?? ""}</Text>
            {sortKey === key && (
              <TouchableOpacity style={styles.btnSort} onPress={changeSortData}>
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
        );
      })}
    </TableRow>
  );

  // render header
  const renderSection = () => {
    return (
      <TableRow
        style={{
          ...styles.head,
          backgroundColor: "#E5E5E5",
          flexDirection: "row",
        }}
        key={TABLE_SUMMARY_KEY}
      >
        {whiteKeys.map((key, index) => {
          return index === 0 ? (
            <View
              style={[styles.headName, { backgroundColor: "#E5E5E5" }]}
              key={uniqueId(key, index, "summary")}
            >
              <TableCell
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
                      ? "$ " + formatMoney(sumObject[key])
                      : sumObject[key] ?? ""}
                  </Text>
                )}
              </TableCell>
            </View>
          ) : (
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
                    ? "$ " + formatMoney(sumObject[key])
                    : sumObject[key] ?? ""}
                </Text>
              )}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  return (
    <View style={styles.container}>
      <StickyForm
        style={{ backgroundColor: "white" }}
        contentStyle={{ width: tableWidth ?? "100%" }}
        data={dataFactory}
        heightForSection={() => TABLE_ROW_HEIGHT}
        heightForIndexPath={() => TABLE_ROW_HEIGHT}
        renderHeader={renderHeader}
        renderSection={renderSection}
        renderIndexPath={renderItem}
        // directionalLockEnabled={true}
        bounces={false}
      />
    </View>
  );
}

TableListExtended.propTypes = {
  tableData: PropTypes.array.isRequired,
  tableHead: PropTypes.array,
  noHead: PropTypes.bool,
  calcSumKeys: PropTypes.array,
  tableCellWidth: PropTypes.array,
  whiteKeys: PropTypes.array.isRequired,
  primaryId: PropTypes.any.isRequired,
  sumTotalKey: PropTypes.string,
  priceKeys: PropTypes.array,
  extraData: PropTypes.object.extraData,
  renderCell: PropTypes.object,
  onCellPress: PropTypes.func,
  onRowPress: PropTypes.func,
  showSumOnBottom: PropTypes.bool,
  onChangeSumObjects: PropTypes.func,
  renderFooter: PropTypes.func,
  renderIconCell: PropTypes.func,
};

export default TableListExtended = forwardRef(TableListExtended);

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

TableListExtended.Row = TableRow;
TableListExtended.Cell = TableCell;

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
    height: TABLE_ROW_HEIGHT,
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
  headName: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
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