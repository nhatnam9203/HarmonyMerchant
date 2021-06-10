import IMAGE from '@resources';
import { CustomCheckBox } from '@shared/components/CustomCheckBox';
import { PasswordInput } from '@shared/components/PasswordInput';
import { CustomInput } from '@shared/components/CustomInput';
import { colors, fonts, layouts } from '@shared/themes';
import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

DropDownPicker.setListMode('SCROLLVIEW');

const log = (obj, message = '') => {
  Logger.log(`[SigInScreen] ${message}`, obj);
};

export const Layout = ({
  inputIdSubmit,
  inputIdRef,
  inputPassSubmit,
  inputPassRef,
  onForgotPasswordPress,
  terminalIDs,
  errorMsg,
  toggleCheckBox,
  setToggleCheckBox,
  signInFormik,
}) => {
  const { t } = useTranslation();
  return (
    <View style={layouts.fill}>
      <ImageBackground
        style={layouts.fullSize}
        source={IMAGE.MerchantBackground}
      >
        <ImageLogo />
        {!!errorMsg && (
          <View style={styles.errorContent}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
        <KeyboardAwareScrollView bounces={false}>
          <View style={styles.content}>
            <View style={[layouts.horizontal, layouts.center]}>
              <Text style={[styles.signUpText, { color: colors.WHITE }]}>
                {t('No account')}
              </Text>
              <TouchableOpacity activeOpacity={0.5}>
                <Text style={styles.signUpText}>{t('Sign Up')}</Text>
              </TouchableOpacity>
            </View>

            <ButtonSignIn
              disable={!signInFormik.isValid || !signInFormik.dirty}
              onPress={signInFormik.handleSubmit}
            />

            <View
              style={[
                layouts.horizontal,
                layouts.horizontalSpaceBetween,
                styles.forgotPassword,
              ]}
            >
              <CustomCheckBox
                label={t('Remember MID')}
                value={toggleCheckBox}
                onValueChange={setToggleCheckBox}
              />
              <TouchableOpacity
                onPress={onForgotPasswordPress}
                activeOpacity={0.5}
              >
                <Text style={styles.textForgotPassword}>
                  {t('Forgot password')}
                </Text>
              </TouchableOpacity>
            </View>

            <DropdownTerminalId
              terminalIDList={terminalIDs}
              value={signInFormik.values.terminalId}
              onChangeValue={(callback) => {
                return signInFormik.setFieldValue(
                  'terminalId',
                  callback(signInFormik.values.terminalId),
                );
              }}
            />

            <InputPassword
              submit={inputPassSubmit}
              iRef={inputPassRef}
              value={signInFormik.values.password}
              onChangeValue={signInFormik.handleChange('password')}
              onBlur={signInFormik.handleBlur('password')}
            />

            <InputMerchantID
              submit={inputIdSubmit}
              iRef={inputIdRef}
              value={signInFormik.values.email}
              onChangeValue={signInFormik.handleChange('email')}
              onBlur={signInFormik.handleBlur('email')}
            />
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </View>
  );
};

const ImageLogo = () => (
  <Image source={IMAGE.MerchantLogo} style={styles.logo} />
);

let InputMerchantID = ({ submit, iRef, t, value, onChangeValue, onBlur }) => (
  <CustomInput
    key="txt-input-merchantID"
    style={styles.textInput}
    textInputProps={{
      onSubmitEditing: submit,
      ref: iRef,
      returnKeyType: 'next',
      clearButtonMode: 'while-editing',
      value: value,
      defaultValue: value,
      onChangeText: onChangeValue,
      placeholder: t('Merchant ID'),
      onBlur: onBlur,
    }}
  />
);
InputMerchantID = withTranslation()(InputMerchantID);

let InputPassword = ({ submit, iRef, t, value, onChangeValue, onBlur }) => (
  <PasswordInput
    key="txt-input-password"
    style={styles.textInput}
    textInputProps={{
      onSubmitEditing: submit,
      ref: iRef,
      returnKeyType: 'send',
      clearButtonMode: 'never',
      placeholder: t('Password'),
      value: value,
      onChangeText: onChangeValue,
      onBlur: onBlur,
    }}
  />
);
InputPassword = withTranslation()(InputPassword);

let ButtonSignIn = ({ t, disable, onPress }) => (
  <Pressable
    style={({ pressed }) => [
      styles.signInButton,
      {
        backgroundColor: disable
          ? colors.VERY_LIGHT_PINK_1
          : colors.WEIRD_GREEN,
        opacity: pressed ? 0.8 : 1,
      },
    ]}
    disabled={disable}
    onPress={onPress}
  >
    <Text
      style={[
        styles.signInText,
        { color: disable ? colors.BROWNISH_GREY : colors.WHITE },
      ]}
    >
      {t('SIGN IN')}
    </Text>
  </Pressable>
);
ButtonSignIn = withTranslation()(ButtonSignIn);

let DropdownTerminalId = ({ t, terminalIDList, value, onChangeValue }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <View style={styles.dropdownTerminal}>
      <DropDownPicker
        value={value}
        items={terminalIDList}
        open={open}
        setOpen={setOpen}
        setValue={onChangeValue}
        style={styles.dropdownTerminalContent}
        textStyle={styles.dropdownTerminalText}
        selectedItemLabelStyle={styles.selectedItemLabelStyle}
        listItemLabelStyle={styles.itemLabelStyle}
        dropDownContainerStyle={styles.dropDownContainerStyle}
        placeholderStyle={styles.dropdownTerminalPlaceholder}
        dropDownDirection="AUTO"
        scrollViewProps={{
          decelerationRate: 'fast',
        }}
        itemKey="label"
        closeAfterSelecting={true}
        showTickIcon={false}
      />
    </View>
  );
};
DropdownTerminalId = withTranslation()(DropdownTerminalId);

const styles = StyleSheet.create({
  logo: {
    position: 'absolute',
    top: scaleHeight(64),
    alignSelf: 'center',
    flex: 0,
  },

  content: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: scaleWidth(400),
    marginTop: scaleHeight(245),
    flex: 1,
    flexDirection: 'column-reverse',
  },

  textInput: {
    marginBottom: scaleHeight(25),
    borderRadius: scaleWidth(3),
  },

  forgotPassword: {
    marginBottom: scaleHeight(25),
  },

  textForgotPassword: {
    fontFamily: fonts.ITALIC,
    fontSize: scaleFont(20),
    fontWeight: 'normal',
    fontStyle: 'italic',
    letterSpacing: 0,
    textAlign: 'right',
    color: colors.WHITE,
  },

  signInButton: {
    width: scaleWidth(400),
    height: scaleHeight(60),
    borderRadius: scaleWidth(3),
    backgroundColor: colors.VERY_LIGHT_PINK_1,
    marginBottom: scaleHeight(55),
    justifyContent: 'center',
    alignItems: 'center',
  },

  signInText: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(25),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.BROWNISH_GREY,
  },

  signUpText: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(24),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.ROBIN_S_EGG,
    marginHorizontal: scaleWidth(6),
  },

  dropdownTerminal: {
    flexDirection: 'row',
    height: scaleHeight(50),
    width: scaleWidth(400),
    marginBottom: scaleHeight(25),
    borderRadius: scaleWidth(3),
  },

  dropdownTerminalContent: {
    backgroundColor: '#fff',
    borderRadius: scaleWidth(3),
    borderWidth: 0,
  },

  dropDownContainerStyle: {
    borderWidth: 0,
  },

  dropdownTerminalText: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: '400',
    fontStyle: 'normal',
    letterSpacing: 1,
    textAlign: 'center',
    color: colors.GREYISH_BROWN,
  },

  dropdownTerminalPlaceholder: {
    fontFamily: 'Roboto-Light',
    fontWeight: '300',
    letterSpacing: 0,
    color: colors.INACTIVE,
  },

  selectedItemLabelStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: '400',
    fontStyle: 'normal',
    letterSpacing: 1,
    textAlign: 'center',
    color: colors.ROBIN_S_EGG,
  },

  itemLabelStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: '400',
    fontStyle: 'normal',
    letterSpacing: 1,
    textAlign: 'center',
    color: colors.GREYISH_BROWN,
  },

  errorContent: {
    width: scaleWidth(400),
    position: 'absolute',
    top: scaleHeight(200),
    alignSelf: 'center',
    flex: 0,
  },

  errorText: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.ORANGEY_RED,
  },
});
