import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import IMAGE from "@resources";
import { localize } from "@utils";

export default function OverallStatistic({ style }) {
  return (
    <View style={[styles.container, style]}>
      <Text>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "red" },
});
