import React from 'react';
import { NativeModules } from 'react-native';
import _ from "ramda";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    getArrayProductsFromAppointment, getArrayServicesFromAppointment,
    getArrayExtrasFromAppointment, getArrayGiftCardsFromAppointment,
    getPaymentStringInvoice, getQuickFilterStringInvoice
} from '@utils';
import PrintManager from '@lib/PrintManager';

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
            visibleProcessingCredit: false,
            transactionId: false,
            visiblePrintInvoice: false,
            titleInvoice: ""
        }
        this.scrollTabInvoiceRef = React.createRef();
        this.modalCalendarRef = React.createRef();
        this.listInvoiceRef = [];
        this.onEndReachedCalledDuringMomentum = true;
        this.visibleEnterPinRef = React.createRef();
        this.confirmInvoiceStatusRef = React.createRef();
        this.popupProcessingCreditRef = React.createRef();
        this.invoicePrintRef = React.createRef();
        this.invoicePrintRef = React.createRef();
    }

    componentDidMount() {
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({
                    isFocus: false,
                    searchFilter: {
                        keySearch: '',
                        paymentMethod: '',
                        status: '',
                    },
                    titleRangeTime: 'Time Range',
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

    async updateSearchFilterInfo(key, value, keyParent = '') {
        const { searchFilter } = this.state;
        if (keyParent !== '') {
            const temptParent = searchFilter[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...searchFilter, [keyParent]: temptChild };
            await this.setState({
                searchFilter: temptUpdate
            })
        } else {
            const temptUpdate = { ...searchFilter, [key]: value };
            await this.setState({
                searchFilter: temptUpdate
            })
        };
        if (key !== "keySearch") {
            setTimeout(() => {
                this.searchInvoice();
            }, 500);
        }else{
            this.props.actions.invoice.updateSearchKeyword(this.state.searchFilter.keySearch);
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

    changeTitleTimeRange = async (title) => {
        await this.setState({
            titleRangeTime: title === "Select" ? "Time Range" : title,
            visibleCalendar: false
        });
        setTimeout(() => {
            this.searchInvoice();
        }, 500);
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

    convertBasket(basket) {
        const arrayProducts = getArrayProductsFromAppointment(basket.products);
        const arryaServices = getArrayServicesFromAppointment(basket.services);
        const arrayExtras = getArrayExtrasFromAppointment(basket.extras);
        const arrayGiftCards = getArrayGiftCardsFromAppointment(basket.giftCards);

        const temptBasket = arrayProducts.concat(arryaServices, arrayExtras, arrayGiftCards);
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

    onRefreshInvoiceList = () => {
        this.searchInvoice(1, false);
    }

    searchInvoiceWithKeyword =() =>{
        this.props.actions.invoice.updateSearchKeyword(this.state.searchFilter.keySearch);
        this.searchInvoice();
    }

    searchInvoice = (page = 1, isShowLoading = true, isLoadMore = false) => {
        const {searchKeyword} = this.props
        const { searchFilter } = this.state;
        const { keySearch, paymentMethod, status } = searchFilter;
        const { isCustomizeDate, startDate, endDate, quickFilter } = this.modalCalendarRef.current.state;

        this.props.actions.invoice.getListInvoicesByMerchant(
            searchKeyword === keySearch ?  keySearch : "",
            getPaymentStringInvoice(paymentMethod),
            status,
            isCustomizeDate ? startDate : "",
            isCustomizeDate ? endDate : "",
            quickFilter ? getQuickFilterStringInvoice(quickFilter) : "",
            page,
            isShowLoading,
            isLoadMore
        );
    }

    loadMoreInvoiceList = ({ distanceFromEnd }) => {
        if (!this.onEndReachedCalledDuringMomentum) {
            const { totalPages, currentPage } = this.props;
            if (currentPage < totalPages) {
                this.searchInvoice(parseInt(currentPage + 1), false, true)
                this.onEndReachedCalledDuringMomentum = true;
            }

        }
    }

    changeStatustransaction = async () => {
        const { invoiceDetail } = this.state;
        this.confirmInvoiceStatusRef.current.setStateFromParent(invoiceDetail);

        await this.setState({
            visibleConfirmInvoiceStatus: true
        })
    }



    confirmChangeInvoiceStatus = async () => {
        const { paxMachineInfo } = this.props;
        const { invoiceDetail } = this.state;
        const { ip, port, timeout } = paxMachineInfo;


        if (invoiceDetail.paymentMethod === "credit_card") {
            const paymentInformation = invoiceDetail.paymentInformation && invoiceDetail.paymentInformation.length > 0 &&
                invoiceDetail.paymentInformation[0].responseData ? invoiceDetail.paymentInformation[0].responseData : {};

            if (!_.isEmpty(paymentInformation)) {
                await this.setState({
                    visibleConfirmInvoiceStatus: false,
                    visibleProcessingCredit: true,
                })
                PosLink.setupPax(ip, port, timeout);
                if (invoiceDetail.status === 'paid') {
                    this.popupProcessingCreditRef.current.setStateFromParent(false);
                    PosLink.refundTransaction(parseFloat(paymentInformation.ApprovedAmount), paymentInformation.RefNum, paymentInformation.ExtData, (data) => {
                        this.handleResultRefundTransaction(data);
                    });
                } else if (invoiceDetail.status === 'pending') {
                    const transactionId = paymentInformation.RefNum ? paymentInformation.RefNum : 0
                    this.popupProcessingCreditRef.current.setStateFromParent(transactionId);
                    PosLink.voidTransaction(parseFloat(paymentInformation.ApprovedAmount), paymentInformation.RefNum, paymentInformation.ExtData, (data) => {
                        this.handleResultVoidTransaction(data);
                    });
                }

            }
        } else {
            await this.setState({
                visibleConfirmInvoiceStatus: false,
                titleInvoice: invoiceDetail.status === 'paid' ? "Refund" : "Void"
            })
            this.props.actions.invoice.changeStatustransaction(invoiceDetail.checkoutId,this.getParamsSearch());
        }
    }

    getParamsSearch = () => {
        const {searchKeyword} = this.props
        const { searchFilter } = this.state;
        const { keySearch, paymentMethod, status } = searchFilter;
        const { isCustomizeDate, startDate, endDate, quickFilter } = this.modalCalendarRef.current.state;

        return `page=1&method=${ getPaymentStringInvoice(paymentMethod)}&status=${status}&timeStart=${isCustomizeDate ? startDate : ""}&timeEnd=${isCustomizeDate ? endDate : ""}&key=${searchKeyword === keySearch ?  keySearch : ""}&quickFilter=${quickFilter ? getQuickFilterStringInvoice(quickFilter) : ""}`;
      
    }

    handleResultVoidTransaction = async result => {
        const { invoiceDetail } = this.state;
        const data = JSON.parse(result);

        await this.setState({
            visibleProcessingCredit: false
        });

        if (data.status === 1) {
            this.props.actions.invoice.changeStatustransaction(invoiceDetail.checkoutId,this.getParamsSearch());
            await this.setState({
                invoiceDetail: {
                    history: []
                },
            });
            for (let i = 0; i < this.listInvoiceRef.length; i++) {
                this.listInvoiceRef[i].setStateFromParent(false);
            }


        } else {
            setTimeout(() => {
                alert(data.message)
            }, 300)
        }

    }

    handleResultRefundTransaction = async result => {
        const { invoiceDetail } = this.state;

        await this.setState({
            visibleProcessingCredit: false
        });

        const data = JSON.parse(result);
        if (data.status === 1 && data.ResultTxt === "OK") {
            this.props.actions.invoice.changeStatustransaction(invoiceDetail.checkoutId,this.getParamsSearch());
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

    closePopupEnterPinInvoice = () => {
        this.props.actions.app.setVisibleEnterPincodeInvoice(false);
        this.props.navigation.navigate("Home");
    }

    getBasket = (appointment) => {
        const arrayProductBuy = [];
        const arryaServicesBuy = [];
        const arrayExtrasBuy = [];
        const arrayGiftCards = [];

        // ------ Push Service -------
        appointment.services.forEach((service) => {
            arryaServicesBuy.push({
                type: "Service",
                data: {
                    name: service.serviceName ? service.serviceName : "",
                    price: service.price ? service.price : ""
                },
                staff: service.staff ? service.staff : false
            })
        });

        // ------ Push Product -------
        appointment.products.forEach((product) => {
            arrayProductBuy.push({
                type: "Product",
                data: {
                    name: product.productName ? product.productName : "",
                    price: product.price ? product.price : ""
                },
                quanlitySet: product.quantity ? product.quantity : ""
            })
        });

        // ------ Push Product -------
        appointment.extras.forEach((extra) => {
            arrayExtrasBuy.push({
                type: 'Extra',
                data: {
                    name: extra.extraName ? extra.extraName : "",
                    price: extra.price ? extra.price : ""
                }
            })
        });

        // ------ Push Gift Card -------
        appointment.giftCards.forEach((gift) => {
            arrayGiftCards.push({
                type: 'GiftCards',
                data: {
                    name: gift.name ? gift.name : "Gift Card",
                    price: gift.price ? gift.price : ""
                },
                quanlitySet: gift.quantity ? gift.quantity : ""
            })
        });

        return {
            arryaServicesBuy,
            arrayProductBuy,
            arrayExtrasBuy,
            arrayGiftCards
        }
    }

    checkStatusPrint = async () => {
        try {
            const printer = await PrintManager.getInstance().portDiscovery();
            if (printer.length > 0) {
                let portName = false;
                for (let i = 0; i < printer.length; i++) {
                    let tempt_portName = printer[i].portName ? printer[i].portName : "";
                    if (tempt_portName === "BT:mPOP" || tempt_portName === "BT:TSP100") {
                        portName = tempt_portName;
                        break;
                    }
                };
                return portName ? portName : false;
            } else {
                return false
            }
        } catch (error) {
        }
    }


    printInvoice = async () => {
        const { invoiceDetail, titleInvoice } = this.state;

        if (!invoiceDetail.appointmentId) {
            alert("You don't select invoice!")
        } else {
            const printMachine = await this.checkStatusPrint();
            if (printMachine) {
                this.props.actions.invoice.togglPopupConfirmPrintInvoice(false);

                const { arryaServicesBuy, arrayProductBuy, arrayExtrasBuy, arrayGiftCards } = this.getBasket(invoiceDetail.basket);
                const basket = [...arryaServicesBuy, ...arrayProductBuy, ...arrayExtrasBuy, ...arrayGiftCards];
                const { subTotal, total, discount, tipAmount, tax, paymentMethod } = invoiceDetail;

                this.invoicePrintRef.current.setStateFromParent(
                    basket,
                    subTotal,
                    tax,
                    discount,
                    tipAmount,
                    total,
                    paymentMethod,
                    false,
                    printMachine,
                    titleInvoice,
                    invoiceDetail.checkoutId ? invoiceDetail.checkoutId : ""
                );

                this.setState({
                    visiblePrintInvoice: true
                })
            } else {
                alert('Please connect to your printer!');
            }



        };
    }

    cancelInvoicePrint = async (isPrintTempt) => {
        await this.setState({ visiblePrintInvoice: false });
        this.updateInvoiceDetailAfterCallServer();
    }

    closePopupConfirmPrintInvoice = () => {
        this.props.actions.invoice.togglPopupConfirmPrintInvoice(false);
        this.updateInvoiceDetailAfterCallServer();
    }

    updateInvoiceDetailAfterCallServer = async () => {
        const { invoiceDetail } = this.state;
        for (let i = 0; i < this.listInvoiceRef.length; i++) {
            if (this.listInvoiceRef[i].props.invoice.checkoutId === invoiceDetail.checkoutId) {
                await this.setState({
                    invoiceDetail: this.listInvoiceRef[i].props.invoice
                });
                break;
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
    isShowSearchInvoice: state.invoice.isShowSearchInvoice,
    totalPages: state.invoice.totalPages,
    currentPage: state.invoice.currentPage,
    visibleEnterPinInvoice: state.app.visibleEnterPinInvoice,
    paxMachineInfo: state.dataLocal.paxMachineInfo,
    visibleConfirmPrintInvoice: state.invoice.visibleConfirmPrintInvoice,
    isLoadMoreInvoiceList: state.invoice.isLoadMoreInvoiceList,
    searchKeyword: state.invoice.searchKeyword,
    profileStaffLogin: state.dataLocal.profileStaffLogin
})

export default connectRedux(mapStateToProps, InvoiceScreen);