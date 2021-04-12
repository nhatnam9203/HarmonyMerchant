import React from 'react';
import { NativeModules, Platform } from 'react-native';
import _ from "ramda";
import { captureRef, releaseCapture } from "react-native-view-shot";
import { StarPRNT } from 'react-native-star-prnt';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    getArrayProductsFromAppointment, getArrayServicesFromAppointment,
    getArrayExtrasFromAppointment, getArrayGiftCardsFromAppointment,
    getPaymentStringInvoice, getQuickFilterStringInvoice,
    checkStatusPrint, getInfoFromModelNameOfPrinter
} from '@utils';
import PrintManager from '@lib/PrintManager';

const PosLink = NativeModules.payment;
const PoslinkAndroid = NativeModules.PoslinkModule;

const initalState = {
    isFocus: false,
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
};

class InvoiceScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = initalState;
        this.scrollTabInvoiceRef = React.createRef();
        this.modalCalendarRef = React.createRef();
        this.listInvoiceRef = [];
        this.onEndReachedCalledDuringMomentum = true;
        this.checkInvoicePermissionRef = React.createRef();
        this.confirmInvoiceStatusRef = React.createRef();
        this.popupProcessingCreditRef = React.createRef();
        this.invoicePrintRef = React.createRef();
        this.invoicePrintRef = React.createRef();
        this.viewShotRef = React.createRef();
    }

    componentDidMount() {
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState(initalState);
                this.checkInvoicePermissionRef.current.setStateFromParent('');
                this.resetInvoiceItem();
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({
                    isFocus: true
                });
                this.checkInvoicePermissionRef.current.setStateFromParent('',);
                const { profileStaffLogin } = this.props;
                const roleName = profileStaffLogin?.roleName || "Admin";
                if (roleName === "Admin") {
                    this.props.actions.invoice.getListInvoicesByMerchant();
                    this.props.actions.invoice.resetProfileInvoiceLogin();
                } else {
                    this.props.actions.invoice.toggleInvoiceTabPermission();
                }

            }
        );
    }

    resetInvoiceItem = () => {
        for (let i = 0; i < this.listInvoiceRef.length; i++) {
            this.listInvoiceRef[i].setStateFromParent(false);
        }
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
            }, 100);
        } else {
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
        this.scrollTabInvoiceRef.current.goToPage(1);
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
        }, 200);
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
        const temptBasket = arryaServices.concat(arrayExtras, arrayProducts, arrayGiftCards);

        return temptBasket;
    }

    setInvoiceDetail = (invoice) => {
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

    onRefreshInvoiceList = () => {
        this.searchInvoice(1, false);
    }

    searchInvoiceWithKeyword = () => {
        this.props.actions.invoice.updateSearchKeyword(this.state.searchFilter.keySearch);
        this.searchInvoice();
    }

    clearSearchText = async () => {
        await this.updateSearchFilterInfo('keySearch', "");
    }

    searchInvoice = (page = 1, isShowLoading = true, isLoadMore = false) => {
        const { searchKeyword } = this.props
        const { searchFilter } = this.state;
        const { keySearch, paymentMethod, status } = searchFilter;
        const { isCustomizeDate, startDate, endDate, quickFilter } = this.modalCalendarRef.current.state;

        this.props.actions.invoice.getListInvoicesByMerchant(
            searchKeyword === keySearch ? keySearch : "",
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

    getItemCount = (data) => {
        return data?.length;
    }

    getItem = (data, index) => {
        return {
            ...data[index],
            id: `${data[index]?.checkoutId}_${Math.random().toString(12).substring(0)}`,
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
        const { name, ip, port, timeout, commType, bluetoothAddr, isSetup } = paxMachineInfo;

        if (invoiceDetail.paymentMethod === "credit_card") {
            const paymentInformation = invoiceDetail?.paymentInformation[0]?.responseData || {};

            if (!_.isEmpty(paymentInformation)) {
                await this.setState({
                    visibleConfirmInvoiceStatus: false,
                    visibleProcessingCredit: true,
                });
                if (Platform.OS === "android") {
                    // ------------------ REFUND ----------------
                    if (invoiceDetail.status === 'paid') {
                        this.popupProcessingCreditRef.current.setStateFromParent(false);
                        setTimeout(() => {
                            PoslinkAndroid.refundTransaction(ip, port, "", "CREDIT", "RETURN",
                                paymentInformation.ApprovedAmount,
                                `${paymentInformation.RefNum}`, `${paymentInformation.ExtData}`,
                                (err) => {
                                    const errorTrans = JSON.parse(err);
                                    this.setState({
                                        visibleProcessingCredit: false
                                    });
                                    setTimeout(() => {
                                        alert(err);
                                    }, 300);
                                },
                                (data) => {
                                    this.handleResultRefundTransaction(data)
                                }
                            )
                        }, 100);
                        // ------------------ VOID ----------------
                    } else if (invoiceDetail.status === 'complete') {
                        const transactionId = paymentInformation.RefNum ? paymentInformation.RefNum : 0;
                        this.popupProcessingCreditRef.current.setStateFromParent(transactionId);
                        setTimeout(() => {
                            PoslinkAndroid.voidTransaction(ip, port, "", "CREDIT", "VOID",
                                `${paymentInformation.RefNum}`, `${paymentInformation.ExtData}`,
                                (err) => {
                                    const errorTrans = JSON.parse(err);
                                    this.setState({
                                        visibleProcessingCredit: false
                                    });
                                    setTimeout(() => {
                                        alert(err);
                                    }, 300);
                                },
                                (data) => {
                                    this.handleResultVoidTransaction(data)
                                }
                            )
                        }, 100);
                    }
                } else {
                    const amount = paymentInformation?.ApprovedAmount || 0;
                    const transactionId = paymentInformation?.RefNum || 0;
                    const extData = paymentInformation?.ExtData || "";
                    const invNum = paymentInformation?.InvNum || "";
                    const tempIpPax = commType == "TCP" ? ip : "";
                    const tempPortPax = commType == "TCP" ? port : "";
                    const idBluetooth = commType === "TCP" ? "" : bluetoothAddr;

                    if (invoiceDetail.status === 'paid') {
                        this.popupProcessingCreditRef.current.setStateFromParent(false);
                        PosLink.sendTransaction({
                            tenderType: "CREDIT",
                            transType: "RETURN",
                            amount: `${parseFloat(amount)}`,
                            transactionId: transactionId,
                            extData: extData,
                            commType: commType,
                            destIp: tempIpPax,
                            portDevice: tempPortPax,
                            timeoutConnect: "90000",
                            bluetoothAddr: idBluetooth,
                            invNum: `${invNum}`
                        }, (data) => this.handleResultRefundTransaction(data));

                    } else if (invoiceDetail.status === 'complete') {
                        this.popupProcessingCreditRef.current.setStateFromParent(transactionId);
                        PosLink.sendTransaction({
                            tenderType: "CREDIT",
                            transType: "VOID",
                            amount: "",
                            transactionId: transactionId,
                            extData: extData,
                            commType: commType,
                            destIp: tempIpPax,
                            portDevice: tempPortPax,
                            timeoutConnect: "90000",
                            bluetoothAddr: idBluetooth,
                            invNum: `${invNum}`
                        }, (data) => this.handleResultVoidTransaction(data));
                    }
                }
            }
        } else {
            await this.setState({
                visibleConfirmInvoiceStatus: false,
                titleInvoice: invoiceDetail.status === 'paid' ? "REFUND" : "VOID"
            })
            this.props.actions.invoice.changeStatustransaction(invoiceDetail.checkoutId, this.getParamsSearch());
        }
    }

    getParamsSearch = () => {
        const { searchKeyword } = this.props
        const { searchFilter } = this.state;
        const { keySearch, paymentMethod, status } = searchFilter;
        const { isCustomizeDate, startDate, endDate, quickFilter } = this.modalCalendarRef.current.state;

        return `page=1&method=${getPaymentStringInvoice(paymentMethod)}&status=${status}&timeStart=${isCustomizeDate ? startDate : ""}&timeEnd=${isCustomizeDate ? endDate : ""}&key=${searchKeyword === keySearch ? keySearch : ""}&quickFilter=${quickFilter ? getQuickFilterStringInvoice(quickFilter) : ""}`;

    }

    handleResultVoidTransaction = async result => {
        const { invoiceDetail } = this.state;
        const data = JSON.parse(result);

        await this.setState({
            visibleProcessingCredit: false
        });

        if (Platform.OS === "android") {
            if (data.ResultCode == "000000") {
                this.props.actions.invoice.changeStatustransaction(invoiceDetail?.checkoutId, this.getParamsSearch(), result);
                await this.setState({
                    titleInvoice: invoiceDetail.status === 'paid' ? "REFUND" : "VOID"
                });
            } else {
                setTimeout(() => {
                    alert(data.ResultTxt)
                }, 300)
            }

        } else {
            if (data.ResultCode === "000000") {
                this.props.actions.invoice.changeStatustransaction(invoiceDetail?.checkoutId, this.getParamsSearch(), result);
                await this.setState({
                    titleInvoice: invoiceDetail.status === 'paid' ? "REFUND" : "VOID"
                })
            } else {
                PosLink.cancelTransaction();
                setTimeout(() => {
                    alert(data.message)
                }, 300)
            }
        }
    }

    handleResultRefundTransaction = async result => {
        const { invoiceDetail } = this.state;
        await this.setState({
            visibleProcessingCredit: false
        });
        const data = JSON.parse(result);
        if (Platform.OS === "android") {
            if (data.ResultCode == "000000") {
                this.props.actions.invoice.changeStatustransaction(invoiceDetail.checkoutId, this.getParamsSearch(), result);
                await this.setState({
                    titleInvoice: invoiceDetail.status === 'paid' ? "REFUND" : "VOID"
                });
            } else {
                setTimeout(() => {
                    alert(data.ResultTxt)
                }, 300);
            }
        } else {
            if (data.ResultCode === "000000") {
                this.props.actions.invoice.changeStatustransaction(invoiceDetail.checkoutId, this.getParamsSearch(), result);
                await this.setState({
                    titleInvoice: invoiceDetail.status === 'paid' ? "REFUND" : "VOID"
                });
            } else {
                PosLink.cancelTransaction();
                setTimeout(() => {
                    alert(data.message)
                }, 300);
            }
        }
    }

    cancelTransaction = async () => {
        PosLink.cancelTransaction();
        await this.setState({
            visibleProcessingCredit: false
        });

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

    printInvoice = async () => {
        const { invoiceDetail, titleInvoice } = this.state;

        if (!invoiceDetail.appointmentId) {
            alert("You don't select invoice!")
        } else {
            const printMachine = await checkStatusPrint();
            if (printMachine) {
                this.props.actions.invoice.togglPopupConfirmPrintInvoice(false);

                const { arryaServicesBuy, arrayProductBuy, arrayExtrasBuy, arrayGiftCards } = this.getBasket(invoiceDetail.basket);
                // const basket = arrayProductBuy.concat(arryaServicesBuy, arrayExtrasBuy, arrayGiftCards);
                const basket = arryaServicesBuy.concat(arrayExtrasBuy, arrayProductBuy, arrayGiftCards);
                const { subTotal, total, discount, tipAmount, tax, paymentMethod } = invoiceDetail;
                const promotionNotes = invoiceDetail.promotionNotes && invoiceDetail.promotionNotes.note ? invoiceDetail.promotionNotes.note : "";

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
                    promotionNotes,
                    titleInvoice,
                    invoiceDetail.checkoutId ? invoiceDetail.checkoutId : "",
                    invoiceDetail.checkoutPayments ? invoiceDetail.checkoutPayments : []
                );

                await this.setState({
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

    printCustomerInvoice = async () => {
        try {
            const { printerSelect, printerList } = this.props;
            const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(printerList, printerSelect);

            if (portName) {
                this.props.actions.app.loadingApp();
                const imageUri = await captureRef(this.viewShotRef, {});
                if (imageUri) {
                    let commands = [];
                    commands.push({ appendLineFeed: 0 });
                    commands.push({ appendBitmap: imageUri, width: parseFloat(widthPaper), bothScale: true, diffusion: true, alignment: "Center" });
                    commands.push({ appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed });

                    await PrintManager.getInstance().print(emulation, commands, portName);
                    releaseCapture(imageUri);
                }
                this.props.actions.app.stopLoadingApp();

            } else {
                alert('Please connect to your printer!');
            }
        } catch (error) {
            this.props.actions.app.stopLoadingApp();
            setTimeout(() => {
                alert("error ", error)
            }, 500)

        }
    }

    shareCustomerInvoice = async () => {
        try {
            const imageUri = await captureRef(this.viewShotRef, {});
            if (Platform.OS === 'ios') {
                RNFetchBlob.ios.previewDocument(imageUri);
            } else {
                const shareResponse = await Share.open({
                    url: `file://${imageUri}`
                });
            }
        } catch (error) {
            // alert(error)
        }
    }

    closePopupCheckInvoiceTabPermission = () => {
        this.props.actions.invoice.toggleInvoiceTabPermission(false);
        this.props.navigation.navigate("Home");
    }

    clearIntervalById = () => {
        const { notiIntervalId } = this.props;
        if (notiIntervalId) {
            clearInterval(notiIntervalId);
            this.props.actions.app.resetNotiIntervalId();
        }
    }

    componentWillUnmount() {
        this.didBlurSubscription?.remove();
        this.didFocusSubscription?.remove();
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
    paxMachineInfo: state.hardware.paxMachineInfo,
    visibleConfirmPrintInvoice: state.invoice.visibleConfirmPrintInvoice,
    isLoadMoreInvoiceList: state.invoice.isLoadMoreInvoiceList,
    searchKeyword: state.invoice.searchKeyword,
    profileStaffLogin: state.dataLocal.profileStaffLogin,
    invoiceTabPermission: state.invoice.invoiceTabPermission,

    printerSelect: state.dataLocal.printerSelect,
    printerList: state.dataLocal.printerList,
    profileLoginInvoice: state.dataLocal.profileLoginInvoice,
    notiIntervalId: state.app.notiIntervalId
})

export default connectRedux(mapStateToProps, InvoiceScreen);