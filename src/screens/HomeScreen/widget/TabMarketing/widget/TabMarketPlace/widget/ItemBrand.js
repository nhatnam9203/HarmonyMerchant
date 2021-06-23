import { Text } from "@components";
import { ScaleSzie, openBrowser } from "@utils";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
  Image,
} from "react-native";
import FastImage from "react-native-fast-image";
import IMAGE from "@resources";

const { width } = Dimensions.get("window");

const ItemBrand = ({ item }) => {
  const { name, fileURL, link } = item;

  const openLinking = () => {
    openBrowser(link)
  };

  return (
    <TouchableOpacity style={styles.container} onPress={openLinking}>
      {fileURL ? (
        <FastImage
          style={styles.image}
          source={{
            uri: fileURL,
            headers: { Authorization: "someAuthToken" },
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.stretch}
        />
      ) : (
        <View style={styles.img}>
          <Image
            style={styles.image_null}
            source={IMAGE.Gallery_ic}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      )}
      <View style={styles.brandName}>
        <Text style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    width: ScaleSzie(126),
    minHeight: ScaleSzie(150),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    margin: ScaleSzie(13),
    borderRadius: ScaleSzie(5),
  },
  image: {
    borderTopLeftRadius: ScaleSzie(5),
    borderTopRightRadius: ScaleSzie(5),
    width: "100%",
    height: ScaleSzie(120),
  },
  img: {
    width: "100%",
    height: ScaleSzie(120),
    justifyContent: 'center',
    alignItems: 'center'
  },
  image_null: {
    width: "30%",
    height: "30%",
  },
  brandName: {
    paddingVertical: ScaleSzie(13),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: ScaleSzie(12),
    fontWeight: "600",
    color: "#0764B0",
    textAlign: 'center',
    paddingHorizontal: ScaleSzie(2)
  },
});

export default ItemBrand;
