import actions from "@redux/actions";
import { ButtonGradient, ButtonGradientWhite } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { useGetCategoriesList } from "@shared/services/api/retailer";
import { colors, fonts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const log = (obj, message = "") => {
  Logger.log(`[DialogPincode] ${message}`, obj);
};

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

export const DialogPinCode = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);

  const merchantID = useSelector(
    (state) => state.dataLocal?.profile?.merchantCode
  );
  const isLoginStaff = useSelector((state) => state.dataLocal.isLoginStaff);
  const [value, setValue] = React.useState("");

  /**
  |--------------------------------------------------
  | CALL API

  |--------------------------------------------------
  */
  const [, getCategoriesList] = useGetCategoriesList();
  // !! call login staff
  React.useImperativeHandle(ref, () => ({
    show: () => {
      setValue("");
      dialogRef.current?.show();
    },
    hide: () => {
      dialogRef.current?.hide();
    },
  }));

  const onHandleSubmit = () => {
    dispatch(actions.staff.loginStaff(merchantID, value));
  };

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */
  // React.useEffect(() => {
  //   if (!staffLogin) {
  //     return;
  //   }

  //   const { codeStatus, message, data } = staffLogin || {};
  //   if (statusSuccess(codeStatus)) {
  //     dispatch(authMerchant.staffSignIn(data));
  //     dialogRef.current?.hide();
  //   }
  // }, [staffLogin]);

  const onLoadApps = React.useCallback(() => {
    if (isLoginStaff) {
      getCategoriesList();
    }
  }, [isLoginStaff]);

  React.useEffect(() => {
    dialogRef.current?.hide();
    onLoadApps();
  }, [isLoginStaff]);

  React.useEffect(() => {
    dialogRef.current?.show();
  }, []);

  const renderItem = ({ item }) => {
    const onPressItem = () => {
      if (item === "⇦") {
        if (value?.length > 0) setValue((prev) => prev.slice(0, -1));
      } else if (!value || value?.length < MAX_LENGTH) {
        setValue((prev) => prev + item);
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

  return (
    <View>
      <DialogLayout
        title={t("Lock Screen")}
        ref={dialogRef}
        hideCloseButton={true}
        bottomChildren={() => (
          <View style={styles.bottomStyle}>
            <ButtonGradient
              label={t("Submit")}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              disable={value?.length !== MAX_LENGTH}
              onPress={onHandleSubmit}
            />
          </View>
        )}
        style={styles.dialog}
      >
        <View style={styles.container}>
          <View style={styles.marginVertical} />
          <Text style={styles.title}>{t("Enter your PIN code")}</Text>
          <View style={styles.marginVertical} />
          {/* <CustomInput
            style={styles.input}
            textInputStyle={styles.textInput}
            textInputProps={{
              secureTextEntry: true,
              blurOnSubmit: false,
              defaultValue: value,
            }}
          /> */}
          <View style={styles.input}>
            <TextInput
              // onChangeText={onHandleChangeText}
              value={value}
              secureTextEntry={true}
              blurOnSubmit={false}
              style={styles.textInput}
              editable={false}
              maxLength={MAX_LENGTH}
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
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />

          <View style={styles.marginVertical} />
        </View>
      </DialogLayout>
    </View>
  );
});

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
  },

  textInput: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(37),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.GREYISH_BROWN,
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
