import React from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import Collapsible from "react-native-collapsible";

import { scaleSzie } from "@utils";
import IMAGE from "@resources";
import { Button, Text } from "@components";
import StarRating from "react-native-star-rating";
import Stars from "react-native-stars";

const { width } = Dimensions.get("window");

const ItemHeader = ({ title = "", content = "", rating = "", isRating }) => {
  return (
    <View style={styles.container}>
      <View style={styles.padding}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
        <View style={styles.row}>
          <Text style={styles.rating}>{isRating ? parseFloat(rating/1).toFixed(1) : rating/1}</Text>
          {isRating && (
            <View style={{ marginLeft: scaleSzie(10) }}>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={rating / 1}
                fullStar={IMAGE.FullStar}
                emptyStar={IMAGE.EmptyStar}
                halfStar={IMAGE.HalfStar}
                starSize={15}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scaleSzie(160),
    height: scaleSzie(90),
    borderRadius: 6,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  padding: {
    padding: scaleSzie(10),
  },
  title: {
    fontSize: scaleSzie(15),
    fontWeight: "600",
    color: "#0764B0",
  },
  content: {
    fontSize: scaleSzie(10),
    color: "#6A6A6A",
    paddingVertical: scaleSzie(3),
  },
  rating: {
    fontSize: scaleSzie(25),
    fontWeight: "bold",
    color: "#404040",
    paddingVertical: scaleSzie(4),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ItemHeader;
