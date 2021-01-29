import { Text } from "@components";
import { scaleSzie } from "@utils";
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

const ItemPhoto = ({ item, selectImage, imageSelect }) => {
  const { merchantBannerId, title, imageUrl, selected } = item;

  const onSelected = () => {
    selectImage(merchantBannerId);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.container}
      onPress={onSelected}
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
        <Image style={{ marginTop: scaleSzie(1) }} source={IMAGE.Gallery_ic} />
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
    width: scaleSzie(140),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    margin: scaleSzie(4),
    marginVertical: scaleSzie(10),
  },
  image: {
    width: "100%",
    height: scaleSzie(100),
  },
  img: {
    width: "100%",
    height: scaleSzie(100),
    justifyContent: 'center',
    alignItems: 'center'
  },
  image_null: {
    width: "30%",
    height: "30%",
  },
  photo: {
    marginLeft: scaleSzie(10),
    paddingVertical: scaleSzie(10),
    width: "100%",
    flexDirection: "row",
  },
  name: {
    width: "80%",
    marginLeft: scaleSzie(5),
    fontSize: scaleSzie(11),
    color: "#9A9A9A",
  },
  ic: {
    width: scaleSzie(20),
    height: scaleSzie(20),
  },
  tick: {
    position: "absolute",
    top: scaleSzie(3),
    right: scaleSzie(3),
    backgroundColor: "#FFF",
    borderRadius: scaleSzie(5),
  },
});

export default ItemPhoto;
