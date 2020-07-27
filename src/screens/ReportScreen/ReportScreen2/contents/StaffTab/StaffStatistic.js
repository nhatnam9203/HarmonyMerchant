import React, { useState, useRef, useCallback } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import IMAGE from "@resources";
import {
  StatusBarHeader,
  Button,
  ParentContainer,
  PopupCheckStaffPermission,
  PopupCalendar,
} from "@components";
import {
  HeaderTitle,
  HeaderTooltip,
  PopupButton,
  TableList,
} from "../../widget";
import { localize, scaleSzie, getQuickFilterTimeRange } from "@utils";
import actions from "@actions";

const HEAD_FONT_SIZE = 17;
const TABLE_ROW_HEIGHT = 50;

export default function StaffStatistic({ style }) {
  /**redux store*/
  const dispatch = useDispatch();
  const listStaffsSalary = useSelector((state) => state.staff.listStaffsSalary);
  const language = useSelector((state) => state.dataLocal.language);

  const searchStaffSalary = useCallback(
    (url) => dispatch(actions.staff.getListStaffsSalaryTop(url, true)),
    [dispatch]
  );

  /**state */
  const [visibleCalendar, setVisibleCalendar] = useState(false);
  const [titleRangeTime, setTitleRangeTime] = useState("This week");
  const [sumObjects, setSumObjects] = useState({});

  const modalCalendarRef = useRef(null);
  const tableListRef = useRef(null);

  /**process */
  const searchStaff = () => {
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
      console.log("quickFilter", quickFilter);
      url = `quickFilter=${getQuickFilterTimeRange(filter)}`;
    }

    // searchStaffSalary(url);
    dispatch(actions.staff.getListStaffsSalaryTop(url, true));
  };

  const changeTitleTimeRange = async (title) => {
    setVisibleCalendar(false);
    setTitleRangeTime(title !== "Time Range" ? title : "All time");
    searchStaff();
  };

  const onCellPress = ({ key, row, column, item }) => {};

  const onChangeSumObject = (sumObj) => {
    setSumObjects(sumObj);
  };

  /**render */
  const renderCell = ({ key, row, column, item }) => {
    if (key === "salary") {
      return (
        <View style={styles.cellSalary}>
          <Text style={styles.txtSalary}>{item[key] + "$"}</Text>
          <Image style={styles.imgDetail} source={IMAGE.Report_Detail} />
        </View>
      );
    }
    return null;
  };

  const renderFooter = () => {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 50,
          backgroundColor: "#E5E5E5",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <View style={styles.cell}>
          {<Text style={styles.textSum}>{"Total"}</Text>}
        </View>

        {sumObjects &&
          Object.keys(sumObjects).map((key, index) => {
            return (
              <View style={styles.cell}>
                <Text style={styles.textSum}>{"$ " + sumObjects[key]}</Text>
              </View>
            );
          })}
      </View>
    );
  };

  return (
    <View style={style}>
      <HeaderTitle title={localize("Staff Statistics", language)} />
      <HeaderTooltip
        rightComponent={
          <PopupButton text="Export" imageSrc={IMAGE.Report_Export} />
        }
      >
        <PopupButton
          text={titleRangeTime}
          onPress={() => setVisibleCalendar(true)}
          style={{ marginRight: 20 }}
        />
        <PopupButton text="All Staff" imageSrc={IMAGE.Report_Dropdown_Arrow} />
      </HeaderTooltip>

      <View style={{ flex: 1 }}>
        <TableList
          showSumOnBottom={true}
          tableData={listStaffsSalary}
          tableHead={[
            localize("Name", language),
            localize("Service sales", language),
            localize("Service split", language),
            localize("Product sales", language),
            localize("Product split", language),
            localize("Tip amount", language),
            localize("Salary", language),
          ]}
          whiteKeys={[
            "staffId",
            "name",
            "serviceSales",
            "serviceSplit",
            "productSales",
            "productSplit",
            "tip",
            "salary",
          ]}
          primaryId="staffId"
          calcSumKeys={[
            "serviceSales",
            "serviceSplit",
            "productSales",
            "productSplit",
            "tip",
            "salary",
          ]}
          renderCell={renderCell}
          onCellPress={onCellPress}
          onChangeSumObjects={onChangeSumObject}
        />

        {renderFooter()}

        <PopupCalendar
          type="report"
          ref={modalCalendarRef}
          visible={visibleCalendar}
          onRequestClose={() => setVisibleCalendar(false)}
          changeTitleTimeRange={changeTitleTimeRange}
          paddingLeft={scaleSzie(60)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tableContent: {
    backgroundColor: "red",
  },
  cellSalary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  txtSalary: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#6A6A6A",
    marginRight: 10,
  },
  imgDetail: {
    tintColor: "#6A6A6A",
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  textSum: {
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
});
