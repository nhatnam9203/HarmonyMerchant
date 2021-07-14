import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class GiftCardScreen extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: true,
      isSelectAll: false,
      visibleAdd: false,
      visibleDetail: false,
      visibleEdit: false,
      keySearch: '',
      currentTab: 0,
    };
    this.scrollTabRef = React.createRef();
    this.modalDetailRef = React.createRef();
    this.modalAddRef = React.createRef();
    this.modalEditRef = React.createRef();
    this.checkPermissionRef = React.createRef();
    this.edtitCustomerRef = React.createRef();
    this.onEndReachedCalledDuringMomentum = true;
    this.giftCardDetailTabRef = React.createRef();
  }

  componentDidMount() {
    this.didBlurSubscription = this.props.navigation.addListener(
      "blur",
      (payload) => {
        this.setState({
          isFocus: false,
          keySearch: '',
        });
        this.checkPermissionRef.current?.setStateFromParent('');
        this.props.actions.customer.clearSearCustomer();
      },
    );
    this.didFocusSubscription = this.props.navigation.addListener(
      "focus",
      (payload) => {
        this.setState({
          isFocus: true,
        });
        this.checkPermissionRef.current?.setStateFromParent('');
        this.scrollTabRef?.current?.goToPage(0);

        const { profileStaffLogin } = this.props;
        const roleName = profileStaffLogin?.roleName || 'Admin';
        if (roleName === 'Admin') {
          this.searchGiftCardsList(1, true, false, false);
        } else {
          this.props.actions.appointment.switchGiftCardTabPermission();
        }
      },
    );
  }

  onChangeKeySearch = async (keySearch) => {
    await this.setState({ keySearch });
    if (keySearch == '') {
      this.searchGiftCardsList(1, true, false, false);
    }
  };

  clearSearchText = async () => {
    await this.setState({
      keySearch: '',
    });
    this.searchGiftCardsList(1, true, false, false);
  };

  onChangeTab = (index) => {
    this.setState({ currentTab: index.i });
  };

  goToGiftCardLogs = (giftCard) => {
    if (this.giftCardDetailTabRef?.current) {
      this.giftCardDetailTabRef?.current?.setStateFromParent(giftCard);
    } else {
      setTimeout(() => {
        this.giftCardDetailTabRef?.current?.setStateFromParent(giftCard);
      }, 300);
    }
    this.scrollTabRef.current?.goToPage(1);
    this.props.actions.appointment.getGiftCardLogs(giftCard?.giftCardId);
  };

  backCustomerListTab = () => {
    this.scrollTabRef.current?.goToPage(0);
  };

  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  closePopupCheckGiftCardTabPermission = () => {
    this.props.actions.appointment.switchGiftCardTabPermission(false);
    this.props.navigation.navigate('Home');
  };

  onRefreshGiftCardList = () => {
    this.searchGiftCardsList(1, false, false, true);
  };

  searchGiftCardsList = (
    currentPage = 1,
    isShowLoading = false,
    isShowLoadMore = false,
    isRefreshing = false,
  ) => {
    const { keySearch } = this.state;
    this.props.actions.appointment.getGiftCardsActiveList(
      keySearch,
      currentPage,
      isShowLoading,
      isShowLoadMore,
      isRefreshing,
    );
  };

  loadMoreGiftCardsList = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      const { totalGiftCardsListPages, currentGiftCardsListPage } = this.props;
      if (currentGiftCardsListPage < totalGiftCardsListPages) {
        this.searchGiftCardsList(
          parseInt(currentGiftCardsListPage + 1),
          false,
          true,
          false,
        );
        this.onEndReachedCalledDuringMomentum = true;
      }
    }
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
  giftCardsList: state.appointment.giftCardsList,
  totalGiftCardsListPages: state.appointment.totalGiftCardsListPages,
  currentGiftCardsListPage: state.appointment.currentGiftCardsListPage,
  isLoadMoreGiftCardsList: state.appointment.isLoadMoreGiftCardsList,
  isGiftCardTabPermission: state.appointment.isGiftCardTabPermission,
  profileStaffLogin: state.dataLocal.profileStaffLogin,
  notiIntervalId: state.app.notiIntervalId,
});

export default connectRedux(mapStateToProps, GiftCardScreen);
