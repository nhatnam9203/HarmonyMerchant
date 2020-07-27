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
    primaryId,
    extraData,
    noHead = false,
    renderCell,
    onCellPress,
    onRowPress,
    showSumOnBottom,
    onChangeSumObjects,
  },
  ref
) {
  const [headerContent, setHeaderContent] = useState([]);
  const [data, setData] = useState([]);
  const [sumObject, setSumObject] = useState({});
  const [renderKeys, setRenderKeys] = useState({});

  /**bind header */
  useEffect(() => {
    if (noHead) {
      setHeaderContent([]);
      return;
    }

    if (tableHead && tableHead.length > 0) {
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
      const filterList = pickObjectFromKeys(tableData, whiteKeys);

      let sumObj = {};
      if (calcSumKeys?.length > 0) {
        calcSumKeys.forEach((key) => {
          sumObj[key] = sumPropertiesKey(filterList, key);
        });
        setSumObject(sumObj);
        if (onChangeSumObjects) {
          onChangeSumObjects(sumObj);
        }
      }

      setData(filterList);
    }
  }, [tableData, whiteKeys]);

  /**bind render keys */
  useEffect(() => {
    const listKeys = whiteKeys.filter((key) => key !== primaryId);
    setRenderKeys(listKeys);
  }, [whiteKeys, primaryId]);

  const getCellWidth = (index) => {
    if (tableCellWidth && tableCellWidth.length > index) {
      return tableCellWidth[index];
    }
    return TABLE_CELL_DEFAULT_WIDTH;
  };

  // useImperativeHandle(ref, () => ({
  //   getSumObjects: () => {
  //     return sumObject;
  //   },
  // }));

  /**render */
  // TABLE CELL
  const renderItem = ({ item, index, separators }) => {
    return (
      <TableRow style={styles.row} key={`${item[primaryId]}`}>
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
        {renderKeys.map((key, keyIndex) => {
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
              style={[styles.cell, { width: getCellWidth(keyIndex) }]}
            >
              {cellRender ?? (
                <Text style={styles.textCell}>
                  {(calcSumKeys.indexOf(key) > -1 ? "$ " : "") + item[key]}
                </Text>
              )}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  // TABLE HEADER
  const renderHeader = () => {
    return headerContent.length > 0 ? (
      <>
        <TableRow style={styles.head} key={TABLE_HEADER_KEY}>
          {headerContent.map((x, index) => (
            <TableCell
              key={x}
              style={[styles.cell, { width: getCellWidth(index) }]}
            >
              <Text style={styles.textHead}>{x}</Text>
            </TableCell>
          ))}
        </TableRow>
        {calcSumKeys?.length > 0 && !showSumOnBottom && (
          <TableRow
            style={[styles.head, { backgroundColor: "#E5E5E5" }]}
            key={TABLE_SUMMARY_KEY}
          >
            {renderKeys.map((key, index) => {
              const keyUnique = uniqueId(key, index, "summary");
              return (
                <TableCell
                  key={keyUnique}
                  style={[styles.cell, { width: getCellWidth(index) }]}
                >
                  {key === "name" && (
                    <Text style={styles.textSum}>{"Total"}</Text>
                  )}
                  {calcSumKeys.indexOf(key) > -1 && (
                    <Text style={styles.textSum}>{"$ " + sumObject[key]}</Text>
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        )}
      </>
    ) : null;
  };

  const renderFooter = () => {
    return calcSumKeys?.length > 0 && showSumOnBottom ? (
      <TableRow
        style={[styles.head, { backgroundColor: "#E5E5E5" }]}
        key={TABLE_SUMMARY_KEY}
      >
        {/* {renderKeys?.map((key, index) => {
          const keyUnique = uniqueId(key, index, "summary-bot");
          return (
            <TableCell
              key={keyUnique}
              style={[styles.cell, { width: getCellWidth(index) }]}
            >
              {key === "name" && <Text style={styles.textSum}>{"Total"}</Text>}
              {calcSumKeys.indexOf(key) > -1 && (
                <Text style={styles.textSum}>{"$ " + sumObject[key]}</Text>
              )}
            </TableCell>
          );
        })} */}
      </TableRow>
    ) : null;
  };

  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  return (
    <FlatList
      styles={{ flex: 1 }}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => `${item[primaryId]}`}
      ListHeaderComponent={renderHeader}
      // ListFooterComponent={renderFooter}
      ItemSeparatorComponent={renderSeparator}
      // extraData={selectedItem}
    />
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
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  textSum: {
    fontSize: HEAD_FONT_SIZE,
    color: "#404040",
    fontWeight: "600",
  },
});
