import actions from "@redux/actions";
import { ButtonGradient, ButtonGradientWhite } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { colors, fonts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import NavigationServices from "@navigators/NavigatorServices";
import { useAppType } from "@shared/hooks";
import { checkPermissionStaff, useAxiosMutation } from "@apis";

const PIN_CODE_CHARS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "0",
  "⇦",
];
const MAX_LENGTH = 4;

/**
 * Component Popup
 */
export const PopupCheckPermission = React.forwardRef(
  ({ onForceClosePopup, onClosePopup, tabName }, ref) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    /**
     * useRef
     */
    const dialogRef = React.useRef(null);
    const textInputRef = React.useRef(null);

    /**
     * get redux state
     */
    const { profile } = useSelector((state) => state.dataLocal) || {};
    const { merchantCode } = profile || {};

    /**
     * useState
     */
    const { isRetailApp, isSalonApp } = useAppType();
    const [value, setValue] = React.useState("");

    /**
     * Call API check permission
     */
    const onHandleSubmit = async () => {
      await requestCheckPermission();
    };

    /**
     * Handle Force Close Popup Events
     */
    const onHandleForceClosePopup = () => {
      clearTextInput();

      // if retailer app back to home screen
      if (isRetailApp()) {
        NavigationServices.navigate("home.order.top_tab");
      }

      // if salon app chua xu ly
      if (isSalonApp()) {
        NavigationServices.navigate("Home");
      }

      if (onForceClosePopup && typeof onForceClosePopup === "function") {
        onForceClosePopup();
      }
    };

    /**
     * Handle Close Popup Events
     */
    const onHandleClose = () => {
      dialogRef.current?.hide();
      clearTextInput();

      if (onclosePop && typeof onclosePop === "function") {
        onClosePopup();
      }
    };

    /**
     * API Check permission
     */
    const [{ isLoading = false }, requestCheckPermission] = useAxiosMutation({
      ...checkPermissionStaff(merchantCode, value, tabName),
      onSuccess: (data, response) => {
        if (response?.codeNumber === 200) {
          // permission
          onHandleClose();
        } else {
          // not permission
          clearTextInput();
          alert(response?.message);
        }
      },
    });

    /**
     * Clear text input
     */
    const clearTextInput = () => {
      setValue("");
      textInputRef.current?.clear();
    };

    /**
     * Ref Components
     */
    React.useImperativeHandle(ref, () => ({
      show: () => {
        clearTextInput();
        dialogRef.current?.show();
      },
      hide: () => {
        dialogRef.current?.hide();
      },
    }));

    /**
     * Render number button
     */
    const renderItem = ({ item = "" }) => {
      const onPressItem = () => {
        console.log(item);
        if (item === "⇦") {
          if (value?.length > 0) setValue((prev) => prev.slice(0, -1));
        } else if (value?.trim().length === 0 || value?.length < MAX_LENGTH) {
          setValue((prev) => `${prev}${item}`);
        }
      };

      return (
        <ButtonGradientWhite
          label={item}
          width={scaleWidth(100)}
          height={scaleWidth(60)}
          borderRadius={scaleWidth(3)}
          textColor={colors.GREYISH_BROWN}
          fontSize={scaleFont(26)}
          fontWeight="500"
          onPress={onPressItem}
        />
      );
    };

    /**
     * Render Popup
     */
    return (
      <View>
        <DialogLayout
          title={t("Input PIN Number")}
          ref={dialogRef}
          bottomChildren={() => (
            <View style={styles.bottomStyle}>
              <ButtonGradient
                label={t("Submit")}
                width={scaleWidth(140)}
                height={scaleHeight(40)}
                borderRadius={scaleWidth(3)}
                disable={value?.length !== MAX_LENGTH}
                onPress={onHandleSubmit}
                loading={isLoading}
              />
            </View>
          )}
          style={styles.dialog}
          onForceClose={onHandleForceClosePopup}
        >
          <View style={styles.container}>
            <View style={styles.marginVertical} />
            <Text style={styles.title}>
              {t("Please enter the authorized PIN number")}
            </Text>
            <View style={styles.marginVertical} />
            <View style={styles.input}>
              <TextInput
                ref={textInputRef}
                value={value}
                secureTextEntry={true}
                blurOnSubmit={false}
                style={styles.textInput}
                editable={false}
                maxLength={MAX_LENGTH}
                placeholder={t("Your PIN")}
              />
            </View>

            <View style={styles.marginVertical} />
            <FlatList
              bounces={false}
              style={styles.flatList}
              data={PIN_CODE_CHARS}
              renderItem={renderItem}
              keyExtractor={(item) => item}
              numColumns={3}
              columnWrapperStyle={styles.columnWrapper}
              ItemSeparatorComponent={() => (
                <View style={styles.itemSeparator} />
              )}
            />

            <View style={styles.marginVertical} />
          </View>
        </DialogLayout>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  dialog: {
    flex: 0,
    width: scaleWidth(380),
  },

  container: {
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: scaleFont(20),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.GREYISH_BROWN,
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.VERY_LIGHT_PINK_C_5,
  },

  input: {
    width: scaleWidth(320),
    height: scaleHeight(48),
    borderRadius: scaleWidth(3),
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderWidth: scaleWidth(1),
    borderColor: "#dddddd",
    justifyContent: "center",
    alignItems: "center",
  },

  textInput: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: scaleWidth(2),
    textAlign: "center",
    color: colors.GREYISH_BROWN,
    width: "100%",
  },

  marginVertical: {
    height: scaleHeight(16),
  },

  flatList: { width: scaleWidth(320) },

  charButton: {
    width: scaleWidth(72),
    height: scaleHeight(54),
    borderRadius: scaleWidth(3),
    borderStyle: "solid",
    borderWidth: scaleWidth(1),
    borderColor: "#eeeeee",
  },

  columnWrapper: {
    justifyContent: "space-between",
  },

  itemSeparator: {
    width: scaleWidth(4),
    height: scaleHeight(10),
  },
});
