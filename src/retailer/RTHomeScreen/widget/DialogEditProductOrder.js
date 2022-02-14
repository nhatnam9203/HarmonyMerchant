import { ButtonGradient, FormInputAmount } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { useGetProducts } from "@shared/services/api/retailer";
import { colors, fonts } from "@shared/themes";
import { statusSuccess } from "@shared/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export const DialogEditProductOrder = React.forwardRef(
  ({ onEditProductItem }, ref) => {
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

    /**
  |--------------------------------------------------
  | CALL API

  |--------------------------------------------------
  */
    const [productsGet, getProducts] = useGetProducts();

    React.useImperativeHandle(ref, () => ({
      show: (item) => {
        // console.log(item);
        dialogRef.current?.show();
        setQuantity(item.quantity);
        setAmount(item.price);
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
        onEditProductItem(productItem, { quantity: quantity ?? 1 });
      }
      dialogRef.current?.hide();
    };

    const onHandleChangeText = (val = 1) => {
      setQuantity(Math.max(1, parseInt(val)));
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

          // console.log(findItem);
          if (findItem) {
            setMaxCountQty(findItem.quantity);
          }
        } else {
          setMaxCountQty(data.quantity);
        }
      }
    }, [productsGet]);

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
          {/* <KeyboardAwareScrollView
            ref={scrollRef}
            // extraScrollHeight={-100}
            // extraHeight={250}
          >

          </KeyboardAwareScrollView> */}
          <View style={styles.container}>
            <View style={styles.marginVertical} />
            {/* <Text style={styles.textStyle}>{t("Price ($)")}</Text>
              <View style={styles.marginVertical} />

              <CustomInputMoney
                style={styles.textInputContainer}
                textInputProps={{
                  placeholder: "Price",
                  fontSize: scaleFont(15),
                  textAlign: "left",
                  defaultValue: amount || 0,
                  onChangeText: setAmount,
                  keyboardType: "numeric",
                  onFocus: (event: Event) => {
                    // `bind` the function if you're using ES6 classes
                    _scrollToInput(ReactNative.findNodeHandle(event.target));
                  },
                  editable: false,
                }}
              />
              <View style={styles.marginVertical} /> */}

            {/* <Text style={styles.textStyle}>{t("Quantity")}</Text>
            <View style={styles.marginVertical} />
            <View style={styles.textInputContainer}>
              <TextInput
                onChangeText={onHandleChangeText}
                value={quantity ? quantity + "" : "1"}
                style={styles.textInput}
                keyboardType="numeric"
                placeholder="1"
              />
            </View> */}

            {/* <FormInput
              label={t("Quantity")}
              placeholder={t("1")}
              required={true}
              onChangeValue={onHandleChangeText}
              defaultValue={quantity ? quantity + "" : ""}
            /> */}
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
