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
            currentTab: 0
        }
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
        this.props.actions.appointment.getGiftCardsActiveList();
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({
                    isFocus: false,
                    keySearch: ''
                });
                this.checkPermissionRef.current.setStateFromParent('');
                this.props.actions.customer.clearSearCustomer();
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({
                    isFocus: true
                });
                this.checkPermissionRef.current.setStateFromParent('');
                // this.props.actions.customer.toggleCustomerTabPermission();
                this.scrollTabRef?.current?.goToPage(0);
            }
        );
    }

    onChangeKeySearch = async (keySearch) => {
        await this.setState({ keySearch })
        if (keySearch == '') {
            this.searchCustomer(1, false, false);
        }
    }

    clearSearchText = async () => {
        await this.setState({
            keySearch: ""
        });
        this.searchGiftCardsList(1, true, false, false);
    }

    showModalAddCustomer = () => {
        this.modalAddRef.current.setStateDefaultFromParent();
        this.setState({
            visibleAdd: true
        })
    }

    showModalEditCustomer = (customer) => {
        this.modalEditRef.current.setStateFromParent(customer);
        this.setState({
            visibleDetail: false,
            visibleEdit: true
        })
    }

    closeModalEditCustomer = () => {
        this.setState({
            visibleEdit: false
        })
    }

    closeModalAddCustomer = () => {
        this.setState({
            visibleAdd: false
        })
    }

    closeModalDetail = () => {
        this.setState({
            visibleDetail: false
        })
    }

    onChangeTab = (index) => {
        this.setState({ currentTab: index.i });
    }

    goToGiftCardLogs = (giftCard) => {
        this.scrollTabRef.current.goToPage(1);
        this.props.actions.appointment.getGiftCardLogs(giftCard?.giftCardId);
    }

    backCustomerListTab = () => {
        this.scrollTabRef.current.goToPage(0);
    }

    handleLockScreen = () => {
        const { isFocus } = this.state;
        if (isFocus) {
            this.props.navigation.navigate('Home');
            this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
        }
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    showLockScreen = () => {
        this.props.actions.app.handleLockScreen(true);
    }

    closePopupCheckCustomerTabPermission = () => {
        this.props.actions.customer.toggleCustomerTabPermission(false);
        this.props.navigation.navigate("Home");
    }

    showAppointmentDetail = () => {
        alert("dd");
    }

    onRefreshGiftCardList = () => {
        this.searchGiftCardsList(1, false, false, true);
    }

    searchCustomer = (currentPage = 1, isShowLoading = false, isShowLoadMore = false) => {
        const { keySearch } = this.state;
        this.props.actions.customer.getListCustomersByMerchant(keySearch, currentPage, isShowLoading, isShowLoadMore);
    }

    searchGiftCardsList = (currentPage = 1, isShowLoading = false, isShowLoadMore = false, isRefreshing = false) => {
        const { keySearch } = this.state;
        this.props.actions.appointment.getGiftCardsActiveList(keySearch, currentPage, isShowLoading, isShowLoadMore, isRefreshing);
    }

    loadMoreCustomerList = () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            const { totalGiftCardsListPages, currentGiftCardsListPage } = this.props;
            if (currentGiftCardsListPage < totalGiftCardsListPages) {
                this.searchGiftCardsList(parseInt(currentGiftCardsListPage + 1), false, true, false);
                this.onEndReachedCalledDuringMomentum = true;
            }
        }
    }

    addNewCustomer = () => {
        if (this.edtitCustomerRef?.current) {
            this.edtitCustomerRef.current.setStateFromListCusomterTab();
        } else {
            setTimeout(() => {
                this.edtitCustomerRef.current.setStateFromListCusomterTab();
            })
        }
        this.scrollTabRef.current.goToPage(2);
    }

    editCustomer = (customer) => {
        if (this.edtitCustomerRef?.current) {
            this.edtitCustomerRef.current.setStateFromParent(customer);
        } else {
            setTimeout(() => {
                this.edtitCustomerRef.current.setStateFromParent(customer);
            })
        }

        this.scrollTabRef.current.goToPage(2);
    }

    submitEditCustomer = async (customer) => {
        this.props.actions.customer.editCustomer(customer?.customerId, customer);
    }

    cancelEditCustomerInfo = () => {
        this.scrollTabRef.current.goToPage(1);
    }

    cancelAddCustomerInfo = () => {
        this.scrollTabRef.current.goToPage(0);
    }

    addCustomer = async (customer) => {
        this.props.actions.customer.addCustomer(customer);
    }

    componentDidUpdate(prevProps, prevState) {

    }

    componentWillUnmount() {
        this.didBlurSubscription.remove();
        this.didFocusSubscription.remove();
    }


}

const mapStateToProps = state => ({
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


    // -------------- New State ---------------
    giftCardsList: state.appointment.giftCardsList,
    totalGiftCardsListPages: state.appointment.totalGiftCardsListPages,
    currentGiftCardsListPage: state.appointment.currentGiftCardsListPage,
    isLoadMoreGiftCardsList: state.appointment.isLoadMoreGiftCardsList,
})

export default connectRedux(mapStateToProps, GiftCardScreen);

