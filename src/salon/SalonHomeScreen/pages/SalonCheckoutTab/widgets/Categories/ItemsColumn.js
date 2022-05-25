import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors, fonts, layouts } from "@shared/themes";
import { ColumnContainer, Header } from "./components";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import ICON from "@resources";
import ItemProductService from "./components/ItemProductService";

export const ItemsColumn = ({
  items,
  isShowCustomService,
  isShowColAmount = false,
  productSeleted,
  categoryTypeSelected,
  groupAppointment,
  showCustomServiceAmount,
  showColAmount,
  categorySelected,
  customService,
}) => {
  const { t } = useTranslation();
  const temptColorHeader = isShowColAmount ? { color: "#6A6A6A" } : {};
  const tempTitle =
    categoryTypeSelected === "Service" ? "Services" : "Products";

  const getItemKey = (item) => `${item?.serviceId ?? item?.productId}`;

  const _renderItem = ({ item, index }) => {
    const key = getItemKey(item);

    return (
      <ItemProductService
        key={key}
        item={item}
        index={index}
        colorText={temptColorHeader}
        itemSelected={productSeleted}
        categoryTypeSelected={categoryTypeSelected}
        isShowColAmount={isShowColAmount}
        groupAppointment={groupAppointment}
        showColAmount={showColAmount}
      />
    );
  };

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
    return isShowCustomService ? (
      <ItemProductService
        key="custom_service"
        index={-1}
        item={Object.assign({}, customService, {
          name: "Custom service",
          category: categorySelected,
        })}
        defaultThumb={ICON.custom_service_thumb}
        colorText={temptColorHeader}
        itemSelected={productSeleted}
        categoryTypeSelected={categoryTypeSelected}
        isShowColAmount={isShowColAmount}
        groupAppointment={groupAppointment}
        showColAmount={showCustomServiceAmount}
      />
    ) : (
      <></>
    );
  };

  return (
    <ColumnContainer
      style={{ width: scaleWidth(260) }}
      highlight={!isShowColAmount}
      border={isShowColAmount}
    >
      <Header label={t(tempTitle)} />
      <FlatList
        style={{ flex: 1 }}
        data={items}
        renderItem={_renderItem}
        extraData={(item, index) => `${index}`}
        keyExtractor={getItemKey}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={() => {}}
        ItemSeparatorComponent={_renderItemSeparator}
        ListHeaderComponent={_renderHeaderComponent}
      />
    </ColumnContainer>
  );
};
