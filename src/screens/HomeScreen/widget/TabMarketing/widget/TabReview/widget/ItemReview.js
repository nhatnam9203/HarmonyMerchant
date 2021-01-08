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

const ItemReview = ({ item }) => {
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

        <Text style={[styles.text, { width: "45%" }]}>{review}</Text>
        <View style={{ width: "8%" }}>
          <Stars
            display={1.7}
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
});

export default ItemReview;
