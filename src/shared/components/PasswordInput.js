import IMAGE from '@resources';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { CustomInput } from './CustomInput';

const log = (obj, message = '') => {
  Logger.log(`[TextInputAuth] ${message}`, obj);
};
const PADDING = 15;

export const PasswordInput = ({ style, textInputProps }) => {
  const [hidePassword, setHidePassword] = React.useState(true);

  const visiblePasswordButtonPressed = React.useCallback(() => {
    setHidePassword(!hidePassword);
  }, [hidePassword]);

  return (
    <CustomInput
      style={style}
      textInputProps={Object.assign({}, textInputProps, {
        secureTextEntry: hidePassword,
        blurOnSubmit: false,
        // defaultValue:
      })}
    >
      <TouchableOpacity
        hitSlop={{
          top: PADDING,
          bottom: PADDING,
          left: PADDING,
          right: PADDING,
        }}
        style={styles.btnStyle}
        onPress={visiblePasswordButtonPressed}
        activeOpacity={1}
      >
        <Image
          source={hidePassword ? IMAGE.showPass : IMAGE.notShowPass}
          color={'#9E9E9E'}
          size={16}
        />
      </TouchableOpacity>
    </CustomInput>
  );
};

const styles = StyleSheet.create({
  container: {},

  btnStyle: {},
});
