import React from "react";
import { Keyboard } from "react-native";

import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";
import { checkStatusPrint } from "@utils";

class SettingScreen extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: true,
      indexTab: 0,
      visibleLogout: false,
    };
    this.scrollTabRef = React.createRef();
    this.taxTabRef = React.createRef();
    this.generalTabRef = React.createRef();
    this.checkPermissionRef = React.createRef();
    this.tabStaffRef = React.createRef();
    this.tabCategoriesRef = React.createRef();
    this.tabServiceRef = React.createRef();
    this.tabExtraRef = React.createRef();
    this.leftMenuSettingRef = React.createRef();
  }

  componentDidMount() {
    this.didBlurSubscription = this.props.navigation.addListener(
      "didBlur",
      (payload) => {
        this.setState({
          isFocus: false,
        });
        this.checkPermissionRef.current.setStateFromParent("");
        this.resetSettingTab();
      }
    );
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      (payload) => {
        this.setState({
          isFocus: true,
        });
        this.checkPermissionRef?.current?.setStateFromParent("");

        const { profileStaffLogin } = this.props;
        const roleName = profileStaffLogin?.roleName || "Admin";
        if (roleName === "Admin") {
          const { profile } = this.props;
          this.props.actions.app.getMerchantByID(profile?.merchantId);
        } else {
          this.props.actions.app.toggleSettingTabPermission();
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

  selectMenu = async (index) => {
    if (index === 7) {
      this.setState({
        visibleLogout: true,
      });
    } else {
      this.leftMenuSettingRef.current.setStateFromParent(index);
      this.scrollTabRef.current.goToPage(index);
      if (index === 6) {
        setTimeout(() => {
          this.fetchAPIsInSettingTab(index);
        }, 100);
      } else {
        this.fetchAPIsInSettingTab(index);
      }

      Keyboard.dismiss();
    }

    this.setState({
      indexTab: index
    });

  }

  fetchAPIsInSettingTab = (index) => {
    switch (index) {
      case 0:
        const { profile } = this.props;
        return this.props.actions.app.getMerchantByID(
          profile.merchantId,
          true
        );
      case 1:
        this.resetStateStaffSetting();
        return this.props.actions.staff.getStaffByMerchantId("", "", "", false, false);
      case 2:
        this.resetStateCategoriesSetting();
        return this.props.actions.category.getCategoriesByMerchantId('', '', '', false, false);
      case 3:
        this.resetStateServiceSetting();
        return this.props.actions.service.getServicesByMerchant('', '', '', false, false);
      case 4:
        this.resetStateExtraSetting();
        return this.props.actions.extra.getExtraByMerchant('', '', false, false);
      case 5:
        return this.updateTaxFromParent();
      case 6:
        this.getPrinters();
      default:
    }
  };

  resetStateExtraSetting = () => {
    if (this.tabExtraRef.current) {
      this.tabExtraRef.current.setStateFromParent();
    }
  }

  resetStateServiceSetting = () => {
    if (this.tabServiceRef.current) {
      this.tabServiceRef.current.setStateFromParent();
    }
  }

  resetStateCategoriesSetting = () => {
    if (this.tabCategoriesRef.current) {
      this.tabCategoriesRef.current.setStateFromParent();
    }
  }

  resetStateStaffSetting = () => {
    if (this.tabStaffRef.current) {
      this.tabStaffRef.current.setStateFromParent();
    }
  }

  updateTaxFromParent = () => {
    const { profile } = this.props;
    const productTAX = profile?.taxProduct || "";
    const serviceTAX = profile?.taxService || "";
    if (this.taxTabRef.current) {
      this.taxTabRef.current.setStateFromParent(productTAX, serviceTAX);
    } else {
      setTimeout(() => {
        this.taxTabRef.current.setStateFromParent(productTAX, serviceTAX);
      }, 500);
    }
  };

  logout = () => {
    this.props.actions.auth.requestLogout();
    this.props.navigation.navigate("SigninStack");
  };

  backTab = () => {
    this.props.actions.staff.switchAddStaff(false);
  };

  closePopupCheckSettingTabPermission = () => {
    this.props.actions.app.toggleSettingTabPermission(false);
    this.props.navigation.navigate("Home");
  };

  getPrinters = async () => {
    const { printerPortType } = this.props;
    try {
      if (!printerPortType) {
        this.props.actions.dataLocal.updatePrinterPortType("Bluetooth");
      }
      this.props.actions.app.loadingApp()
      const printMachine = await checkStatusPrint(printerPortType ? printerPortType : "Bluetooth");
      this.props.actions.dataLocal.updatePrinterList(printMachine);
      this.props.actions.app.stopLoadingApp();
    } catch (error) {
      this.props.actions.app.stopLoadingApp();
      setTimeout(() => {
        alert(error)
      }, 500)
    }
  }

  resetSettingTab = () => {
    const { isShowSearchCategories, isShowSearchExtra, isShowSearchService, isShowSearchStaff } = this.props;
    if (isShowSearchCategories) {
      this.props.actions.category.getCategoriesByMerchantId('', '', '', false, false);
    }
    if (isShowSearchExtra) {
      this.props.actions.extra.getExtraByMerchant('', '', false, false);
    }
    if (isShowSearchService) {
      this.props.actions.service.getServicesByMerchant('', '', '', false, false);
    }
    if (isShowSearchStaff) {
      this.props.actions.staff.getStaffByMerchantId("", "", "", false, false);
    }
    this.scrollTabRef.current.goToPage(0);

    if (this.leftMenuSettingRef.current) {
      this.leftMenuSettingRef.current.setStateFromParent(0);
    }
    this.setState({
      indexTab: 0,
    })

  }

  componentDidUpdate(prevProps, prevState) {
    const { profile, loading } = this.props;
    if (
      prevProps.loading !== loading &&
      prevProps.loading &&
      !loading &&
      !this.generalTabRef.current.state.isUpdateInternal &&
      this.state.indexTab === 0
    ) {

      // ------- External Update -----
      this.generalTabRef.current.setStateFromParent(
        profile?.webLink || "",
        profile?.timezone || "",
        profile?.autoCloseAt || "",
        profile?.turnAmount || 0,
        profile?.staffColumn || 8,
        profile?.signinAppStyle || "",
        profile?.sendReviewLinkOption || "",
        profile?.isUsingTurn || false,
        profile?.giftForNewEnabled || false
      );
    }
  }

  componentWillUnmount() {
    this.didBlurSubscription.remove();
    this.didFocusSubscription.remove();
  }
}

const mapStateToProps = (state) => ({
  profile: state.dataLocal.profile,
  language: state.dataLocal.language,
  loading: state.app.loading,
  settingTabPermission: state.app.settingTabPermission,
  printerPortType: state.dataLocal.printerPortType,
  isAddStaff: state.staff.isAddStaff,

  isShowSearchCategories: state.category.isShowSearchCategories,
  isShowSearchExtra: state.extra.isShowSearchExtra,
  isShowSearchService: state.service.isShowSearchService,
  isShowSearchStaff: state.staff.isShowSearchStaff,
  profileStaffLogin: state.dataLocal.profileStaffLogin,
});

export default connectRedux(mapStateToProps, SettingScreen);
