import React from "react";

import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";
import { role, menuTabs, isPermissionToTab } from "@utils";
import * as l from "lodash";

class SettlementScreen extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: true,
      currentPage: 0,
    };
    this.scrollTabRef = React.createRef();
    this.tabSettleRef = React.createRef();
    this.checkPermissionRef = React.createRef();
    this.transactionTabRef = React.createRef();
    this.batchHistoryTabRef = React.createRef();
  }

  componentDidMount() {
    this.didBlurSubscription = this.props.navigation.addListener(
      "blur",
      (payload) => {
        this.setState({
          isFocus: false,
          currentPage: 0,
        });
        this.scrollTabRef.current?.goToPage(0);
        this.checkPermissionRef.current?.setStateFromParent("");
        if (this.transactionTabRef.current) {
          this.transactionTabRef.current?.resetStateFromParent();
        }
      }
    );
    this.didFocusSubscription = this.props.navigation.addListener(
      "focus",
      (payload) => {
        this.setState({
          isFocus: true,
        });
        this.tabSettleRef.current?.onDidFocus();
        // reset time range
        this.transactionTabRef?.current?.didFocus();
        this.batchHistoryTabRef?.current?.didFocus();

        this.checkPermissionRef.current?.setStateFromParent("");
        const { profileStaffLogin } = this.props;
        const roleName = profileStaffLogin?.roleName || role.Admin;
        const permission = l.get(profileStaffLogin, "permission", []);
        if (roleName === role.Admin) {
          this.tabSettleRef?.current?.callReportFromChildren();
        } else if (roleName === role.Manager) {
          if (isPermissionToTab(permission, menuTabs.MENU_SETTLEMENT)) {
            this.tabSettleRef?.current?.callReportFromChildren();
          } else {
            this.props.actions.invoice.toggleSettlementTabPermission();
          }
        } else {
          this.props.actions.invoice.toggleSettlementTabPermission();
        }
      }
    );
  }

  onChangeTab = (index) => {
    const currentIndex = index.i;
    this.setState({
      currentPage: currentIndex,
    });
    if (currentIndex === 1) {
      if (this.transactionTabRef?.current) {
        this.transactionTabRef.current?.searchTransactions();
      }
    } else if (currentIndex === 2) {
      this.props.actions.invoice.getBatchHistory();
      if (this.batchHistoryTabRef?.current) {
        this.batchHistoryTabRef?.current?.setStateFromParent();
        this.batchHistoryTabRef?.current?.scrollTabFromParent(0);
        this.props.actions.invoice.toggleDisplayBackBatchHistoryIcon(false);
      } else {
        setTimeout(() => {
          this.batchHistoryTabRef.current?.setStateFromParent();
        }, 300);
      }
    }
  };

  reviewBatchHistory = () => {
    this.scrollTabRef.current?.goToPage(2);
  };

  handleLockScreen = () => {
    const { isFocus } = this.state;
    const {profile} = this.props;
    if (isFocus) {
      this.props.navigation.navigate(
        profile.type === "Retailer" ? "retailer.home.order" : "Home"
      );

      this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
    }
  };

  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  closePopupCheckSettementTabPermission = () => {
    const {profile} = this.props;

    this.props.actions.invoice.toggleSettlementTabPermission(false);
    this.props.navigation.navigate(
      profile.type === "Retailer" ? "retailer.home.order" : "Home"
    );
  };

  backSettlementTab = () => {
    this.tabSettleRef.current?.scrollTabFromParent();
    this.props.actions.invoice.toggleDisplayBackSettleIcon(false);
  };

  backBatchHistoryTab = () => {
    const { isShowBackBatchHistory } = this.props;
    const page = isShowBackBatchHistory == 1 ? 1 : 0;
    const isShowIcon = isShowBackBatchHistory == 1 ? "0" : false;
    this.batchHistoryTabRef.current?.scrollTabFromParent(page);
    this.props.actions.invoice.toggleDisplayBackBatchHistoryIcon(isShowIcon);
  };

  clearIntervalById = () => {
    const { notiIntervalId } = this.props;
    if (notiIntervalId) {
      clearInterval(notiIntervalId);
      this.props.actions.app.resetNotiIntervalId();
    }
  };

  componentWillUnmount() {
    this.didBlurSubscription();
    this.didFocusSubscription();
  }
}

const mapStateToProps = (state) => ({
  profile: state.dataLocal.profile,
  language: state.dataLocal.language,
  connectPAXStatus: state.app.connectPAXStatus,
  settlementTabPermission: state.invoice.settlementTabPermission,
  isShowBackSettlement: state.invoice.isShowBackSettlement,
  isShowBackBatchHistory: state.invoice.isShowBackBatchHistory,
  terminalID: state.app.terminalID,
  profileStaffLogin: state.dataLocal.profileStaffLogin,
  notiIntervalId: state.app.notiIntervalId,
  paymentMachineType: state.hardware.paymentMachineType,
});

export default connectRedux(mapStateToProps, SettlementScreen);
