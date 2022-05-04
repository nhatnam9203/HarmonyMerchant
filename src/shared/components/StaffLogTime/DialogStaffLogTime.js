import actions from "@actions";
import {
  ButtonGradient,
  FormInput,
  FormInputMask,
  PopupPinCode,
  SwitchLabel,
  DialogWithOneButton,
} from "@shared/components";
import { useLockScreen } from "@shared/hooks";
import { DialogLayout } from "@shared/layouts";
import { harmonyApi } from "@shared/services";
import { colors, fonts } from "@shared/themes";
import {
  dateToString,
  STAFF_CHECK_IN_TYPE,
  STAFF_CHECK_OUT_TYPE,
} from "@shared/utils";
import {
  formatHourMinute,
  formatNumberFromCurrency,
  formatWithMoment,
} from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";

const HOURS_FORMAT = "hh:mm A";
const DATE_FORMAT = "YYYY-MM-DD";
const ONE_HOURS_IN_MILS = 60 * 60 * 1000;

export const DialogStaffLogTime = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const dialogRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  const popupPinCodeRef = React.useRef(null);
  const dialogSuccessRef = React.useRef(null);

  const { merchantStaffLogtime, displayName } =
    useSelector((state) => state.dataLocal?.profileStaffLogin) || {};

  const [cashCheck, setCashCheck] = React.useState(false);
  const [note, setNote] = React.useState(null);
  const [amount, setAmount] = React.useState(0);
  const [startLogTime, setStartLogTime] = React.useState(false);
  const [logTimeType, setLogTimeType] = React.useState(STAFF_CHECK_IN_TYPE);
  const [checkInTime, setCheckInTime] = React.useState(null);
  const [workingTime, setWorkingTime] = React.useState(null);

  const { loginStaff } = useLockScreen({
    onSubmitSuccess: async () => {
      if (!startLogTime) return;
      popupPinCodeRef.current?.hide();
      dispatch(actions.app.closeAllPopupPincode());

      const { startTime, startDate, type } = merchantStaffLogtime;

      setLogTimeType(type);

      const lastDateStaffLog = `${formatWithMoment(
        new Date(startDate),
        DATE_FORMAT
      )}T${formatHourMinute(formatWithMoment(startTime, HOURS_FORMAT))}:00`;

      const lastDate = new Date(lastDateStaffLog);
      const todayDate = new Date();

      const delta = todayDate.getTime() - lastDate.getTime();

      if (
        lastDate.setHours(0, 0, 0, 0) == todayDate.setHours(0, 0, 0, 0) &&
        type === STAFF_CHECK_IN_TYPE
      ) {
        setLogTimeType(STAFF_CHECK_OUT_TYPE);
        setCheckInTime(
          formatHourMinute(formatWithMoment(startTime, HOURS_FORMAT))
        );

        const h = Math.floor(delta / ONE_HOURS_IN_MILS);
        const m = Math.floor((delta - h * ONE_HOURS_IN_MILS) / (1000 * 60));

        setWorkingTime(`${h} h ${m} m`);
      } else {
        //
        setLogTimeType(STAFF_CHECK_IN_TYPE);
      }

      setTimeout(() => {
        dialogRef.current?.show();
      }, 750);
    },
    isActive: popupPinCodeRef.current?.isShow(),
  });

  const [
    createStaffLogTime,
    { isLoading: isStaffLogTime, data: staffLogTimeCreated },
  ] = harmonyApi.useStaffLogTimeCreateMutation();

  const getLogTimeTextForType = React.useCallback(
    () =>
      logTimeType === STAFF_CHECK_IN_TYPE ? t("Check-In") : t("Check-Out"),
    [logTimeType]
  );

  const getTextForSuccessDialog = React.useCallback(
    () =>
      logTimeType === STAFF_CHECK_IN_TYPE
        ? t("Successful start of the work shift!")
        : t("End of shift successfully"),
    [logTimeType]
  );

  const onButtonPressed = async () => {
    if (isStaffLogTime) return;

    const currentDate = `${formatWithMoment(
      new Date(),
      DATE_FORMAT
    )}T${formatHourMinute(formatWithMoment(new Date(), HOURS_FORMAT))}:00`;

    const data = {
      merchantStaffLogtimeId: 0,
      startDate: currentDate,
      startTime: currentDate,
      note: note,
      amount: formatNumberFromCurrency(amount),
      type: logTimeType,
      staffName: displayName,
    };

    await createStaffLogTime(data);
  };

  const onCashCheck = () => {
    setCashCheck((prev) => !prev);
  };

  const _scrollToInput = (reactNode) => {
    // Add a 'scroll' ref to your ScrollView
    scrollRef.current?.scrollToFocusedInput(reactNode);
  };

  const onLoginStaff = async (pinCode) => {
    // console.log(pinCode);
    // await staffLogin({ merchantID, pinCode });
    await loginStaff(pinCode);
  };

  const onForceClosePopupPinCode = () => {
    setStartLogTime(false);
  };

  const resetAll = () => {
    setCashCheck(false);
    setNote(null);
    setAmount(0);
    setLogTimeType(STAFF_CHECK_IN_TYPE);
    setCheckInTime(null);
    setWorkingTime(null);
  };

  React.useImperativeHandle(ref, () => ({
    show: () => {
      //   dialogRef.current?.show();
      resetAll();
      setStartLogTime(true);
      popupPinCodeRef.current?.show();
    },
    hide: () => {
      setStartLogTime(false);
      dialogRef.current?.hide();
    },
  }));

  React.useEffect(() => {
    if (staffLogTimeCreated) {
      setStartLogTime(false);
      dialogRef.current?.hide();

      setTimeout(() => {
        dialogSuccessRef.current?.show();
      }, 550);
    }
  }, [staffLogTimeCreated]);

  return (
    <View>
      <DialogLayout
        title={getLogTimeTextForType()}
        ref={dialogRef}
        style={styles.dialog}
        behavior={"none"}
        onForceClose={() => {
          setStartLogTime(false);
        }}
        bottomChildren={() => (
          <View style={styles.bottomStyle}>
            <ButtonGradient
              label={getLogTimeTextForType()}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              onPress={onButtonPressed}
              isLoading={isStaffLogTime}
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
            <View style={{ alignItems: "center" }}>
              <Text style={styles.title}>
                {`Hello `}
                <Text
                  style={[{ color: colors.OCEAN_BLUE }]}
                >{`${displayName}`}</Text>
                {" !"}
              </Text>
              <View style={styles.margin} />
              {logTimeType === STAFF_CHECK_IN_TYPE && (
                <Text style={styles.textStyle}>
                  {t(
                    `Press the ${getLogTimeTextForType()} button to start your shift`
                  )}
                </Text>
              )}
              <View style={styles.marginVertical} />
              {logTimeType === STAFF_CHECK_OUT_TYPE && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {checkInTime && (
                    <Text
                      style={styles.textStyle}
                    >{`Check-In at: ${checkInTime}`}</Text>
                  )}
                  {workingTime && (
                    <Text
                      style={styles.textStyle}
                    >{`Working time : ${workingTime}`}</Text>
                  )}
                </View>
              )}
              <View style={styles.marginVertical} />

              <View
                style={{
                  width: scaleWidth(150),
                  alignSelf: "flex-start",
                }}
              >
                <SwitchLabel
                  label={t("Cash check")}
                  textStyle={styles.textStyle}
                  isLabelFront={false}
                  toggleSwitch={onCashCheck}
                  isEnabled={cashCheck}
                />
              </View>

              {cashCheck && (
                <View style={{ width: "100%" }}>
                  <View style={styles.marginVertical} />
                  <View style={styles.marginVertical} />

                  <Text style={styles.textStyle}>
                    {t("Cash amount (The money on the Box)")}
                  </Text>
                  <FormInputMask
                    placeholder={"Price"}
                    // required={true}
                    onChangeValue={setAmount}
                    defaultValue={amount || 0}
                    keyboardType="numeric"
                    onFocus={(event) => {
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
                    onFocus={(event) => {
                      // `bind` the function if you're using ES6 classes
                      _scrollToInput(ReactNative.findNodeHandle(event.target));
                    }}
                  />
                  <View style={styles.marginVertical} />
                </View>
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </DialogLayout>
      <PopupPinCode
        ref={popupPinCodeRef}
        hideCloseButton={false}
        title={t("Staff Log Time")}
        onSubmit={onLoginStaff}
        onForceClose={onForceClosePopupPinCode}
      />

      <DialogWithOneButton
        ref={dialogSuccessRef}
        title={t(`${getLogTimeTextForType()} Complete`)}
        description={`${getTextForSuccessDialog()}`}
      />
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

  margin: {
    height: scaleHeight(10),
  },
});
