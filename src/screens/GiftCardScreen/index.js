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
                this.props.actions.appointment.switchGiftCardTabPermission();
                this.scrollTabRef?.current?.goToPage(0);
            }
        );
    }

    onChangeKeySearch = async (keySearch) => {
        await this.setState({ keySearch })
        if (keySearch == '') {
            this.searchGiftCardsList(1, true, false, false);
        }
    }

    clearSearchText = async () => {
        await this.setState({
            keySearch: ""
        });
        this.searchGiftCardsList(1, true, false, false);
    }

    onChangeTab = (index) => {
        this.setState({ currentTab: index.i });
    }

    goToGiftCardLogs = (giftCard) => {
        if (this.giftCardDetailTabRef?.current) {
            this.giftCardDetailTabRef?.current?.setStateFromParent(giftCard);
        } else {
            setTimeout(() => {
                this.giftCardDetailTabRef?.current?.setStateFromParent(giftCard);
            }, 300);
        }
        this.scrollTabRef.current.goToPage(1);
        this.props.actions.appointment.getGiftCardLogs(giftCard?.giftCardId);
    }

    backCustomerListTab = () => {
        this.scrollTabRef.current.goToPage(0);
    }


    openDrawer = () => {
        this.props.navigation.openDrawer();
    }


    closePopupCheckCustomerTabPermission = () => {
        this.props.actions.customer.toggleCustomerTabPermission(false);
        this.props.navigation.navigate("Home");
    }


    onRefreshGiftCardList = () => {
        this.searchGiftCardsList(1, false, false, true);
    }


    searchGiftCardsList = (currentPage = 1, isShowLoading = false, isShowLoadMore = false, isRefreshing = false) => {
        const { keySearch } = this.state;
        this.props.actions.appointment.getGiftCardsActiveList(keySearch, currentPage, isShowLoading, isShowLoadMore, isRefreshing);
    }

    loadMoreGiftCardsList = () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            const { totalGiftCardsListPages, currentGiftCardsListPage } = this.props;
            if (currentGiftCardsListPage < totalGiftCardsListPages) {
                this.searchGiftCardsList(parseInt(currentGiftCardsListPage + 1), false, true, false);
                this.onEndReachedCalledDuringMomentum = true;
            }
        }
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
    isGiftCardTabPermission: state.appointment.isGiftCardTabPermission
})

export default connectRedux(mapStateToProps, GiftCardScreen);

