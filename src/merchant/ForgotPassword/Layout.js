import IMAGE from '@resources';
import { CustomInput } from '@shared/components/CustomInput';
import { colors, layouts, fonts } from '@shared/themes';
import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation, withTranslation } from 'react-i18next';

export const Layout = ({
  inputIdSubmit,
  inputEmailRef,
  forgotPassFormik,
  errorMsg,
}) => {
  return (
    <View style={layouts.fill}>
      <ImageBackground style={styles.imageBg} source={IMAGE.MerchantBackground}>
        <ImageLogo />
        <KeyboardAwareScrollView bounces={false}>
          <View style={styles.content}>
            <TextTitle />
            <SpacingVertical />
            <TextDescription />
            <SpacingVertical />
            <SpacingVertical />
            <SpacingVertical />
            <InputEmail
              submit={inputIdSubmit}
              iRef={inputEmailRef}
              value={forgotPassFormik.values.email}
              onChangeValue={forgotPassFormik.handleChange('email')}
              onBlur={forgotPassFormik.handleBlur('email')}
            />

            <SpacingVertical />
            <SpacingVertical />
            {!!errorMsg && (
              <View style={styles.errorContent}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}
            <SpacingVertical />
            <SpacingVertical />
            <ButtonSignIn
              disable={!forgotPassFormik.isValid || !forgotPassFormik.dirty}
              onPress={forgotPassFormik.handleSubmit}
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

let InputEmail = ({ submit, iRef, t, value, onChangeValue }) => (
  <CustomInput
    key="txt-input-email"
    style={styles.textInput}
    textInputProps={{
      onSubmitEditing: submit,
      ref: iRef,
      returnKeyType: 'send',
      clearButtonMode: 'while-editing',
      placeholder: t('Email address'),
      defaultValue: value,
      onChangeText: onChangeValue,
      autoFocus: true,
      autoCapitalize: 'none',
    }}
  />
);
InputEmail = withTranslation()(InputEmail);

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
    onPress={onPress}
  >
    <Text
      style={[
        styles.signInText,
        { color: disable ? colors.BROWNISH_GREY : colors.WHITE },
      ]}
    >
      {t('submit').toUpperCase()}
    </Text>
  </Pressable>
);
ButtonSignIn = withTranslation()(ButtonSignIn);

let TextTitle = ({ t }) => {
  return <Text style={styles.textTitle}>{t('Forgot Password')}</Text>;
};
TextTitle = withTranslation()(TextTitle);

let TextDescription = ({ t }) => {
  return (
    <Text style={styles.textDescription}>
      {t(
        "Please enter your email address and we'll send you \n instructions on how to reset your password"
      )}
    </Text>
  );
};
TextDescription = withTranslation()(TextDescription);

const SpacingVertical = () => <View style={layouts.marginVertical} />;

const styles = StyleSheet.create({
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },

  logo: {
    position: 'absolute',
    top: scaleHeight(64),
    alignSelf: 'center',
  },

  content: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleHeight(210),
    flex: 1,
  },

  textInput: {
    marginBottom: scaleHeight(25),
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
    fontFamily: 'Roboto-Medium',
    fontSize: scaleFont(25),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
  },

  textTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: scaleFont(40),
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.WHITE,
  },

  textDescription: {
    fontFamily: 'Roboto-Light',
    fontSize: scaleFont(24),
    fontWeight: '300',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.WHITE,
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
