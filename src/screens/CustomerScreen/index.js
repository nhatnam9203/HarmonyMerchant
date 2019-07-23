import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class CustomerScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isFocus: true,
            isSelectAll: false,
            visibleEditAddCustomer: false,
            keySearch: ''
        }
        this.scrollTabRef = React.createRef();
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
        this.setState({
            visibleEditAddCustomer: true
        })
    }

    closeModalAddCustomer = () => {
        this.setState({
            visibleEditAddCustomer: false
        })
    }

    showModalDetail = () =>{
        
    }

    addCustomer = (customer) =>{
        this.props.actions.customer.addCustomer(customer);
        console.log('customer : ',customer);
    }

    handleLockScreen = () => {
        const { isFocus } = this.state;
        if (isFocus) {
            this.props.actions.app.handleLockScreen(true);
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
    refreshListCustomer: state.customer.refreshListCustomer
})



export default connectRedux(mapStateToProps, CustomerScreen);