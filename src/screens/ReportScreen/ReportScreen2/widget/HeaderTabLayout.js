import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Text, View, Image } from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";

import IMAGE from "@resources";

const SCROLL_PAGE_DEFAULT = 0;

const ACTIVE_BG_COLOR = "#0764B0";
const INACTIVE_BG_COLOR = "#FAFAFA";

const ACTIVE_TEXT_COLOR = "#fff";
const INACTIVE_TEXT_COLOR = "#6A6A6A";

const ICON_DEFAULT_SIZE = 20;
const FONT_TEXT_SIZE = 15;
const TAB_DEFAULT_HEIGHT = 50;

//================================
//Header Tab Layout
//================================
export default function HeaderTabLayout({
  children,
  tabIcons,
  onHeaderTabChanged,
}) {
  /**process */
  const [tabCurrent, changeTabCurrent] = useState(SCROLL_PAGE_DEFAULT);

  const onChangeTab = ({ i, ref }) => {
    changeTabCurrent(i);
    if (onHeaderTabChanged) {
      onHeaderTabChanged(i);
    }
  };

  /**render */
  const renderHeaderTab = (args) => {
    return <CustomTabBar {...args} tabIcons={tabIcons} />;
  };

  return (
    <ScrollableTabView
      style={styles.scrollTab}
      initialPage={SCROLL_PAGE_DEFAULT}
      locked={true}
      scrollWithoutAnimation
      renderTabBar={renderHeaderTab}
      onChangeTab={onChangeTab}
    >
      {children && children}
    </ScrollableTabView>
  );
}

//================================
//Custom TabBar
//================================
function CustomTabBar({ tabs, goToPage, activeTab, tabIcons }) {
  const onPressHandle = (page) => {
    if (goToPage) {
      goToPage(page);
    }
  };

  const renderIconTab = (page, color) => {
    if (tabIcons && tabIcons.length > page) {
      return <ImageComponent source={tabIcons[page]} color={color} />;
    }
    /**No tabIcons*/
    switch (page) {
      default:
        return <ImageComponent source={IMAGE.Customer} color={color} />;
    }
  };

  const renderTabItem = (name = "", page) => {
    const activeTextColor =
      activeTab === page ? ACTIVE_TEXT_COLOR : INACTIVE_TEXT_COLOR;
    const activeBackgroundColor =
      activeTab === page ? ACTIVE_BG_COLOR : INACTIVE_BG_COLOR;

    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        key={name}
        onPress={() => onPressHandle(page)}
      >
        <View style={[styles.tab, { backgroundColor: activeBackgroundColor }]}>
          {renderIconTab(page, activeTextColor)}
          <Text style={[styles.text, { color: activeTextColor }]}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.tabs}>
      {tabs.map((name, page) => renderTabItem(name, page))}
    </View>
  );
}

//================================
//Image Component
//================================
const ImageComponent = ({ source, color }) => (
  <Image
    source={source}
    style={{
      width: ICON_DEFAULT_SIZE,
      height: ICON_DEFAULT_SIZE,
      tintColor: color,
      marginHorizontal: 10,
    }}
  />
);

//================================
//Styles
//================================
const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  tabs: {
    height: TAB_DEFAULT_HEIGHT,
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: "#ccc",
  },
  text: {
    fontSize: FONT_TEXT_SIZE,
  },
  scrollTab: { flex: 1 },
});
