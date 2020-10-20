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
        this.checkPermissionRef.current.setStateFromParent("");
        this.screenReportRef.current.didBlur();
      }
    );
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      (payload) => {
        this.setState({
          isFocus: true,
        });
        this.checkPermissionRef.current.setStateFromParent("");
        this.props.actions.staff.toggleReportTabPermission();
        this.screenReportRef.current.didFocus();
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
    // const {
    //   isCustomizeDate,
    //   startDate,
    //   endDate,
    //   quickFilter,
    // } = this.modalCalendarRef.current.state;
    // let url;
    // if (isCustomizeDate) {
    //   url = `timeStart=${startDate}&timeEnd=${endDate}`;
    // } else {
    //   const filter = quickFilter === false ? "This Week" : quickFilter;
    //   //console.log('quickFilter',quickFilter)
    //   url = `quickFilter=${getQuickFilterTimeRange(filter)}`;
    // }
    // this.props.actions.staff.getListStaffsSalaryTop(url, true);
  };

  onRefreshStaffReport = () => {
    return;
    // const {
    //   isCustomizeDate,
    //   startDate,
    //   endDate,
    //   quickFilter,
    // } = this.modalCalendarRef.current.state;
    // let url;
    // if (isCustomizeDate) {
    //   url = `timeStart=${startDate}&timeEnd=${endDate}`;
    // } else {
    //   const filter = quickFilter === false ? "This Week" : quickFilter;
    //   url = `quickFilter=${getQuickFilterTimeRange(filter)}`;
    // }
    // this.props.actions.staff.getListStaffsSalaryTop(url, false);
  };

  cancelStaffInvoicePrint = async () => {
    await this.setState({
      visibleStaffInvoicePrint: false,
      selectedStaff: {},
    });
  };

  showPopupStaffInvoice = async (staff) => {
    // console.log("staff : ",JSON.stringify(staff));
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

  componentWillUnmount() {
    this.didBlurSubscription.remove();
    this.didFocusSubscription.remove();
  }
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  listStaffsSalary: state.staff.listStaffsSalary,
  refreshListStaffsSalary: state.staff.refreshListStaffsSalary,
  listStaffsCalendar: state.staff.listStaffsCalendar,
  dx: state.staff.dx,
  reportTabPermission: state.staff.reportTabPermission,
});

export default connectRedux(mapStateToProps, ReportScreen);
