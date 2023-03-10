import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import { colors } from "@shared/themes";
import { fonts } from "../themes";

export const CustomRadioSelect = React.forwardRef(
  (
    {
      data,
      onSelect,
      onRenderLabel,
      required = false,
      defaultValue,
      horizontal = false,
      style,
    },
    ref
  ) => {
    const [value, setValue] = React.useState(defaultValue);

    const onHandleRenderLabel = (x) => {
      if (onRenderLabel && typeof onRenderLabel === "function") {
        return onRenderLabel(x);
      }
      return <Text style={styles.textStyle}>{x?.label}</Text>;
    };

    const onHandleSelect = (newValue) => {
      setValue(newValue);
      if (onSelect && typeof onSelect === "function") {
        const findItem = data?.find((x) => x.value === newValue);
        onSelect(findItem);
      }
    };

    React.useEffect(() => {
      if (data?.length > 0 && required) {
        setValue(data[0].value);
      }
    }, [data, required]);

    React.useImperativeHandle(ref, () => ({
      reset: () => {
        setValue(null);
      },
      setValue: (val) => {
        setValue(val);
      },
    }));

    return data ? (
      <RadioButton.Group onValueChange={onHandleSelect} value={value}>
        <View style={[horizontal && { flexDirection: "row" }, style]}>
          {data?.map((x) => (
            <View style={styles.rowContent} key={x?.value}>
              <RadioButton.Android value={x?.value} color={colors.OCEAN_BLUE} />
              {onHandleRenderLabel(x)}
            </View>
          ))}
        </View>
      </RadioButton.Group>
    ) : null;
  }
);

const styles = StyleSheet.create({
  rowContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: scaleHeight(2),
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },
});
