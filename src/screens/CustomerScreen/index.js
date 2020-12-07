import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class CustomerScreen extends Layout {

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
        this.onEndReachedCalledDuringMomentum = true;
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
                this.props.actions.customer.toggleCustomerTabPermission();
            }
        );
    }

    onChangeKeySearch = async (keySearch) => {
        await this.setState({ keySearch })
        if (keySearch == '') {
            this.searchCustomer();
        }
    }

    clearSearchText = () => {
        this.setState({
            keySearch: ""
        })
    }

    searchCustomer = (isShowLoading = true) => {
        const { keySearch } = this.state;
        this.props.actions.customer.getListCustomersByMerchant(keySearch, isShowLoading);
    }

    onRefreshCustomer = () => {
        this.searchCustomer(false);
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

    gotoCustomerDetailTab = (customer) => {
        this.scrollTabRef.current.goToPage(1);
        this.props.actions.customer.getCustomerInfoById(customer?.customerId || 0);
        this.props.actions.customer.getPastAppointments(customer?.customerId || 0);
        if (this.customerDetailTabRef?.current) {
            this.customerDetailTabRef?.current?.setStateFromParent(customer);
        } else {
            setTimeout(() => {
                this.customerDetailTabRef?.current?.setStateFromParent(customer);
            }, 300)
        }

    }

    backCustomerListTab = () => {
        this.scrollTabRef.current.goToPage(0);
    }

    addCustomer = async (customer) => {
        await this.setState({
            visibleAdd: false
        })
        this.props.actions.customer.addCustomer(customer);
    }

    editCustomer = async (customerId, customer) => {
        await this.setState({
            visibleEdit: false
        })
        this.props.actions.customer.editCustomer(customerId, customer, this.state.keySearch);

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
        alert("dd")
    }


    searchCustomer_1 = (isShowLoading = true) => {
        const { totalPages, currentPage } = this.props;
        const { keySearch } = this.state;
        this.props.actions.customer.getListCustomersByMerchant(keySearch, parseInt(currentPage + 1), isShowLoading);
    }

    loadMoreCustomerList = () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            const { totalPages, currentPage } = this.props;
            if (currentPage < totalPages) {
                // this.searchInvoice(parseInt(currentPage + 1), false, true)
                this.searchCustomer_1(false);
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
})

export default connectRedux(mapStateToProps, CustomerScreen);