import moment from "moment";
import React from "react";
import { TouchableOpacity, View, Keyboard, Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// const DATE_FORMAT = 'YYYY/MM/DD';
const HOURS_FORMAT = "hh:mm A";
// const DATE_FORMAT = 'YYYY-MM-DD hh:mm:ss';
const LAYOUT_WIDTH = "100%";

const CustomTimePicker = ({
  renderBase,
  onChangeDate,
  style,
  fmDate = HOURS_FORMAT,
  editable = false,
  dateString,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [date, setDate] = React.useState(new Date());

  const showPicker = () => {
    Keyboard.dismiss();
    setVisible(true);
  };

  const hidePicker = () => {
    setVisible(false);
  };

  function createDateAsUTC(date) {
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );
  }

  React.useEffect(() => {
    if (dateString) {
      var dateObject = moment(dateString, "DD/MM/YYYY HH:mm A");
      // Logger.debug(dateObject, '=======> dateObject');

      setDate(dateObject?.toDate());
    }
  }, [dateString]);

  const handleConfirm = (selectDate) => {
    if (Platform.OS === "android") {
      hidePicker();
    }

    if (typeof onChangeDate === "function") {
      var current = moment().startOf("day");
      const temtFormatDate = moment.parseZone(date);
      const diffDate = moment(new Date()).diff(moment(date)); // số tuổi tính ms
      const delta = moment(temtFormatDate).diff(current, "days");

      if (delta > 0) {
        onChangeDate(moment(selectDate).format(fmDate));
      } else {
        const deltaH = moment(selectDate).diff(moment(new Date()), "minute");
        if (deltaH > 0) {
          onChangeDate(moment(selectDate).format(fmDate));
        } else {
          alert("Error when pick time");

          return;
        }
      }
    }

    if (Platform.OS === "ios") {
      hidePicker();
    }
  };

  return (
    <View>
      {editable ? (
        <View style={{ width: LAYOUT_WIDTH }}>
          {typeof renderBase === "function" && renderBase(showPicker)}
        </View>
      ) : (
        <TouchableOpacity onPress={showPicker} activeOpacity={1}>
          <View pointerEvents="box-only" style={{ width: LAYOUT_WIDTH }}>
            {typeof renderBase === "function" && renderBase()}
          </View>
        </TouchableOpacity>
      )}

      <DateTimePickerModal
        testID="dateTimePicker"
        isVisible={visible}
        mode="time"
        display={"spinner"}
        is24Hour={false}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        value={date}
        cancelTextIOS={"Close"}
        confirmTextIOS={"Confirm"}
        headerTextIOS={"Pick Time"}
        minuteInterval={30}
      />
    </View>
  );
};

export default CustomTimePicker;
