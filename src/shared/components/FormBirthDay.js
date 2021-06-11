import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { fonts, colors } from "@shared/themes";
import { useTranslation } from "react-i18next";
import IMAGE from "@resources";
import { CustomDatePicker } from "./CustomDatePicker";
import { dateToString, BIRTH_DAY_DATE_FORMAT_STRING } from "@shared/utils";

// !!  defaultDate: date type,
export const FormBirthDay = ({ onChangeDate, defaultDateString }) => {
  const [t] = useTranslation();
  const [value, setValue] = React.useState(defaultDateString);

  const onBirthdaySubmitError = (code, year) => {
    if (code === "error_birthday_min") {
      alert(`${t("Date of birth cannot be least than present")} ${year} `);
    } else if (code === "error_birthday_max") {
      alert(`${t("Date of birth cannot be greater than present")} ${year} `);
    } else if (code === "error_select_date_min") {
      alert(`${t("Date select is wrong")}`);
    } else if (code) {
      alert(`${t("Date select is error with code")} ${code}`);
    }
  };

  const onHandleChangeDate = (date) => {
    const dateString = dateToString(date, BIRTH_DAY_DATE_FORMAT_STRING);
    setValue(dateString);
    if (onChangeDate && typeof onChangeDate === "function") {
      onChangeDate(date); // format here if need
    }
  };

  React.useEffect(() => {
    setValue(defaultDateString);
  }, [defaultDateString]);

  return (
    <CustomDatePicker
      onChangeDate={onHandleChangeDate}
      defaultDateString={defaultDateString}
      editable={false}
      isBirthday={true}
      minimumYear={3}
      maximumYear={200}
      // minimumDate={new Date()}
      onSubmitError={onBirthdaySubmitError}
      renderBase={(date, showPicker) => (
        <View style={styles.container}>
          <Text style={styles.textStyle}>{t("Birthday")}</Text>
          <TouchableOpacity style={styles.customInput} onPress={showPicker}>
            <TextInput
              // onChangeText={onHandleChangeText}
              placeholder={t("--/--/----")}
              value={value}
              style={[
                styles.textInput,
                value?.length > 0
                  ? styles.textEditStyle
                  : styles.textPlaceholderStyle,
              ]}
              pointerEvents="none"
            />
            <View style={styles.horizontalLine} />
            <Image
              source={IMAGE.customer_birthday}
              color={"#aaa"}
              size={scaleWidth(16)}
            />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleHeight(8),
    flex: 1,
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

  customInput: {
    height: scaleHeight(40),
    borderRadius: 1,
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dddddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: scaleHeight(10),
    marginVertical: scaleHeight(8),
    flex: 1,
  },

  horizontalLine: {
    width: scaleWidth(1),
    height: scaleHeight(32),
    borderRadius: scaleWidth(1),
    backgroundColor: "#ccc",
    marginHorizontal: scaleWidth(10),
  },

  horizontalPadding: {
    width: scaleWidth(16),
  },

  textInput: {
    height: scaleHeight(26),
    fontSize: scaleFont(20),
    textAlign: "center",
    fontStyle: "normal",
    flex: 1,
  },

  textPlaceholderStyle: {
    fontFamily: "Roboto-Light",
    fontWeight: "300",
    letterSpacing: 0,
    color: colors.INACTIVE,
    fontSize: scaleFont(17),
  },

  textEditStyle: {
    fontSize: scaleFont(17),
    color: colors.GREYISH_BROWN,
    letterSpacing: 1,
    fontWeight: "500",
    fontFamily: "Roboto-Medium",
  },
});
