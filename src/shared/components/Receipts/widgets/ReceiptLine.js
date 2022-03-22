import Dash from "react-native-dash";
import React from "react";

export const LineHeader = () => (
  <Dash
    style={{
      height: 1,
      marginVertical: scaleHeight(10),
      marginHorizontal: scaleWidth(0),
    }}
    dashGap={2}
    dashLength={6}
    dashThickness={1}
    dashColor="#000"
  />
);

export const LineItem = () => (
  <Dash
    style={{
      width: "98%",
      height: 1,
      marginVertical: scaleHeight(4),
      marginHorizontal: scaleWidth(4),
    }}
    dashGap={4}
    dashLength={1}
    dashThickness={1}
    dashColor="#0009"
  />
);
