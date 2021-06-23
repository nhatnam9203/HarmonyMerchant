import { ButtonGradient, FormInput } from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { colors, fonts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

export const DialogRestock = React.forwardRef(({ onRestockSubmit }, ref) => {
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);
  const [value, setValue] = React.useState(0);
  const [reason, setReason] = React.useState(null);

  React.useImperativeHandle(ref, () => ({
    show: () => {
      setValue(0);
      setReason(null);
      dialogRef.current?.show();
    },
  }));

  const onHandleSubmitButtonPress = () => {
    dialogRef.current?.hide();
    if (onRestockSubmit && typeof onRestockSubmit === "function") {
      onRestockSubmit(value, reason);
    }
  };

  return (
    <View>
      <DialogLayout
        title={t("Restock")}
        ref={dialogRef}
        bottomChildren={() => (
          <View style={styles.bottomStyle}>
            <ButtonGradient
              label={t("Submit")}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              onPress={onHandleSubmitButtonPress}
            />
          </View>
        )}
      >
        <View style={styles.container}>
          <FormInput
            label={t("Enter the amount of adjustment")}
            placeholder={t("Enter the amount")}
            onChangeValue={setValue}
            defaultValue={value}
            keyboardType="numeric"
          />

          <FormInput
            label={t("Reasont")}
            placeholder={t("Adjustment reason")}
            onChangeValue={setReason}
            defaultValue={reason}
          />
        </View>
      </DialogLayout>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },

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
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  list: {
    // height: scaleHeight(400),
    maxHeight: scaleHeight(400),
    minHeight: scaleHeight(100),
    width: "100%",
    marginVertical: scaleHeight(20),
  },

  item: {
    width: scaleWidth(440),
    height: scaleHeight(48),
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderRightWidth: scaleWidth(1),
    borderLeftWidth: scaleWidth(1),
    borderColor: "#dddddd",
    alignItems: "center",
    paddingHorizontal: scaleWidth(16),
    justifyContent: "space-between",
  },

  itemSeparator: {
    backgroundColor: "#dddddd",
    height: scaleHeight(1),
  },

  itemText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },
});
