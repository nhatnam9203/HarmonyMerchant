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

const TABLE_HEADER_HEIGHT = 50;
const TABLE_ROW_HEIGHT = 50;
const TABLE_CELL_DEFAULT_WIDTH = 140;
const HEAD_FONT_SIZE = 17;
const CELL_FONT_SIZE = 15;

const TABLE_HEADER_KEY = "report-header";
const TABLE_SUMMARY_KEY = "report-summary";

const uniqueId = (key, index, defaultPrefix = "key") =>
  defaultPrefix + key + "-index" + index;

const sumPropertiesKey = (array, key) => {
  if (array?.length > 0) {
    const values = array.map((item) => parseFloat(item[key]) || 0);
    return values.reduce((a, b) => a + b);
  }
  return 0;
};

const pickObjectFromKeys = (array, keys) => {
  return array.map((obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => keys.includes(key))
    );
  });
};

const getCellKey = (item, primaryId) => {
  if (!primaryId || primaryId.length <= 0) {
    return item[0];
  }
  return `${item[primaryId]}`;
};

const formatFloatValue = (value) => {
  return value ? parseFloat(value).toFixed(2) : 0.0;
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
  },
  ref
) {
  const [headerContent, setHeaderContent] = useState([]);
  const [data, setData] = useState([]);
  const [sumObject, setSumObject] = useState({});

  /**bind header */
  useEffect(() => {
    if (noHead) {
      setHeaderContent([]);
      return;
    }

    if (tableHead?.length > 0) {
      setHeaderContent(tableHead);
      return;
    }

    if (tableData?.length > 0) {
      const listHead = Object.keys(tableData[0]);
      setHeaderContent(listHead);
    }
  }, [noHead, tableData, tableHead]);

  /**bind data */
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

  const getCellWidth = (index, key) => {
    if (tableCellWidth && tableCellWidth[key]) {
      return tableCellWidth[key];
    }
    return TABLE_CELL_DEFAULT_WIDTH;
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
      <TableRow style={styles.row} key={cellKey}>
        {/** render for objects*/}
        {/* {Object.keys(item)
          .filter((key) => key !== primaryId)
          .map((key, cellIndex) => (
            <TableCell
              key={key}
              style={[styles.cell, { width: getCellWidth(cellIndex) }]}
            >
              <Text style={styles.textCell}>{item[key]}</Text>
            </TableCell>
          ))} */}

        {/** render for whiteKeys*/}
        {whiteKeys.map((key, keyIndex) => {
          const keyUnique = uniqueId(key, keyIndex);
          const cellRender = renderCell({
            key: key,
            row: index,
            column: keyIndex,
            item: item,
          });
          return (
            <TableCell
              onPress={() =>
                onCellPress({
                  key: key,
                  row: index,
                  column: keyIndex,
                  item: item,
                })
              }
              key={keyUnique}
              style={[styles.cell, { width: getCellWidth(keyIndex, key) }]}
            >
              {cellRender ?? (
                <Text style={styles.textCell}>
                  {priceKeys?.indexOf(key) > -1
                    ? "$ " + formatFloatValue(item[key])
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
    return headerContent?.length > 0 ? (
      <>
        <TableRow style={styles.head} key={TABLE_HEADER_KEY}>
          {headerContent.map((x, index) => (
            <TableCell
              key={x.key}
              style={[styles.cell, { width: getCellWidth(index, x.key) }]}
            >
              <Text style={styles.textHead}>{x.value}</Text>
            </TableCell>
          ))}
        </TableRow>
        {calcSumKeys?.length > 0 && !showSumOnBottom && (
          <TableRow
            style={[styles.head, { backgroundColor: "#E5E5E5" }]}
            key={TABLE_SUMMARY_KEY}
          >
            {whiteKeys.map((key, index) => {
              const keyUnique = uniqueId(key, index, "summary");
              return (
                <TableCell
                  key={keyUnique}
                  style={[styles.cell, { width: getCellWidth(index, key) }]}
                >
                  {key === sumTotalKey && (
                    <Text style={styles.textSum}>{"Total"}</Text>
                  )}

                  {calcSumKeys.indexOf(key) > -1 && (
                    <Text style={styles.textSum}>
                      {priceKeys?.indexOf(key) > -1
                        ? "$ " + formatFloatValue(sumObject[key])
                        : sumObject[key]}
                    </Text>
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        )}
      </>
    ) : null;
  };

  // render footer
  const onRenderFooter = () => {
    return renderFooter ? renderFooter() : <View />;
  };

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
        ListFooterComponent={onRenderFooter}
        ItemSeparatorComponent={renderSeparator}
        // extraData={selectedItem}
      />
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
};

export default TableList = forwardRef(TableList);

//================================
// Component
//================================

function TableRow({ style, children, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={style}>{children && children}</View>
    </TouchableOpacity>
  );
}

function TableCell({ style, children, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={style}>{children && children}</View>
    </TouchableOpacity>
  );
}

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
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  textCell: {
    fontSize: CELL_FONT_SIZE,
    color: "#6A6A6A",
  },
  head: {
    height: TABLE_HEADER_HEIGHT,
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#FAFAFA",
  },
  textHead: {
    fontSize: HEAD_FONT_SIZE,
    color: "#0764B0",
    fontWeight: "600",
    flexWrap: "wrap",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  textSum: {
    fontSize: HEAD_FONT_SIZE,
    color: "#404040",
    fontWeight: "600",
    flexWrap: "wrap",
  },
});
