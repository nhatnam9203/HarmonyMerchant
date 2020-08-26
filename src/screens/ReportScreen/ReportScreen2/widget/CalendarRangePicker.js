import React, { useState, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";

const DATE_FORMAT = "MM/DD/YYYY";

const CalendarRangePicker = ({
  renderBase,
  minDate = moment().format(DATE_FORMAT),
  maxDate = moment().format(DATE_FORMAT),
  onSelectDay,
}) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);

  const showPicker = () => {
    setVisible(true);
  };

  const hidePicker = () => {
    setVisible(false);
  };

  const onDayPress = (day) => {
    setSelected(day);
    if (typeof onSelectDay === "function")
      onSelectDay(moment(day.dateString).format(DATE_FORMAT));
    hidePicker();
  };

  const onMonthChange = (month) => {
    setCurrentMonth(month.month);
  };

  useEffect(() => {
    if (minDate && maxDate) {
      setCurrentMonth(moment(minDate).get("month") + 1);
      setSelected(null);
    }
  }, [minDate, maxDate]);

  /**render */

  return (
    <View>
      <TouchableWithoutFeedback onPress={showPicker}>
        <View pointerEvents="box-only">{RenderBase(renderBase)}</View>
      </TouchableWithoutFeedback>

      <Modal
        visible={visible}
        onRequestClose={hidePicker}
        style={{ backgroundColor: "red" }}
        transparent={true}
      >
        <View style={[styles.container, styles.shadowP]}>
          <Calendar
            style={{ marginBottom: 10 }}
            theme={{
              textSectionTitleDisabledColor: "#d9e1e8",

              // month
              textMonthFontSize: 16,
              textMonthFontWeight: "bold",
              monthTextColor: "#0764B0",

              // arrow
              arrowColor: "#0764B0",
              disabledArrowColor: "#d9e1e8",
              arrowStyle: { padding: 0 },

              // day selected
              selectedDayTextColor: "white",
              selectedDayBackgroundColor: "#0764B0",

              //day name
              textSectionTitleColor: "#0764B0",
              textDayHeaderFontSize: 15,
              textDayHeaderFontWeight: "normal",
            }}
            current={
              selected
                ? selected?.dateString
                : moment(minDate).add(1, "day").format(DATE_FORMAT)
            }
            minDate={moment(minDate).add(1, "day").format(DATE_FORMAT)}
            maxDate={maxDate}
            showWeekNumbers={false}
            firstDay={1}
            onDayPress={onDayPress}
            onMonthChange={onMonthChange}
            markingType={"period"}
            markedDates={{
              [selected?.dateString]: {
                selected: true,
                disableTouchEvent: true,
                startingDay: true,
                endingDay: true,
                color: "#0764B0",
              },
            }}
            disableAllTouchEventsForDisabledDays
            hideExtraDays={true}
            disableArrowLeft={currentMonth <= moment(minDate).get("month") + 1}
            disableArrowRight={currentMonth >= moment(maxDate).get("month") + 1}
          />
          <TouchableOpacity onPress={hidePicker}>
            <View style={styles.btnClose}>
              <Text style={styles.txtClose}>Close</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const RenderBase = (renderBase) => {
  if (typeof renderBase === "function") {
    return renderBase();
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    width: "50%",
    alignSelf: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    padding: 10,
  },
  calendarHeader: {
    height: 50,
    width: "100%",
    backgroundColor: "red",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnClose: {
    width: "100%",
    height: 45,
    backgroundColor: "#0764B0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  txtClose: {
    color: "#fff",
    fontSize: 17,
  },
  shadowP: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0,0.3)",
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 1,
      },

      android: {
        elevation: 2,
      },
    }),
  },
});

export default CalendarRangePicker;
