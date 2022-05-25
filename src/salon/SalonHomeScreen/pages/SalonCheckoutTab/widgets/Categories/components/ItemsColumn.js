import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors, fonts, layouts } from "@shared/themes";
import { ColumnContainer } from "./ColumnContainer";
import { Header } from "./Header";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import ICON from "@resources";

export const ItemsColumn = ({ items, isShowCustomService }) => {
  const { t } = useTranslation();

  const _renderItem = () => {};

  const _renderItemSeparator = () => {
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

  const _renderHeaderComponent = () => {
    return isShowCustomService ? <View> </View> : <></>;
  };

  return (
    <ColumnContainer highlight={highlight} border={!highlight}>
      <Header label={t("Categories")} />
      <FlatList
        style={{ flex: 1 }}
        data={items}
        renderItem={_renderItem}
        extraData={(item, index) => `${index}`}
        keyExtractor={(item, index) => `${item?.staffId}_${index}`}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={() => {}}
        ItemSeparatorComponent={_renderItemSeparator}
        ListHeaderComponent={_renderHeaderComponent}
      />
    </ColumnContainer>
  );
};
