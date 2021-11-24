import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { colors, fonts, layouts } from "@shared/themes";
import FastImage from "react-native-fast-image";
import IMAGE from "@resources";
import { formatMoneyWithUnit } from "@utils";

export const CUSTOM_LIST_TYPES = {
  CAT: "Categories",
  SUB: "Subcategories",
  PRO: "Products",
};

export const CustomList = ({
  style,
  title,
  isActive = false,
  items,
  onPressRow,
  activeId,
  type,
  refreshData,
  renderMoreItem = () => {
    return null;
  },
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const onRefresh = () => {
    if (refreshData && typeof refreshData === "function") {
      setIsRefreshing(true);

      refreshData();

      setTimeout(() => {
        setIsRefreshing(false);
      }, 200);
    }
  };

  const renderHeader = () =>
    items ? (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    ) : null;

  const renderContent = (item, isFocus) => {
    switch (type) {
      case CUSTOM_LIST_TYPES.PRO:
        return (
          <>
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
            <View style={styles.productContent}>
              <Text style={styles.productName} numberOfLines={3}>
                {item?.name}
              </Text>
              <Text style={styles.productPrice}>{`${
                item?.priceRange ?? formatMoneyWithUnit(item?.price)
              }`}</Text>
            </View>
          </>
        );
      case CUSTOM_LIST_TYPES.CAT:
      default:
        return (
          <Text
            style={[
              styles.itemText,
              isFocus
                ? { color: colors.WHITE }
                : { color: colors.BROWNISH_GREY },
            ]}
          >
            {item?.name}
          </Text>
        );
    }
  };

  const renderItem = ({ item }) => {
    const onHandlePress = () => {
      if (onPressRow && typeof onPressRow === "function") {
        onPressRow(item);
      }
    };

    const isFocus = activeId === item.categoryId;

    return (
      <TouchableOpacity
        style={[
          styles.itemContent,
          isFocus
            ? { backgroundColor: colors.OCEAN_BLUE }
            : { backgroundColor: colors.WHITE },
        ]}
        onPress={onHandlePress}
      >
        {renderContent(item, isFocus)}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, isActive ? styles.active : styles.border]}>
      <View style={[styles.content, style, isActive && styles.shadow]}>
        <FlatList
          data={items}
          style={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderMoreItem}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${index}`}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  active: {
    flex: 3,
    borderWidth: scaleWidth(0),
    zIndex: 100,
  },

  container: {
    flex: 2,
    zIndex: 1,
  },

  content: { flex: 1, backgroundColor: colors.WHITE },

  shadow: {
    shadowColor: "#40404080",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 6,
  },

  border: {
    borderStyle: "solid",
    borderWidth: scaleWidth(1),
    borderRightColor: "#dddddd",
    borderLeftColor: "#fff",
    borderTopColor: "#dddddd",
  },

  listContent: { flex: 1 },

  header: {
    height: scaleHeight(48),
    backgroundColor: colors.VERY_LIGHT_PINK_1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  itemContent: {
    height: scaleHeight(80),
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: scaleWidth(10),
  },

  itemText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.BROWNISH_GREY,
  },

  imageStyle: {
    width: scaleWidth(60),
    height: scaleHeight(60),
  },

  productName: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(15),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },

  productPrice: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(14),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: -0.34,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  productContent: {
    flex: 1,
    marginLeft: scaleWidth(10),
  },
});
