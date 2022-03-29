import {
  Button,
  HomeTabBar,
  ParentContainer,
  PopupCheckStaffPermission,
  PopupEnterPin,
  ScrollableTabView,
  StatusBarHeader,
} from "@components";
import configs from "@configs";
import ICON from "@resources";
import {
  formatWithMoment,
  getColorTitleByNotiType,
  getIconByNotiType,
  getNotiContentByType,
  localize,
  menuTabs,
  scaleSize,
} from "@utils";
import React from "react";
import {
  Dimensions,
  Image,
  Modal,
  Text,
  View,
  VirtualizedList,
} from "react-native";
import styles from "./style";
import { TabAppointment, TabCheckout, TabMarketing } from "./widget";

const { height } = Dimensions.get("window");

export default class Layout extends React.Component {
  renderNotiItem(noti) {
    const icon = noti?.view
      ? `${getIconByNotiType(noti?.type || "")}_is_read`
      : getIconByNotiType(noti?.type || "");
    const content = getNotiContentByType(noti);

    return (
      <Button
        onPress={this.handlePushNotiDataToWebView(noti)}
        style={{ minHeight: scaleSize(110) }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            paddingTop: scaleSize(10),
            paddingBottom: scaleSize(6),
          }}
        >
          {/* ------------ Icon ------------ */}
          <View style={{ width: scaleSize(50) }}>
            <Image
              source={ICON[icon]}
              style={{ width: scaleSize(30), height: scaleSize(30) }}
            />
          </View>
          {/* ------------ Information ------------ */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: getColorTitleByNotiType(noti?.view, noti?.type),
                fontSize: scaleSize(16),
                fontWeight: "600",
                marginBottom: scaleSize(6),
              }}
            >
              {noti?.title || ""}
            </Text>
            {content}

            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Text
                style={{
                  color: "#585858",
                  fontSize: scaleSize(12),
                  marginTop: scaleSize(10),
                }}
              >
                {formatWithMoment(noti?.createdDate, "MM/DD/YYYY   hh:mm A")}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 2, backgroundColor: "#EEEEEE" }} />
      </Button>
    );
  }

  render() {
    const {
      language,
      navigation,
      marketingTabPermission,
      visibleEnterPin,
      notificationList,
      notificationContUnread,
      currentAppMode,
    } = this.props;
    const { isFocus, visible, categoryStaffId, staffIdSelected } = this.state;
    return (
      <ParentContainer
        handleLockScreen={this.handleLockScreen}
        activeScreen={isFocus}
        navigation={navigation}
        clearIntervalById={this.clearIntervalById}
      >
        <View style={styles.container}>
          <StatusBarHeader />
          <ScrollableTabView
            ref={this.scrollTabParentRef}
            style={{}}
            initialPage={1}
            locked={true}
            renderTabBar={() => (
              <HomeTabBar
                activeTextColor="#fff"
                inactiveTextColor="#0764B0"
                backgroundTabActive="#0764B0"
                textStyle={{
                  fontSize: scaleSize(16),
                  fontWeight: "500",
                }}
                onPressHandlerChangeTab={this.onPressHandlerChangeTab}
                displayNotifiPopup={this.displayNotifiPopup}
                notificationContUnread={notificationContUnread}
              />
            )}
            onChangeTab={this.onChangeTab}
          >
            <TabMarketing tabLabel={`${localize("MARKETING", language)}`} />
            {
              <TabAppointment
                ref={this.tabAppointmentRef}
                tabLabel={`${localize("APPOINTMENT", language)}`}
                currentTabParent={this.state.currentTab}
                clearDataTabCheckout={this.clearDataTabCheckout}
                checkoutAppointment={this.checkoutAppointment}
                bookAppointment={this.bookAppointment}
                createABlockAppointment={this.createABlockAppointment}
                addMoreAppointmentFromCalendar={
                  this.addMoreAppointmentFromCalendar
                }
                navigation={this.props.navigation}
                getCategoryStaff={this.getCategoryStaff}
              />
            }

            {
              <TabCheckout
                ref={this.tabCheckoutRef}
                tabLabel={`${localize("CHECK-OUT", language)}`}
                navigation={this.props.navigation}
                gotoPageCurentParent={this.gotoPageCurentParent}
                gotoTabAppointment={this.gotoTabAppointment}
                gotoAppoitmentScreen={this.gotoAppoitmentScreen}
                currentTabParent={this.state.currentTab}
                gotoAppointmentTabToGroup={this.gotoAppointmentTabToGroup}
                pushAppointmentIdOfflineIntoWebview={
                  this.pushAppointmentIdOfflineIntoWebview
                }
                categoryStaffId={categoryStaffId}
                staffIdSelected={staffIdSelected}
              />
            }
          </ScrollableTabView>
          <Button onPress={this.openDrawer} style={configs.btn_left_position}>
            <Image
              source={ICON.openDrawer}
              style={{ width: scaleSize(34), height: scaleSize(34) }}
            />
          </Button>

          <View
            style={[
              configs.btn_right_position,
              {
                flexDirection: "row",
              },
            ]}
          >
            <Button onPress={this.showLockScreen}>
              <Image
                source={ICON.signOut}
                style={{ width: scaleSize(34), height: scaleSize(33) }}
              />
            </Button>
          </View>

          <PopupEnterPin
            visibleEnterPin={visibleEnterPin && isFocus ? true : false}
            ref={this.popupEnterPinRef}
            title="Pin code"
            onRequestClose={() => {}}
            confimYes={this.submitPincode}
            hideCloseButton={true}
          />
          <PopupCheckStaffPermission
            ref={this.checkMarketingPermissionRef}
            visiblePopupCheckStaffPermission={marketingTabPermission}
            title={localize("Input PIN Number", language)}
            tabName={menuTabs.MARKETING}
            onRequestClose={this.closePopupCheckMarketingTabPermission}
          />
          {/* --------- Notification Popup  ------ */}
          <Modal transparent={true} visible={visible} animationType={"fade"}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.6)",
                alignItems: "center",
                paddingTop: scaleSize(48),
              }}
            >
              <View
                style={{
                  height: height - scaleSize(48),
                  width: scaleSize(300),
                  backgroundColor: "#fff",
                  paddingHorizontal: scaleSize(10),
                }}
              >
                {/* -------------- Header ----------- */}
                <View style={{ height: scaleSize(50) }}>
                  <Text
                    style={{
                      color: "#404040",
                      fontSize: scaleSize(14),
                      fontWeight: "600",
                      marginTop: scaleSize(10),
                    }}
                  >
                    {`Notifications`}
                  </Text>

                  <Button
                    onPress={this.closeNotiPopup}
                    style={{
                      height: scaleSize(30),
                      width: scaleSize(30),
                      justifyContent: "center",
                      alignItems: "flex-end",
                      position: "absolute",
                      top: 0,
                      right: 0,
                    }}
                  >
                    <Image source={ICON.close_noti_popup} />
                  </Button>

                  <Button
                    onPress={this.readAllNotification}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: scaleSize(16),
                      height: scaleSize(30),
                      width: scaleSize(30),
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      style={{ width: scaleSize(22), height: scaleSize(22) }}
                      source={ICON.read_all_noti}
                    />
                  </Button>
                </View>

                {/* ------------ Notification List ---------- */}
                <View style={{ flex: 1 }}>
                  <VirtualizedList
                    data={notificationList}
                    initialNumToRender={10}
                    renderItem={({ item }) => this.renderNotiItem(item)}
                    keyExtractor={(item, index) =>
                      `${item?.merchantNotificationId}_${index}`
                    }
                    getItemCount={this.getItemCount}
                    getItem={this.getItem}
                    showsVerticalScrollIndicator={false}
                    onEndReached={this.loadMoreNotificationList}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => {
                      this.onEndReachedCalledDuringMomentum = false;
                    }}
                  />
                </View>
              </View>
            </View>
            {/* <Loading /> */}
          </Modal>
        </View>
      </ParentContainer>
    );
  }
}
