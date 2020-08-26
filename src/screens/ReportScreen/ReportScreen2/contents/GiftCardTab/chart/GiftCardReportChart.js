import React, { useEffect, useState, useRef, forwardRef } from "react";
import { StyleSheet, processColor, View, Text } from "react-native";
import { BarChart } from "react-native-charts-wrapper";
import _ from "ramda";
import moment from "moment";

import { formatNumberFromCurrency } from "@utils";
import { CalendarRangePicker, PopupButton } from "../../../widget";

const MAX_LABEL_COUNT = 7;
const DATE_FORMAT = "MM/DD/YYYY";

/**chart info */
const legend = {
  enabled: true,
  textSize: 14,
  form: "SQUARE",
  formSize: 22,
  direction: "LEFT_TO_RIGHT",
  horizontalAlignment: "CENTER",
  verticalAlignment: "BOTTOM",
  orientation: "HORIZONTAL",
  yEntrySpace: 5,
  xEntrySpace: 25,
  wordWrapEnabled: true,
};

const yAxis = {
  left: {
    drawLabels: true,
    drawAxisLine: true,
    drawGridLines: true,
    axisMinimum: 0,
    textSize: 14,
    formSize: 14,
    textColor: processColor("#0764B0"),
    granularity: 10,
    labelCount: 10,
    valueFormatter: "###,###,###.##",
  },
  right: {
    drawLabels: false,
    drawAxisLine: false,
    drawGridLines: false,
    axisMinimum: 0,
    textSize: 14,
    formSize: 14,
    textColor: processColor("#E5B960"),
    granularity: 10,
    labelCount: 10,
  },
};

const colors = [
  processColor("#FF7F00"),
  processColor("#CAB2D6"),
  processColor("#1F78B4"),
  processColor("#80C6FF"),
  processColor("#E5B960"),
  processColor("#FEBBFF"),
  processColor("#1F7810"),
  processColor("#80C610"),
  processColor("#CAB610"),
  processColor("#1F11B4"),
];

const pickValuesForKey = (array, forKey, format) => {
  return array.map((obj) => {
    const item = Object.entries(obj).filter(([key, value]) => key === forKey);
    const [key, value] = item[0];
    if (format === "float") return formatNumberFromCurrency(value);
    return value + "";
  });
};

// Returns an array of dates between the two dates
const getDatesBetween = (startDate, endDate) => {
  let dates = [];

  // Strip hours minutes seconds etc.
  let currentDate = startDate;

  while (currentDate <= endDate) {
    dates.push(currentDate.format("MM/DD/YYYY"));
    currentDate = currentDate.add(1, "day");
  }

  return dates;
};

const getDateRange = (title, timeUrl) => {
  const currentDate = moment();

  switch (title) {
    case "Today":
      return {
        since: currentDate.valueOf(),
        valueFormatter: [currentDate.format("DD/MM")],
        // start: currentDate.format("MM/DD/YYYY"),
        // end: currentDate.format("MM/DD/YYYY"),
      };
    case "Yesterday":
      const yesterday = currentDate.clone().subtract(1, "days");
      return {
        since: yesterday.valueOf(),
        valueFormatter: [
          yesterday.format("DD/MM"),
          currentDate.format("DD/MM"),
        ],
        // start: yesterday.format("MM/DD/YYYY"),
        // end: currentDate.format("MM/DD/YYYY"),
      };
    case "This Week":
      const weekStart = currentDate.clone().startOf("isoweek");
      return {
        since: weekStart.clone().valueOf(),
        valueFormatter: getDatesBetween(weekStart, currentDate),
        start: weekStart.format(DATE_FORMAT),
        end: currentDate.format(DATE_FORMAT),
      };
    case "Last Week":
      const lastWeek = currentDate.clone().subtract(1, "weeks");
      return {
        since: lastWeek.clone().startOf("isoweek").valueOf(),
        valueFormatter: getDatesBetween(
          lastWeek.clone().startOf("isoweek"),
          lastWeek.clone().endOf("isoweek")
        ),
        start: lastWeek.startOf("isoweek").format(DATE_FORMAT),
        end: lastWeek.endOf("isoweek").format(DATE_FORMAT),
      };
      break;
    case "This Month":
      return {
        since: currentDate.clone().startOf("month").valueOf(),
        valueFormatter: getDatesBetween(
          currentDate.clone().startOf("month"),
          currentDate.clone()
        ),
        start: currentDate.clone().startOf("month").format(DATE_FORMAT),
        end: currentDate.clone().format(DATE_FORMAT),
      };
    case "Last Month":
      const lastMonth = currentDate.subtract(1, "months");
      return {
        since: lastMonth.clone().startOf("month").valueOf(),
        valueFormatter: getDatesBetween(
          lastMonth.clone().startOf("month"),
          lastMonth.clone().endOf("month")
        ),
        start: lastMonth.startOf("month").format(DATE_FORMAT),
        end: lastMonth.endOf("month").format(DATE_FORMAT),
      };
    default:
      if (!timeUrl || _.isEmpty(timeUrl)) return null;

      const strArr = timeUrl?.split("&");
      if (strArr?.length != 2) return null;
      const startArr = strArr[0]?.split("=");
      const endArr = strArr[1]?.split("=");
      if (startArr?.length != 2 || endArr?.length != 2) return null;
      const startDate = moment(startArr[1]);
      return {
        since: startDate.valueOf(),
        valueFormatter: getDatesBetween(moment(startArr[1]), moment(endArr[1])),
        start: startArr[1],
        end: endArr[1],
      };
  }
};

/**RENDER */
const CalendarPickerComponent = React.forwardRef((props, ref) => {
  const { startDate, endDate } = props;
  return (
    <View style={styles.calendarPicker}>
      <CalendarRangePicker
        minDate={startDate}
        maxDate={endDate}
        renderBase={() => (
          <PopupButton
            text="Select day"
            // imageSrc={IMAGE.export}
          />
        )}
      />
    </View>
  );
});

export default function GiftCardBarGroupChart({
  data,
  titleRangeTime,
  urlRangeTime,
}) {
  /**state store */
  const [dataChart, setDataChart] = useState({});
  const [xAxis, setXAxis] = useState({});
  const [dateValues, setDateValues] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  const calendarPicker = useRef(null);

  /**useEffect */
  // add listener data change, map to chart data set
  useEffect(() => {
    if (data && dateValues) {
      // ======= map values =======

      let dateSets = Object.create({});

      // get all date to create key | xAxis value format
      data.forEach((item, index) => {
        const label = item.type || `${index}`;
        const giftCardStatistics = item.giftCardStatistics || [];

        let values = [];
        dateValues?.forEach((xDate) => {
          const statisticItem = giftCardStatistics.find((x) =>
            moment(x.date).isSame(xDate)
          );
          if (statisticItem) {
            values.push(formatNumberFromCurrency(statisticItem["sales"]));
          } else values.push(0);
        });

        if (dateSets[label] === undefined) {
          dateSets[label] = {
            values: values,
            label: label,
            config: {
              colors: [colors[index] || processColor("#80C6FF")],
              drawValues: false,
              valueTextSize: 14,
              valueTextColor: processColor("#0764B0"),
              valueFormatter: "###,###,##0.00;-###,###,##0.00",
            },
          };
        }
      });

      const createDataSet = {
        dataSets: Object.values(dateSets),
        config: {
          // BarData
          barWidth: (0.8 / (Object.keys(dateSets).length || 1)) * 2,
          group: {
            fromX: 0,
            groupSpace: 0.2,
            barSpace: 0,
          },
        },
      };

      setDataChart(createDataSet);
    } else {
      setDataChart([]);
    }

    // ======= map formatter =======
  }, [data, dateValues]);

  useEffect(() => {
    const dates = getDateRange(titleRangeTime, urlRangeTime);
    setDateRange(dates);
    setDateValues(dates?.valueFormatter);
    const createXAxis = {
      // valueFormatter: valueFormatter,
      centerAxisLabels: true,
      position: "BOTTOM",
      granularityEnabled: true,
      granularity: 1,
      textSize: 14,
      formSize: 14,
      textColor: processColor("#0764B0"),
      drawAxisLine: true,
      drawGridLines: false,
      drawLabels: true,
      labelCount: MAX_LABEL_COUNT,
      timeUnit: "DAYS",
      valueFormatterPattern: "MM/DD/YYYY",
      axisMaximum: dates?.valueFormatter?.length || 1,
      axisMinimum: 0,
      ...dates,
    };

    setXAxis(createXAxis);
  }, [urlRangeTime]);

  return (
    <View style={styles.container}>
      {dateValues?.length > MAX_LABEL_COUNT && dateRange && (
        <CalendarPickerComponent
          ref={calendarPicker}
          startDate={dateRange?.start}
          endDate={dateRange?.end}
        />
      )}
      <View style={{ flex: 1 }}>
        <View style={styles.amountContent}>
          <Text style={styles.txtAmount}>Amount ($)</Text>
        </View>
        <View style={styles.dateContent}>
          <Text style={styles.txtAmount}>Date</Text>
        </View>
        {!_.isEmpty(xAxis) && !_.isEmpty(dataChart) && (
          <BarChart
            dragEnabled={true}
            style={styles.chart}
            data={dataChart}
            xAxis={xAxis}
            yAxis={yAxis}
            animation={{ durationX: 200 }}
            legend={legend}
            entryLabelTextSize={14}
            touchEnabled={true}
            dragEnabled={true}
            scaleEnabled={true}
            scaleXEnabled={true}
            scaleYEnabled={true}
            pinchZoom={true}
            doubleTapToZoomEnabled={false}
            dragDecelerationEnabled={false}
            dragDecelerationFrictionCoef={0.99}
            zoom={{ scaleX: 1, scaleY: 1, xValue: 0, yValue: 0 }}
            highlightFullBarEnabled={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  chart: {
    flex: 1,
    paddingHorizontal: 20,
  },
  amountContent: {
    position: "absolute",
    top: -30,
    left: 0,
  },
  dateContent: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  txtAmount: {
    color: "#205580",
    fontSize: 15,
  },
  calendarPicker: {
    height: 50,
    left: 0,
    top: -50,
    right: 0,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
