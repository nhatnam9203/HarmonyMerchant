import React, { Component } from "react";
import UserInactivity from "react-native-user-inactivity";
import _ from "ramda";

import connectRedux from "@redux/ConnectRedux";

class ParentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
    };
    this._interval = false;
  }

  getTimeOut(number) {
    let timeout = 0;
    switch (number) {
      case "2 Minutes":
        // timeout = parseInt(2 * 60 * 1000);
        timeout = parseInt(15 * 1000);
        break;
      case "5 Minutes":
        timeout = parseInt(5 * 60 * 1000);
        break;
      case "10 Minutes":
        timeout = parseInt(10 * 60 * 1000);
        break;
      case "15 Minutes":
        timeout = parseInt(15 * 60 * 1000);
        break;
      default:
        timeout = parseInt(2000 * 60 * 1000);
    }
    return timeout;
  }

  handleInactive = (isActive) => {
    const {
      activeScreen,
      visibleEnterPin,
      isOfflineMode,
      autoLockScreenAfter,
      groupAppointment,
      invoiceTabPermission,
      settlementTabPermission,
      customerTabPermission,
      inventoryTabPermission,
      reportTabPermission,
      settingTabPermission,
      visiblePaymentCompleted,
      notiIntervalId,
    } = this.props;

    if (notiIntervalId && isActive && this.props.clearIntervalById) {
      this.props.clearIntervalById();
    }

    const parent = this.props.navigation.dangerouslyGetParent();
    const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;
    if (
      !isActive &&
      activeScreen &&
      !visibleEnterPin &&
      !isDrawerOpen &&
      !isOfflineMode &&
      autoLockScreenAfter != "Never" &&
      _.isEmpty(groupAppointment) &&
      !invoiceTabPermission &&
      !settlementTabPermission &&
      !customerTabPermission &&
      !inventoryTabPermission &&
      !reportTabPermission &&
      !settingTabPermission &&
      !visiblePaymentCompleted
    ) {
      this.props.handleLockScreen();
    }
  };

  render() {
    const { autoLockScreenAfter } = this.props;
    const { active } = this.state;
    return (
      <UserInactivity
        isActive={active}
        timeForInactivity={this.getTimeOut(autoLockScreenAfter)}
        onAction={this.handleInactive}
        style={{ flex: 1 }}
      >
        {this.props.children}
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state) => ({
  autoLockScreenAfter: state.dataLocal.autoLockScreenAfter,
  visibleEnterPinInvoice: state.app.visibleEnterPinInvoice,
  visibleEnterPin: state.app.visibleEnterPin,
  isOfflineMode: state.network.isOfflineMode,
  groupAppointment: state.appointment.groupAppointment,
  invoiceTabPermission: state.invoice.invoiceTabPermission,
  settlementTabPermission: state.invoice.settlementTabPermission,
  customerTabPermission: state.customer.customerTabPermission,
  inventoryTabPermission: state.product.inventoryTabPermission,
  reportTabPermission: state.staff.reportTabPermission,
  settingTabPermission: state.app.settingTabPermission,
  visiblePaymentCompleted: state.appointment.visiblePaymentCompleted,
  notiIntervalId: state.app.notiIntervalId,
});

export default connectRedux(mapStateToProps, ParentContainer);
