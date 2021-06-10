import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts, colors } from '@shared/themes';
import { CustomInput } from './CustomInput';
import { useTranslation } from 'react-i18next';

export const FormContactEmail = ({ onChangeEmail, defaultValue }) => {
  const [t] = useTranslation();
  const [email, setEmail] = React.useState(defaultValue);
  const onHandleChange = (value) => {
    setEmail(value);
    if (onChangeEmail && typeof onChangeEmail === 'function') {
      onChangeEmail(value);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{t('Contact Email')}</Text>
      <View style={styles.content}>
        <CustomInput
          style={styles.customInput}
          textInputProps={{
            placeholder: t('Email Address'),
            fontSize: scaleFont(17),
            textAlign: 'left',
            defaultValue: email,
            onChangeText: onHandleChange,
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
    flex: 1,
    height: scaleHeight(40),
  },
});
