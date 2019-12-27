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
            keySearch: ''
        }
        this.scrollTabRef = React.createRef();
        this.modalDetailRef = React.createRef();
        this.modalAddRef = React.createRef();
        this.modalEditRef = React.createRef();
    }

    componentDidMount() {
        this.props.actions.customer.getListCustomersByMerchant();
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({
                    isFocus: false
                })
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({
                    isFocus: true
                })
            }
        );
    }

    searchCustomer = () => {
        const { keySearch } = this.state;
        if (keySearch == '') {
            this.props.actions.customer.clearSearCustomer();
        } else {
            this.props.actions.customer.searchCustomer(keySearch);
        }
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

    showModalDetail = (customer) => {
    //console.log('----- customer : ',customer);
        this.modalDetailRef.current.setStateFromParent(customer);
        this.setState({
            visibleDetail: true
        })
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
        this.props.actions.customer.editCustomer(customerId, customer);

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
    stateCity: state.dataLocal.stateCity
})



export default connectRedux(mapStateToProps, CustomerScreen);