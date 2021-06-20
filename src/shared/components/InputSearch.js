import IMAGE from '@resources';
import { colors } from '@shared/themes';
import _ from 'lodash';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { CustomInput } from './CustomInput';

export const InputSearch = ({ width, height, onSearch, textInputProps }) => {
  const [value, setValue] = React.useState();

  const debounce = React.useCallback(
    _.debounce((_prop) => {
      if (onSearch && typeof onSearch === 'function') {
        onSearch(_prop);
      }
    }, 800),
    [onSearch],
  );

  const onHandleChange = (val) => {
    setValue(val);
    debounce(val);
  };

  return (
    <CustomInput
      style={[styles.container, { width, height }]}
      textInputProps={Object.assign({}, textInputProps, {
        blurOnSubmit: false,
        placeholder: 'Search',
        fontSize: scaleFont(17),
        defaultValue: value,
        onChangeText: onHandleChange,
        textAlign: 'left',
      })}
    >
      <Image source={IMAGE.search} color={'#9E9E9E'} size={scaleWidth(32)} />
    </CustomInput>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 1,
    backgroundColor: colors.WHITE,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cccccc',
    height: '100%',
  },
});
