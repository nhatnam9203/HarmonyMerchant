import React, { useState, useRef, useCallback } from "react";
import { View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import IMAGE from "@resources";
import {
  Text,
  StatusBarHeader,
  Button,
  ParentContainer,
  PopupCheckStaffPermission,
  PopupCalendar,
} from "@components";
import { HeaderTitle, HeaderTooltip, PopupButton, TableList } from "../widget";
import { localize, scaleSzie, getQuickFilterTimeRange } from "@utils";
import actions from "@actions";

export default function StaffSalaryTab({ style }) {
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

  const modalCalendarRef = useRef(null);

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

  /**render */
  const renderCell = ({ key, row, column, item }) => {
    if (key === "salary") {
      return (
        <View>
          <Text>{item[key]}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={style}>
      <HeaderTitle title={localize("Staff Salary", language)} />
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
        />

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
