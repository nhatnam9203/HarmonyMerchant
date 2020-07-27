import React, { useState, useRef, useCallback } from "react";
import { View, Image, StyleSheet } from "react-native";
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
import {
  HeaderTitle,
  HeaderTooltip,
  PopupButton,
  TableList,
} from "../../widget";
import { localize, scaleSzie, getQuickFilterTimeRange } from "@utils";
import actions from "@actions";

export default function StaffSalaryTab({ style, onGoStatistics, titleRangeTime, showCalendar }) {
  /**redux store*/
  const dispatch = useDispatch();
  const listStaffsSalary = useSelector((state) => state.staff.listStaffsSalary);
  const language = useSelector((state) => state.dataLocal.language);

  /**state */

  /**process */
  const onCellPress = ({ key, row, column, item }) => {
    if (key === "salary") {
      dispatch(actions.staff.getListStaffCalendar(item.staffId));
      onGoStatistics();
    }
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
          onPress={showCalendar}
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
          onCellPress={onCellPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
