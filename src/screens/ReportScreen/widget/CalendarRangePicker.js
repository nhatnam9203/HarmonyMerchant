import React from "react";
import { Calendar } from "react-native-calendars";

import { ModalCustom } from "@components";

const CalendarRangePicker = ({ renderBase }) => {
  return (
    <View>
      {renderBase && renderBase()}

      <ModalCustom visible={true} style={{ backgroundColor: "red" }}>
        <Calendar // Initially visible month. Default = Date()
          current={"2012-03-01"}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={"2012-05-10"}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          maxDate={"2012-05-30"}
        />
      </ModalCustom>
    </View>
  );
};
