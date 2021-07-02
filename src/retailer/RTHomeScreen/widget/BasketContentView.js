import IMAGE from "@resources";
import { ButtonGradient } from "@shared/components";
import { colors, fonts, layouts } from "@shared/themes";
import {
  calcTotalPriceOfProduct,
  createSubmitAppointment,
} from "@shared/utils";
import { formatMoneyWithUnit } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useDispatch, useSelector } from "react-redux";

const log = (obj, message = "") => {
  Logger.log(`[BasketContentView] ${message}`, obj);
};

export const BasketContentView = React.forwardRef(
  ({ onHadSubmitted, onRemoveItem }, ref) => {
    const [t] = useTranslation();
    const dispatch = useDispatch();
    const basketProducts = useSelector(
      (state) => state.basketRetailer.products
    );
    const appointment = useSelector(
      (state) => state.basketRetailer.appointment
    );

    /**
  |--------------------------------------------------
  | API
  |--------------------------------------------------
  */

    const calcTotalPrice = () => {
      return (
        basketProducts?.reduce(
          (accumulator, product) =>
            accumulator + calcTotalPriceOfProduct(product),
          0
        ) ?? 0
      );
    };

    const onHandleCreateOrder = () => {
      const submitValues = createSubmitAppointment(basketProducts);
      onHadSubmitted(submitValues);
    };

    React.useImperativeHandle(ref, () => ({
      canCreateOrder: () => {
        return basketProducts?.length > 0;
      },
    }));

    const renderItem = ({ item }) => {
      const onHandleDeleteItem = () => {
        // dispatch(basketRetailer.removeBasketItem(item.id));
        if (onRemoveItem && typeof onRemoveItem === "function") {
          onRemoveItem(item);
        }
      };

      return (
        <ProductItem key={item.id + ""} handleDelete={onHandleDeleteItem}>
          <View style={styles.productItem}>
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

            <View style={layouts.marginHorizontal} />
            <View style={styles.productItemContent}>
              <Text style={styles.totalText}>{item?.productName}</Text>
              <Text style={styles.totalInfoText}>{item?.value}</Text>
            </View>
            <Text style={styles.productItemQuantity}>{`${item?.quantity} ${t(
              "items"
            )}`}</Text>
            <View style={layouts.marginHorizontal} />
            <View style={layouts.marginHorizontal} />
            <Text style={styles.productItemPrice}>
              {formatMoneyWithUnit(item?.price)}
            </Text>
          </View>
        </ProductItem>
      );
    };

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          data={appointment?.products}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.id + ""}
        />
        <View style={styles.totalContent}>
          <View style={layouts.marginVertical} />
          <TotalInfo
            label={t("Subtotal")}
            value={formatMoneyWithUnit(appointment?.subTotal)}
          />
          <TotalInfo
            label={t("Tax")}
            value={formatMoneyWithUnit(appointment?.tax)}
          />
          <TotalInfo
            label={t("Discount")}
            value={formatMoneyWithUnit(appointment?.discount)}
          />
          <View style={layouts.marginVertical} />
          <View style={styles.line} />
          <View style={layouts.marginVertical} />
          <TotalInfo
            label={t("Total")}
            value={formatMoneyWithUnit(appointment?.total)}
            isBold
          />
          <View style={layouts.marginVertical} />
        </View>
        <View style={layouts.center}>
          <ButtonGradient
            disable={!appointment || appointment?.products?.length <= 0}
            label={t("CREATE ORDER")}
            width={scaleWidth(400)}
            height={scaleHeight(60)}
            fontSize={scaleFont(25)}
            textColor={colors.WHITE}
            onPress={onHandleCreateOrder}
          />
        </View>
      </View>
    );
  }
);

const TotalInfo = ({ label, value = "$ 0.00", isBold = false }) => (
  <View style={styles.totalInfoContent}>
    <Text style={isBold ? styles.totalText : styles.totalInfoText}>
      {label}
    </Text>
    <Text style={isBold ? styles.priceText : styles.priceInfoText}>
      {value}
    </Text>
  </View>
);

const ProductItem = ({ children, handleDelete }) => {
  const rightSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 20],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
    return (
      <TouchableOpacity
        style={styles.rightAction}
        onPress={handleDelete}
        activeOpacity={0.6}
      >
        <Animated.Text style={styles.actionText}>X</Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      renderRightActions={rightSwipe}
      containerStyle={styles.rightSwipe}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flatList: {
    flex: 1,
  },

  totalContent: {
    marginHorizontal: scaleWidth(12),
  },
  totalInfoContent: {
    flexDirection: "row",
    height: scaleHeight(25),
    alignItems: "center",
    justifyContent: "space-between",
  },

  totalInfoText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  totalText: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(17),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  priceInfoText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "right",
    color: colors.WEIRD_GREEN,
  },

  priceText: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(17),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "right",
    color: colors.WEIRD_GREEN,
  },

  line: {
    height: 1,
    borderRadius: 1,
    backgroundColor: "#dddddd",
  },

  imageStyle: {
    width: scaleWidth(36),
    height: scaleHeight(36),
  },

  productItem: {
    flexDirection: "row",
    height: scaleHeight(60),
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: scaleWidth(12),
    backgroundColor: "#fff",
  },

  productItemContent: {
    flex: 1,
  },

  productItemPrice: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(14),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: -0.34,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  productItemQuantity: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(14),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  separator: { height: scaleHeight(1), backgroundColor: "#eeeeee" },

  rightAction: {
    backgroundColor: "#FF3B30",
    width: scaleWidth(40),
    justifyContent: "center",
    alignItems: "center",
  },

  actionText: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(17),
    fontWeight: "bold",
    color: colors.WHITE,
  },

  rightSwipe: {
    paddingRight: scaleWidth(4),
    backgroundColor: "#FF3B30",
  },
});
