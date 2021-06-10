import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts, colors } from '@shared/themes';
import { CustomInputMask } from './CustomInput';
import { useTranslation } from 'react-i18next';
import { ButtonCountryCode } from './ButtonCountryCode';

export const FormPhoneNumber = ({
  phoneNumber,
  onChangePhoneNumber,
  hasTitle = true,
  dropDownDirection,
}) => {
  const [t] = useTranslation();
  const [phoneNumberValue, setPhoneNumber] = React.useState(phoneNumber);
  const [phoneCodeValue, setPhoneCode] = React.useState('+1');

  const onHandleChangeValue = (value) => {
    // !! format phone input here
    setPhoneNumber(value);
    if (onChangePhoneNumber && typeof onChangePhoneNumber === 'function') {
      onChangePhoneNumber(`${phoneCodeValue}${value}`);
    }
  };

  const onHandleChangeCountryCode = (code) => {
    setPhoneCode(code);
    if (onChangePhoneNumber && typeof onChangePhoneNumber === 'function') {
      onChangePhoneNumber(`${code}${phoneNumberValue}`);
    }
  };

  return (
    <View style={styles.container}>
      {hasTitle && (
        <Text style={styles.textStyle}>
          {t('Phone Number')} <Text style={styles.requiredStyle}>*</Text>
        </Text>
      )}
      <View style={styles.content}>
        <ButtonCountryCode
          onChangeValue={onHandleChangeCountryCode}
          defaultValue={phoneCodeValue}
          width={scaleWidth(100)}
          height={scaleHeight(40)}
          dropDownDirection={dropDownDirection}
        />
        <View style={styles.horizontalPadding} />
        <CustomInputMask
          options={{
            /**
             * mask: (String | required | default '')
             * the mask pattern
             * 9 - accept digit.
             * A - accept alpha.
             * S - accept alphanumeric.
             * * - accept all, EXCEPT white space.
             */
            mask: '999-999-9999',
          }}
          style={styles.customInput}
          textInputProps={{
            placeholder: t('Enter Phone Number'),
            fontSize: scaleFont(17),
            textAlign: 'left',
            defaultValue: phoneNumberValue,
            onChangeText: onHandleChangeValue,
            keyboardType: 'phone-pad',
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleHeight(8),
  },

  content: {
    flexDirection: 'row',
    paddingVertical: scaleHeight(10),
    justifyContent: 'space-between',
  },

  textStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },

  requiredStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.ORANGEY_RED,
  },

  customInput: {
    flex: 1,
    height: scaleHeight(40),
  },

  horizontalPadding: {
    width: scaleWidth(16),
  },
});
