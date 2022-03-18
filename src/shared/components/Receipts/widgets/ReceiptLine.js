import Dash from "react-native-dash";
import React from "react";

export const LineHeader = () => (
  <Dash
    style={{
      width: "100%",
      height: 1,
      marginVertical: scaleHeight(4),
      marginHorizontal: scaleWidth(4),
    }}
    dashGap={2}
    dashLength={10}
    dashThickness={1}
    dashColor="#000d"
  />
);

export const LineItem = () => (
  <Dash
    style={{
      width: "98%",
      height: 1,
      paddingHorizontal: scaleWidth(5),
    }}
    dashGap={4}
    dashLength={1}
    dashThickness={1}
    dashColor="#0009"
  />
);
