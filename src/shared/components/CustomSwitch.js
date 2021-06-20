import React from "react";
import { Switch, Platform } from "react-native";
import { colors } from "@shared/themes";

export const CustomSwitch = ({
  onValueChange,
  defaultValue = false,
  disabled,
  isBlock = false,
}) => {
  const [isEnabled, setIsEnabled] = React.useState();

  const toggleSwitch = () => {
    if (!isBlock) {
      setIsEnabled((previousState) => !previousState);
    }
  };

  React.useEffect(() => {
    if (onValueChange && typeof onValueChange === "function") {
      onValueChange(isEnabled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled]);

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
