import React from "react";
import { View, Text, TextInput, StyleSheet, FlatList } from "react-native";
import { ButtonGradient, CustomCheckBox } from "@shared/components";
import { useTranslation } from "react-i18next";
import { layouts, colors, fonts } from "@shared/themes";
import { ORDERED_STATUS } from "@shared/components/OrderStatusView";
import { dateToString, DATE_TIME_SHOW_FORMAT_STRING } from "@shared/utils";

export const FormEditNotes = ({
  onSubmitNotes,
  notes,
  isShowButtonSubmit = true,
  onChangeValue,
  orderStatus,
  onDidNotPayCheck,
}) => {
  const [t] = useTranslation();
  const [lastNote, setLastNote] = React.useState(null);

  const onHandleSubmitNotes = () => {
    if (!lastNote) {
      return;
    }

    if (onSubmitNotes && typeof onSubmitNotes === "function") {
      onSubmitNotes(lastNote);
    }

    setLastNote(null);
  };

  const onHandleChangeText = (text) => {
    setLastNote(text);
    if (onChangeValue && typeof onChangeValue === "function") {
      onChangeValue(text);
    }
  };

  const setToggleCheckBox = (bl) => {
    if (onDidNotPayCheck && typeof onDidNotPayCheck === "function") {
      onDidNotPayCheck(bl);
    }
  };

  const renderNoteItem = ({ item, index }) => {
    return (
      <View key={`${item?.createDate ?? index}`}>
        <Text style={styles.noteLabelText}>{`${dateToString(
          item?.createDate,
          DATE_TIME_SHOW_FORMAT_STRING
        )}`}</Text>
        <Text style={styles.noteStyle}>{item?.note}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* {orderStatus === ORDERED_STATUS.PENDING && (
        <CustomCheckBox
          label={t("Did not pay")}
          onValueChange={setToggleCheckBox}
          selectedColor={colors.OCEAN_BLUE}
          onCheckColor="#fff"
          textStyle={styles.textStyle}
          style={{ height: scaleHeight(40) }}
        />
      )} */}
      <Text>{t("Comment Text")}</Text>
      <View style={layouts.marginVertical} />
      <TextInput
        style={styles.textInput}
        placeholderTextColor="#C5C5C5"
        multiline={true}
        value={lastNote}
        onChangeText={onHandleChangeText}
      />
      <View style={layouts.marginVertical} />
      <View style={layouts.marginVertical} />
      <View style={styles.horizontal}>
        <FlatList
          style={styles.notesContainer}
          data={notes}
          renderItem={renderNoteItem}
          keyExtractor={(item, index) => `${item?.createDate ?? index}`}
          ListFooterComponent={() => (
            <View style={{ height: scaleHeight(5) }} />
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: scaleHeight(10) }} />
          )}
        />
        <View style={layouts.marginHorizontal} />
        {true && (
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "flex-start",
            }}
          >
            <ButtonGradient
              label={t("Submit notes")}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              fontSize={scaleFont(17)}
              textWeight="normal"
              onPress={onHandleSubmitNotes}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: "100%",
  },

  textInput: {
    height: scaleHeight(60),
    borderWidth: scaleWidth(1),
    borderColor: "#C5C5C5",
    textAlignVertical: "top",
    padding: scaleWidth(16),
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
    // textDecorationLine: "underline",
  },

  noteStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
    // textDecorationLine: "underline",
  },

  noteLabelText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  notesContainer: {
    maxHeight: scaleHeight(135),
    flex: 1,
  },

  horizontal: {
    flexDirection: "row",
  },
});
