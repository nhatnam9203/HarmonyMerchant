import React from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { scaleSzie } from "@utils";
import IMAGE from "@resources";
import { Button, Text } from "@components";
import moment from "moment";
import Stars from "react-native-stars";

const { width } = Dimensions.get("window");

const images = [
  {
    url: "",
  },
  {
    url: "",
  },
  {
    url: "",
  },
  {
    url: "",
  },
  {
    url: "",
  },
  {
    url: "",
  },
  {
    url: "",
  },
];

const ItemReview = ({ item, openImage }) => {
  const { date, customer, review, rating, actions } = item;

  const checkActions = () => {
    switch (actions) {
      case "Show":
        return { color: "#0764B0" };
      case "Hide":
        return { color: "#FF3B30" };
      default:
        break;
    }
  };

  function renderImage() {
    return images.slice(0, 5).map((obj, index) =>
      index === 4 ? (
        <TouchableOpacity key={index} style={{ marginRight: 5 }} onPress={openImage}>
          <Image
            style={[styles.img, { opacity: 0.4 }]}
            source={{
              uri: "https://reactnative.dev/img/tiny_logo.png",
            }}
          />
          <View style={styles.extImg}>
            <Text style={styles.extText}>+{images.length - 5}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity key={index} style={{ marginRight: 5 }} onPress={openImage}>
          <Image
            style={styles.img}
            source={{
              uri: "https://reactnative.dev/img/tiny_logo.png",
            }}
          />
        </TouchableOpacity>
      )
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.padding}>
        <View style={{ width: "12%" }}>
          <Text style={[styles.text]}>
            {moment(new Date()).format("MM/DD/YYYY")}
          </Text>
          <Text style={[styles.text]}>
            {moment(new Date()).format("h:mm A")}
          </Text>
        </View>
        <View style={{ width: "15%" }}>
          <Text style={[styles.text, { color: "#0764B0", fontWeight: "500" }]}>
            {customer}
          </Text>
          <Text style={[styles.text, { color: "#0764B0", fontWeight: "500" }]}>
            {customer}
          </Text>
        </View>

        <View style={{ width: "45%" }}>
          <Text style={[styles.text]}>{review}</Text>
          <View style={[styles.row, { marginTop: 8 }]}>{renderImage()}</View>
        </View>

        <View style={{ width: "8%" }}>
          <Stars
            display={rating}
            spacing={2}
            count={5}
            starSize={15}
            color={"#B1b1b1"}
            fullStar={IMAGE.FullStar}
            emptyStar={IMAGE.EmptyStar}
          />
        </View>
        <View style={{ width: "12%" }} />
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: checkActions().color }]}
          // onPress={openImage}
        >
          <Text style={[styles.text, { color: "#FFF" }]}>{actions}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",

    marginBottom: 1,
  },
  padding: {
    padding: scaleSzie(15),
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
  },
  text: {
    color: "#6A6A6A",
    fontSize: scaleSzie(12),
  },
  btn: {
    width: scaleSzie(60),
    height: scaleSzie(25),
    backgroundColor: "#0764B0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 1,
  },
  img: {
    width: scaleSzie(25),
    height: scaleSzie(25),
  },
  extImg: {
    position: "absolute",
    top: scaleSzie(5),
    left: scaleSzie(4),
  },
  extText: {
    color: "#000",
    fontSize: scaleSzie(12),
  },
});

export default ItemReview;
