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
    position: "absolute",
    bottom: 0,
    left: 10,
    right: 10,
    // height: scaleHeight(50),
    // backgroundColor: "red",
  },

  image: { width: "100%", height: scaleHeight(100) },
});
