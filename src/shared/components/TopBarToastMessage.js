import React from "react";
import { View, StyleSheet, Text } from "react-native";

const TopBarToastMessage = ({ message }) => {
  if (!message) return <></>;
  return (
    <View style={styles.container}>
      {!!message && (
        <View style={styles.content}>
          <Text style={styles.text}>{message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: scaleHeight(80),
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
    top: scaleHeight(20),
    left: 0,
    right: 0,
    paddingBottom: scaleHeight(10),
  },

  content: {
    backgroundColor: "#fff",
    flex: 0,
    paddingVertical: scaleHeight(10),
    paddingHorizontal: scaleHeight(10),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scaleWidth(16),
    flexDirection: "row",
  },

  text: {
    fontSize: scaleFont(14),
    color: "red",
    marginLeft: scaleWidth(10),
  },
});

export default TopBarToastMessage;
