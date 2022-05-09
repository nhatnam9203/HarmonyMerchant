import { ButtonCalendarFilter, ExportModal } from "@shared/components";
import { layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import _ from "lodash";
import { Table } from "@shared/components/CustomTable";

const FILTER_NAME_DEFAULT = "All Staff";

export const StaffLogTimeDetailTab = ({
  route: {
    params: { item, timeValue },
  },
  navigation,
  showBackButton,
  onChangeTimeValue,
  reportData,
  onRefresh,
  exportRef,
  onHandleExportFile,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const calendarRef = React.useRef(null);

  const [details, setDetails] = React.useState(null);

  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      showBackButton(true);
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      showBackButton(false);
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  React.useEffect(() => {
    if (item && reportData?.details?.length > 0) {
      const arr = reportData?.details?.filter((x) => {
        if (x?.length > 0) {
          return item.StaffId == _.get(x[0], "StaffId");
        }
        return false;
      });
      setDetails(...arr);
    } else {
      setDetails([]);
    }
  }, [item, reportData]);

  React.useEffect(() => {
    calendarRef.current?.updateTimeValue(timeValue);
  }, [timeValue]);

  const onRenderCell = ({ columnKey, rowIndex, columnIndex, item }) => {
    return null;
  };

  const onSortWithKey = (sortKey) => {
    switch (sortKey) {
      case "totalProfit":
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Table
          items={details}
          headerKeyLabels={{
            Date: t("Date"),
            LoginTime: t("Login time"),
            LogoutTime: t("Logout time"),
            Duration: t("Duration"),
          }}
          whiteListKeys={["Date", "LoginTime", "LogoutTime", "Duration"]}
          widthForKeys={{
            Date: scaleWidth(350),
            LoginTime: scaleWidth(200),
            LogoutTime: scaleWidth(200),
            Duration: scaleWidth(300),
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
          onRowPress={() => {}}
          onRefresh={onRefresh}
          //   sortedKeys={{ staffName: sortStaffName }}
          //   sortKey="staffName"
          //   onSortWithKey={onSortWithKey}
        />
      </View>

      <View style={styles.rowContent}>
        <Text style={layouts.title}>{`${item?.staffName}`}</Text>
        {/* <ExportModal
          ref={exportRef}
          onExportFile={onHandleExportFile}
          exportFuncs={[{ value: "csv", label: "CSV" }]}
        /> */}
      </View>

      <View style={styles.rowContent}>
        <View style={layouts.horizontal}>
          <ButtonCalendarFilter
            ref={calendarRef}
            onChangeTimeValue={onChangeTimeValue}
            paddingLeft={scaleWidth(15)}
            paddingTop={scaleHeight(165)}
            // defaultValue={timeValue}
          />
        </View>
        <View style={layouts.horizontal}></View>
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
