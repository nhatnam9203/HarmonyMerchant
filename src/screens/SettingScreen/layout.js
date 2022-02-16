import React from "react";
import { View, Image } from "react-native";

import {
  StatusBarHeader,
  Button,
  ParentContainer,
  Text,
  PopupLogout,
  PopupCheckStaffPermission,
  ScrollableTabView,
} from "@components";
import { scaleSize, localize, menuTabs } from "@utils";
import styles from "./style";
import IMAGE from "@resources";
import {
  TabStaff,
  TabService,
  TabExtra,
  TabCategories,
  TabGaneral,
  TabHardware,
  TabTAX,
  TabAdvance,
} from "./widget";
import configs from "@configs";
import { WithLogout } from "@shared/HOC/withLogout";

const MENU = [
  "General",
  "Advance",
  "Staff",
  "Categories",
  "Services",
  "Extra",
  "Tax",
  "Hardware",
  "Logout",
];

const WithLogoutPopup = WithLogout(PopupLogout);

export default class Layout extends React.Component {
  renderHeader() {
    const { language } = this.props;
    return (
      <View
        style={{
          height: scaleSize(35),
          borderBottomColor: "#0764B0",
          borderWidth: 3,
          paddingLeft: scaleSize(50),
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: scaleSize(16),
            color: "#0764B0",
            fontWeight: "600",
          }}
        >
          {localize("Settings", language)}
        </Text>
      </View>
    );
  }

  render() {
    const { language, navigation, settingTabPermission, isAddStaff } =
      this.props;
    const { isFocus } = this.state;

    return (
      <ParentContainer
        handleLockScreen={this.handleLockScreen}
        activeScreen={isFocus}
        navigation={navigation}
        clearIntervalById={this.clearIntervalById}
      >
        <View style={styles.container}>
          <StatusBarHeader />
          {this.renderHeader()}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <LeftMenuSetting
              ref={this.leftMenuSettingRef}
              selectMenu={this.selectMenu}
            />
            <View style={{ flex: 1 }}>
              <ScrollableTabView
                ref={this.scrollTabRef}
                style={{}}
                initialPage={0}
                tabBarPosition="bottom"
                locked={true}
                springTension={1}
                springFriction={1}
                renderTabBar={() => <View />}
              >
                <TabGaneral
                  ref={this.generalTabRef}
                  isFocus={this.state.isFocus}
                  currentTab={this.state.indexTab}
                />
                <TabAdvance.component />
                <TabStaff ref={this.tabStaffRef} />
                <TabCategories ref={this.tabCategoriesRef} />
                <TabService ref={this.tabServiceRef} />
                <TabExtra ref={this.tabExtraRef} />
                <TabTAX ref={this.taxTabRef} />
                <TabHardware />
              </ScrollableTabView>
            </View>
          </View>

          <Button onPress={this.openDrawer} style={configs.btn_left_position}>
            <Image
              source={IMAGE.openDrawer}
              style={{ width: scaleSize(34), height: scaleSize(34) }}
            />
          </Button>
          {isAddStaff ? (
            <Button
              onPress={this.backTab}
              style={[
                configs.btn_right_position,
                {
                  width: scaleSize(34),
                  height: scaleSize(34),
                  backgroundColor: "#0764B0",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Image
                source={IMAGE.arrowRight}
                style={{ width: scaleSize(22), height: scaleSize(17) }}
              />
            </Button>
          ) : null}
        </View>
        <WithLogoutPopup
          visible={this.state.visibleLogout}
          title={localize("Confirmation", language)}
          message={`${localize("Are you sure you want to Log out", language)}?`}
          onRequestClose={() => this.setState({ visibleLogout: false })}
          confimYes={this.logout}
          language={language}
        />
        <PopupCheckStaffPermission
          ref={this.checkPermissionRef}
          visiblePopupCheckStaffPermission={settingTabPermission}
          title={localize("Input PIN Number", language)}
          tabName={menuTabs.MENU_SETTING}
          onRequestClose={this.closePopupCheckSettingTabPermission}
        />
      </ParentContainer>
    );
  }
}

class LeftMenuSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indexTab: 0,
    };
  }

  setStateFromParent = async (indexTab) => {
    await this.setState({
      indexTab,
    });
  };

  render() {
    const { selectMenu } = this.props;
    const { indexTab } = this.state;

    return (
      <View
        style={{
          width: scaleSize(140),
          backgroundColor: "rgb(250,250,250)",
          zIndex: 1,
        }}
      >
        {MENU.map((title, index) => {
          const temptIcon = index === indexTab ? title : `${title}_in`;
          const temptBackground =
            index === indexTab
              ? {
                  backgroundColor: "#fff",
                  borderLeftColor: "#0764B0",
                  borderLeftWidth: 7,
                }
              : {};
          const temptTextColorSelect =
            index === indexTab ? { color: "#0764B0" } : {};
          return (
            <Button
              onPress={() => selectMenu(index)}
              key={index}
              style={[
                {
                  height: scaleSize(50),
                  borderBottomColor: "rgb(241,241,241)",
                  borderBottomWidth: 3,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: scaleSize(10),
                },
                temptBackground,
              ]}
            >
              <Image
                source={IMAGE[temptIcon]}
                style={{
                  width: scaleSize(18),
                  height: scaleSize(18),
                  marginRight: scaleSize(10),
                }}
              />
              <Text
                style={[
                  { color: "#404040", fontSize: scaleSize(16) },
                  temptTextColorSelect,
                ]}
              >
                {title}
              </Text>
            </Button>
          );
        })}
      </View>
    );
  }
}
