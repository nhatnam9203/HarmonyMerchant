import connectRedux from "@redux/ConnectRedux";
import {
  BusinessWorkingTime,
  getNameLanguage,
  getPosotion,
  getTitleSendLinkGoogle,
  getTitleSignInAppDisplay,
  getValueSendLinkGoogle,
  getValueSignInAppDisplay,
  gotoSettingsDevice,
} from "@utils";
import React from "react";
import { SettingGeneralPage } from "../RTSettingsScreen/pages/SettingGeneralPage";
import Layout from "./layout";

const ShippingMethodDefault = {
  id: 0,
  storePickup: true,
  flatRate: true,
  freeShip: true,
  shippingFlatRates: [
    {
      id: 0,
      label: "1-2 days",
      amount: 5.0,
      isDeleted: 0,
      tempId: 1,
    },
    {
      id: 0,
      label: "2-4 days",
      amount: 10.0,
      isDeleted: 0,
      tempId: 2,
    },
    {
      id: 0,
      label: "5-10 days",
      amount: 15.0,
      isDeleted: 0,
      tempId: 3,
    },
  ],
};

class TabGaneral extends Layout {
  constructor(props) {
    super(props);
    const { profile, autoLockScreenAfter } = this.props;

    this.state = {
      languageApp: getNameLanguage(this.props.language),
      longitude: profile?.longitude || "",
      latitude: profile?.latitude || "",
      webLink: profile?.webLink || "",
      autoCloseAt: profile.autoCloseAt || "",
      autoLockScreenAfter: autoLockScreenAfter,
      timezone: profile?.timezone || "",
      isUpdateInternal: false,
      businessHour: profile?.businessHour || BusinessWorkingTime,
      turnAmount: profile?.turnAmount || 0,
      staffColumn: profile?.staffColumn || 8,
      signinAppStyle: getTitleSignInAppDisplay(profile?.signinAppStyle || ""),
      sendReviewLinkOption: getTitleSendLinkGoogle(
        profile?.sendReviewLinkOption || ""
      ),
      giftForNewEnabled: profile?.giftForNewEnabled || false,
      receiptFooter: profile?.receiptFooter || "",
      shippingMethod: profile?.shippingMethod ?? ShippingMethodDefault,
      isCheckQty: profile?.isCheckQty ?? false,
      isPrintReceipt: profile?.isPrintReceipt ?? false,
      businessName: profile?.businessName ?? "",
      phone: profile?.phone,
      email: profile?.email,
      address: profile?.address,
      city: profile?.city,
      stateId: profile?.stateId,
      zip: profile?.zip,
      isOpenCashier: profile?.isOpenCashier,
    };
    this.tempId = 4;
    this.inputRefsTime = [];
    this.checkPermissionRef = React.createRef();
    this.onChangeShippingFlatRate = this.onChangeShippingFlatRate.bind(this);
    this.onCheckShippingFree = this.onCheckShippingFree.bind(this);
    this.switchCheckProductQuantity =
      this.switchCheckProductQuantity.bind(this);
    this.switchPrintReceipt = this.switchPrintReceipt.bind(this);
  }

  setRefTimeWorking = (ref) => {
    if (ref) {
      this.inputRefsTime.push(ref);
    }
  };

  setStateFromParent = async (
    webLink,
    timezone,
    autoCloseAt,
    turnAmount,
    staffColumn,
    signinAppStyle,
    sendReviewLinkOption,
    giftForNewEnabled
  ) => {
    const { currentTab } = this.props;
    if (currentTab === SettingGeneralPage.name) {
      await this.setState({
        webLink,
        timezone,
        autoCloseAt,
        turnAmount,
        isUpdateInternal: false,
        staffColumn,
        signinAppStyle: getTitleSignInAppDisplay(signinAppStyle),
        sendReviewLinkOption: getTitleSendLinkGoogle(
          sendReviewLinkOption || ""
        ),
        giftForNewEnabled,
      });

      this.onRefreshGeneral();

      this.updateWorkTime();
    }
  };

  updateWorkTime = () => {
    const { profile } = this.props;
    const businessHour = profile.businessHour
      ? profile.businessHour
      : BusinessWorkingTime;
    for (let i = 0; i < this.inputRefsTime.length; i++) {
      this.inputRefsTime[i].setStateFromParent(
        businessHour[this.inputRefsTime[i].props.title]
      );
    }
  };

  onRefreshGeneral = () => {
    const { profile } = this.props;
    this.props.actions.app.getMerchantByID(profile.merchantId, true);
  };

  getCurrentPosition = async () => {
    try {
      const position = await getPosotion();
      const { latitude, longitude } = position.coords;
      await this.setState({
        latitude: `${latitude}`,
        longitude: `${longitude}`,
      });
    } catch (error) {
      gotoSettingsDevice();
    }
  };

  changeAutoLockTime = (value) => {
    this.props.actions.dataLocal.updateAutoLockTime(value);
  };

  saveSettngApp = async () => {
    const { profile } = this.props;
    const {
      languageApp,
      longitude,
      latitude,
      webLink,
      autoCloseAt,
      timezone,
      turnAmount,
      staffColumn,
      signinAppStyle,
      sendReviewLinkOption,
      giftForNewEnabled,
      receiptFooter,
      shippingMethod,
      isCheckQty,
      isPrintReceipt,
      businessName,
      phone,
      email,
      address,
      city,
      stateId,
      zip,
      isOpenCashier,
    } = this.state;
    const temptLanguage = languageApp === "English" ? "en" : "vi";
    this.props.actions.dataLocal.changeSettingLocal(temptLanguage, autoCloseAt);
    await this.setState({
      isUpdateInternal: true,
    });
    let objWorkingTime = [];
    this.inputRefsTime.forEach((ref) => {
      objWorkingTime = {
        ...objWorkingTime,
        [ref.props.title]: {
          timeStart: ref.state.timeStart,
          timeEnd: ref.state.timeEnd,
          isCheck: ref.state.isCheck,
        },
      };
    });
    this.props.actions.app.merchantSetting(
      {
        businessHour: objWorkingTime,
        webLink: webLink,
        latitude: latitude,
        longitude: longitude,
        taxService: profile.taxService,
        taxProduct: profile.taxProduct,
        timezone,
        autoLockscreen: "",
        autoCloseAt,
        turnAmount,
        staffColumn,
        signinAppStyle: getValueSignInAppDisplay(signinAppStyle),
        sendReviewLinkOption: getValueSendLinkGoogle(sendReviewLinkOption),
        giftForNewEnabled,
        receiptFooter,
        shippingMethod,
        isCheckQty,
        isPrintReceipt,
        businessName,
        phone,
        email,
        address,
        city,
        stateId,
        zip,
        isOpenCashier,
      },
      true,
      true
    );
  };

  switchTipOnPaxMachine = (visible) => {
    this.props.actions.dataLocal.switchTipOnPaxMachine(visible);
  };

  async componentDidUpdate(prevProps, prevState) {
    const { profile, refreshingGeneral, loading, currentTab } = this.props;
    // console.log(currentTab + " " + SettingGeneralPage.name);
    if (
      currentTab === SettingGeneralPage.name &&
      prevProps.refreshingGeneral !== refreshingGeneral &&
      !refreshingGeneral
    ) {
      await this.setState({
        webLink: profile?.webLink || "",
        timezone: profile?.timezone || "",
        autoCloseAt: profile?.autoCloseAt || "",
        turnAmount: profile?.turnAmount || 0,
        staffColumn: profile?.staffColumn || 8,
        signinAppStyle: getTitleSignInAppDisplay(profile?.signinAppStyle || ""),
        sendReviewLinkOption: getTitleSendLinkGoogle(
          profile?.sendReviewLinkOption || ""
        ),
        giftForNewEnabled: profile?.giftForNewEnabled || false,
        shippingMethod: profile?.shippingMethod ?? ShippingMethodDefault,
        receiptFooter: profile?.receiptFooter || "",
        isCheckQty: profile?.isCheckQty ?? false,
        isPrintReceipt: profile?.isPrintReceipt ?? false,
        businessName: profile?.businessName ?? "",
        phone: profile?.phone,
        email: profile?.email,
        address: profile?.address,
        city: profile?.city,
        stateId: profile?.stateId,
        zip: profile?.zip,
        isOpenCashier: profile?.isOpenCashier,
      });
      this.updateWorkTime();
    }
    if (
      currentTab === SettingGeneralPage.name &&
      prevProps.loading !== loading &&
      prevProps.loading &&
      !loading &&
      this.state.isUpdateInternal
    ) {
      await this.setState({
        webLink: profile?.webLink || "",
        timezone: profile?.timezone || "",
        autoCloseAt: profile?.autoCloseAt || "",
        turnAmount: profile?.turnAmount || 0,
        staffColumn: profile?.staffColumn || 8,
        isUpdateInternal: false,
        signinAppStyle: getTitleSignInAppDisplay(profile?.signinAppStyle || ""),
        sendReviewLinkOption: getTitleSendLinkGoogle(
          profile?.sendReviewLinkOption || ""
        ),
        giftForNewEnabled: profile?.giftForNewEnabled || false,
        shippingMethod: profile?.shippingMethod ?? ShippingMethodDefault,
        receiptFooter: profile?.receiptFooter || "",
        isCheckQty: profile?.isCheckQty ?? false,
        isPrintReceipt: profile?.isPrintReceipt ?? false,
        businessName: profile?.businessName ?? "",
        phone: profile?.phone,
        email: profile?.email,
        address: profile?.address,
        city: profile?.city,
        stateId: profile?.stateId,
        zip: profile?.zip,
        isOpenCashier: profile?.isOpenCashier,
      });
      this.updateWorkTime();
    }
  }

  addMoreShipping = () => {
    this.tempId++;

    const { shippingMethod } = this.state;

    let { shippingFlatRates = [] } = shippingMethod || [];

    shippingFlatRates.push({
      id: 0,
      label: "Flat rate",
      amount: 0,
      isDeleted: 0,
      tempId: this.tempId,
    });

    this.setState({
      shippingMethod: Object.assign({}, shippingMethod, {
        shippingFlatRates,
      }),
    });
  };

  onCheckShippingFree(isCheck) {
    const { shippingMethod } = this.state;

    this.setState({
      shippingMethod: Object.assign({}, shippingMethod, { freeShip: isCheck }),
    });
  }

  onChangeShippingFlatRate(shipItem) {
    const { shippingMethod } = this.state;
    let { shippingFlatRates = [] } = shippingMethod || [];
    const findIndex = shippingFlatRates?.findIndex((x) =>
      x.id > 0 ? x.id === shipItem.id : x.tempId === shipItem.tempId
    );

    if (findIndex >= 0) {
      shippingFlatRates[findIndex] = shipItem;

      this.setState({
        shippingMethod: Object.assign({}, shippingMethod, {
          shippingFlatRates,
        }),
      });
    }
  }

  componentDidMount() {
    this.props.actions.app.getMerchantByID(this.props.profile.merchantId, true);
  }
  componentWillUnmount() {
    this.inputRefsTime = [];
  }

  switchCheckProductQuantity(visible) {
    this.setState({
      isCheckQty: visible,
    });
  }

  switchPrintReceipt(visible) {
    this.setState({
      isPrintReceipt: visible,
    });
  }

  switchOpenCashier(visible) {
    this.setState({
      isOpenCashier: visible,
    });
  }
}

const mapStateToProps = (state) => ({
  profile: state.dataLocal.profile,
  language: state.dataLocal.language,
  autoCloseAt: state.dataLocal.autoCloseAt,
  autoLockScreenAfter: state.dataLocal.autoLockScreenAfter,
  stateCity: state.dataLocal.stateCity,
  refreshingGeneral: state.app.refreshingGeneral,
  loading: state.app.loading,
  versionApp: state.dataLocal.versionApp,
  isTipOnPaxMachine: state.dataLocal.isTipOnPaxMachine,
  app: state.app,
  profileStaffLogin: state.dataLocal.profileStaffLogin,
});

export default connectRedux(mapStateToProps, TabGaneral);
