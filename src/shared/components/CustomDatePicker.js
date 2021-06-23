import { colors, fonts } from "@shared/themes";
import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";

import Modal from "react-native-modal";
import { ButtonGradient, ButtonGradientWhite } from "./Button";

const DATE_FORMAT = "DD/MM/YYYY";
const ONE_DAY = 24 * 60 * 60 * 1000;
const BIRTHDAY_ONE_YEAR = 365 * ONE_DAY;
const BIRTHDAY_MIN = 6;
const BIRTHDAY_MAX = 100;

const CodeError = {
  min: "error_birthday_min",
  max: "error_birthday_max",
  date_min: "error_select_date_min",
};

export const CustomDatePicker = ({
  onChangeDate,
  fmDate = DATE_FORMAT,
  editable = false,
  maximumYear = BIRTHDAY_MAX,
  minimumYear = BIRTHDAY_MIN,
  isBirthday = true,
  onSubmitError,
  minimumDate,
  width,
  renderBase,
  defaultDateString,
}) => {
  const [t] = useTranslation();
  const [visible, setVisible] = React.useState(false);
  const [date, setDate] = React.useState();

  const showPicker = () => {
    Keyboard.dismiss();
    setVisible(true);
  };

  const hidePicker = () => {
    setVisible(false);
  };

  const onHandleConfirm = () => {
    if (typeof onChangeDate === "function") {
      const tempFormatDate = moment.parseZone(date);
      const diffDate = moment(new Date()).diff(moment(date)); // số tuổi tính ms

      if (diffDate < minimumYear * BIRTHDAY_ONE_YEAR && isBirthday) {
        // nhỏ hơn 6 tuổi
        // alert('Date of birth cannot be least than present');
        if (onSubmitError && typeof onSubmitError === "function") {
          onSubmitError(CodeError.min, minimumYear);
        }
        return;
      }

      if (diffDate > maximumYear * BIRTHDAY_ONE_YEAR && isBirthday) {
        // lớn hơn 6 tuổi
        // alert('Date of birth cannot be greater than present');
        if (onSubmitError && typeof onSubmitError === "function") {
          onSubmitError(CodeError.max, maximumYear);
        }
        return;
      }

      if (minimumDate) {
        // var current = moment().startOf('day');
        const delta = moment(date).diff(moment(minimumDate), "days") + 1; // diff day hours
        if (delta < 0) {
          if (onSubmitError && typeof onSubmitError === "function") {
            onSubmitError(CodeError.date_min, delta);
          }

          return;
        }
      }

      if (tempFormatDate !== "Invalid date") {
        onChangeDate(tempFormatDate);
      }
    }

    hidePicker();
  };

  React.useEffect(() => {
    if (defaultDateString) setDate(new Date(defaultDateString));
  }, [defaultDateString]);

  return (
    <View>
      {renderBase && typeof renderBase === "function" && editable ? (
        <View style={width && { width }}>
          {typeof renderBase === "function" && renderBase(date, showPicker)}
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={showPicker} accessible={false}>
          <View pointerEvents="box-only" style={{ width }}>
            {typeof renderBase === "function" && renderBase(date)}
          </View>
        </TouchableWithoutFeedback>
      )}

      <Modal style={styles.modal} visible={visible} onRequestClose={hidePicker}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.txtTitle}>{t("Date Picker")}</Text>
          </View>
          <View style={styles.picker}>
            <DatePicker date={date} onDateChange={setDate} mode="date" />
          </View>
          <View style={styles.bottomStyle}>
            <ButtonGradientWhite
              label={t("Close")}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              fontSize={scaleFont(17)}
              textWeight="normal"
              onPress={hidePicker}
            />
            <ButtonGradient
              label={t("Confirm")}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              fontSize={scaleFont(17)}
              textColor={colors.WHITE}
              textWeight="normal"
              onPress={onHandleConfirm}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#40404050",
    margin: 0,
  },

  container: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: scaleWidth(400),
    borderRadius: scaleHeight(20),
    shadowColor: "#004080bf",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
  },

  header: {
    height: scaleWidth(48),
    width: "100%",
    backgroundColor: colors.OCEAN_BLUE,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderTopLeftRadius: scaleHeight(20),
    borderTopRightRadius: scaleHeight(20),
  },

  picker: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: scaleHeight(240),
  },

  txtTitle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(23),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.WHITE,
  },

  bottomStyle: {
    width: "100%",
    height: scaleHeight(80),
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#00000026",
  },
});
