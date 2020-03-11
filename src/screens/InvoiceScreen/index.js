import React from 'react';
import { NativeModules } from 'react-native';
import _ from "ramda";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    getArrayProductsFromAppointment, getArrayServicesFromAppointment,
    getArrayExtrasFromAppointment, getArrayGiftCardsFromAppointment
} from '@utils';

const PosLink = NativeModules.MyApp;

class InvoiceScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isFocus: true,
            visibleCalendar: false,
            invoiceDetail: {
                history: []
            },
            searchFilter: {
                keySearch: '',
                paymentMethod: '',
                status: '',
            },
            titleRangeTime: 'Time Range',
            visibleEnterPin: true,
            visibleConfirmInvoiceStatus: false,
            visibleProcessingCredit: false
        }
        this.scrollTabInvoiceRef = React.createRef();
        this.modalCalendarRef = React.createRef();
        this.listInvoiceRef = [];
        this.onEndReachedCalledDuringMomentum = true;
        this.visibleEnterPinRef = React.createRef();
        this.confirmInvoiceStatusRef = React.createRef();
    }

    componentDidMount() {
        // this.props.actions.invoice.getListInvoicesByMerchant(true, 1);
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({
                    isFocus: false
                });
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({
                    isFocus: true
                });
                this.props.actions.app.setVisibleEnterPincodeInvoice();
                this.visibleEnterPinRef.current.setStateFromParent('');
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

    changeTitleTimeRange = (title) => {
        this.setState({
            titleRangeTime: title,
            visibleCalendar: false
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
                method = ''
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

    getQuickFilterString(type) {
        let quickFilter = '';
        switch (type) {
            case 'Today':
                quickFilter = 'today';
                break;
            case 'Yesterday':
                quickFilter = 'yesterday';
                break;
            case 'This Week':
                quickFilter = 'thisWeek';
                break;
            case 'Last Week':
                quickFilter = 'lastWeek';
                break;
            case 'This Month':
                quickFilter = 'thisMonth';
                break;
            case 'Last Month':
                quickFilter = 'lastMonth';
                break;
            default:
                quickFilter = ''
        }
        return quickFilter
    }

    searchInvoice = () => {
        const { searchFilter } = this.state;
        const { keySearch, paymentMethod, status } = searchFilter;
        const { isCustomizeDate, startDate, endDate, quickFilter } = this.modalCalendarRef.current.state;
        const isTimeRange = isCustomizeDate ? true : (quickFilter ? true : false);
        if (keySearch == '' && paymentMethod == '' && status == '' && !isTimeRange) {
            this.props.actions.invoice.clearSearInvoice();
        } else {
            if (isCustomizeDate) {
                const url = `method=${this.getPaymentString(paymentMethod)}&status=${status}&timeStart=${startDate}&timeEnd=${endDate}&key=${keySearch}`
                this.props.actions.invoice.searchInvoice(url);
            } else if (quickFilter) {
                const url = `method=${this.getPaymentString(paymentMethod)}&status=${status}&quickFilter=${this.getQuickFilterString(quickFilter)}&key=${keySearch}`
                this.props.actions.invoice.searchInvoice(url);
            } else {
                const url = `method=${this.getPaymentString(paymentMethod)}&status=${status}&key=${keySearch}`
                this.props.actions.invoice.searchInvoice(url);
            }
        }

    }



    handleLockScreen = () => {
        const { isFocus } = this.state;
        if (isFocus && !this.props.visibleEnterPinInvoice) {
            this.props.navigation.navigate('Home');
            this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
        }
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    showLockScreen = () => {
        // this.props.actions.app.handleLockScreen(true);
        // alert('ddd')
    }

    convertBasket(basket) {
        const arrayProducts = getArrayProductsFromAppointment(basket.products);
        const arryaServices = getArrayServicesFromAppointment(basket.services);
        const arrayExtras = getArrayExtrasFromAppointment(basket.extras);
        const arrayGiftCards = getArrayGiftCardsFromAppointment(basket.giftCards);

        const temptBasket = arrayProducts.concat(arryaServices, arrayExtras, arrayGiftCards);
        //console.log('temptBasket : ', JSON.stringify(temptBasket));
        return temptBasket;
    }

    setInvoiceDetail = async (invoice) => {
        for (let i = 0; i < this.listInvoiceRef.length; i++) {
            if (this.listInvoiceRef[i].props.invoice.checkoutId === invoice.checkoutId) {
                this.listInvoiceRef[i].setStateFromParent(true);
            } else {
                this.listInvoiceRef[i].setStateFromParent(false);
            }
        }
        await this.setState({
            invoiceDetail: invoice
        });


    }

    loadMoreInvoiceList = ({ distanceFromEnd }) => {
        if (!this.onEndReachedCalledDuringMomentum) {
            const { totalPages, currentPage } = this.props;
            if (currentPage < totalPages) {
                this.props.actions.invoice.getListInvoicesByMerchant(false, parseInt(currentPage + 1));
                this.onEndReachedCalledDuringMomentum = true;
            }

        }
    }

    changeStatustransaction = async () => {
        const { invoiceDetail } = this.state;
        this.confirmInvoiceStatusRef.current.setStateFromParent(invoiceDetail)
        await this.setState({
            visibleConfirmInvoiceStatus: true
        })
    }



    confirmChangeInvoiceStatus = async () => {
        const { paxMachineInfo } = this.props;
        const { invoiceDetail } = this.state;
        const { ip, port, timeout } = paxMachineInfo;

        const paymentInformation = invoiceDetail.paymentInformation && invoiceDetail.paymentInformation.length > 0 &&
            invoiceDetail.paymentInformation[0].responseData ? invoiceDetail.paymentInformation[0].responseData : {};

        console.log("invoiceDetail :  ", JSON.stringify(paymentInformation));
        console.log("ApprovedAmount :  ", paymentInformation.ApprovedAmount);


        if (!_.isEmpty(paymentInformation)) {
            await this.setState({
                visibleConfirmInvoiceStatus: false,
                visibleProcessingCredit: true
            })
            PosLink.setupPax(ip, port, timeout);
            PosLink.voidTransaction(parseFloat(paymentInformation.ApprovedAmount), paymentInformation.RefNum, paymentInformation.ExtData, (data) => {
                console.log("--- data : ", data);
                // this.handleResultRefundTransaction(data);
            });
        }
    }

    handleResultRefundTransaction = async result => {
        const { invoiceDetail } = this.state;

        console.log("--- result : ", result);
        await this.setState({
            visibleProcessingCredit: false
        });

        const data = JSON.parse(result);
        if (data.status === 1 && data.ResultTxt === "OK") {
            this.props.actions.invoice.changeStatustransaction(invoiceDetail.checkoutId);
            await this.setState({
                invoiceDetail: {
                    history: []
                },
            });
            for (let i = 0; i < this.listInvoiceRef.length; i++) {
                this.listInvoiceRef[i].setStateFromParent(false);
            }

        } else if (data.status === 1 && data.ResultTxt === "DUP TRANSACTION") {
            setTimeout(() => {
                alert("DUP TRANSACTION !")
            }, 300)
        } else {
            setTimeout(() => {
                alert(data.message)
            }, 300)

        }
    }

    cancelTransaction = async () => {
        PosLink.cancelTransaction();
        await this.setState({
            visibleProcessingCredit: false
        });

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
    isShowSearchInvoice: state.invoice.isShowSearchInvoice,
    totalPages: state.invoice.totalPages,
    currentPage: state.invoice.currentPage,
    visibleEnterPinInvoice: state.app.visibleEnterPinInvoice,

    paxMachineInfo: state.dataLocal.paxMachineInfo,
})

export default connectRedux(mapStateToProps, InvoiceScreen);