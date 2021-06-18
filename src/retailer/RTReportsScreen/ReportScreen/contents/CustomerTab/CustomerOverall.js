import NavigationServices from "@navigators/NavigatorServices";
import { ButtonCalendarFilter, ExportModal } from "@shared/components";
import { Table } from "@shared/components/CustomTable";
import { layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import {
  dateToString,
  DATE_SHOW_FORMAT_STRING,
  statusSuccess,
} from "@shared/utils";
import { formatMoneyWithUnit } from "@utils";

export default function CustomerOverall({
  onChangeTimeValue,
  data,
  timeValue,
}) {
  /**redux store*/
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const calendarRef = React.useRef(null);

  React.useEffect(() => {
    if (timeValue) {
      calendarRef.current?.updateTimeValue(timeValue);
    }
  }, [timeValue]);

  const onSelectRow = ({ item }) => {
    NavigationServices.navigate("ReportCustomerDetail", {
      customerId: item?.customerId,
      name: item?.name,
      timeValue: timeValue,
    });
  };

  const onRenderCell = ({ columnKey, rowIndex, columnIndex, item }) => {
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContent}>
        <View style={layouts.horizontal}>
          <ButtonCalendarFilter
            ref={calendarRef}
            onChangeTimeValue={onChangeTimeValue}
            paddingLeft={scaleWidth(15)}
            paddingTop={scaleHeight(125)}
            defaultValue={"This Week"}
          />
        </View>
      </View>
      <View style={styles.rowContent}>
        <Text style={layouts.title}>{t("Customer report")}</Text>
        <ExportModal />
      </View>
      <View style={styles.content}>
        <Table
          items={data}
          headerKeyLabels={{
            name: t("Customer name"),
            appointmentCount: t("Orders"),
            lastVisitDate: t("Last order"),
            lastVisitSale: t("Last order sales"),
            total: t("Total sales"),
          }}
          whiteListKeys={[
            "name",
            "appointmentCount",
            "lastVisitDate",
            "lastVisitSale",
            "total",
          ]}
          //   sortedKeys={{ customerName: sortName, phone: sortPhoneNumber }}
          primaryKey="customerId"
          //   unitKeys={{ totalDuration: "hrs" }}
          widthForKeys={{
            name: scaleWidth(300),
            appointmentCount: scaleWidth(150),
            lastVisitDate: scaleWidth(180),
            lastVisitSale: scaleWidth(180),
            total: scaleWidth(180),
          }}
          emptyDescription={t("No Report Data")}
          //   styleTextKeys={{ customerName: styles.textName }}
          //   onSortWithKey={onSortWithKey}
          formatFunctionKeys={{
            lastVisitDate: (value) =>
              dateToString(value, DATE_SHOW_FORMAT_STRING),
            total: (value) => `${formatMoneyWithUnit(value)}`,
          }}
          renderCell={onRenderCell}
          onRowPress={onSelectRow}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
