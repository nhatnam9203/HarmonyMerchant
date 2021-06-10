import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { colors } from '@shared/themes';
import { fonts } from '../themes';

export const CustomRadioSelect = React.forwardRef(
  ({ data, onSelect, onRenderLabel, required = false }, ref) => {
    const [value, setValue] = React.useState();

    const onHandleRenderLabel = (x) => {
      if (onRenderLabel && typeof onRenderLabel === 'function') {
        return onRenderLabel(x);
      }
      return <Text style={styles.textStyle}>{x?.label}</Text>;
    };

    const onHandleSelect = (newValue) => {
      setValue(newValue);
      if (onSelect && typeof onSelect === 'function') {
        const findItem = data?.find((x) => x.value === newValue);
        onSelect(findItem);
      }
    };

    React.useEffect(() => {
      if (data?.length > 0 && required) setValue(data[0].value);
    }, [data, required]);

    // React.useEffect(() => {
    //   setValue(defaultValue);
    // }, [defaultValue]);

    React.useImperativeHandle(ref, () => ({
      reset: () => {
        setValue(null);
      },
    }));

    return data ? (
      <RadioButton.Group onValueChange={onHandleSelect} value={value}>
        {data?.map((x) => (
          <View style={styles.rowContent}>
            <RadioButton.Android value={x?.value} color={colors.OCEAN_BLUE} />
            {onHandleRenderLabel(x)}
          </View>
        ))}
      </RadioButton.Group>
    ) : null;
  },
);

const styles = StyleSheet.create({
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: scaleHeight(2),
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },
});
