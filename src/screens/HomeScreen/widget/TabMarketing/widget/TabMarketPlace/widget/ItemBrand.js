import { Text } from "@components";
import { scaleSzie, openBrowser } from "@utils";
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
    width: "100%",
    height: scaleSzie(120),
  },
  img: {
    width: "100%",
    height: scaleSzie(120),
    justifyContent: 'center',
    alignItems: 'center'
  },
  image_null: {
    width: "30%",
    height: "30%",
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
    textAlign: 'center',
    paddingHorizontal: scaleSzie(2)
  },
});

export default ItemBrand;
