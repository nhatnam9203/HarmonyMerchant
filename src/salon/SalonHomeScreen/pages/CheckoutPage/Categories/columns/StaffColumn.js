import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { SalonHomeContext } from "../../SalonHomeContext";
import { ColumnContainer, Header } from "../../widgets";

export const StaffColumn = ({ staffFlatListRef }) => {
  const { t } = useTranslation();
  const ctx = React.useContext(SalonHomeContext);
  const {
    isBlockBookingFromCalendar,
    staffListCurrentDate,
    selectedStaff,
    displayCategoriesColumn,
    loginStaff,
  } = ctx || {};

  const _onSelectStaff = () => {};

  const _renderStaff = ({ item, index }) => {
    const onHandleDisplayCategoriesColumn = () => {
      displayCategoriesColumn(item);
    };

    return (
      <StaffItem
        key={`${index}`}
        staff={item}
        onSelectStaff={onHandleDisplayCategoriesColumn}
        selectedStaff={selectedStaff}
        loginStaff={loginStaff}
      />
    );
  };

  const _renderSeparator = () => (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: colors.VERY_LIGHT_PINK_E_5,
      }}
    />
  );

  return (
    <ColumnContainer
      style={{
        width: scaleWidth(80),
        height: "100%",
      }}
      highlight={false}
      border={false}
    >
      <Header label={t("Staff")} />
      <FlatList
        ref={staffFlatListRef}
        style={{ flex: 1 }}
        data={staffListCurrentDate}
        renderItem={_renderStaff}
        extraData={(item, index) => `${index}`}
        keyExtractor={(item, index) => `${item?.staffId}_${index}`}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={() => {}}
        ItemSeparatorComponent={_renderSeparator}
      />
      {isBlockBookingFromCalendar && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#fff7",
          }}
        />
      )}
    </ColumnContainer>
  );
};

const StaffItem = ({ staff, selectedStaff, loginStaff, onSelectStaff }) => {
  const {
    imageUrl,
    displayName = "",
    orderNumber = 0,
    isNextAvailableStaff,
    staffId,
  } = staff || {};

  const isSelected = () => {
    return selectedStaff?.staffId === staffId;
  };

  const isMine = () => {
    return loginStaff?.staffId === staffId;
  };

  return (
    <TouchableOpacity onPress={onSelectStaff}>
      <View
        style={{
          ...layouts.center,
          height: scaleHeight(80),
          width: "100%",
          backgroundColor: isSelected()
            ? colors.OCEAN_BLUE
            : isMine()
            ? colors.AZURE
            : "transparent",
        }}
      >
        <FastImage
          style={styles.avatar}
          source={
            imageUrl
              ? {
                  uri: imageUrl,
                  priority: FastImage.priority.normal,
                }
              : ICONS.StaffAvatar
          }
        />
        <View style={{ height: scaleHeight(6) }} />
        <Text
          style={{
            fontFamily: fonts.REGULAR,
            fontSize: scaleFont(12),
            fontWeight: "normal",
            fontStyle: "normal",
            letterSpacing: 0,
            textAlign: "center",
            color: isSelected() ? colors.WHITE : colors.GREYISH_BROWN,
          }}
        >{`${displayName}`}</Text>
      </View>
      <NextTurnAlert
        isNextAvailableStaff={isNextAvailableStaff}
        orderNumber={orderNumber}
      />
    </TouchableOpacity>
  );
};

const NextTurnAlert = ({ orderNumber, isNextAvailableStaff }) => {
  return (
    <View
      style={{
        width: scaleWidth(20),
        height: scaleHeight(20),
        borderRadius: scaleWidth(10),
        backgroundColor: isNextAvailableStaff
          ? colors.ORANGEY_RED
          : colors.OCEAN_BLUE,
        ...layouts.center,
        position: "absolute",
        top: scaleHeight(2),
        left: scaleWidth(2),
      }}
    >
      <Text
        style={{
          fontFamily: fonts.REGULAR,
          fontSize: scaleFont(12),
          fontWeight: "500",
          fontStyle: "normal",
          letterSpacing: 0,
          textAlign: "center",
          color: colors.WHITE,
        }}
      >{`${orderNumber}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: scaleWidth(46),
    height: scaleHeight(46),
    borderRadius: scaleWidth(23),
    borderWidth: 1,
    borderColor: "#efefef",
  },
});
