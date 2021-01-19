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
import IMAGE from "@resources";

const { width } = Dimensions.get("window");

const ItemBrand = ({ item }) => {
  const { name, fileURL, link } = item;

  const openLinking = () => {
    Linking.openURL(link);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={openLinking}>
      <FastImage
        style={styles.image}
        source={{
          uri: fileURL,
          headers: { Authorization: "someAuthToken" },
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.stretch}
      />
      <View style={styles.brandName}>
        <Text style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    width: scaleSzie(126),
    minHeight: scaleSzie(150),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    margin: scaleSzie(13),
    borderRadius: scaleSzie(5),
  },
  image: {
    borderTopLeftRadius: scaleSzie(5),
    borderTopRightRadius: scaleSzie(5),
    width: '100%',
    height: scaleSzie(120),
  },
  brandName: {
    paddingVertical: scaleSzie(13),
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
