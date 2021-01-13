import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { scaleSzie,formatWithMoment } from "@utils";
import IMAGE from "@resources";
import { Button, Text } from "@components";
import moment from "moment";
import StarRating from "react-native-star-rating";
import FastImage from "react-native-fast-image";

const { width } = Dimensions.get("window");

const ItemReview = ({ item, openImage, isVisibleReview }) => {
  const {
    createdDate,
    user,
    message,
    rating,
    isDisabled,
    ratingImages,
    staffRatingId,
  } = item;
  const checkActions = () => {
    switch (isDisabled) {
      case 0:
        return { color: "#0764B0", content: "Show" };
      case 1:
        return { color: "#FF3B30", content: "Hidden" };
      default:
        return { color: "#0764B0" };
    }
  };

  const onDisableReview = () => {
    isVisibleReview(isDisabled, staffRatingId);
  };

  const setImage = (index) => {
    openImage(ratingImages, index);
  };

  function renderImage() {
    return ratingImages.slice(0, 5).map((obj, index) =>
      index === 4 ? (
        <TouchableOpacity
          key={index}
          style={{ marginRight: 5 }}
          onPress={() => setImage(index)}
        >
          <FastImage
            style={[styles.img, { opacity: 0.4 }]}
            source={{
              uri: obj.imageUrl,
              headers: { Authorization: "someAuthToken" },
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <View style={styles.extImg}>
            <Text style={styles.extText}>+{ratingImages.length - 5}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          key={index}
          style={{ marginRight: 5 }}
          onPress={() =>setImage(index)}
        >
          <FastImage
            style={[styles.img]}
            source={{
              uri: obj.imageUrl,
              headers: { Authorization: "someAuthToken" },
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.stretch}
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
            {formatWithMoment(createdDate,"MM/DD/YYYY")}
          </Text>
          <Text style={[styles.text]}>
            {formatWithMoment(createdDate, "h:mm A")}
          </Text>
        </View>
        <View style={{ width: "15%" }}>
          <Text style={[styles.text, { color: "#0764B0", fontWeight: "500" }]}>
            {user?.name || ""}
          </Text>
          {/* <Text style={[styles.text, { color: "#0764B0", fontWeight: "500" }]}>
            {customer}
          </Text> */}
        </View>

        <View style={{ width: "45%" }}>
          <Text style={[styles.text]}>{message}</Text>
          <View style={[styles.row, { marginTop: 8 }]}>{renderImage()}</View>
        </View>

        <View style={{ width: "8%" }}>
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
        <View style={{ width: "12%" }} />
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: checkActions().color }]}
          onPress={onDisableReview}
        >
          <Text style={[styles.text, { color: "#FFF" }]}>
            {checkActions().content}
          </Text>
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
