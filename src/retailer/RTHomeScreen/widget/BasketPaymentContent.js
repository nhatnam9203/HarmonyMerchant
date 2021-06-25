import { basketRetailer } from "@redux/slices";
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
  Image,
} from "react-native";
import FastImage from "react-native-fast-image";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useDispatch, useSelector } from "react-redux";
import { ButtonGradient } from "@shared/components";
import IMAGE from "@resources";
import _ from "lodash";

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
      onDiscountAdd
    },
    ref
  ) => {
    const [t] = useTranslation();
    const dispatch = useDispatch();
    const [buttonTittle, setButtonTittle] = React.useState();
    const [isAcceptPay, setIsAcceptPay] = React.useState(false);
    const [disable, setDisable] = React.useState(false);

    /**
  |--------------------------------------------------
  | API
  |--------------------------------------------------
  */
    log(orderItem, "orderItem");
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
      // console.log(`changeButtonDone ${changeButtonDone}`);
      // console.log(`isCancelHarmonyPay ${isCancelHarmonyPay}`);
      // console.log(`isAcceptPay ${isAcceptPay}`);
      // console.log(`paymentSelected ${paymentSelected}`);

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
      // console.log(`groupAppointment ${JSON.stringify(groupAppointment)}`);

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

    // React.useImperativeHandle(ref, () => ({
    //   canCreateOrder: () => {},
    // }));

    const renderItem = ({ item }) => {
      // const onHandleDeleteItem = () => {
      //   dispatch(basketRetailer.removeBasketItem(item.id));
      // };

      return (
        <View style={styles.productItem} key={item.id + ""}>
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
            <Text style={styles.totalInfoText}>{item?.description}</Text>
          </View>
          <Text style={styles.productItemQuantity}>{`${item.quantity} ${t(
            "items"
          )}`}</Text>
          <View style={layouts.marginHorizontal} />
          <View style={layouts.marginHorizontal} />
          <Text style={styles.productItemPrice}>
            {formatMoneyWithUnit(item.price)}
          </Text>
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          data={orderItem?.products}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.id + ""}
        />
        <View style={styles.line} />
        <View style={styles.totalContent}>
          <View style={layouts.marginVertical} />
          <View style={layouts.marginVertical} />
          <TotalInfo
            label={t("Subtotal")}
            value={formatMoneyWithUnit(orderItem?.subTotal)}
          />
          <TotalInfo
            label={t("Tax")}
            value={formatMoneyWithUnit(orderItem?.tax)}
          />
          <TotalInfo
            label={t("Discount")}
            value={formatMoneyWithUnit(orderItem?.discount)}
          >
            <View style={layouts.marginHorizontal} />
            <TouchableOpacity onPress={onDiscountAdd}>
              <Image
                source={IMAGE.add_discount_checkout}
                style={styles.iconStyle}
              />
            </TouchableOpacity>
          </TotalInfo>
          <View style={layouts.marginVertical} />
          <View style={styles.line} />
          <View style={layouts.marginVertical} />
          <TotalInfo
            label={t("Total")}
            value={formatMoneyWithUnit(orderItem?.total)}
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
    height: scaleHeight(30),
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
    width: scaleWidth(24),
    height: scaleHeight(24),
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

  totalLabel: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});
