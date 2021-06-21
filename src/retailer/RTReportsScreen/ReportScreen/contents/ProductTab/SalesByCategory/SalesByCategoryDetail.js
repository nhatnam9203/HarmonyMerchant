import IMAGE from "@resources";
import { ButtonCalendarFilter, ExportModal } from "@shared/components";
import { Table } from "@shared/components/CustomTable";
import { layouts } from "@shared/themes";
import { dateToString, DATE_SHOW_FORMAT_STRING } from "@shared/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { PopupButton } from "../../../widget";
import SalesCategoryLineChart from "./chart/SaleCategoryLineChart";
import { formatMoneyWithUnit } from "@utils";

const VIEW_MODE = {
  LIST: 'LIST',
  CHART: 'CHART',
};

const ACTIVE_COLOR = '#0764B0';
const INACTIVE_COLOR = '#6A6A6A';

const log = (obj, message = '') => {
  Logger.log(`[SalesByCategoryDetail] ${message}`, obj);
};

export default function SalesByCategoryDetail({
  route: {
    params: { detailName, timeValue },
  },
  navigation,
  showBackButton,
  onChangeTimeValue,
  data,
  onRefresh,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const calendarRef = React.useRef(null);

  const [viewMode, setViewMode] = React.useState(VIEW_MODE.LIST);
  const [details, setDetails] = React.useState(null);

  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      showBackButton(true);
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
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

  React.useEffect(() => {
    calendarRef.current?.updateTimeValue(timeValue);
  }, [timeValue]);

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
            paddingLeft={scaleWidth(15)}
            paddingTop={scaleHeight(165)}
            // defaultValue={timeValue}
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
              date: t('Category name'),
              quantity: t('Qty sold'),
              totalRevenue: t('Total revenue'),
              totalCost: t('Total cost'),
              totalTax: t('Total tax'),
              totalProfit: t('Total profit'),
            }}
            whiteListKeys={[
              'date',
              'quantity',
              'totalRevenue',
              'totalCost',
              'totalTax',
              'totalProfit',
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
            emptyDescription={t('No Report Data')}
            //   styleTextKeys={{ customerName: styles.textName }}
            //   onSortWithKey={onSortWithKey}
            formatFunctionKeys={{
              date: (value) => dateToString(value, DATE_SHOW_FORMAT_STRING),
              totalRevenue: (value) => `${formatMoneyWithUnit(value)}`,
              totalCost: (value) => `${formatMoneyWithUnit(value)}`,
              totalTax: (value) => `${formatMoneyWithUnit(value)}`,
              totalProfit: (value) => `${formatMoneyWithUnit(value)}`,
            }}
            renderCell={onRenderCell}
            onRefresh={onRefresh}
            //   onRowPress={onSelectRow}
          />
        )}

        {viewMode === VIEW_MODE.CHART && (
          <SalesCategoryLineChart data={details} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cellAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    flex: 1,
  },
  txtSalary: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#6A6A6A',
    marginRight: 5,
  },
  imgDetail: {
    tintColor: '#6A6A6A',
    width: 20,
    height: 20,
  },
  btnInCell: {
    height: '100%',
    width: 35,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartDetail: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
  chartDetailItem: {
    flexDirection: 'row',
    margin: 10,
    paddingLeft: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
