import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "react-native-material-dropdown";

import IMAGE from "@resources";
import {
  HeaderTitle,
  HeaderTooltip,
  PopupButton,
  TableList,
} from "../../widget";
import { localize } from "@utils";

const HEAD_FONT_SIZE = 17;
const TABLE_ROW_HEIGHT = 50;

export default function CustomerReportTab({
  style,
  showCalendar,
  titleRangeTime,
}) {
  /**redux */
  const language = useSelector((state) => state.dataLocal.language);
  const pathFileReportStaff = useSelector(
    (state) => state.staff.pathFileReportStaffSalary
  );

  return (
    <View style={style}>
      <HeaderTitle title={localize("Customer Report", language)} />
      <HeaderTooltip
        rightComponent={
          <>
            <PopupButton
              text="Export"
              imageSrc={IMAGE.Report_Export}
              // onPress={showExportFile}
            />

            {pathFileReportStaff && (
              <PopupButton
                // onPress={() => handleTheDownloadedFile(pathFileReportStaff)}
                style={{ backgroundColor: "rgb(235,93,57)", marginLeft: 20 }}
                txtStyle={{ color: "#fff" }}
                imageStyle={{ tintColor: "#fff" }}
                text={localize("Manager downloaded file", language)}
                imageSrc={IMAGE.Report_Export}
              />
            )}
          </>
        }
      >
        <PopupButton
          text={titleRangeTime}
          onPress={showCalendar}
          style={{ marginRight: 20 }}
        />
        <View style={{ width: 160, height: 45 }}>
          <Dropdown
            // data={dataStaffSalaryFilter}
            // onChangeText={(text) => onChangeFilterStaff(text)}
            renderBase={() => (
              <PopupButton
                text={"All Staff"}
                imageSrc={IMAGE.Report_Dropdown_Arrow}
              />
            )}
          />
        </View>
      </HeaderTooltip>
    </View>
  );
}
