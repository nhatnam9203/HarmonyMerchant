import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors, fonts, layouts } from "@shared/themes";
import { ColumnContainer, Header } from "../../components";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import ICON from "@resources";
import { SalonHomeContext } from "../../../SalonHomeContext";

export const CategoriesColumn = ({ items }) => {
  const { t } = useTranslation();
  const ctx = React.useContext(SalonHomeContext);
  const {
    categorySelected,
    onPressSelectCategory,
    onSelectGiftCard,
    isShowColProduct,
  } = ctx || {};

  const _renderCategory = ({ item, index }) => {
    return (
      <ItemCategory
        category={item}
        onPressSelectCategory={onPressSelectCategory}
        categorySelected={categorySelected}
      />
    );
  };

  const _renderGiftCard = () => {
    return (
      <ItemCategory
        category={{
          name: "Gift Card",
          categoryId: 1,
        }}
        onPressSelectCategory={onSelectGiftCard}
        // colorText={temptColorHeader}
        categorySelected={categorySelected}
      />
    );
  };

  const _renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: colors.VERY_LIGHT_PINK_E_5,
        }}
      />
    );
  };

  return (
    <ColumnContainer
      style={{ width: !isShowColProduct ? scaleWidth(260) : scaleWidth(120) }}
      highlight={!isShowColProduct}
      border={!isShowColProduct}
    >
      <Header label={t("Categories")} />
      <FlatList
        style={{ flex: 1 }}
        data={items}
        renderItem={_renderCategory}
        extraData={(item, index) => `${index}`}
        keyExtractor={(item, index) => `${item?.staffId}_${index}`}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={() => {}}
        ItemSeparatorComponent={_renderSeparator}
        ListFooterComponent={_renderGiftCard}
      />
    </ColumnContainer>
  );
};

const ItemCategory = ({
  category,
  onPressSelectCategory,
  colorText,
  categorySelected,
}) => {
  const backgroundColor =
    category.categoryId === categorySelected.categoryId
      ? colors.OCEAN_BLUE
      : category?.isSelect
      ? colors.AZURE
      : colors.WHITE;

  const textColor =
    category.categoryId === categorySelected.categoryId
      ? { color: "#fff" }
      : {};

  return (
    <TouchableOpacity
      onPress={() => onPressSelectCategory(category)}
      style={{
        minHeight: scaleHeight(80),
        justifyContent: "center",
        backgroundColor: backgroundColor,
        paddingLeft: scaleWidth(8),
      }}
    >
      <Text
        numberOfLines={2}
        style={[
          {
            fontFamily: fonts.REGULAR,
            fontSize: scaleFont(17),
            fontWeight: "normal",
            fontStyle: "normal",
            letterSpacing: -0.41,
            textAlign: "left",
            color: colors.GREYISH_BROWN,
          },
          colorText,
          textColor,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};
