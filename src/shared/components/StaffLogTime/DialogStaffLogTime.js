import { CustomTimePicker } from "@components/CustomTimePicker";
import IMAGE from "@resources";
import {
  ButtonGradient,
  CustomRadioSelect,
  FormInput,
  FormInputMask,
  SwitchLabel,
  PopupPinCode,
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
import { useStaffLoginMutation } from "@shared/services";
import { useLockScreen } from "@shared/hooks";
import actions from "@actions";

export const DialogStaffLogTime = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const dialogRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  const popupPinCodeRef = React.useRef(null);

  const profileStaffLogin = useSelector(
    (state) => state.dataLocal?.profileStaffLogin
  );

  const [cashCheck, setCashCheck] = React.useState(false);
  const [note, setNote] = React.useState(null);
  const [amount, setAmount] = React.useState(0);
  const [startLogTime, setStartLogTime] = React.useState(false);

  const { loginStaff } = useLockScreen({
    onSubmitSuccess: () => {
      if (!startLogTime) return;
      popupPinCodeRef.current?.hide();
      dispatch(actions.app.closeAllPopupPincode());

      setTimeout(() => {
        dialogRef.current?.show();
      }, 1000);
    },
    isActive: popupPinCodeRef.current?.isShow(),
  });

  // const [staffLogin, { isLoading: isLoginStaff, data: loginStaffData }] =
  //   useStaffLoginMutation();

  const onButtonPressed = () => {};

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

  React.useImperativeHandle(ref, () => ({
    show: () => {
      //   dialogRef.current?.show();
      setStartLogTime(true);
      popupPinCodeRef.current?.show();
    },
    hide: () => {
      setStartLogTime(false);
      dialogRef.current?.hide();
    },
  }));

  return (
    <View>
      <DialogLayout
        title={t("Check-In")}
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
              onPress={onButtonPressed}
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
                >{`${profileStaffLogin?.displayName}`}</Text>
                {" !"}
              </Text>
              <View style={styles.margin} />
              <Text style={styles.textStyle}>
                {t("Press the Check-In button to start your shift")}
              </Text>
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
