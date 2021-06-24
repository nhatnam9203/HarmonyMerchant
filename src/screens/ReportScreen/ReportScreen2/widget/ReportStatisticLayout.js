import React, { useState, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "react-native-material-dropdown";

import IMAGE from "@resources";
import { localize, scaleSzie, getQuickFilterTimeRange } from "@utils";
import { PopupCalendar } from "@components";

import HeaderTitle from "./HeaderTitle";
import HeaderTooltip from "./HeaderTooltip";
import PopupButton from "./PopupButton";
import TableList from "./CustomTableList";

const HEAD_FONT_SIZE = 17;
const TABLE_ROW_HEIGHT = 50;

export default function ReportStatisticLayout({
  style,
  showExportFile,
  isShowExportButton = true,
  handleTheDownloadedFile,
  onChangeFilter,
  dataFilters,
  filterId,
  title,
  tableData,
  tableHead,
  whiteKeys,
  primaryId,
  calcSumKeys,
  sumTotalKey,
  priceKeys,
  tableCellWidth,
  titleRangeTime,
  pathFileExport,
  showCalendar,
  renderTable,
  sortKey,
  unitKeys,
  subTitle,
  isRefreshing,
  onRefresh,
  detailOfItem,
  formatKeys,
}) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  /**render */
  const onCellPress = ({ key, row, column, item }) => {};

  const renderCell = ({ key, row, column, item }) => {
    return null;
  };

  const renderFooter = () => {
    return (
      <View style={styles.tableFooter}>
        <View style={styles.cell} key="total-key">
          {<Text style={styles.txtCalcSum}>{"Total"}</Text>}
        </View>

        {sumObjects &&
          Object.keys(sumObjects).map((key, index) => {
            return (
              <View style={styles.cell} key={key}>
                <Text style={styles.txtCalcSum}>{"$ " + sumObjects[key]}</Text>
              </View>
            );
          })}
      </View>
    );
  };

  return (
    <View style={style}>
      <HeaderTitle
        title={title || localize("Statistics", language)}
        subTitle={subTitle}
      />
      <HeaderTooltip
        rightComponent={
          <>
            {isShowExportButton && (
              <PopupButton
                text="Export"
                imageSrc={IMAGE.export}
                onPress={showExportFile}
              />
            )}
            {!!pathFileExport && (
              <PopupButton
                onPress={() => handleTheDownloadedFile(pathFileExport)}
                style={{ backgroundColor: "rgb(235,93,57)", marginLeft: 20 }}
                txtStyle={{ color: "#fff" }}
                imageStyle={{ tintColor: "#fff" }}
                text={localize("Manager downloaded file", language)}
                imageSrc={IMAGE.export}
              />
            )}
          </>
        }
      >
        {/* <PopupButton
          text={titleRangeTime}
          imageSrc={IMAGE.calendar}
          onPress={showCalendar}
          style={{ marginRight: 20 }}
        /> */}
        {dataFilters && (
          <Dropdown
            data={dataFilters}
            onChangeText={(text) => onChangeFilter(text)}
            dropdownPosition={2}
            value={filterId}
            renderBase={() => (
              <PopupButton
                text={filterId}
                imageSrc={IMAGE.Report_Dropdown_Arrow}
              />
            )}
          />
        )}
      </HeaderTooltip>

      <View style={{ flex: 1 }}>
        {tableData &&
          (renderTable ? (
            renderTable()
          ) : (
            <TableList
              // showSumOnBottom={true}
              tableData={tableData}
              tableHead={tableHead}
              whiteKeys={whiteKeys}
              primaryId={primaryId}
              calcSumKeys={calcSumKeys}
              sumTotalKey={sumTotalKey}
              priceKeys={priceKeys}
              sortKey={sortKey}
              unitKeys={unitKeys}
              tableCellWidth={tableCellWidth}
              renderCell={renderCell}
              onCellPress={onCellPress}
              isRefreshing={isRefreshing}
              onRefresh={onRefresh}
              checkSumItem={detailOfItem}
              formatKeys={formatKeys}
            />
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tableContent: {
    backgroundColor: "red",
  },
  txtCalcSum: {
    fontSize: HEAD_FONT_SIZE,
    color: "#404040",
    fontWeight: "600",
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  tableFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "#E5E5E5",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
