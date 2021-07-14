import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import FastImage from "react-native-fast-image";
import IMAGE from "@resources";
import { layouts } from "@shared/themes";

export const ProductOptionImage = ({
  width = scaleWidth(350),
  imageUrl,
  options,
}) => {
  const [optionsImages, setOptionsImages] = React.useState(null);

  React.useEffect(() => {
    if (!options?.length) {
      return;
    }

    let results = [];
    for (const opt of options) {
      const imageOpts = opt.values?.filter((x) => x.imageUrl) || [];
      results = results.concat(imageOpts);
    }

    if (results?.length > 0) {
      setOptionsImages(results);
    }
  }, [options]);

  return (
    <View style={[styles.container, { width }]}>
      <FastImage
        style={styles.defaultImageStyle}
        source={
          imageUrl
            ? {
                uri: imageUrl,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }
            : IMAGE.product_holder
        }
        resizeMode="contain"
      />
      {optionsImages && (
        <FlatList
          contentContainerStyle={styles.listOptionsImage}
          data={optionsImages}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <FastImage
                style={styles.imageStyle}
                source={
                  item?.imageUrl
                    ? {
                        uri: item?.imageUrl,
                        priority: FastImage.priority.high,
                        cache: FastImage.cacheControl.immutable,
                      }
                    : IMAGE.product_holder
                }
                resizeMode="contain"
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={layouts.marginVertical} />}
          horizontal={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
  },

  defaultImageStyle: { padding: scaleWidth(5), flex: 5 },
  imageStyle: {
    paddingHorizontal: scaleWidth(5),
    flex: 1,
  },
  itemContainer: {
    paddingHorizontal: scaleWidth(5),
    width: scaleWidth(120),
    height: scaleHeight(120),
  },
  listOptionsImage: {
    flex: 1,
    paddingHorizontal: scaleWidth(5),
  },
});
