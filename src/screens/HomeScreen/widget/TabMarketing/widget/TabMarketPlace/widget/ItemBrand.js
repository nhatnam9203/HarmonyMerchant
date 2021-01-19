import { Text } from "@components";
import { scaleSzie } from "@utils";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
} from "react-native";
import FastImage from "react-native-fast-image";

const { width } = Dimensions.get("window");

const ItemBrand = ({ item }) => {
  const { brandName, url, linking } = item;

  const openLinking = () => {
    Linking.openURL(linking);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={openLinking}>
      <FastImage
        style={styles.image}
        source={{
          uri: url,
          headers: { Authorization: "someAuthToken" },
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.stretch}
      />
      <View style={styles.brandName}>
        <Text style={styles.name}>{brandName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    width: scaleSzie(122),
    minHeight: scaleSzie(150),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    margin: scaleSzie(15),
    borderRadius: scaleSzie(5),
  },
  image: {
    borderTopLeftRadius: scaleSzie(5),
    borderTopRightRadius: scaleSzie(5),
    width: scaleSzie(122),
    height: scaleSzie(120),
  },
  brandName: {
    paddingVertical: scaleSzie(15),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: scaleSzie(12),
    fontWeight: "600",
    color: "#0764B0",
  },
});

export default ItemBrand;
