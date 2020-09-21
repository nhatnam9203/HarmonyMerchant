import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import {ScrollableTabView} from "@components";

import IMAGE from "@resources";

const SCROLL_PAGE_DEFAULT = 0;

const ACTIVE_BG_COLOR = "#0764B0";
const INACTIVE_BG_COLOR = "#FAFAFA";

const ACTIVE_TEXT_COLOR = "#fff";
const INACTIVE_TEXT_COLOR = "#0764B0";

const FONT_TEXT_SIZE = 15;
const TAB_DEFAULT_HEIGHT = 44;

//================================
//Header Tab Layout
//================================
export default function CustomScrollTab({
  children,
  tabIcons,
  onHeaderTabChanged,
  showHeader,
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
    return showHeader ? (
      <CustomTabBar {...args} tabIcons={tabIcons} />
    ) : (
      <View />
    );
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

  const renderTabItem = (name = "", page) => {
    const activeTextColor =
      activeTab === page ? ACTIVE_TEXT_COLOR : INACTIVE_TEXT_COLOR;
    const activeBackgroundColor =
      activeTab === page ? ACTIVE_BG_COLOR : INACTIVE_BG_COLOR;

    return (
      <TouchableOpacity
        key={name}
        onPress={() => onPressHandle(page)}
        style={{ flex: 0 }}
      >
        <View style={[styles.tab, { backgroundColor: activeBackgroundColor }]}>
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
//Styles
//================================
const styles = StyleSheet.create({
  tab: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flex: 0,
    height: "100%",
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  tabs: {
    height: TAB_DEFAULT_HEIGHT,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0764B0",
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
  },
  text: {
    fontSize: FONT_TEXT_SIZE,
  },
  scrollTab: { flex: 1 },
});
