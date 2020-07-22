import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";

const TABLE_HEADER_HEIGHT = 50;
const TABLE_ROW_HEIGHT = 50;
const TABLE_CELL_DEFAULT_WIDTH = 140;
const HEAD_FONT_SIZE = 17;
const CELL_FONT_SIZE = 15;

const TABLE_HEADER_KEY = "report-header";

const uniqueId = (key, index) => key + "-index" + index;

/**
 * !error: header long bug ui
 * */
export default function TableList({
  tableData,
  tableHead,
  tableCellWidth,
  whiteKeys,
  primaryId,
  extraData,
  noSummary = true,
  noHead = false,
}) {
  const [headerContent, setHeaderContent] = useState([]);
  const [data, setData] = useState([]);

  const getTableHead = () => {
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
  };

  useEffect(getTableHead, [noHead, tableData, tableHead]);

  const bineTableData = () => {
    if (whiteKeys?.length > 0 && tableData) {
      const filterList = tableData.map((obj) => {
        return Object.fromEntries(
          Object.entries(obj).filter(([key]) => whiteKeys.includes(key))
        );
      });

      setData(filterList);
    }
  };

  useEffect(bineTableData, [tableData, whiteKeys]);

  const getCellWidth = (index) => {
    if (tableCellWidth && tableCellWidth.length > index) {
      return tableCellWidth[index];
    }
    return TABLE_CELL_DEFAULT_WIDTH;
  };

  /**render */
  // TABLE CELL
  const renderItem = ({ item, index, separators }) => {
    const renderKeys = whiteKeys.filter((key) => key !== primaryId);

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
          return (
            <TableCell
              key={keyUnique}
              style={[styles.cell, { width: getCellWidth(keyIndex) }]}
            >
              <Text style={styles.textCell}>{item[key]}</Text>
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  // TABLE HEADER
  const renderHeader = () => {
    return headerContent.length > 0 ? (
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
      ItemSeparatorComponent={renderSeparator}
      // extraData={selectedItem}
    />
  );
}

TableList.propTypes = {
  tableData: PropTypes.array.isRequired,
  tableHead: PropTypes.array,
  noHead: PropTypes.bool,
  noSummary: PropTypes.bool,
  tableCellWidth: PropTypes.array,
  whiteKeys: PropTypes.array,
  primaryId: PropTypes.any.isRequired,
};

//================================
// Component
//================================

function TableRow({ style, children }) {
  return (
    <TouchableOpacity>
      <View style={style}>{children && children}</View>
    </TouchableOpacity>
  );
}

function TableCell({ style, children }) {
  return (
    <TouchableOpacity>
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
});
