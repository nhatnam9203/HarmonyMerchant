import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';

export const ProductOptionImage = ({
  width = scaleWidth(300),
  imageUrl,
  options,
}) => {
  const [colorOptions, setColorOptions] = React.useState(null);

  React.useEffect(() => {
    if (!options?.length) {
      return;
    }
    const colorOpt = options?.find((x) => x.label === 'Color');
    // console.log(colorOpt);
    if (colorOpt) {
      setColorOptions(colorOpt?.values);
    }
  }, [options]);
  return (
    <View style={[styles.container, { width }]}>
      <FastImage
        style={[styles.imageStyle, { width: width, height: width }]}
        source={{
          uri: imageUrl,
          priority: FastImage.priority.high,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode="contain"
      />
      {colorOptions && (
        <FlatList
          data={colorOptions}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <FastImage
                style={[
                  styles.imageStyle,
                  { width: width / 3, height: width / 3 },
                ]}
                source={{
                  uri: item?.imageUrl,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
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
  container: { justifyContent: 'flex-start' },
  imageStyle: {},
});
