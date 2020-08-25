import React, { useEffect, useState } from "react";
import { StyleSheet, processColor, View, Text } from "react-native";
import { BarChart } from "react-native-charts-wrapper";
import _ from "ramda";
import moment from "moment";

import { formatNumberFromCurrency } from "@utils";

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
    valueFormatter: "#.# '$'",
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

const getDateRange = (title, timeUrl) => {
  const currentDate = moment();

  switch (title) {
    case "Today":
      return {
        start: currentDate.format("MM/DD/YYYY"),
        end: currentDate.format("MM/DD/YYYY"),
      };
    case "Yesterday":
      const yesterday = currentDate.subtract(1, "days");
      return {
        start: yesterday.format("MM/DD/YYYY"),
        end: currentDate.format("MM/DD/YYYY"),
      };
    case "This Week":
      const weekStart = currentDate.clone().startOf("isoweek");
      return {
        start: weekStart.format("MM/DD/YYYY"),
        end: currentDate.format("MM/DD/YYYY"),
      };
    case "Last Week":
      const lastWeek = currentDate.subtract(1, "weeks");
      return {
        start: lastWeek.startOf("isoweek").format("MM/DD/YYYY"),
        end: lastWeek.endOf("isoweek").format("MM/DD/YYYY"),
      };
      break;
    case "This Month":
      const thisMonth = currentDate.clone().startOf("month");
      return {
        start: thisMonth.format("MM/DD/YYYY"),
        end: currentDate.format("MM/DD/YYYY"),
      };
    case "Last Month":
      const lastMonth = currentDate.subtract(1, "months");
      return {
        start: lastMonth.startOf("month").format("MM/DD/YYYY"),
        end: lastMonth.endOf("month").format("MM/DD/YYYY"),
      };
    default:
      if (!timeUrl || _.isEmpty(timeUrl)) return null;

      const strArr = timeUrl?.split("&");
      if (strArr?.length != 2) return null;
      const startArr = strArr[0]?.split("=");
      const endArr = strArr[1]?.split("=");
      if (startArr?.length != 2 || endArr?.length != 2) return null;

      return {
        start: startArr[1],
        end: endArr[1],
      };
  }
};

export default function GiftCardBarGroupChart({
  data,
  titleRangeTime,
  urlRangeTime,
}) {
  /**state store */
  const [dataChart, setDataChart] = useState({});
  const [xAxis, setXAxis] = useState({});

  /**useEffect */
  // add listener data change, map to chart data set
  useEffect(() => {
    if (data) {
      // ======= map values =======

      let dateDataDict = Object.create({}); // data for dateString
      let dateSets = Object.create({});

      // get all date to create key | xAxis value format
      data.forEach((item, index) => {
        const label = item.type || `${index}`;
        if (dateSets[label] === undefined) {
          dateSets[label] = {
            values: [],
            label: label,
            config: {
              colors: [colors[index] || processColor("#80C6FF")],
              drawValues: false,
              valueTextSize: 14,
              valueTextColor: processColor("#0764B0"),
              valueFormatter: "0.00",
            },
          };
        }

        // get list statistics
        const giftCardStatistics = item.giftCardStatistics || [];
        giftCardStatistics.forEach((statistic) => {
          const xAxisKey = statistic["dateString"];
          let dataItem = dateDataDict[xAxisKey];
          if (!dataItem) {
            dataItem = Object.create({});
          }
          dataItem[label] = formatNumberFromCurrency(statistic["sales"] || 0);
          dateDataDict[xAxisKey] = dataItem;
        });
      });

      // create dataset values
      Object.keys(dateDataDict).forEach((key) => {
        const item = dateDataDict[key];
        Object.keys(dateSets).forEach((label) => {
          const value = item[label] || 0.0;
          let dateItem = dateSets[label];
          let values = dateItem["values"] || [];
          values.push(value);
          dateItem["values"] = values;
          dateSets[label] = dateItem;
        });
      });

      const dataSets = []; // Object.values(dateSets);
      const createDataSet = {
        dataSets: dataSets,
        config: {
          // BarData
          barWidth: 0.2,
          group: {
            fromX: 0,
            groupSpace: 0.2,
            barSpace: 0,
          },
        },
      };

      // setDataChart(createDataSet);
      setDataChart({});

      const valueFormatter = Object.keys(dateDataDict);
    } else {
      setDataChart({});
    }

    // ======= map formatter =======
  }, [data]);

  useEffect(() => {
    const dateValues = getDateRange(titleRangeTime, urlRangeTime);

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
      timeUnit: "DAYS",
      since: 0,
      valueFormatter: "date",
      valueFormatterPattern: "YYYY/MM/dd",
    };

    setXAxis(createXAxis);
  }, [urlRangeTime]);

  return (
    <View style={styles.container}>
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
          zoom={{ scaleX: 3, scaleY: 1, xValue: 0, yValue: 0 }}
          highlightFullBarEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
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
});
