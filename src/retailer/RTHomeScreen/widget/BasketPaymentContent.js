import IMAGE from "@resources";
import { ButtonGradient } from "@shared/components";
import { WithPopupPermission } from "@shared/HOC/withPopupPermission";
import { useConfirmAppointment } from "@shared/services/api/retailer";
import { colors, fonts, layouts } from "@shared/themes";
import { calcTotalPriceOfProduct } from "@shared/utils";
import { formatMoneyWithUnit, menuTabs } from "@utils";
import _ from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useDispatch } from "react-redux";

const log = (obj, message = "") => {
  Logger.log(`[BasketContentView] ${message}`, obj);
};

const ButtonPermissionDiscount = WithPopupPermission(TouchableOpacity);
const SwitchPermissionTax = WithPopupPermission(Switch);

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
      isDidNotPay,
      didNotPayComplete,
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
    const [, confirmAppointment] = useConfirmAppointment();

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
      try {
        if (isDidNotPay) {
          // console.log(groupAppointment);
          // TODO: mới làm cho trường hợp 1 appointment
          if (groupAppointment?.appointments?.length > 0) {
            const appointment = groupAppointment?.appointments[0];
            const params = {
              // shippingAmount: 0,
              billingAddressId: appointment.billingAddressId,
              shippingAddressId: appointment.shippingAddressId,
              didNotPay: isDidNotPay,
            };

            confirmAppointment(params, appointment.appointmentId);

            didNotPayComplete();
          }

          return;
        }

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
      } catch (e) {
        console.log(e);
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

    const renderItem = ({ item }) => {

      const onHandleAddDiscount = () => {
        if (!item.bookingProductId) return;
        if (onDiscountItemAdd && typeof onDiscountItemAdd === "function") {
          onDiscountItemAdd(item);
        }
      };

      const discounts = _.map(_.get(item, "discounts"), (itemDiscount) => {
        const type =
          itemDiscount?.type == "Item" ? "Discount Item:" : "Promotion:";
        const value = _.get(itemDiscount, "value");
        return `${type} ${formatMoneyWithUnit(value)}`;
      });

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
                <View>
                  <Text style={styles.totalInfoText}>
                    {`Discount: ${formatMoneyWithUnit(item?.discount)}`}
                  </Text>
                  {item?.discounts?.length > 0 && (
                    <Text style={styles.descriptionText}>
                      {`(${discounts.toString()})`}
                    </Text>
                  )}
                </View>
              )}
            </View>
            <View
              style={{
                width: scaleWidth(70),
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <Text style={styles.productItemQuantity}>{`${item?.quantity} ${t(
                "items"
              )}`}</Text>
            </View>
            <View style={layouts.marginHorizontal} />
            <View
              style={{
                width: scaleWidth(80),
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <Text style={styles.productItemPrice}>
                {formatMoneyWithUnit(item?.price)}
              </Text>
            </View>
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
              <SwitchPermissionTax
                style={{ marginLeft: scaleWidth(15) }}
                trackColor={{ false: "#767577", true: "#0764B0" }}
                ios_backgroundColor="#E5E5E5"
                value={isTax ? true : false}
                tabName={menuTabs.CHECKOUT_DISCOUNT}
                onPermission={switchTax}
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
            <ButtonPermissionDiscount
              onPermission={onDiscountAdd}
              tabName={menuTabs.CHECKOUT_DISCOUNT}
            >
              <Image
                source={IMAGE.add_discount_checkout}
                style={styles.iconStyle}
                resizeMode="contain"
              />
            </ButtonPermissionDiscount>
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
            disable={disable && !isDidNotPay}
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
  descriptionText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(12),
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

  icon: {
    marginRight: scaleWidth(8),
    resizeMode: "contain",
  },
});
