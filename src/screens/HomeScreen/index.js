import configs from "@configs";
import connectRedux from "@redux/ConnectRedux";
import { getPosotion, isPermissionToTab, menuTabs, role } from "@utils";
import * as l from "lodash";
import _ from "ramda";
import React from "react";
import { Alert, AppState, BackHandler, NativeModules } from "react-native";
import CodePush from "react-native-code-push";
import env from "react-native-config";
import SoundPlayer from "react-native-sound-player";
import Layout from "./layout";

const initialState = {
  isFocus: true,
  currentTab: 1,
  visibleConfirm: false,
  temptCurrentTap: -1,
  visibleEnterPin: true,
  isConnectedInternet: true,
  visible: false,
  categoryStaffId: null,
  staffIdSelected: null,
  visibleConfirmPayment: false,
};

const PosLink = NativeModules.payment;

class HomeScreen extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      appState: AppState.currentState,
    };
    this.scrollTabParentRef = React.createRef();
    this.tabAppointmentRef = React.createRef();
    this.tabCheckoutRef = React.createRef();
    this.popupEnterPinRef = React.createRef();
    this.checkMarketingPermissionRef = React.createRef();

    this.onEndReachedCalledDuringMomentum = true;
  }

  getCategoryStaff = (staffId) => {
    if (this.tabCheckoutRef?.current?.getCategory) {
      this.tabCheckoutRef?.current?.getCategory(staffId);
    } else {
      this.setState({ categoryStaffId: staffId });
    }
  };

  componentDidMount() {
    this.props.actions.app.changeFlagVisibleEnteerPinCode(true);

    // ----------- Add Listener Back Action On Android --------------
    BackHandler.addEventListener("hardwareBackPress", this.backAction);

    this.didBlurSubscription = this.props.navigation.addListener(
      "blur",
      (payload) => {
        this.setState({
          isFocus: false,
        });
        this.popupEnterPinRef?.current?.setStateFromParent("");
      }
    );
    this.didFocusSubscription = this.props.navigation.addListener(
      "focus",
      (payload) => {
        this.setState({
          isFocus: true,
        });
        if (this.tabAppointmentRef?.current) {
          this.tabAppointmentRef?.current?.updateLinkOfCalendar();
        }
      }
    );

    AppState.addEventListener("change", this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this.checkUpdateCodePush();
    } else {
      if (!_.isEmpty(this.props.groupAppointment)) {
        PosLink.cancelTransaction();
      }
    }
    this.setState({ appState: nextAppState });
  };

  async checkUpdateCodePush() {
    const tempEnv = env.IS_PRODUCTION;
    const deploymentKey =
      tempEnv == "Production"
        ? configs.codePushKeyIOS.production
        : configs.codePushKeyIOS.staging;

    Promise.race([
      CodePush.checkForUpdate(deploymentKey),
      new Promise((resolve, reject) =>
        setTimeout(() => reject("TIME_OUT"), 10000)
      ),
    ])
      .then((result) => {
        if (result && result !== "TIME_OUT" && !result.failedInstall) {
          this.props.actions.app.closeAllPopupPincode();
          const description = result.description ? `${result.description}` : "";
          setTimeout(() => {
            this.props.actions.app.tooglePopupCodePush(true, description);
          }, 500);
        }
      })
      .catch((error) => {});
  }

  codePushStatusDidChange(syncStatus) {}

  codePushDownloadDidProgress(progress) {}

  backAction = () => {
    if (this.state.isFocus) {
      Alert.alert(
        "Hold on!",
        "Are you sure you want to exit the application?",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]
      );
      return true;
    } else {
      return false;
    }
  };

  async getCurrentLocation() {
    const { profile } = this.props;
    if (!profile.longitude || !profile.latitude) {
      try {
        const position = await getPosotion();
        const { latitude, longitude } = position.coords;
        this.props.actions.app.merchantSetting({
          businessHourStart: profile.businessHourStart,
          businessHourEnd: profile.businessHourEnd,
          webLink: profile.webLink,
          latitude: latitude,
          longitude: longitude,
          taxService: profile.taxService,
          taxProduct: profile.taxProduct,
        });
      } catch (error) {}
    }
  }

  gotoAppoitmentScreen = () => {
    this.scrollTabParentRef.current.goToPage(1);
  };

  gotoPageCurentParent = (isDrawer = false) => {
    if (isDrawer) {
      this.scrollTabParentRef.current.goToPage(1);
      this.props.navigation.openDrawer();
    } else {
      const { temptCurrentTap } = this.state;
      this.scrollTabParentRef.current.goToPage(1);
    }
  };

  gotoTabAppointment = () => {
    this.scrollTabParentRef.current.goToPage(1);
  };

  onPressHandlerChangeTab = async (index) => {
    const { currentTab } = this.state;
    const {
      groupAppointment,
      appointmentIdOffline,
      blockAppointments,
      profileStaffLogin,
      isOfflineMode,
    } = this.props;
    if (appointmentIdOffline !== 0) {
      this.props.actions.appointment.checkoutAppointmentOffline(0);
    }

    if (currentTab !== index) {
      if (
        currentTab === 1 &&
        this.tabAppointmentRef?.current?.state?.isShowAddAppointment
      ) {
        // console.log('-----1-------');
        await this.setState({
          temptCurrentTap: index,
        });
        this.tabAppointmentRef?.current?.setStateVisibleFromParent(true);
      } else if (
        currentTab === 2 &&
        this.tabCheckoutRef?.current?.state?.basket?.length > 0
      ) {
        // console.log('-----2-------');
        await this.setState({
          temptCurrentTap: index,
        });
        this.tabCheckoutRef?.current?.setStateVisibleFromParent();
      } else {
        // console.log('-----3-------');
        if (
          currentTab === 2 &&
          this.tabCheckoutRef?.current?.state?.basket?.length === 0
        ) {
          // console.log('-----4-------');
          if (!_.isEmpty(groupAppointment)) {
            // console.log('-----5-------');
            await this.setState({
              temptCurrentTap: index,
            });
            this.tabCheckoutRef?.current?.setStateVisibleFromParent();
          } else if (blockAppointments && blockAppointments.length > 0) {
            await this.setState({
              temptCurrentTap: index,
            });
            this.tabCheckoutRef?.current?.setStateVisibleFromParent();
          } else {
            // console.log('-----6-------');
            if (index === 0) {
              this.tooglePopupMarketingPermission();
            } else {
              this.tabCheckoutRef?.current?.resetStateFromParent();
              this.scrollTabParentRef.current.goToPage(index);
            }
          }
        } else {
          // console.log('-----7-------');
          if (index === 2 && _.isEmpty(groupAppointment)) {
            if (!isOfflineMode) {
              this.getCategoryStaff(profileStaffLogin.staffId);
            }

            if (!this.tabCheckoutRef?.current) {
              this.setState({ staffIdSelected: profileStaffLogin.staffId });
            } else {
              this.tabCheckoutRef?.current.setSelectStaffFromCalendar(
                profileStaffLogin.staffId
              );
            }
          }
          if (index === 0) {
            this.tooglePopupMarketingPermission();
          } else {
            this.scrollTabParentRef.current.goToPage(index);
          }
        }
      }
    }
  };

  tooglePopupMarketingPermission = () => {
    const { profileStaffLogin } = this.props;
    const roleName = profileStaffLogin?.roleName || "Admin";
    const permission = l.get(profileStaffLogin, "permission", []);
    if (roleName === role.Admin) {
      this.scrollTabParentRef.current.goToPage(0);
    } else if (roleName === role.Manager) {
      if (isPermissionToTab(permission, menuTabs.MARKETING)) {
        this.scrollTabParentRef.current.goToPage(0);
      } else {
        this.handleNotPermission();
      }
    } else {
      this.handleNotPermission();
    }
  };

  handleNotPermission() {
    this.checkMarketingPermissionRef.current.setStateFromParent("");
    this.props.actions.marketing.toggleMarketingTabPermission();
    this.tabCheckoutRef?.current?.resetStateFromParent();
  }

  handleLockScreen = async () => {
    const { isFocus } = this.state;
    if (isFocus) {
      this.scrollTabParentRef.current.goToPage(1);
      this.popupEnterPinRef.current.setStateFromParent("");
      this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
    }
  };

  openDrawer = () => {
    const { groupAppointment, blockAppointments } = this.props;
    if (
      !_.isEmpty(groupAppointment) ||
      (blockAppointments && blockAppointments.length > 0)
    ) {
      this.tabCheckoutRef?.current?.setStateVisibleFromParent(true, true);
    } else {
      this.props.navigation.openDrawer();
    }
  };

  showLockScreen = () => {
    this.popupEnterPinRef.current.setStateFromParent("");
    this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
    this.scrollTabParentRef.current.goToPage(1);
  };

  clearDataTabCheckout = () => {
    if (this.tabCheckoutRef?.current) {
      this.tabCheckoutRef?.current.resetStateFromParent();
    }
  };

  checkoutAppointment = async (appointmentId, appointment = {}) => {
    await this.setState({
      currentTab: 2,
    });
    const { groupAppointment, isOfflineMode } = this.props;
    if (isOfflineMode) {
      this.tabCheckoutRef?.current?.setBasketOfflineModeFromParent(appointment);
    } else {
      const checkoutGroupId = groupAppointment?.checkoutGroupId || 0;
      this.props.actions.appointment.checkoutAppointment(
        appointmentId,
        checkoutGroupId
      );
    }
    this.scrollTabParentRef.current.goToPage(2);

    const staffId = appointment?.staffId || false;
    if (staffId) {
      if (this.tabCheckoutRef?.current) {
        this.tabCheckoutRef?.current?.setSelectStaffFromCalendar(staffId);
      } else {
        setTimeout(() => {
          this.tabCheckoutRef?.current?.setSelectStaffFromCalendar(staffId);
        }, 200);
      }
    }
  };

  bookAppointment = async (appointmentId, staffId = 0) => {
    this.props.actions.appointment.getGroupAppointmentById(
      appointmentId,
      true,
      false,
      false,
    );
    this.scrollTabParentRef.current.goToPage(2);
    if (this.tabCheckoutRef?.current) {
      this.tabCheckoutRef?.current?.resetStateFromParent();
      if (staffId) {
        this.tabCheckoutRef?.current?.setSelectStaffFromCalendar(staffId);
      }
    } else {
      setTimeout(() => {
        this.tabCheckoutRef?.current?.resetStateFromParent();
        if (staffId) {
          this.tabCheckoutRef?.current?.setSelectStaffFromCalendar(staffId);
        }
      }, 200);
    }
  };

  addMoreAppointmentFromCalendar = (appointmentId, staffId = 0) => {
    // console.log("===> addMoreAppointmentFromCalendar");

    if (staffId && staffId !== 0 && staffId !== -1) {
      this.props.actions.appointment.getGroupAppointmentById(
        appointmentId,
        false,
        true,
        false,
      );
      this.scrollTabParentRef.current.goToPage(2);

      if (this.tabCheckoutRef?.current) {
        this.tabCheckoutRef?.current?.setSelectStaffFromCalendar(staffId);
      } else {
        setTimeout(() => {
          this.tabCheckoutRef?.current?.setSelectStaffFromCalendar(staffId);
        }, 200);
      }
    } else {
      this.props.actions.appointment.getBlockAppointmentById(
        appointmentId,
        true
      );
      this.scrollTabParentRef.current.goToPage(2);

      if (this.tabCheckoutRef?.current) {
        this.tabCheckoutRef?.current?.setBlockStateFromCalendar();
      } else {
        setTimeout(() => {
          this.tabCheckoutRef?.current?.setBlockStateFromCalendar();
        }, 200);
      }
    }
  };

  /**
   * createABlockAppointment
   * Can call from web with appointment id
   * @param {*} appointmentId
   * @param {*} fromTime
   * @param {*} staffId
   */
  createABlockAppointment = (appointmentId, fromTime, staffId = 0) => {
    this.props.actions.appointment.updateFromTimeBlockAppointment(
      fromTime ? fromTime : new Date()
    );

    this.props.actions.appointment.getBlockAppointmentById(appointmentId, true);

    this.scrollTabParentRef.current.goToPage(2);

    if (this.tabCheckoutRef?.current) {
      this.tabCheckoutRef?.current?.setBlockStateFromCalendar(staffId);

      if (staffId && staffId !== 0 && staffId !== -1) {
        this.props.actions.appointment.getGroupAppointmentById(
          appointmentId,
          false,
          true,
          false,
        );

        this.tabCheckoutRef?.current?.setSelectStaffFromCalendar(staffId);
      }
    } else {
      setTimeout(() => {
        this.tabCheckoutRef?.current?.setBlockStateFromCalendar(staffId);
        if (staffId && staffId !== 0 && staffId !== -1) {
          this.props.actions.appointment.getGroupAppointmentById(
            appointmentId,
            false,
            true,
            false,
          );

          this.tabCheckoutRef?.current?.setSelectStaffFromCalendar(staffId);
        }
      }, 200);
    }
  }; // !

  submitPincode = () => {
    const password = this.popupEnterPinRef.current.state.value;
    const { profile } = this.props;
    if (password.length === 4) {
      this.props.actions.staff.loginStaff(profile.merchantCode, password);
    } else {
      Alert.alert(`PIN must be 4 digits.`);
    }
  };

  loginStaffSuccess = () => {
    const { listAppointmentsOfflineMode, profile } = this.props;
    if (this.tabAppointmentRef?.current) {
      setTimeout(() => {
        this.tabAppointmentRef?.current?.updateLinkOfCalendar();
      }, 500);
    }

    if (listAppointmentsOfflineMode && listAppointmentsOfflineMode.length > 0) {
      this.props.actions.appointment.submitAppointmentOffline(
        listAppointmentsOfflineMode
      );
    }

    this.getCurrentLocation();
    Promise.all([
      this.props.actions.category.getCategoriesByMerchantId(), // .
      this.props.actions.extra.getExtraByMerchant(), // .
      this.props.actions.service.getServicesByMerchant(), // .
      this.props.actions.product.getProductsByMerchant(), // .
      this.props.actions.staff.getStaffByMerchantId(), // .
      this.props.actions.appointment.getStaffListByCurrentDate(
        profile?.merchantId
      ), // .
      this.props.actions.app.getNotificationList(), // .
      this.props.actions.app.getCountUnReadOfNotification(), // .

      this.props.actions.service.getCustomServiceByMerchantId(
        profile?.merchantId
      ), // .
    ])
      .then((data) => {
        this.props.actions.staff.reloadButtonEnterPincode();
        if (data.length >= 5) {
          this.props.actions.app.changeFlagVisibleEnteerPinCode(false);
        }
      })
      .catch((error) => {
        this.props.actions.staff.reloadButtonEnterPincode();
      });
  };

  // ----------- Handle group appointment -------

  gotoAppointmentTabToGroup = () => {
    this.scrollTabParentRef.current.goToPage(1);
  };

  pushAppointmentIdOfflineIntoWebview = () => {
    this.tabAppointmentRef?.current?.connectWebview();
  };

  onChangeTab = (index) => {
    const { profile } = this.props;
    const page = index?.i || 0;
    if (page === 2) {
      this.tabCheckoutRef?.current?.setStatusIsCheckout(true);
    }

    this.setState({ currentTab: page });
    if (page === 0) {
      this.props.actions.marketing.getPromotionByMerchant();
    } else if (page === 2) {
      this.props.actions.appointment.getStaffListByCurrentDate(
        profile?.merchantId
      );
    }
  };

  closePopupCheckMarketingTabPermission = () => {
    this.props.actions.marketing.toggleMarketingTabPermission(false);
  };

  handleNotification = () => {
    if (!this.props?.notiIntervalId) {
      const intervalId = setInterval(() => {
        try {
          SoundPlayer.playSoundFile("harmony", "mp3");
        } catch (e) {}
      }, 5000);
      this.props.actions.app.handleNotifiIntervalId(intervalId);
    }
  };

  clearIntervalById = () => {
    const { notiIntervalId } = this.props;
    if (notiIntervalId) {
      clearInterval(notiIntervalId);
      this.props.actions.app?.resetNotiIntervalId();
    }
  };

  displayNotifiPopup = () => {
    this.setState({
      visible: true,
    });
    this.props.actions.app.getNotificationList();
  };

  closeNotiPopup = () => {
    this.setState({
      visible: false,
    });
  };

  getItemCount = (data) => {
    return data?.length;
  };

  getItem = (data, index) => {
    return {
      ...data[index],
      id: `${data[index]?.merchantNotificationId}_${Math.random()
        .toString(12)
        .substring(0)}`,
    };
  };

  handlePushNotiDataToWebView = (noti) => () => {
    this.tabAppointmentRef?.current?.pushNotiDataToWebView(noti);
    this.setState({
      visible: false,
    });
    if (!l.get(noti, "view")) {
      this.props.actions.app.maskNotiAsReadById(
        noti?.merchantNotificationId || 0
      );
    }
  };

  loadMoreNotificationList = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      const { notiTotalPages, notiCurrentPage } = this.props;
      if (notiCurrentPage < notiTotalPages) {
        this.props.actions.app.getNotificationList(notiCurrentPage + 1);
        this.onEndReachedCalledDuringMomentum = true;
      }
    }
  };

  readAllNotification = () => {
    this.props.actions.app.readAllNotification();
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      isLoginStaff,
      isCheckAppointmentBeforeOffline,
      groupAppointment,
      isGoToTabMarketing,
      isHandleNotiWhenHaveAAppointment,
      profileStaffLogin,
    } = this.props;
    if (isLoginStaff && prevProps.isLoginStaff !== isLoginStaff) {
      this.loginStaffSuccess();
      this.props.actions.dataLocal.resetStateLoginStaff();
    }

    // ----------- Check Appointent Checkout berfore Offline mode -----------
    if (
      !_.isEmpty(groupAppointment) &&
      isCheckAppointmentBeforeOffline &&
      isCheckAppointmentBeforeOffline !==
        prevProps.isCheckAppointmentBeforeOffline
    ) {
      this.props.actions.appointment.checkAppointmentBeforOffline(false);
      this.tabCheckoutRef?.current?.resetStateFromParent();
      this.scrollTabParentRef.current.goToPage(1);
      this.props.actions.appointment.resetGroupAppointment();
    }

    if (
      prevProps.isGoToTabMarketing !== isGoToTabMarketing &&
      isGoToTabMarketing
    ) {
      this.props.actions.marketing.toggleMarketingTabPermission(false);
      this.scrollTabParentRef.current.goToPage(0);
    }

    if (
      isHandleNotiWhenHaveAAppointment &&
      prevProps.isHandleNotiWhenHaveAAppointment !==
        isHandleNotiWhenHaveAAppointment
    ) {
      if (profileStaffLogin?.token) {
        this.handleNotification();
        this.props.actions.app.resetStateNotiWhenHaveAAppointment();
      }
    }
  }

  componentWillUnmount() {
    this.didBlurSubscription();
    this.didFocusSubscription();

    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    AppState.removeEventListener("change", this.handleAppStateChange);
    this.clearIntervalById();
  }
}

const mapStateToProps = (state) => ({
  profile: state.dataLocal.profile,
  language: state.dataLocal.language,
  token: state.dataLocal.token,
  appointmentIdOffline: state.appointment.appointmentIdOffline,
  appointmentDetail: state.appointment.appointmentDetail,
  visibleModalLock: state.app.visibleModalLock,
  loading: state.app.loading,
  isLoginStaff: state.dataLocal.isLoginStaff,
  listAppointmentsOfflineMode: state.dataLocal.listAppointmentsOfflineMode,
  groupAppointment: state.appointment.groupAppointment,
  isOfflineMode: state.network.isOfflineMode,
  isCheckAppointmentBeforeOffline:
    state.appointment.isCheckAppointmentBeforeOffline,
  blockAppointments: state.appointment.blockAppointments,
  marketingTabPermission: state.marketing.marketingTabPermission,
  isGoToTabMarketing: state.marketing.isGoToTabMarketing,
  visibleEnterPin: state.app.visibleEnterPin,
  profileStaffLogin: state?.dataLocal?.profileStaffLogin || {},

  isHandleNotiWhenHaveAAppointment: state.app.isHandleNotiWhenHaveAAppointment,
  notiIntervalId: state.app.notiIntervalId,
  notificationList: state.app.notificationList,
  notificationContUnread: state.app.notificationContUnread,
  notiCurrentPage: state.app.notiCurrentPage,
  notiTotalPages: state.app.notiTotalPages,
});

let codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
};

HomeScreen = CodePush(codePushOptions)(HomeScreen);

export default connectRedux(mapStateToProps, HomeScreen);
