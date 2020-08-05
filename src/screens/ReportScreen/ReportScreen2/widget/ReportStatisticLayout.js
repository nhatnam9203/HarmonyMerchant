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
}) {
  /**redux store*/
  const dispatch = useDispatch();
  const listStaffsCalendar = useSelector(
    (state) => state.staff.listStaffsCalendar
  );
  const language = useSelector((state) => state.dataLocal.language);
  const pathFileReportStaff = useSelector(
    (state) => state.staff.pathFileReportStaffStatistic
  );

  /**state */
  const [sumObjects, setSumObjects] = useState({});

  const [visibleCalendar, setVisibleCalendar] = useState(false);
  const [titleRangeTime, setTitleRangeTime] = useState("This week");

  /**refs */
  const modalCalendarRef = useRef(null);

  /**process */
  const onCellPress = ({ key, row, column, item }) => {};
  const onChangeSumObject = (sumObj) => {
    setSumObjects(sumObj);
  };

  // create time range params
  const getFilterTimeParams = () => {
    if (!modalCalendarRef || !modalCalendarRef.current) {
      return `quickFilter=${getQuickFilterTimeRange("This Week")}`;
    }

    const {
      isCustomizeDate,
      startDate,
      endDate,
      quickFilter,
    } = modalCalendarRef.current.state;

    let url;

    if (isCustomizeDate) {
      url = `timeStart=${startDate}&timeEnd=${endDate}`;
    } else {
      const filter = quickFilter === false ? "This Week" : quickFilter;
      // console.log("quickFilter", quickFilter);
      url = `quickFilter=${getQuickFilterTimeRange(filter)}`;
    }

    return url;
  };

  // create title for time, to set default title print
  const getTimeTitle = () => {
    if (!modalCalendarRef || !modalCalendarRef.current) {
      return "This Week";
    }

    const {
      isCustomizeDate,
      startDate,
      endDate,
      quickFilter,
    } = modalCalendarRef.current.state;

    const filter = quickFilter === false ? "This Week" : quickFilter;
    let title = `${filter}`;

    if (startDate && endDate) {
      title = ` ${startDate} - ${endDate}`;
    }

    return title;
  };

  const getOverallPaymentMethod = async () => {
    await dispatch(
      actions.report.getOverallPaymentMethod(true, getFilterTimeParams())
    );
  };

  const changeTitleTimeRange = async (title) => {
    setVisibleCalendar(false);
    await setTitleRangeTime(title !== "Time Range" ? title : "All time");
    // await getOverallPaymentMethod();
  };

  /**render */
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
      <HeaderTitle title={title || localize("Statistics", language)} />
      <HeaderTooltip
        rightComponent={
          <>
            <PopupButton
              text="Export"
              imageSrc={IMAGE.export}
              onPress={showExportFile}
            />
            {pathFileReportStaff && (
              <PopupButton
                onPress={() => handleTheDownloadedFile(pathFileReportStaff)}
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
        <PopupButton
          text={titleRangeTime}
          imageSrc={IMAGE.calendar}
          onPress={() => setVisibleCalendar(true)}
          style={{ marginRight: 20 }}
        />
        <View style={{ width: 160, height: 45 }}>
          <Dropdown
            data={dataFilters}
            onChangeText={(text) => onChangeFilter(text)}
            dropdownPosition={2}
            renderBase={() => (
              <PopupButton
                text={filterId}
                imageSrc={IMAGE.Report_Dropdown_Arrow}
              />
            )}
          />
        </View>
      </HeaderTooltip>

      <View style={{ flex: 1 }}>
        {tableData && (
          <TableList
            // showSumOnBottom={true}
            tableData={tableData}
            tableHead={tableHead}
            whiteKeys={whiteKeys}
            primaryId={primaryId}
            calcSumKeys={calcSumKeys}
            sumTotalKey={sumTotalKey}
            priceKeys={priceKeys}
            tableCellWidth={tableCellWidth}
            renderCell={renderCell}
            onCellPress={onCellPress}
          />
        )}
        {/* {renderFooter()} */}
      </View>

      <PopupCalendar
        type="report"
        ref={modalCalendarRef}
        visible={visibleCalendar}
        onRequestClose={() => setVisibleCalendar(false)}
        changeTitleTimeRange={changeTitleTimeRange}
        paddingLeft={scaleSzie(60)}
      />
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
