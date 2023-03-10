import ICON from "@resources";
import { ButtonDrawer } from "@shared/components/ButtonDrawer";
import { ButtonLock } from "@shared/components/ButtonLock";
import { WithDialogPinCode } from "@shared/HOC/withDialogPinCode";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const BAR_HEIGHT = scaleHeight(48);
const CONTENT_HEIGHT = scaleHeight(47);

const ButtonLockScreen = WithDialogPinCode(ButtonLock);

export const HomeTopTabBar = ({
  state,
  descriptors,
  navigation,
  position,
  onOpenDrawer,
  notificationContUnread = 0,
  onChangeTab,
  isBlockChangeTab = false,
  onWillChangeTab,
  displayNotificationPopup = () => {},
}) => {
  const renderTab = (name, page, isTabActive, onPress) => {
    const textColor = isTabActive ? "#FFFFFF" : "#0872C9";
    const fontWeight = isTabActive ? "bold" : "normal";

    return (
      <TouchableOpacity
        style={[styles.compressible]}
        key={`${name}_${page}`}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={onPress}
      >
        <LinearGradient
          colors={isTabActive ? ["#0872C9", "#0764B0"] : ["#FFFFFF", "#F1F1F1"]}
          style={[styles.tab, isTabActive && styles.activeTab]}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: scaleWidth(12),
              justifyContent: "center",
            }}
          >
            <Text
              style={[
                styles.textStyle,
                {
                  color: textColor,
                },
              ]}
            >
              {name}
            </Text>
          </View>
        </LinearGradient>

        {page === 1 && isTabActive && (
          <TouchableOpacity
            onPress={() => displayNotificationPopup()}
            style={{
              position: "absolute",
              with: scaleWidth(80),
              right: scaleWidth(10),
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Image
              source={ICON.noti_bell}
              style={{ height: scaleWidth(28), width: scaleHeight(28) }}
            />
            {notificationContUnread > 0 && (
              <View
                style={{
                  width: scaleWidth(16),
                  height: scaleHeight(16),
                  backgroundColor: "#EE2F24",
                  position: "absolute",
                  top: scaleHeight(2),
                  right: 0,
                  borderRadius: scaleHeight(8),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: scaleFont(10),
                    fontWeight: "600",
                  }}
                >
                  {`${notificationContUnread ?? "0"}`}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ButtonDrawer onPress={onOpenDrawer} />
      <View style={[styles.tabContainer, styles.shadow]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const label =
            options.title !== undefined
              ? options.title
              : options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            if (
              onWillChangeTab &&
              typeof onWillChangeTab === "function" &&
              !isFocused
            ) {
              onWillChangeTab(route.name);
            }

            if (isBlockChangeTab) {
              return;
            }

            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            // change tab process
            if (!isFocused && !event.defaultPrevented) {
              if (onChangeTab && typeof onChangeTab === "function") {
                onChangeTab(route.name);
              }

              navigation.navigate(route.name, {
                checkoutStaffId: 0,
                bookingStaffId: 0,
              });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return renderTab(label, index, isFocused, onPress);
        })}
      </View>
      <ButtonLockScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: BAR_HEIGHT,
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#EEEEEE",
    height: CONTENT_HEIGHT,
    flex: 1,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2,

    elevation: 3,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // borderRightWidth: 0.5,
    // borderRightColor: '#404040',
  },
  compressible: { flex: 1, backgroundColor: "#eaeaea" },

  activeTab: {
    position: "absolute",
    height: BAR_HEIGHT,
    left: 0,
    top: 0,
    right: 0,
  },

  middleTab: {
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "transparent",
  },

  textStyle: {
    fontSize: scaleFont(23),
    fontWeight: "500",
    fontFamily: "Roboto-Medium",
  },
});
