import React from "react";
import { View, Image } from "react-native";

import {
  Text,
  StatusBarHeader,
  Button,
  ParentContainer,
  PopupCheckStaffPermission,
  PopupCalendar,
} from "@components";
import { scaleSize, localize, menuTabs } from "@utils";
import styles from "./style";
import IMAGE from "@resources";
import {PopupStaffInvoicePrint} from "./widget";
import ReportScreen2 from "./ReportScreen2";
import configs from "@configs";

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
        <Text style={{ fontSize: scaleSize(16), color: "#0764B0",fontWeight:"600" }}>
          {localize("Reports", language)}
        </Text>
      </View>
    );
  }


  render() {
    const { navigation, language, reportTabPermission } = this.props;
    const {
      isFocus,
      visibleCalendar,
      selectedStaff,
      visibleStaffInvoicePrint,
      showBackButton,
    } = this.state;

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

          <ReportScreen2
            ref={this.screenReportRef}
            showBackButton={this.onShowBackButton}
          />

          {/**button drawer */}
          <Button
            onPress={this.openDrawer}
            style={configs.btn_left_position}
          >
            <Image
              source={IMAGE.openDrawer}
              style={{ width: scaleSize(34), height: scaleSize(34) }}
            />
          </Button>
          {/**button back on top-right */}
          {showBackButton && (
            <Button
              style={{
                position: "absolute",
                top: 20,
                right: 0,
                width: scaleSize(34),
                height: scaleSize(34),
                backgroundColor: "#0764B0",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={this.onBackButtonPressed}
            >
              <Image
                source={IMAGE.arrowRight}
                style={{ width: scaleSize(22), height: scaleSize(17) }}
              />
            </Button>
          )}
        </View>

        <PopupCalendar
          ref={this.modalCalendarRef}
          type="report"
          visible={visibleCalendar}
          onRequestClose={() => this.setState({ visibleCalendar: false })}
          changeTitleTimeRange={this.changeTitleTimeRange}
        />

        <PopupStaffInvoicePrint
          visiblePrintInvoice={visibleStaffInvoicePrint}
          onRequestClose={this.cancelStaffInvoicePrint}
          staff={selectedStaff}
        />

        <PopupCheckStaffPermission
          ref={this.checkPermissionRef}
          visiblePopupCheckStaffPermission={reportTabPermission}
          title={localize("Input PIN Number", language)}
          tabName={menuTabs.MENU_REPORT}
          onRequestClose={this.closePopupCheckReportTabPermission}
        />
      </ParentContainer>
    );
  }

}
