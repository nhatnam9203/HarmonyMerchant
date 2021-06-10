import React from "react";
import _ from "ramda";

import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";

class ReportScreen extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: true,
      valueSwitch: true,
      visibleCalendar: false,
      titleRangeTime: "This week",
      visibleStaffInvoicePrint: false,
      selectedStaff: {},
      showBackButton: false,
    };
    this.modalCalendarRef = React.createRef();
    this.checkPermissionRef = React.createRef();
    this.screenReportRef = React.createRef();
  }

  componentDidMount() {
    this.didBlurSubscription = this.props.navigation.addListener(
      "didBlur",
      (payload) => {
        this.setState({
          isFocus: false,
          titleRangeTime: "This week",
        });
        this.checkPermissionRef?.current?.setStateFromParent("");
        this.screenReportRef?.current?.didBlur();
      }
    );
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      (payload) => {
        this.setState({
          isFocus: true,
        });
        this.checkPermissionRef?.current?.setStateFromParent("");
        this.screenReportRef?.current?.didFocus();

        const { profileStaffLogin } = this.props;
        const roleName = profileStaffLogin?.roleName || "Admin";
        if (roleName === "Admin") {
          this.props.actions.staff.getListStaffsSalaryTop();
        } else {
          this.props.actions.staff.toggleReportTabPermission();
        }
      }
    );
  }

  handleLockScreen = () => {
    const { isFocus } = this.state;
    if (isFocus) {
      this.props.navigation.navigate("Home");
      this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
    }
  };

  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  onValueChangeSwich = (value) => {
    this.setState({
      valueSwitch: value,
    });
  };

  showCalendar = () => {
    this.setState({
      visibleCalendar: true,
    });
  };

  changeTitleTimeRange = async (title) => {
    return;
    // await this.setState({
    //   titleRangeTime: title !== "Time Range" ? title : "All time",
    //   visibleCalendar: false,
    // });
    // this.searchStaff();
  };
  setPosition = (dx) => {
    this.props.actions.staff.setPositionHeader(dx);
  };
  searchStaff = () => {
    return;
  };

  onRefreshStaffReport = () => {
    return;
  };

  cancelStaffInvoicePrint = async () => {
    await this.setState({
      visibleStaffInvoicePrint: false,
      selectedStaff: {},
    });
  };

  showPopupStaffInvoice = async (staff) => {
    await this.setState({
      visibleStaffInvoicePrint: true,
      selectedStaff: staff,
    });
  };

  closePopupCheckReportTabPermission = () => {
    this.props.actions.staff.toggleReportTabPermission(false);
    this.props.navigation.navigate("Home");
  };

  onBackButtonPressed = () => {
    this.screenReportRef?.current.onBack();
  };

  onShowBackButton = (value) => {
    this.setState({ showBackButton: value });
  };

  clearIntervalById = () => {
    const { notiIntervalId } = this.props;
    if (notiIntervalId) {
      clearInterval(notiIntervalId);
      this.props.actions.app.resetNotiIntervalId();
    }
  }

  componentWillUnmount() {
    this.didBlurSubscription();
    this.didFocusSubscription();
  }
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  listStaffsSalary: state.staff.listStaffsSalary,
  refreshListStaffsSalary: state.staff.refreshListStaffsSalary,
  listStaffsCalendar: state.staff.listStaffsCalendar,
  dx: state.staff.dx,
  reportTabPermission: state.staff.reportTabPermission,
  profileStaffLogin: state.dataLocal.profileStaffLogin,
  notiIntervalId: state.app.notiIntervalId
});

export default connectRedux(mapStateToProps, ReportScreen);
