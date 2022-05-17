import React from "react";
import { Switch, Platform } from "react-native";
import { colors } from "@shared/themes";

export const CustomSwitch = ({
  onValueChange,
  defaultValue = false,
  disabled,
  isBlock = false,
}) => {
  const [isEnabled, setIsEnabled] = React.useState(defaultValue ?? false);

  const toggleSwitch = () => {
    if (!isBlock) {
      const val = !isEnabled;
      if (onValueChange && typeof onValueChange === "function") {
        onValueChange(val);
      }
      setIsEnabled(val);
    }
  };

  React.useEffect(() => {
    setIsEnabled(defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  return (
    <Switch
      trackColor={{ false: colors.WHITE, true: colors.OCEAN_BLUE }}
      thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
      ios_backgroundColor="#BCBCBC"
      onValueChange={toggleSwitch}
      value={isEnabled}
      disabled={disabled}
      style={{
        transform: [{ scale: Platform.OS === "ios" ? 0.9 : 1 }],
      }}
    />
  );
};
