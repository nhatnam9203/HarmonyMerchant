import React from "react";
import { View, StyleSheet, Image } from "react-native";
import IMAGE from "@resources";

export const AgencyLogo = () => {
  return (
    <View style={styles.container}>
      <Image
        source={IMAGE.AgencyLogo}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: scaleHeight(100),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  image: { width: "96%", height: scaleHeight(100) },
});
