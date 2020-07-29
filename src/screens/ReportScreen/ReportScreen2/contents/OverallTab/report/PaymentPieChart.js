import React from "react";
import { StyleSheet, processColor, View } from "react-native";
import { PieChart } from "react-native-charts-wrapper";

const legend = {
    enabled: true,
    textSize: 16,
    form: "CIRCLE",
    horizontalAlignment: "CENTER",
    verticalAlignment: "BOTTOM",
    orientation: "HORIZONTAL",
    wordWrapEnabled: true,
    maxSizePercent: 1.0,
  },
  data = {
    dataSets: [
      {
        values: [
          { value: 1000, label: "Cash" },
          { value: 1200, label: "Credit Card" },
          { value: 900, label: "Harmony Pay" },
          { value: 1200, label: "Other" },
        ],
        label: "",
        config: {
          colors: [
            processColor("#003680"),
            processColor("#3E70B3"),
            processColor("#BFDAFF"),
            processColor("#8FA3BF"),
          ],
          valueTextSize: 14,
          valueTextColor: processColor("white"),
          sliceSpace: 1,
          selectionShift: 0,
          // xValuePosition: "OUTSIDE_SLICE",
          // yValuePosition: "OUTSIDE_SLICE",
          valueFormatter: "#'%'",
          valueLineColor: processColor("white"),
          valueLinePart1Length: 0,
        },
      },
    ],
  },
  highlights = [{ x: 2 }],
  description = {
    text: "",
    textSize: 14,
    textColor: processColor("darkgray"),
  };

export default function PaymentBarChart({}) {
  function handleSelect(event) {
    let entry = event.nativeEvent;
    if (entry == null) {
      //   this.setState({ ...this.state, selectedEntry: null });
    } else {
      //   this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) });
    }

    console.log(event.nativeEvent);
  }

  return (
    <View style={styles.container}>
      <PieChart
        style={styles.chart}
        logEnabled={true}
        chartBackgroundColor={processColor("transparent")}
        chartDescription={description}
        data={data}
        legend={legend}
        highlights={highlights}
        entryLabelColor={processColor("#fff")}
        entryLabelTextSize={14}
        drawEntryLabels={false}
        rotationEnabled={true}
        rotationAngle={45}
        usePercentValues={true}
        styledCenterText={{
          text: "28%",
          color: processColor("#003680"),
          size: 60,
        }}
        centerTextRadiusPercent={100}
        holeRadius={55}
        holeColor={processColor("#fff")}
        transparentCircleRadius={45}
        transparentCircleColor={processColor("#f0f0f088")}
        maxAngle={360}
        onSelect={handleSelect}
        onChange={(event) => console.log(event.nativeEvent)}
      />
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
  },
});
