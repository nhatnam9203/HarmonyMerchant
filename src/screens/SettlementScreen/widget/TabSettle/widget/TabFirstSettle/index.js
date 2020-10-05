import React from 'react';
import { NativeModules, Alert } from 'react-native';
import _ from "ramda";
import env from 'react-native-config';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    formatNumberFromCurrency, formatMoney, scaleSzie, roundFloatNumber, requestAPI,
} from '@utils';
import apiConfigs from '@configs/api';

const PosLink = NativeModules.MyApp;

class TabFirstSettle extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            creditCount: 0,
            creditAmount: 0,
            editPaymentByHarmony: 0.00,
            editPaymentByCreditCard: 0.00,
            editPaymentByCash: 0.00,
            editOtherPayment: 0.00,
            discountSettlement: 0.00,
            total: 0.00,
            note: '',
            isShowKeyboard: false,
            isEditOtherAmount: false,
            isEditCashAmount: false,
            visible: false,
            isGetReportFromPax: true
        };
        this.arrayStaffRef = [];
        this.inputHarmonyPaymentRef = React.createRef();
        this.inputCashPaymentRef = React.createRef();
        this.inputOtherPaymentRef = React.createRef();
        this.totalCustomRef = React.createRef();
        this.scrollRef = React.createRef();
        this.otherAmountRef = React.createRef();
        this.cashAmountRef = React.createRef();
        this.creditAmountRef = React.createRef();
    }

    setStateFromParent = async () => {
        await this.setState({
            isGetReportFromPax: true
        })
    }


    keyboardDidShow = async () => {
        if (this.scrollRef.current) {
            this.scrollRef.current.scrollToEnd();
        }
    }

    keyboardDidHide = async () => {
        this.scrollTo(0);
    }

    scrollTo = (number) => {
        if (this.scrollRef.current) {
            this.scrollRef.current.scrollTo({ x: 0, y: scaleSzie(number), animated: true });
        }

    }

    resetNoteFromParent = async () => {
        await this.setState({
            note: '',
            creditCount: 0,
            creditAmount: 0,
            editPaymentByCreditCard: 0.00
        })
    }

    pushStaffIntoArrayStaff = ref => {
        if (ref) {
            this.arrayStaffRef.push(ref);
        }
    }

    handlePAXReport = async () => {
        const { paxMachineInfo } = this.props;
        const { ip, port, timeout, isSetup } = paxMachineInfo;
        if (isSetup) {
            await this.setState({
                visible: true
            });
            let totalReport = 0;
            let totalRecord = 0;
            let isError = false;

            try {
                const tempEnv = env.IS_PRODUCTION;
                PosLink.setupPax(ip, port, timeout);
                // ----------- Total Amount --------
                let data = await PosLink.reportTransaction("LOCALDETAILREPORT", "ALL", "UNKNOWN", "UNKNOWN");
                let result = JSON.parse(data);
                if (result.ResultTxt && result.ResultTxt == "OK") {
                    if (tempEnv == "Production" && result.Message === "DEMO APPROVED") {
                        await this.setState({
                            visible: false,
                            isGetReportFromPax: false
                        });

                        setTimeout(() => {
                            alert("You're running your Pax on DEMO MODE!")
                        }, 500);

                        throw "You're running your Pax on DEMO MODE!"

                    } else {
                        totalRecord = result.TotalRecord ? parseInt(result.TotalRecord) : 0;

                        // ----------- Total Report --------
                        let amountData = await PosLink.reportTransaction("LOCALTOTALREPORT", "ALL", "UNKNOWN", "");
                        let amountResult = JSON.parse(amountData);
                        totalReport = amountResult.CreditAmount ? parseFloat(amountResult.CreditAmount) : 0;
                    }
                } else {
                    throw `${result.ResultTxt}`
                }


            } catch (error) {
                isError = true;
                this.props.actions.app.connectPaxMachineError(`${error}`);
            }

            if (!isError) {
                this.props.actions.app.ConnectPaxMachineSuccess();
                const moneyInPax = formatMoney(roundFloatNumber(totalReport / 100));
                await this.setState({
                    creditCount: totalRecord,
                    editPaymentByCreditCard: moneyInPax
                });
            }

            await this.setState({
                visible: false,
                isGetReportFromPax: false
            });

        } else {
            this.props.actions.app.connectPaxMachineError("Don't have setup in Hardware Tab!");
        }
    }

    continueSettlement = () => {
        const { settleWaiting } = this.props;
        const { creditCount, editPaymentByHarmony, editPaymentByCreditCard, editPaymentByCash, editOtherPayment, note, discountSettlement } = this.state;
        this.props.gotoTabSecondSettle({
            paymentByHarmony: editPaymentByHarmony,
            paymentByCreditCard: editPaymentByCreditCard,
            paymentByCash: editPaymentByCash,
            otherPayment: editOtherPayment,
            discount: discountSettlement,
            paymentByCashStatistic: settleWaiting.paymentByCash ? settleWaiting.paymentByCash : 0.00,
            otherPaymentStatistic: settleWaiting.otherPayment ? settleWaiting.otherPayment : 0.00,
            total: roundFloatNumber(
                formatNumberFromCurrency(editPaymentByHarmony) +
                formatNumberFromCurrency(editPaymentByCreditCard) +
                formatNumberFromCurrency(editPaymentByCash) +
                formatNumberFromCurrency(editOtherPayment) +
                formatNumberFromCurrency(discountSettlement)
            ),
            note
        }, creditCount);
    }

    gotoTabSecondSettle = async () => {
        const { versionApp, profileStaffLogin } = this.props;
        try {
            this.props.actions.app.loadingApp();
            const getSettlementWarning = await requestAPI({
                type: 'GET_SETTLEMENT_WARNING',
                method: 'GET',
                token: profileStaffLogin.token,
                api: `${apiConfigs.BASE_API}settlement/warning`,
                versionApp: versionApp
            });
            this.props.actions.app.stopLoadingApp();

            const isWarning = getSettlementWarning.data ? getSettlementWarning.data : false;
            if (isWarning) {
                setTimeout(() => {
                    Alert.alert(
                        "Warning",
                        "Please review your calendar. There are appointments that have not checked-out yet. Do you want to continue with settlement and cancel all unpaid appointments?",
                        [

                            {
                                text: "No",
                                onPress: () => { },
                                style: "cancel"
                            },
                            { text: "Yes", onPress: () => this.continueSettlement() }
                        ],
                        { cancelable: false }
                    );
                }, 300)


            } else {
                this.continueSettlement()
            }
        } catch (error) {
            this.props.actions.app.stopLoadingApp();
            this.props.actions.app.catchError(error)
        }


    }

    getInvoicesOfStaff = async (staffId) => {
        this.props.actions.invoice.invoicesOfStaff(staffId);
        for (let i = 0; i < this.arrayStaffRef.length; i++) {
            if (this.arrayStaffRef[i].props.staffId === staffId) {
                this.arrayStaffRef[i].setStateFromParent(true);
            } else {
                this.arrayStaffRef[i].setStateFromParent(false);
            }
        }
    }

    updateTotalCustom = async (key, value) => {
        await this.setState({
            [key]: value
        });

    }

    // ----------- New code -----------
    onPressStaff = (staffId) => {
        this.props.onPressStaff(staffId);
    }

    onPressGiftCardTotal = () => {
        const { gitfCardSales } = this.props;
        if (gitfCardSales.length > 0) {
            this.props.onPressGiftCardTotal();
        }

    }


    editCashAmount = () => {
        this.setState({
            isEditCashAmount: true
        });
        this.cashAmountRef.current.setStateFromParent(this.state.editPaymentByCash);
    }

    cancelEditCashAmount = () => {
        this.setState({
            isEditCashAmount: false
        });
        this.scrollTo(0);
    }

    saveEditCashAmount = () => {
        const changeAmount = this.cashAmountRef.current.state.amount;
        this.setState({
            isEditCashAmount: false,
            editPaymentByCash: changeAmount
        });

        this.scrollTo(0);
    }

    editOtherAmount = () => {
        this.setState({
            isEditOtherAmount: true
        });
        this.otherAmountRef.current.setStateFromParent(this.state.editOtherPayment);
    }

    cancelEditOtherAmount = () => {
        this.setState({
            isEditOtherAmount: false
        });
        this.scrollTo(0);
    }

    saveEditOtherAmount = () => {
        const changeAmount = this.otherAmountRef.current.state.amount;
        this.setState({
            isEditOtherAmount: false,
            editOtherPayment: changeAmount
        });

        this.scrollTo(0);
    }

    refreshSettlement = async () => {
        await this.setState({
            isGetReportFromPax: true
        })
        this.props.actions.invoice.getSettlementWating();
        this.props.actions.invoice.getListStaffsSales();
        this.props.actions.invoice.getListGiftCardSales();


    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { isGettingSettlement, settleWaiting } = this.props;
        if (prevProps.isGettingSettlement === "loading" && isGettingSettlement === "success" && !_.isEmpty(settleWaiting)) {
            await this.setState({
                editPaymentByHarmony: settleWaiting.paymentByHarmony ? settleWaiting.paymentByHarmony : 0.00,
                editPaymentByCash: settleWaiting.paymentByCash ? settleWaiting.paymentByCash : 0.00,
                editOtherPayment: settleWaiting.otherPayment ? settleWaiting.otherPayment : 0.00,
                total: settleWaiting.total ? settleWaiting.total : 0.00,
                discountSettlement: settleWaiting.discount ? settleWaiting.discount : 0.00,
            });
            if (this.state.isGetReportFromPax) {
                this.handlePAXReport();
            }
            this.props.actions.invoice.resetStateIsGettingSettlement();
        }
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    paxMachineInfo: state.dataLocal.paxMachineInfo,
    settleWaiting: state.invoice.settleWaiting,
    invoicesOfStaff: state.invoice.invoicesOfStaff,
    loading: state.app.loading,
    refreshingSettle: state.invoice.refreshingSettle,
    isGettingSettlement: state.invoice.isGettingSettlement,
    versionApp: state.dataLocal.versionApp,
    profileStaffLogin: state.dataLocal.profileStaffLogin,
    staffSales: state.invoice.staffSales,
    gitfCardSales: state.invoice.gitfCardSales
})



export default connectRedux(mapStateToProps, TabFirstSettle);