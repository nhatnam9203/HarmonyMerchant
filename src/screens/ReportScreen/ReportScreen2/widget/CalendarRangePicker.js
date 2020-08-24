import React, { useState } from "react";
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
import XDate from "xdate";

import { ModalCustom } from "@components";

const CalendarRangePicker = ({ renderBase }) => {
  const [visible, setVisible] = useState(false);

  const showPicker = () => {
    setVisible(true);
  };

  const hidePicker = () => {
    setVisible(false);
  };

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
            current={XDate.today().toString("yyyy-MM-dd")}
            minDate={"2020-05-10"}
            maxDate={XDate.today().toString("yyyy-MM-dd")}
            showWeekNumbers={true}
            firstDay={1}
            onDayPress={(day) => {
              console.log("selected day", day);
            }}
            markingType={"period"}
            markedDates={{}}
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

const RenderHeader = (date) => {
  const monthYear = XDate(date).toString("MMMM yyyy");

  return (
    <View style={styles.calendarHeader}>
      <Text>{monthYear}</Text>
      <TouchableOpacity>
        <View>
          <Text>Close</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
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
    width: 160,
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
