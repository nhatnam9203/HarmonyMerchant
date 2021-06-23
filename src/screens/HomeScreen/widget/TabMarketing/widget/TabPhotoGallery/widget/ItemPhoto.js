import { Text } from "@components";
import { ScaleSzie } from "@utils";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import FastImage from "react-native-fast-image";
import IMAGE from "@resources";

const ItemPhoto = ({ index, item, selectImage, openImage, isSelected }) => {
  const { merchantBannerId, title, imageUrl, selected } = item;

  const onSelected = () => {
    selectImage(merchantBannerId);
  };

  const onOpenImage = () => {
    openImage(index);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.container}
      onPress={isSelected ? onSelected : onOpenImage}
      onLongPress={onSelected}
    >
      {imageUrl ? (
        <FastImage
          style={styles.image}
          source={{
            uri: imageUrl,
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

      <View style={styles.photo}>
        <Image style={{ marginTop: ScaleSzie(1) }} source={IMAGE.Gallery_ic} />
        <Text numberOfLines={2} style={styles.name}>{title}</Text>
      </View>
      {selected && (
        <View style={styles.tick}>
          <Image style={styles.ic} source={IMAGE.Tick_ic} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    width: ScaleSzie(140),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    margin: ScaleSzie(4),
    marginVertical: ScaleSzie(10),
  },
  image: {
    width: "100%",
    height: ScaleSzie(100),
  },
  img: {
    width: "100%",
    height: ScaleSzie(100),
    justifyContent: 'center',
    alignItems: 'center'
  },
  image_null: {
    width: "30%",
    height: "30%",
  },
  photo: {
    marginLeft: ScaleSzie(10),
    paddingVertical: ScaleSzie(10),
    width: "100%",
    flexDirection: "row",
  },
  name: {
    width: "80%",
    marginLeft: ScaleSzie(5),
    fontSize: ScaleSzie(11),
    color: "#9A9A9A",
  },
  ic: {
    width: ScaleSzie(20),
    height: ScaleSzie(20),
  },
  tick: {
    position: "absolute",
    top: ScaleSzie(3),
    right: ScaleSzie(3),
    backgroundColor: "#FFF",
    borderRadius: ScaleSzie(5),
  },
});

export default ItemPhoto;
