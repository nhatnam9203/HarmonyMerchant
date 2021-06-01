import React from "react";
import { Keyboard, Platform, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const HOURS_FORMAT = "hh:mm A";
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
  const [date, setDate] = React.useState();

  const showPicker = () => {
    Keyboard.dismiss();
    setVisible(true);
  };

  const hidePicker = () => {
    setVisible(false);
  };

  React.useEffect(() => {
    if (dateString) {
      setDate(dateString);
    }
  }, [dateString]);

  const handleConfirm = (selectDate) => {
    if (Platform.OS === "android") {
      hidePicker();
    }

    if (typeof onChangeDate === "function") {
      onChangeDate(selectDate);
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
        locale="en-US"
        is24Hour={false}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        // value={date}
        cancelTextIOS={"Close"}
        confirmTextIOS={"Confirm"}
        headerTextIOS={"Pick Time"}
        minuteInterval={30}
      />
    </View>
  );
};

export default CustomTimePicker;
