import React from "react";
import NavigationServices from "@navigators/NavigatorServices";
import { ScreenName } from "@src/ScreenName";
import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";
import { role, menuTabs, isPermissionToTab } from '@utils';
import * as l from 'lodash';

class CustomerScreen extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: true,
      isSelectAll: false,
      visibleAdd: false,
      visibleDetail: false,
      visibleEdit: false,
      keySearch: "",
      currentTab: 0,
    };
    this.scrollTabRef = React.createRef();
    this.modalDetailRef = React.createRef();
    this.modalAddRef = React.createRef();
    this.modalEditRef = React.createRef();
    this.checkPermissionRef = React.createRef();
    this.customerDetailTabRef = React.createRef();
    this.edtitCustomerRef = React.createRef();
    this.onEndReachedCalledDuringMomentum = true;
  }

  componentDidMount() {
    this.didBlurSubscription = this.props.navigation.addListener(
      "blur",
      (payload) => {
        this.setState({
          isFocus: false,
          keySearch: "",
        });
        this.checkPermissionRef.current?.setStateFromParent("");
        this.props.actions.customer.clearSearCustomer();
      }
    );
    this.didFocusSubscription = this.props.navigation.addListener(
      "focus",
      (payload) => {
        this.props.actions.customer.countCustomer(); 
        this.setState({
          isFocus: true,
        });
        this.checkPermissionRef.current?.setStateFromParent("");
        this.scrollTabRef?.current?.goToPage(0);

        const { profileStaffLogin } = this.props;
        const roleName = profileStaffLogin?.roleName || role.Admin;
        const permission = l.get(profileStaffLogin, 'permission', [])
        if (roleName === role.Admin) {
          this.searchCustomer(1, true, false);
        } else if (roleName === role.Manager) {
          if (isPermissionToTab(permission, menuTabs.MENU_CUSTOMER)) {
            this.searchCustomer(1, true, false);
          }else {
            this.props.actions.customer.toggleCustomerTabPermission();
          }
        } else {
            this.props.actions.customer.toggleCustomerTabPermission();
          }
        }
    );
  }

  onChangeKeySearch = async (keySearch) => {
    await this.setState({ keySearch });
    if (keySearch == "") {
      this.searchCustomer(1, false, false);
    }
  };

  clearSearchText = async () => {
    await this.setState({
      keySearch: "",
    });
    this.searchCustomer(1, true, false);
  };

  showModalAddCustomer = () => {
    this.modalAddRef.current?.setStateDefaultFromParent();
    this.setState({
      visibleAdd: true,
    });
  };

  showModalEditCustomer = (customer) => {
    this.modalEditRef.current?.setStateFromParent(customer);
    this.setState({
      visibleDetail: false,
      visibleEdit: true,
    });
  };

  closeModalEditCustomer = () => {
    this.setState({
      visibleEdit: false,
    });
  };

  closeModalAddCustomer = () => {
    this.setState({
      visibleAdd: false,
    });
  };

  closeModalDetail = () => {
    this.setState({
      visibleDetail: false,
    });
  };

  onChangeTab = (index) => {
    this.setState({ currentTab: index.i });
  };

  gotoCustomerDetailTab = (customer) => {
    this.scrollTabRef.current?.goToPage(1);
    this.props.actions.customer.getCustomerInfoById(customer?.customerId || 0);
    this.props.actions.customer.getPastAppointments(customer?.customerId || 0);
    if (this.customerDetailTabRef?.current) {
      this.customerDetailTabRef?.current?.setStateFromParent(customer);
    } else {
      setTimeout(() => {
        this.customerDetailTabRef?.current?.setStateFromParent(customer);
      }, 300);
    }
  };

  backCustomerListTab = () => {
    this.scrollTabRef.current?.goToPage(0);
  };

  handleLockScreen = () => {
    const { isFocus } = this.state;
    if (isFocus) {
      NavigationServices.navigate(ScreenName.SALON.APPOINTMENT);
      this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
    }
  };

  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  showLockScreen = () => {
    this.props.actions.app.handleLockScreen(true);
  };

  closePopupCheckCustomerTabPermission = () => {
    this.props.actions.customer.toggleCustomerTabPermission(false);
    NavigationServices.navigate(ScreenName.SALON.APPOINTMENT);

  };

  showAppointmentDetail = () => {
    alert("dd");
  };

  onRefreshCustomer = () => {
    this.searchCustomer(1, false, false);
  };

  searchCustomer = (
    currentPage = 1,
    isShowLoading = false,
    isShowLoadMore = false
  ) => {
    const { keySearch } = this.state;
    this.props.actions.customer.getListCustomersByMerchant(
      keySearch,
      currentPage,
      isShowLoading,
      isShowLoadMore
    );
  };

  loadMoreCustomerList = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      const { totalPages, currentPage } = this.props;
      if (currentPage < totalPages) {
        this.searchCustomer(parseInt(currentPage + 1), false, true);
        this.onEndReachedCalledDuringMomentum = true;
      }
    }
  };

  addNewCustomer = () => {
    if (this.edtitCustomerRef?.current) {
      this.edtitCustomerRef.current?.setStateFromListCusomterTab();
    } else {
      setTimeout(() => {
        this.edtitCustomerRef.current?.setStateFromListCusomterTab();
      });
    }
    this.scrollTabRef.current?.goToPage(2);
  };

  editCustomer = (customer) => {
    if (this.edtitCustomerRef?.current) {
      this.edtitCustomerRef.current?.setStateFromParent(customer);
    } else {
      setTimeout(() => {
        this.edtitCustomerRef.current?.setStateFromParent(customer);
      });
    }

    this.scrollTabRef.current?.goToPage(2);
  };

  deleteCustomer = (customer) => {
    this.props.actions.customer.deleteCustomer(customer?.customerId, customer);
  };

  submitEditCustomer = async (customer) => {
    this.props.actions.customer.editCustomer(customer?.customerId, customer);
  };

  cancelEditCustomerInfo = () => {
    this.scrollTabRef.current?.goToPage(1);
  };

  cancelAddCustomerInfo = () => {
    this.scrollTabRef.current?.goToPage(0);
  };

  addCustomer = async (customer) => {
    this.props.actions.customer.addCustomer(customer);
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      isEditCustomerSuccess,
      isAddCustomerSuccess,
      isDeleteCustomerSuccess,
    } = this.props;
    if (
      isEditCustomerSuccess &&
      isEditCustomerSuccess !== prevProps.isEditCustomerSuccess
    ) {
      this.scrollTabRef.current?.goToPage(1);
      this.props.actions.customer.resetEditCustomerState();
    }

    if (
      isAddCustomerSuccess &&
      isAddCustomerSuccess !== prevProps.isAddCustomerSuccess
    ) {
      this.scrollTabRef.current?.goToPage(0);
      this.props.actions.customer.resetAddCustomerState();
    }

    if (
      isDeleteCustomerSuccess &&
      isDeleteCustomerSuccess !== prevProps.isDeleteCustomerSuccess
    ) {
      this.scrollTabRef.current?.goToPage(0);
      this.props.actions.customer.resetDeleteCustomerState();
    }
  }

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
  listCustomersByMerchant: state.customer.listCustomersByMerchant,
  listCustomersSearch: state.customer.listCustomersSearch,
  isShowSearchCustomer: state.customer.isShowSearchCustomer,
  refreshListCustomer: state.customer.refreshListCustomer,
  stateCity: state.dataLocal.stateCity,
  customerTabPermission: state.customer.customerTabPermission,
  totalPages: state.customer.totalPages,
  currentPage: state.customer.currentPage,
  isLoadMoreCustomerList: state.customer.isLoadMoreCustomerList,
  isEditCustomerSuccess: state.customer.isEditCustomerSuccess,
  isAddCustomerSuccess: state.customer.isAddCustomerSuccess,
  isDeleteCustomerSuccess: state.customer.isDeleteCustomerSuccess,
  profileStaffLogin: state.dataLocal.profileStaffLogin,
  notiIntervalId: state.app.notiIntervalId,
  totalCustomerMerchant: state.customer.totalCustomerMerchant,
});

export default connectRedux(mapStateToProps, CustomerScreen);
