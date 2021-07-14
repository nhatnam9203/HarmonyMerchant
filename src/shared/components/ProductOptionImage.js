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
  const [colorOptions, setColorOptions] = React.useState(null);

  React.useEffect(() => {
    if (!options?.length) {
      return;
    }
    const colorOpt = options?.find((x) => x.label === "Color");
    if (colorOpt) {
      setColorOptions(colorOpt?.values);
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
      <View style={layouts.marginVertical} />
      {colorOptions && (
        <FlatList
          style={styles.listOptionsImage}
          data={colorOptions}
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
          numColumns={3}
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

  defaultImageStyle: { paddingHorizontal: scaleWidth(5), flex: 2 },
  imageStyle: { paddingHorizontal: scaleWidth(5), flex: 1 },
  itemContainer: { paddingHorizontal: scaleWidth(5), flex: 1 },
  listOptionsImage: { flex: 1, paddingHorizontal: scaleWidth(5) },
});
