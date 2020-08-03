import PropTypes from "prop-types";
import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import _ from "ramda";
import { roundFloatNumber } from "@utils";

const TABLE_HEADER_HEIGHT = 50;
const TABLE_ROW_HEIGHT = 50;
const TABLE_CELL_DEFAULT_WIDTH = 140;
const HEAD_FONT_SIZE = 17;
const CELL_FONT_SIZE = 15;

const TABLE_HEADER_KEY = "report-header";
const TABLE_SUMMARY_KEY = "report-summary";
const TABLE_ACTION_KEY = "action";

const uniqueId = (key, index, defaultPrefix = "key") =>
  defaultPrefix + key + "-index" + index;

/**sum column of object  */
const sumPropertiesKey = (array, key) => {
  if (array?.length > 0) {
    const values = array.map((item) => parseFloat(item[key]) || 0);
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

/**
 * !error: header long bug ui
 * !error: calcSum -> pagination bug
 * */
function TableList(
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
    onChangeSumObjects,
    renderFooter,
    renderActionCell,
  },
  ref
) {
  /**state */
  const [headerContent, setHeaderContent] = useState({});
  const [data, setData] = useState([]);
  const [sumObject, setSumObject] = useState({});

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
          sumObj[key] = sumPropertiesKey(tableData, key);
        });
        setSumObject(sumObj);
        if (onChangeSumObjects) {
          onChangeSumObjects(sumObj);
        }
      }

      setData(tableData);
    }
  }, [tableData, whiteKeys]);

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

  // useImperativeHandle(ref, () => ({
  //   getSumObjects: () => {
  //     return sumObject;
  //   },
  // }));

  /**render */
  // render cell
  const renderItem = ({ item, index, separators }) => {
    const cellKey = getCellKey(item, primaryId);

    return (
      <TableRow
        key={cellKey}
        onPress={() => onRowPress && onRowPress({ item, row: index })}
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
              onPress={() => onCellPress && onCellPress(actProps)}
              key={keyUnique}
              style={{
                width: getCellWidth(keyIndex, key),
                ...(isPriceCell(key) && { alignItems: "flex-end" }),
              }}
            >
              {key === TABLE_ACTION_KEY
                ? cellActionRender
                : cellRender ?? (
                    <Text style={styles.txtCell}>
                      {isPriceCell(key)
                        ? "$ " + roundFloatNumber(item[key])
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
                width: getCellWidth(index, key),
                // ...(isPriceCell(key) && { alignItems: "flex-end" }),
              }}
            >
              <Text style={styles.txtHead}>{headerContent[key] ?? ""}</Text>
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
                      ? "$ " + roundFloatNumber(sumObject[key])
                      : sumObject[key] ?? ""}
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
        // extraData={selectedItem}
      />
      {showSumOnBottom && onRenderFooter()}
    </View>
  );
}

TableList.propTypes = {
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

export default TableList = forwardRef(TableList);

//================================
// Component
//================================

function TableRow({ style, children, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.row, style]}>{children && children}</View>
    </TouchableOpacity>
  );
}

function TableCell({ style, children, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
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
    textAlign: "justify",
    flexWrap: "wrap",
  },
  txtHead: {
    fontSize: HEAD_FONT_SIZE,
    color: "#0764B0",
    fontWeight: "600",
    flexWrap: "wrap",
    textAlign: "justify",
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
    textAlign: "justify",
  },
});
