import IMAGE from "@resources";
import { ButtonGradient } from "@shared/components";
import { colors, fonts, layouts } from "@shared/themes";
import { calcTotalPriceOfProduct } from "@shared/utils";
import { formatMoneyWithUnit } from "@utils";
import _ from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import FastImage from "react-native-fast-image";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useDispatch } from "react-redux";
import { groupBy } from "lodash";

const log = (obj, message = "") => {
  Logger.log(`[BasketContentView] ${message}`, obj);
};

export const BasketPaymentContent = React.forwardRef(
  (
    {
      onHadSubmitted,
      orderItem,
      paymentSelected,
      changeButtonDone,
      isDonePayment,
      isCancelHarmonyPay,
      cancelHarmonyPayment,
      payBasket,
      groupAppointment,
      finishedHandle,
      onDiscountAdd,
      onTipAdd,
      switchTax,
      isTax,
      onDiscountItemAdd,
    },
    ref
  ) => {
    const [t] = useTranslation();
    const dispatch = useDispatch();
    const [buttonTittle, setButtonTittle] = React.useState();
    const [isAcceptPay, setIsAcceptPay] = React.useState(false);
    const [disable, setDisable] = React.useState(false);
    const [items, setItems] = React.useState(null);

    /**
  |--------------------------------------------------
  | API
  |--------------------------------------------------
  */
    const calcTotalPrice = () => {
      return (
        orderItem?.products?.reduce(
          (accumulator, product) =>
            accumulator + calcTotalPriceOfProduct(product),
          0
        ) ?? 0
      );
    };

    const onHandlePay = () => {
      if (changeButtonDone && isCancelHarmonyPay) {
        if (paymentSelected === "HarmonyPay") {
          cancelHarmonyPayment();
        } else {
          finishedHandle();
        }
      } else if (changeButtonDone && isDonePayment) {
        finishedHandle();
      } else if (
        paymentSelected === "" ||
        paymentSelected === "Gift Card" ||
        !isAcceptPay
      ) {
      } else {
        payBasket();
      }
    };

    React.useEffect(() => {
      if (changeButtonDone && isCancelHarmonyPay) {
        if (paymentSelected === "HarmonyPay") {
          setButtonTittle(t("CANCEL"));
          setDisable(false);
        } else {
          setButtonTittle(t("DONE"));
          setDisable(false);
        }
      } else if (changeButtonDone && isDonePayment) {
        setButtonTittle(t("DONE"));
        setDisable(false);
      } else if (
        paymentSelected === "" ||
        paymentSelected === "Gift Card" ||
        !isAcceptPay
      ) {
        setButtonTittle(t("PAY"));
        setDisable(true);
      } else {
        setButtonTittle(t("PAY"));
        setDisable(false);
      }
    }, [changeButtonDone, isCancelHarmonyPay, isAcceptPay, paymentSelected]);

    React.useEffect(() => {
      let isAccept = !_.isEmpty(groupAppointment)
        ? groupAppointment.total && parseFloat(groupAppointment.total) > 0
          ? true
          : false
        : orderItem?.products?.length > 0
        ? true
        : false;

      isAccept = paymentSelected === "Cash" ? true : isAccept;

      setIsAcceptPay(isAccept);
    }, [groupAppointment, paymentSelected, orderItem]);

    React.useEffect(() => {
      if (orderItem?.products?.length > 0 || orderItem?.giftCards?.length > 0) {
        // const temps = orderItem.products?.reduce((previous, x) => {
        //   let groups = previous ?? [];
        //   const keyUnique = x.productName + " + " + x.value;

        //   const isExitIdx = groups.findIndex((g) => g.key === keyUnique);

        //   if (isExitIdx >= 0) {
        //     const existItem = groups[isExitIdx];
        //     groups[isExitIdx] = Object.assign({}, existItem, {
        //       value: [...existItem.value, x],
        //     });
        //   } else {
        //     groups.push({ key: keyUnique, value: [x] });
        //   }

        //   return groups;
        // }, []);

        // const giftCardTemps = orderItem.giftCards?.reduce((previous, x) => {
        //   let groups = previous ?? [];
        //   const keyUnique = x.giftCardId + "";

        //   const isExitIdx = groups.findIndex((g) => g.key === keyUnique);

        //   if (isExitIdx >= 0) {
        //     const existItem = groups[isExitIdx];
        //     groups[isExitIdx] = Object.assign({}, existItem, {
        //       value: [...existItem.value, x],
        //     });
        //   } else {
        //     groups.push({ key: keyUnique, value: [x] });
        //   }

        //   return groups;
        // }, []);

        setItems([
          ...(orderItem?.products?.map((x) =>
            Object.assign({}, x, { key: x.bookingProductId })
          ) || []),
          ...(orderItem?.giftCards?.map((x) =>
            Object.assign({}, x, { key: x.bookingGiftCardId })
          ) || []),
        ]);
      } else {
        setItems(null);
      }
    }, [orderItem]);

    // React.useImperativeHandle(ref, () => ({
    //   canCreateOrder: () => {},
    // }));

    const renderItem = ({ item }) => {
      // const firstItem = item.value[0];
      // const qty = item.value?.reduce((prev, cur) => prev + cur.quantity, 0);

      const onHandleAddDiscount = () => {
        if (!item.bookingProductId) return;
        if (onDiscountItemAdd && typeof onDiscountItemAdd === "function") {
          onDiscountItemAdd(item);
        }
      };
      return (
        <TouchableOpacity onPress={onHandleAddDiscount}>
          <View style={styles.productItem} key={item.key + ""}>
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
              <Text style={styles.totalText}>
                {item?.productName ?? item?.name}
              </Text>
              <Text style={styles.totalInfoText}>{item?.value}</Text>
              <View style={layouts.marginVertical} />

              {item?.discount && (
                <Text
                  style={styles.totalInfoText}
                >{`Discount: ${formatMoneyWithUnit(item?.discount)}`}</Text>
              )}
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
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          data={items}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.key + ""}
        />
        <View style={styles.line} />
        <View style={styles.totalContent}>
          <View style={layouts.marginVertical} />
          <View style={layouts.marginVertical} />
          <TotalInfo
            label={t("Subtotal")}
            value={formatMoneyWithUnit(groupAppointment?.subTotal)}
          />
          {/* ---- Tax --- */}
          <View style={styles.totalInfoContent}>
            <View style={styles.taxRow}>
              <Text style={styles.totalInfoText}>{t("Tax")}</Text>
              <Switch
                style={{ marginLeft: scaleWidth(15) }}
                trackColor={{ false: "#767577", true: "#0764B0" }}
                ios_backgroundColor="#E5E5E5"
                onValueChange={switchTax}
                value={isTax ? true : false}
              />
            </View>
            <Text style={styles.priceInfoText}>
              {formatMoneyWithUnit(groupAppointment?.tax)}
            </Text>
          </View>

          <TotalInfo
            label={t("Discount")}
            value={formatMoneyWithUnit(groupAppointment?.discount)}
          >
            <View style={layouts.marginHorizontal} />
            <TouchableOpacity onPress={onDiscountAdd}>
              <Image
                source={IMAGE.add_discount_checkout}
                style={styles.iconStyle}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </TotalInfo>
          <View style={layouts.marginVertical} />
          <TotalInfo
            label={t("Tip")}
            value={formatMoneyWithUnit(groupAppointment?.tipAmount)}
          >
            <View style={layouts.marginHorizontal} />
            <TouchableOpacity onPress={onTipAdd}>
              <Image
                source={IMAGE.add_discount_checkout}
                style={styles.iconStyle}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </TotalInfo>
          <View style={layouts.marginVertical} />
          {groupAppointment?.shippingFee >= 0 && (
            <TotalInfo
              label={t("Shipping Fee")}
              value={formatMoneyWithUnit(groupAppointment?.shippingFee)}
            />
          )}
          <View style={layouts.marginVertical} />
          <View style={styles.line} />
          <View style={layouts.marginVertical} />
          <TotalInfo
            label={t("Total")}
            value={formatMoneyWithUnit(groupAppointment?.total)}
            isBold
          />
          <View style={layouts.marginVertical} />
        </View>
        <View style={layouts.center}>
          <ButtonGradient
            disable={disable}
            label={buttonTittle ?? t("PAY")}
            width={scaleWidth(400)}
            height={scaleHeight(60)}
            fontSize={scaleFont(25)}
            textColor={colors.WHITE}
            onPress={onHandlePay}
          />
        </View>
      </View>
    );
  }
);

const TotalInfo = ({ label, value = "$ 0.00", isBold = false, children }) => (
  <View style={styles.totalInfoContent}>
    <View style={styles.totalLabel}>
      <Text style={isBold ? styles.totalText : styles.totalInfoText}>
        {label}
      </Text>
      {children}
    </View>
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
    height: scaleHeight(35),
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

  iconStyle: {
    width: scaleWidth(20),
    height: scaleHeight(20),
  },

  productItem: {
    flexDirection: "row",
    minHeight: scaleHeight(60),
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

  totalLabel: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  taxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
