import {
  ButtonCalendarFilter,
  FormTitle,
  ExportModal,
} from "@shared/components";
import { useReportSaleProduct } from "@shared/services/api/retailer";
import { getQuickFilterTimeRange } from "@utils";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import { useDispatch } from "react-redux";
import { Table } from "@shared/components/CustomTable";
import {
  dateToString,
  DATE_SHOW_FORMAT_STRING,
  statusSuccess,
} from "@shared/utils";
import { layouts } from "@shared/themes";
import { DropdownMenu } from "@shared/components";
import SalesProductLineChart from "./chart/SaleProductLineChart";
import { PopupButton, TableList, ReportTabLayout } from "../../../widget";
import IMAGE from "@resources";
const VIEW_MODE = {
  LIST: "LIST",
  CHART: "CHART",
};

const ACTIVE_COLOR = "#0764B0";
const INACTIVE_COLOR = "#6A6A6A";

const log = (obj, message = "") => {
  Logger.log(`[SalesByProductDetail] ${message}`, obj);
};

export default function SalesByProductDetail({
  route: {
    params: { detailName },
  },
  navigation,
  showBackButton,
  onChangeTimeValue,
  data,
  timeValue,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const calendarRef = React.useRef(null);

  const [viewMode, setViewMode] = useState(VIEW_MODE.LIST);
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
    if (detailName && data?.length > 0) {
      const itemSelect = data.find((detail) => detail.name === detailName);
      setDetails(itemSelect?.details || []);
    } else {
      setDetails([]);
    }
  }, [detailName, data]);

  const viewModeList = () => setViewMode(VIEW_MODE.LIST);
  const viewModeChart = () => setViewMode(VIEW_MODE.CHART);

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
            paddingLeft={scaleWidth(105)}
            paddingTop={scaleHeight(170)}
            defaultValue={timeValue}
          />
        </View>
        <View style={layouts.horizontal}>
          <PopupButton
            imageSrc={IMAGE.Report_Chart}
            imageStyle={{
              tintColor:
                viewMode === VIEW_MODE.CHART ? ACTIVE_COLOR : INACTIVE_COLOR,
            }}
            onPress={viewModeChart}
          />
          <View style={layouts.marginHorizontal} />
          <PopupButton
            imageSrc={IMAGE.Report_Grid}
            imageStyle={{
              tintColor:
                viewMode === VIEW_MODE.LIST ? ACTIVE_COLOR : INACTIVE_COLOR,
            }}
            onPress={viewModeList}
          />
        </View>
      </View>
      <View style={styles.rowContent}>
        <Text style={layouts.title}>{detailName}</Text>
        <ExportModal />
      </View>
      <View style={styles.content}>
        {viewMode === VIEW_MODE.LIST && (
          <Table
            items={details}
            headerKeyLabels={{
              date: t("Product name"),
              quantity: t("Qty sold"),
              totalRevenue: t("Total revenue"),
              totalCost: t("Total cost"),
              totalTax: t("Total tax"),
              totalProfit: t("Total profit"),
            }}
            whiteListKeys={[
              "date",
              "quantity",
              "totalRevenue",
              "totalCost",
              "totalTax",
              "totalProfit",
            ]}
            //   sortedKeys={{ customerName: sortName, phone: sortPhoneNumber }}
            primaryKey="date"
            //   unitKeys={{ totalDuration: "hrs" }}
            widthForKeys={{
              date: scaleWidth(250),
              quantity: scaleWidth(120),
              totalRevenue: scaleWidth(180),
              totalCost: scaleWidth(180),
              totalTax: scaleWidth(180),
            }}
            emptyDescription={t("No Report Data")}
            //   styleTextKeys={{ customerName: styles.textName }}
            //   onSortWithKey={onSortWithKey}
            formatFunctionKeys={{
              date: (value) => dateToString(value, DATE_SHOW_FORMAT_STRING),
            }}
            renderCell={onRenderCell}
            //   onRowPress={onSelectRow}
          />
        )}

        {viewMode === VIEW_MODE.CHART && (
          <SalesProductLineChart data={details} />
        )}
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

  cellAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    flex: 1,
  },
  txtSalary: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#6A6A6A",
    marginRight: 5,
  },
  imgDetail: {
    tintColor: "#6A6A6A",
    width: 20,
    height: 20,
  },
  btnInCell: {
    height: "100%",
    width: 35,
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  chartDetail: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
  },
  chartDetailItem: {
    flexDirection: "row",
    margin: 10,
    paddingLeft: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
