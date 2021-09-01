import {
  ButtonGradient,
  FormInput,
  CustomRadioSelect,
} from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import { colors, fonts, layouts } from "@shared/themes";
import { BIRTH_DAY_DATE_FORMAT_STRING, dateToString } from "@shared/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import { useDispatch } from "react-redux";
import IMAGE from "@resources";
import { CustomTimePicker } from "@components";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const CHECK_IN_TYPE = "check-in";
const CHECK_OUT_TYPE = "check-out";

export const StaffCheckInDialog = React.forwardRef(
  ({ title, onSuccess }, ref) => {
    const dispatch = useDispatch();
    const [t] = useTranslation();
    const dialogRef = React.useRef(null);
    const messageSelectRef = React.useRef(null);

    const [value, setValue] = React.useState(new Date());
    const [note, setNote] = React.useState(null);
    const [amount, setAmount] = React.useState(0);
    const [type, setType] = React.useState(CHECK_IN_TYPE);
    const [startTime, setStartTime] = React.useState(new Date());
    const [startDate, setStartDate] = React.useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] =
      React.useState(false);

    const onHandleSuccess = (e) => {
      const code = e?.data;
      dialogRef.current?.hide();

      if (typeof onSuccess === "function" && onSuccess) {
        onSuccess(code);
      }
    };

    const onHandleChangeSelect = (bl) => {
      setType(bl?.value ?? CHECK_IN_TYPE);
    };

    const showStartTime = React.useCallback(() => {
      return dateToString(startTime, "LT");
    }, [startTime]);

    const showStartDate = React.useCallback(() => {
      return dateToString(startDate, "MM/DD/YYYY");
    }, [startDate]);

    const showDatePicker = () => {
      Keyboard.dismiss();
      setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };

    const handleDateConfirm = (date) => {
      setStartDate(date, "MM/DD/YYYY");
      setDatePickerVisibility(false);
    };

    React.useImperativeHandle(ref, () => ({
      show: () => {
        // setValue('');
        dialogRef.current?.show();
      },
      hide: () => {
        dialogRef.current?.hide();
      },
    }));

    return (
      <View>
        <DialogLayout
          title={title ?? t("Check-In/Check-Out")}
          ref={dialogRef}
          style={styles.dialog}
          bottomChildren={() => (
            <View style={styles.bottomStyle}>
              <ButtonGradient
                label={t("Save")}
                width={scaleWidth(140)}
                height={scaleHeight(40)}
                borderRadius={scaleWidth(3)}
                onPress={onHandleSuccess}
              />
            </View>
          )}
        >
          <View style={styles.container}>
            <View style={[styles.row, { flexDirection: "row" }]}>
              <View style={styles.dateContent}>
                <Text style={styles.textStyle}>{t("Date")}</Text>
                <TouchableOpacity
                  style={styles.customInput}
                  onPress={showDatePicker}
                >
                  <TextInput
                    // onChangeText={onHandleChangeText}
                    placeholder={t("--/--/----")}
                    value={showStartDate()}
                    style={[styles.textInput, styles.textEditStyle]}
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

              <View style={styles.dateContent}>
                <Text style={styles.textStyle}>{t("Time")}</Text>

                <CustomTimePicker
                  editable={true}
                  defaultValue={startTime}
                  onChangeDate={setStartTime}
                  minuteInterval={0}
                  renderBase={(showTimePicker) => (
                    <TouchableOpacity
                      style={[styles.customInput, { width: scaleWidth(140) }]}
                      onPress={showTimePicker}
                    >
                      <TextInput
                        pointerEvents="none"
                        placeholder="--:--"
                        value={showStartTime()}
                        style={[styles.textInput, styles.textEditStyle]}
                      />
                      <Image
                        source={IMAGE.dropdown}
                        style={{ resizeMode: "center" }}
                      />
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
            <View style={styles.marginVertical} />

            <View style={styles.row}>
              <Text style={styles.textStyle}>{t("Type of opeation")}</Text>
              <CustomRadioSelect
                style={styles.customRadioSelect}
                ref={messageSelectRef}
                horizontal={true}
                defaultValue={CHECK_IN_TYPE}
                data={[
                  { label: t("Check In"), value: CHECK_IN_TYPE },
                  { label: t("Check Out"), value: CHECK_OUT_TYPE },
                ]}
                onSelect={onHandleChangeSelect}
              />
            </View>

            <FormInput
              label={t("Cash amount (The money on the Box")}
              placeholder={t("Enter the amount")}
              onChangeValue={setAmount}
              defaultValue={amount}
              keyboardType="numeric"
            />
            <FormInput
              label={t("Note")}
              placeholder={t("Input text here ...")}
              onChangeValue={setNote}
              defaultValue={note}
              multiline={true}
            />
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            display={"spinner"}
            locale="en-US"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
            date={startDate}
            cancelTextIOS={"Close"}
            confirmTextIOS={"Confirm"}
            headerTextIOS={"Pick Date"}
          />
        </DialogLayout>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  dialog: {
    flex: 0,
    width: scaleWidth(480),
  },

  container: { flex: 0 },

  row: { width: "100%", flex: 0 },

  title: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.GREYISH_BROWN,
  },

  marginVertical: {
    height: scaleHeight(10),
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

  textStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  customRadioSelect: {
    height: scaleHeight(50),
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  customInput: {
    height: scaleHeight(40),
    width: scaleWidth(200),
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

  dateContent: {
    flex: 1,
  },
});
