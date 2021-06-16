import { PopupCalendar } from "@components";
import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import { colors } from "@shared/themes";
import IMAGE from "@resources";
import { fonts, layouts } from "../themes";

export const ButtonCalendarFilter = React.forwardRef(
  ({ onChangeTimeValue, paddingLeft, paddingTop, defaultValue }, ref) => {
    const calendarRef = React.useRef(null);

    const [visible, setVisible] = React.useState(false);
    const [textTime, setTextTime] = React.useState(null);

    const onChangeTime = (time) => {
      setTextTime(time);
      setVisible(false);

      if (onChangeTimeValue && typeof onChangeTimeValue === "function") {
        onChangeTimeValue(time, calendarRef.current?.state);
      }
    };

    const openDatePicker = () => {
      setVisible(true);
    };

    React.useImperativeHandle(ref, () => ({
      setTimeValue: (timeValue) => {
        if (timeValue !== textTime)
          calendarRef.current?.selectQuickFilter(timeValue);
      },
    }));

    React.useEffect(() => {
      calendarRef.current?.selectQuickFilter(defaultValue ?? "This Week");
    }, []);

    return (
      <View>
        <TouchableOpacity style={styles.container} onPress={openDatePicker}>
          <Text style={styles.text}>{textTime}</Text>
          <View style={layouts.marginHorizontal} />
          <Image source={IMAGE.calendar} style={styles.icon} />
        </TouchableOpacity>
        <PopupCalendar
          ref={calendarRef}
          visible={visible}
          paddingLeft={paddingLeft ?? scaleWidth(100)}
          paddingTop={paddingTop ?? scaleHeight(137)}
          onRequestClose={setVisible}
          changeTitleTimeRange={onChangeTime}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc",
    flexDirection: "row",
    height: scaleHeight(40),
    alignItems: "center",
    minWidth: scaleWidth(128),
    justifyContent: "space-between",
    paddingHorizontal: scaleWidth(10),
    flex: 0,
  },

  icon: {
    width: scaleWidth(20),
    height: scaleHeight(20),
    tintColor: colors.BROWNISH_GREY,
  },

  text: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },
});
