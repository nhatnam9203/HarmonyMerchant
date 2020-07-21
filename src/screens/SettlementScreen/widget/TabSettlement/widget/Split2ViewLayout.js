import React from "react";
import { View, StyleSheet } from "react-native";

function Split2ViewLayout({ leftComponent, rightComponent }) {
  return (
    <View style={styles.container}>
      <View key="left" style={styles.content}>
        {leftComponent && leftComponent()}
      </View>
      <View key="right" style={styles.content}>
        {rightComponent && rightComponent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", marginHorizontal: 5 },
  content: { flex: 1, margin: 5 },
});

export default Split2ViewLayout;
