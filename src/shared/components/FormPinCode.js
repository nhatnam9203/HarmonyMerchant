import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts, colors, layouts } from '@shared/themes';
import { PasswordInput } from './PasswordInput';
import { useTranslation } from 'react-i18next';

export const FormPinCode = ({ onChangePinCode, defaultValue, onBlur }) => {
  const [t] = useTranslation();
  const [pincode, setPinCode] = React.useState('');

  const onHandleChange = (value) => {
    setPinCode(value);
    if (onChangePinCode && typeof onChangePinCode === 'function') {
      onChangePinCode(value);
    }
  };

  React.useEffect(() => {
    if (defaultValue) {
      setPinCode(defaultValue);
    }
  }, [defaultValue]);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{t('PIN code')}</Text>
      <View style={styles.content}>
        <PasswordInput
          style={styles.customInput}
          key="txt-input-pincode"
          textInputProps={{
            // ref: iRef,
            returnKeyType: 'send',
            clearButtonMode: 'never',
            placeholder: t('PIN code'),
            defaultValue: pincode,
            onChangeText: onHandleChange,
            onBlur: onBlur,
            keyboardType: 'numeric',
            maxLength: 4,
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

  customInput: {
    ...layouts.fullWidth,
    height: scaleHeight(40),
  },
});
