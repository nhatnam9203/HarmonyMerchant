import { colors } from '@shared/themes';
import { isEmpty } from 'ramda';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

export const CustomInput = ({
  style,
  textInputProps: {
    defaultValue,
    fontSize,
    textAlign,
    onChangeText,
    textInputStyle,
    ...textInputProps
  },
  children,
}) => {
  const [value, setValue] = React.useState();
  const onHandleChangeText = (text) => {
    setValue(text);
    if (onChangeText && typeof onChangeText === 'function') {
      onChangeText(text);
    }
  };

  React.useEffect(() => {
    if (defaultValue) {
      if (typeof defaultValue === 'string') {
        setValue(defaultValue);
      } else setValue(defaultValue + '');
    }
  }, [defaultValue]);

  return (
    <View style={[styles.container, style]}>
      <TextInput
        onChangeText={onHandleChangeText}
        {...textInputProps}
        value={value}
        style={[
          styles.textInput,
          textAlign && { textAlign },
          value?.length > 0
            ? [styles.textEditStyle, fontSize && { fontSize }]
            : [styles.textPlaceholderStyle, fontSize && { fontSize }],
          textInputStyle,
        ]}
      />
      {children}
    </View>
  );
};

export const CustomInputMask = ({
  style,
  textInputProps: {
    defaultValue,
    fontSize,
    textAlign,
    onChangeText,
    ...textInputProps
  },
  children,
  options,
  type,
}) => {
  const [value, setValue] = React.useState(null);
  const onHandleChangeText = (text) => {
    setValue(text);
    if (onChangeText && typeof onChangeText === 'function') {
      onChangeText(text);
    }
  };

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <View style={[styles.container, style]}>
      <TextInputMask
        type={type ?? 'custom'}
        options={
          options ?? {
            /**
             * mask: (String | required | default '')
             * the mask pattern
             * 9 - accept digit.
             * A - accept alpha.
             * S - accept alphanumeric.
             * * - accept all, EXCEPT white space.
             */
            mask: '999-999-9999',
          }
        }
        {...textInputProps}
        onChangeText={onHandleChangeText}
        value={value}
        style={[
          styles.textInput,
          textAlign && { textAlign },
          !isEmpty(value)
            ? [styles.textEditStyle, fontSize && { fontSize }]
            : [styles.textPlaceholderStyle, fontSize && { fontSize }],
        ]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 1,
    backgroundColor: colors.WHITE,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dddddd',
    width: scaleWidth(400),
    height: scaleHeight(48),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scaleWidth(8),
  },

  textInput: {
    height: scaleHeight(26),
    fontSize: scaleFont(20),
    textAlign: 'center',
    fontStyle: 'normal',
    flex: 1,
  },

  textPlaceholderStyle: {
    fontFamily: 'Roboto-Light',
    fontWeight: '300',
    letterSpacing: 0,
    color: colors.INACTIVE,
  },

  textEditStyle: {
    color: colors.GREYISH_BROWN,
    letterSpacing: 1,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
  },
});
