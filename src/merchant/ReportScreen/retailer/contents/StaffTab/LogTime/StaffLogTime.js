import React from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { ReportTabLayout, TableListExtended } from "../../../../widget";
import { useSelector } from "react-redux";
import { layouts } from "@shared/themes";
import {
  ButtonCalendarFilter,
  FormTitle,
  ExportModal,
} from "@shared/components";
import { DropdownMenu } from "@shared/components";
import { useTranslation } from "react-i18next";
import { Table } from "@shared/components/CustomTable";
import { formatMoneyWithUnit } from "@utils";
import NavigationServices from "@navigators/NavigatorServices";
import { useDispatch } from "react-redux";

const FILTER_NAME_DEFAULT = "All Staff";

export const StaffLogTimeTab = ({
  exportRef,
  onHandleExportFile,
  reportData,
  onChangeTimeValue,
  showBackButton,
  timeValue,
  onRefresh,
  sortStaffName,
  onSortWithKey,
}) => {
  const { t } = useTranslation();
  const calendarRef = React.useRef(null);

  React.useEffect(() => {
    if (timeValue) {
      calendarRef.current?.updateTimeValue(timeValue);
    }
  }, [timeValue]);

  const onSelectRow = ({ item }) => {
    NavigationServices.navigate("ReportStaffLogTime_Detail", {
      item,
      timeValue: timeValue,
    });
  };

  const onRenderCell = ({ columnKey, rowIndex, columnIndex, item }) => {
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Table
          items={reportData?.sumary?.filter((x) => x.StaffId > 0)}
          headerKeyLabels={{
            staffName: t("Staff name"),
            workingDay: t("Working days"),
            totalWorkingTime: t("Total working time"),
          }}
          whiteListKeys={["staffName", "workingDay", "totalWorkingTime"]}
          primaryKey="StaffId"
          widthForKeys={{
            staffName: scaleWidth(450),
            workingDay: scaleWidth(300),
            totalWorkingTime: scaleWidth(300),
          }}
          emptyDescription={t("No Report Data")}
          formatFunctionKeys={
            {
              // totalRevenue: (value) => `${formatMoneyWithUnit(value)}`,
              // totalCost: (value) => `${formatMoneyWithUnit(value)}`,
              // totalTax: (value) => `${formatMoneyWithUnit(value)}`,
              // totalProfit: (value) => `${formatMoneyWithUnit(value)}`,
            }
          }
          renderCell={onRenderCell}
          onRowPress={onSelectRow}
          onRefresh={onRefresh}
          sortedKeys={{ staffName: sortStaffName }}
          sortKey="staffName"
          onSortWithKey={onSortWithKey}
        />
      </View>

      <View style={styles.rowContent}>
        <Text style={layouts.title}>{t("Staff Working Hour")}</Text>
        <ExportModal ref={exportRef} onExportFile={onHandleExportFile} />
      </View>

      <View style={styles.rowContent}>
        <View style={layouts.horizontal}>
          <ButtonCalendarFilter
            ref={calendarRef}
            onChangeTimeValue={onChangeTimeValue}
            paddingLeft={scaleWidth(15)}
            paddingTop={scaleHeight(165)}
            defaultValue={"This Week"}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
  },

  content: {
    flex: 1,
    marginTop: scaleHeight(20),
  },

  rowContent: {
    marginTop: scaleHeight(20),
    paddingHorizontal: scaleWidth(16),
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
