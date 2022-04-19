import {
  ButtonGradient,
  FormInputAmount,
  SwitchLabel,
} from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { useGetProducts } from "@shared/services/api/retailer";
import { colors, fonts } from "@shared/themes";
import { statusSuccess } from "@shared/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { InputMoney } from "@shared/components";
import { formatNumberFromCurrency, formatMoney } from "@utils";

export const DialogEditProductOrder = React.forwardRef(
  ({ onEditProductItem, isApplyCostPrice }, ref) => {
    const dispatch = useDispatch();
    const [t] = useTranslation();
    const dialogRef = React.useRef(null);
    const scrollRef = React.useRef(null);

    const { isCheckQty = false } =
      useSelector((state) => state.dataLocal.profile) || {};

    const [amount, setAmount] = React.useState(0);
    const [quantity, setQuantity] = React.useState(1);
    const [productItem, setProductItem] = React.useState(null);
    const [maxCountQty, setMaxCountQty] = React.useState(10);
    const [applyToCost, setApplyToCost] = React.useState(false);
    const [sourceItem, setSourceItem] = React.useState(null);

    /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
    const [productsGet, getProducts] = useGetProducts();

    React.useImperativeHandle(ref, () => ({
      show: (item) => {
        dialogRef.current?.show();
        setSourceItem(null);
        setQuantity(item.quantity ?? 1);
        setAmount(item.price ?? 0);
        setProductItem(item);
        getProducts(item.productId);
      },
      hide: () => {
        dialogRef.current?.hide();
      },
    }));

    const _scrollToInput = (reactNode) => {
      // Add a 'scroll' ref to your ScrollView
      scrollRef.current?.scrollToFocusedInput(reactNode);
    };

    const handleSubmit = (event) => {
      if (onEditProductItem && typeof onEditProductItem === "function") {
        onEditProductItem(productItem, {
          quantity: quantity ?? 1,
          price: formatNumberFromCurrency(amount),
          // changeToCost: true,
        });
      }
      dialogRef.current?.hide();
    };

    const onHandleChangeText = (val = 1) => {
      setQuantity(Math.max(1, parseInt(val)));
    };

    const onHandleApplyToCostPrice = () => {
      if (!applyToCost) {
        setApplyToCost(true);
        setAmount(formatMoney(productItem?.costPrice) ?? 0);
      } else {
        setApplyToCost(false);
        setAmount(sourceItem?.price);
      }
    };
    /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */

    React.useEffect(() => {
      const { codeStatus, data } = productsGet || {};
      if (statusSuccess(codeStatus)) {
        if (data.quantities?.length > 0) {
          const findItem = data.quantities?.find(
            (x) => x.id === productItem.productQuantityId
          );

          if (findItem) {
            setSourceItem(findItem);
            setMaxCountQty(findItem.quantity);
            if (
              formatNumberFromCurrency(findItem.costPrice ?? 0) ===
              formatNumberFromCurrency(amount)
            ) {
              setApplyToCost(true);
            } else {
              setApplyToCost(false);
            }
          }
        } else {
          setSourceItem(data);
          setMaxCountQty(data.quantity);
          if (
            formatNumberFromCurrency(data.costPrice ?? 0) ===
            formatNumberFromCurrency(amount)
          ) {
            setApplyToCost(true);
          } else {
            setApplyToCost(false);
          }
        }
      }
    }, [productsGet, amount]);

    return (
      <View>
        <DialogLayout
          title={t("Edit Product Item")}
          ref={dialogRef}
          behavior={"padding"}
          bottomChildren={() => (
            <View style={styles.bottomStyle}>
              <ButtonGradient
                label={t("Submit")}
                width={scaleWidth(140)}
                height={scaleHeight(40)}
                borderRadius={scaleWidth(3)}
                disable={isCheckQty && quantity > maxCountQty}
                onPress={handleSubmit}
              />
            </View>
          )}
          style={styles.dialog}
        >
          <View style={styles.container}>
            {!isApplyCostPrice && (
              <View>
                <View style={styles.marginVertical} />
                <Text style={styles.textStyle}>{t("Price ($)")}</Text>
                <View
                  style={{
                    height: scaleHeight(40),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <View style={{ width: scaleWidth(20) }} />
                  <View style={{ width: scaleWidth(200) }}>
                    <SwitchLabel
                      label={t("- Apply to cost price")}
                      toggleSwitch={onHandleApplyToCostPrice}
                      isEnabled={applyToCost}
                    />
                  </View>
                </View>
              </View>
            )}
            <View style={styles.marginVertical} />
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <InputMoney
                width={scaleWidth(220)}
                height={scaleHeight(40)}
                keyboardType="numeric"
                textAlign="center"
                value={`${amount}`}
                onChangeText={setAmount}
                editable={!applyToCost}
              />
            </View>
            <View style={styles.marginVertical} />
            <Text style={styles.textStyle}>{t("Quantity")}</Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <FormInputAmount
                // label={t("Quantity")}
                defaultValue={quantity}
                onChangeValue={(value) => {
                  onHandleChangeText(value);
                }}
                width={scaleWidth(100)}
              />
            </View>
          </View>
        </DialogLayout>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  dialog: {
    flex: 0,
    width: scaleWidth(450),
  },

  container: {
    flex: 0,
  },

  row: { flexDirection: "row", alignItems: "center" },

  bottomStyle: {
    width: "100%",
    height: scaleHeight(80),
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  title: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(23),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },

  textStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  marginVertical: {
    height: scaleHeight(10),
  },

  textInputContainer: {
    borderRadius: 1,
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dddddd",
    width: scaleWidth(400),
    height: scaleHeight(48),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: scaleWidth(8),
  },

  textInput: {
    height: scaleHeight(26),
    fontSize: scaleFont(20),
    textAlign: "left",
    fontStyle: "normal",
    flex: 1,
  },
});
