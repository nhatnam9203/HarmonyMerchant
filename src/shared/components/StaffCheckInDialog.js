import { CustomTimePicker } from "@components/CustomTimePicker";
import IMAGE from "@resources";
import {
  ButtonGradient,
  CustomRadioSelect,
  FormInput,
  FormInputMask,
} from "@shared/components";
import { DialogLayout } from "@shared/layouts";
import {
  useStaffLogTimeCreate,
  useStaffLogTimeEdit,
} from "@shared/services/api/retailer/Staff";
import { colors, fonts } from "@shared/themes";
import {
  dateToString,
  STAFF_CHECK_IN_TYPE,
  STAFF_LOG_TIME_TYPE,
} from "@shared/utils";
import { statusSuccess } from "@shared/utils/app";
import {
  formatHourMinute,
  formatNumberFromCurrency,
  formatWithMoment,
  role,
} from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useDispatch, useSelector } from "react-redux";

const HOURS_FORMAT = "hh:mm A";

export const StaffCheckInDialog = React.forwardRef(({ onSuccess }, ref) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const dialogRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  const messageSelectRef = React.useRef(null);

  const [note, setNote] = React.useState(null);
  const [amount, setAmount] = React.useState(0);
  const [type, setType] = React.useState(STAFF_CHECK_IN_TYPE);
  const [startTime, setStartTime] = React.useState(new Date());
  const [startDate, setStartDate] = React.useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [sessionId, setSessionId] = React.useState(null);
  const [staffName, setStaffName] = React.useState(null);

  const [staffLogTimeCreate, createStaffLogTime] = useStaffLogTimeCreate();
  const [staffLogTimeEdit, editStaffLogTime] = useStaffLogTimeEdit();

  const profile = useSelector((state) => state.dataLocal.profileStaffLogin);

  const clearDataForm = () => {
    setNote(null);
    setAmount(0);
    setType(STAFF_CHECK_IN_TYPE);
    setStartTime(new Date());
    setStartDate(new Date());
    setStaffName(null);
    setSessionId(null);
  };

  const onHandleSaveLogTime = () => {
    dialogRef.current?.hide();

    const time = `${formatWithMoment(
      new Date(startDate),
      "YYYY-MM-DD"
    )}T${formatHourMinute(formatWithMoment(startTime, HOURS_FORMAT))}:00`;

    if (sessionId) {
      const data = {
        startDate: time,
        startTime: time,
        note: note,
        amount: formatNumberFromCurrency(amount),
        type: type,
        staffName: staffName,
      };

      editStaffLogTime(sessionId, data);
    } else {
      const data = {
        merchantStaffLogtimeId: 0,
        startDate: time,
        startTime: time,
        note: note,
        amount: formatNumberFromCurrency(amount),
        type: type,
        staffName: profile ? `${profile.firstName} ${profile.lastName}` : "",
      };

      createStaffLogTime(data);
    }
  };

  const onHandleChangeSelect = (bl) => {
    setType(bl?.value ?? STAFF_CHECK_IN_TYPE);
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

  const _scrollToInput = (reactNode) => {
    // Add a 'scroll' ref to your ScrollView
    scrollRef.current?.scrollToFocusedInput(reactNode);
  };

  React.useEffect(() => {
    const { codeStatus } = staffLogTimeCreate || staffLogTimeEdit || {};
    if (statusSuccess(codeStatus)) {
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess();
      }
    }
  }, [staffLogTimeCreate, staffLogTimeEdit]);

  React.useImperativeHandle(ref, () => ({
    show: () => {
      clearDataForm();
      setSessionId(null);
      setStaffName(null);
      dialogRef.current?.show();
    },
    showWithItem: (item) => {
      if (item) {
        setNote(item.note);
        setStartDate(new Date(item.startDate));
        setStartTime(new Date(item.startTime));
        setAmount(item.amount);
        setType(item.type);

        setSessionId(item.merchantStaffLogtimeId);
        setStaffName(item.staffName);
        dialogRef.current?.show();
        messageSelectRef.current?.setValue(item.type);
      }
    },
    hide: () => {
      dialogRef.current?.hide();
    },
  }));

  return (
    <View>
      <DialogLayout
        title={sessionId ? t("Edit Sessions") : t("Check-In/Check-Out")}
        ref={dialogRef}
        style={styles.dialog}
        behavior={"none"}
        bottomChildren={() => (
          <View style={styles.bottomStyle}>
            <ButtonGradient
              label={t("Save")}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              onPress={onHandleSaveLogTime}
            />
          </View>
        )}
      >
        <KeyboardAwareScrollView
          ref={scrollRef}
          extraScrollHeight={-100}
          extraHeight={250}
        >
          <View style={styles.container}>
            <View style={styles.marginVertical} />
            <View style={[styles.row, { flexDirection: "row" }]}>
              <View style={styles.dateContent}>
                <Text style={styles.textStyle}>{t("Date")}</Text>
                <TouchableOpacity
                  style={styles.customInput}
                  onPress={showDatePicker}
                  disabled={profile?.roleName !== role.Admin || !sessionId}
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
                  onChangeDate={(d) => {
                    setStartTime(d);
                  }}
                  minuteInterval={0}
                  renderBase={(showTimePicker) => (
                    <TouchableOpacity
                      style={[styles.customInput, { width: scaleWidth(140) }]}
                      onPress={showTimePicker}
                      disabled={profile?.roleName !== role.Admin || !sessionId}
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
                defaultValue={type}
                data={STAFF_LOG_TIME_TYPE}
                onSelect={onHandleChangeSelect}
              />
            </View>
            <View style={styles.marginVertical} />

            <Text style={styles.textStyle}>
              {t("Cash amount (The money on the Box)")}
            </Text>
            <View style={styles.marginVertical} />

            <FormInputMask
              label={t("Price ($)")}
              placeholder={"Price"}
              onChangeValue={setAmount}
              defaultValue={amount || 0}
              keyboardType="numeric"
              onFocus={(event: Event) => {
                // `bind` the function if you're using ES6 classes
                _scrollToInput(ReactNative.findNodeHandle(event.target));
              }}
            />

            <FormInput
              label={t("Note")}
              placeholder={t("Input note here ...")}
              onChangeValue={setNote}
              defaultValue={note}
              multiline={true}
              onFocus={(event: Event) => {
                // `bind` the function if you're using ES6 classes
                _scrollToInput(ReactNative.findNodeHandle(event.target));
              }}
            />
            <View style={styles.marginVertical} />
          </View>
        </KeyboardAwareScrollView>

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
});

const styles = StyleSheet.create({
  dialog: {
    flex: 0,
    width: scaleWidth(480),
  },

  container: { flex: 0 },

  row: { width: "100%", height: scaleHeight(70) },

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

  formInputType: {
    height: scaleHeight(80),
  },

  textInputContent: {
    height: scaleHeight(26),
    fontSize: scaleFont(20),
    textAlign: "left",
    fontStyle: "normal",
    flex: 1,
  },

  textInputContainer: {
    borderRadius: 1,
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dddddd",
    width: "100%",
    height: scaleHeight(44),
  },
});
