import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ColumnContainer, Header } from "../../widgets";
import ItemAmount from "../../widgets/ItemAmount";
import ItemExtra from "../../widgets/ItemExtra";

export const ExtraAmountColumn = ({
  isShowColAmount = false,
  productSeleted,
  categoryTypeSelected,
  groupAppointment,
  categorySelected,
  getExtrasFromRedux,
  onPressSelectExtra,
  arrSelectedExtra,
  addAmount,
}) => {
  const { t } = useTranslation();
  const amountRef = React.useRef(null);

  const temptHeader =
    categorySelected.categoryType === "Service" ? "Extra" : "Amount";

  const _renderItem = ({ item, index }) => {
    return (
      <ItemExtra
        key={index}
        extra={item}
        onPressSelectExtra={onPressSelectExtra}
        arrSelectedExtra={arrSelectedExtra}
        groupAppointment={groupAppointment}
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
    return <></>;
  };

  const data = getExtrasFromRedux(productSeleted);

  return (
    <ColumnContainer
      style={{ width: scaleWidth(260) }}
      highlight={!isShowColAmount}
      border={false}
    >
      <Header label={t(temptHeader)} />
      {categoryTypeSelected === "Product" ? (
        <ItemAmount ref={amountRef} price={productSeleted?.price} />
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={data}
          renderItem={_renderItem}
          extraData={(item, index) => `${index}`}
          keyExtractor={(item, index) => `${index}`}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={() => {}}
          ItemSeparatorComponent={_renderItemSeparator}
          //   ListHeaderComponent={_renderHeaderComponent}
        />
      )}

      {/* ------- Footer -------- */}
      <TouchableOpacity
        style={styles.button}
        backgroundColor="#F1F1F1"
        title={t("ADD")}
        textColor="#6A6A6A"
        onPress={addAmount}
      >
        <Text style={styles.buttonText}>{t("ADD")}</Text>
      </TouchableOpacity>
    </ColumnContainer>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 3,
    backgroundColor: colors.OCEAN_BLUE,
    width: scaleWidth(240),
    height: scaleHeight(60),
    ...layouts.center,
    marginVertical: scaleHeight(10),
    alignSelf: "center",
  },

  buttonText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(25),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: -0.6,
    textAlign: "center",
    color: colors.WHITE,
  },
});
