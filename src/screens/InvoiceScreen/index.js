import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    getArrayProductsFromAppointment, getArrayServicesFromAppointment,
    getArrayExtrasFromAppointment
} from '@utils';

class InvoiceScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isFocus: true,
            visibleCalendar: false,
            invoiceDetail: {},
            searchFilter: {
                keySearch: '',
                paymentMethod: '',
                status: '',

            },
        }
        this.scrollTabInvoiceRef = React.createRef();
        this.modalCalendarRef = React.createRef();
        this.listInvoiceRef = [];
    }

    componentDidMount() {
        this.props.actions.invoice.getListInvoicesByMerchant();
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

    updateSearchFilterInfo(key, value, keyParent = '') {
        const { searchFilter } = this.state;
        if (keyParent !== '') {
            const temptParent = searchFilter[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...searchFilter, [keyParent]: temptChild };
            this.setState({
                searchFilter: temptUpdate
            })
        } else {
            const temptUpdate = { ...searchFilter, [key]: value };
            this.setState({
                searchFilter: temptUpdate
            })
        }
    }

    setListInvoiceRef = ref => {
        if (ref) {
            this.listInvoiceRef.push(ref);
        }
    }

    gotoTabPaymentInfomation = () => {
        this.scrollTabInvoiceRef.current.goToPage(1);
    }

    gotoBasket = () => {
        this.scrollTabInvoiceRef.current.goToPage(2);
    }

    gotoHistory = () => {
        this.scrollTabInvoiceRef.current.goToPage(3);
    }

    backTab = () => {
        this.scrollTabInvoiceRef.current.goToPage(0);
    }

    showCalendar = () => {
        this.setState({
            visibleCalendar: true
        })
    }

    getPaymentString(type) {
        let method = '';
        switch (type) {
            case 'HP-Harmony Account':
                method = 'harmony';
                break;
            case 'Cash':
                method = 'cash';
                break;
            case 'Credit Card':
                method = 'credit_card';
                break;
            case 'Cheque/Bank Transfer':
                method = 'orther';
                break;
            default:
                method = 'cash'
        }
        return method
    }

    getStatusString(type) {
        let status = '';
        switch (type) {
            case 'Pending':
                status = 'pending';
                break;
            case 'Paid':
                status = 'paid';
                break;
            case 'Fail':
                status = 'fail';
                break;
            case 'Cancel':
                status = 'cancel';
                break;
            case 'Voided':
                status = 'void';
                break;
            case 'Refunded':
                status = 'refund';
                break;
            default:
                status = 'pending'
        }
        return status
    }

    searchInvoice = () => {
        const { searchFilter } = this.state;
        const { keySearch, paymentMethod, status } = searchFilter;
        if (keySearch == '' && paymentMethod == '' & status == '') {
            // this.props.actions.product.clearSearchProduct();
        } else {
            this.props.actions.invoice.searchInvoice(keySearch, this.getPaymentString(paymentMethod),this.getStatusString(status) );
        }

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

    convertBasket(basket) {
        const arrayProducts = getArrayProductsFromAppointment(basket.products);
        const arryaServices = getArrayServicesFromAppointment(basket.services);
        const arrayExtras = getArrayExtrasFromAppointment(basket.extras);
        const temptBasket = arrayProducts.concat(arryaServices, arrayExtras);
        // console.log('temptBasket : ', JSON.stringify(temptBasket));
        return temptBasket;
    }

    setInvoiceDetail = async (invoice) => {
        this.setState({
            invoiceDetail: invoice
        });
        for (let i = 0; i < this.listInvoiceRef.length; i++) {
            if (this.listInvoiceRef[i].props.invoice.checkoutId === invoice.checkoutId) {
                this.listInvoiceRef[i].setStateFromParent(true);
            } else {
                this.listInvoiceRef[i].setStateFromParent(false);
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
    listInvoicesByMerchant: state.invoice.listInvoicesByMerchant,
    refreshListInvoice: state.invoice.refreshListInvoice,
    listInvoicesSearch: state.invoice.listInvoicesSearch,
    isShowSearchInvoice: state.invoice.isShowSearchInvoice
})

export default connectRedux(mapStateToProps, InvoiceScreen);