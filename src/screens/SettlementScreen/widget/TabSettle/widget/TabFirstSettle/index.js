import React from 'react';
import { NativeModules } from 'react-native';
import _ from "ramda";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { formatNumberFromCurrency, formatMoney, scaleSzie } from '@utils';


const PosLink = NativeModules.MyApp;

class TabFirstSettle extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            creditCount: 0,
            creditAmount: 0,
            // settleTotal: {
            editPaymentByHarmony: 0.00,
            editPaymentByCreditCard: 0.00,
            editPaymentByCash: 0.00,
            editOtherPayment: 0.00,
            total: 0.00,
            note: ''
            // },

        };
        this.arrayStaffRef = [];
        this.inputHarmonyPaymentRef = React.createRef();
        this.inputCreditPaymentRef = React.createRef();
        this.inputCashPaymentRef = React.createRef();
        this.inputOtherPaymentRef = React.createRef();
        this.totalCustomRef = React.createRef();
        this.scrollSRef = React.createRef();
    }


    scrollTo = (number) => {
        this.scrollSRef.current.scrollTo({ x: 0, y: scaleSzie(number), animated: true })
    }

    resetNoteFromParent = async () => {
        await this.setState({
            note: ''
        })
    }

    pushStaffIntoArrayStaff = ref => {
        if (ref) {
            this.arrayStaffRef.push(ref);
        }
    }

    handleReportTabFirst = () => {
        this.props.actions.invoice.getSettlementWating(false);
        const { paxMachineInfo } = this.props;
        const { ip, port, timeout, isSetup } = paxMachineInfo;
        if (isSetup) {
            PosLink.setupPax(ip, port, timeout);
            PosLink.reportTransaction(message => this.handleResponseReportTransactions(message));
        } else {
            this.props.actions.app.connectPaxMachineError("Don't have setup in Hardware Tab!");
        }
    }

    async handleResponseReportTransactions(message) {
        try {
            const result = JSON.parse(message);
            if (result.status == 0) {
                this.props.actions.app.connectPaxMachineError(result.message);
            } else {
                this.props.actions.app.ConnectPaxMachineSuccess();
                this.setState({
                    creditCount: result.CreditCount,
                    creditAmount: result.CreditAmount
                });
                if (this.inputCreditPaymentRef.current) {
                    const creditAmount = formatMoney(result.CreditAmount / 100);
                    this.inputCreditPaymentRef.current.setValueFromParent(creditAmount);
                }

            }
        } catch (error) {
            //console.log('error : ', error)
        }
    }

    gotoTabSecondSettle = async () => {
        const harmonyPayment = formatNumberFromCurrency(this.inputHarmonyPaymentRef.current.state.value);
        const creditPayment = formatNumberFromCurrency(this.inputCreditPaymentRef.current.state.value);
        const cashPayment = formatNumberFromCurrency(this.inputCashPaymentRef.current.state.value);
        const otherPayment = formatNumberFromCurrency(this.inputOtherPaymentRef.current.state.value);
        const total = formatMoney(parseFloat(harmonyPayment) + parseFloat(creditPayment) + parseFloat(cashPayment) + parseFloat(otherPayment));
        await this.setState({
            // settleTotal: {
            paymentByHarmony: this.inputHarmonyPaymentRef.current.state.value,
            paymentByCreditCard: this.inputCreditPaymentRef.current.state.value,
            paymentByCash: this.inputCashPaymentRef.current.state.value,
            otherPayment: this.inputOtherPaymentRef.current.state.value,
            total: total,
            note: this.state.note
            // }
        });
        this.props.gotoTabSecondSettle();
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

    updateTotalCustom = () => {
        const harmonyPayment = formatNumberFromCurrency(this.inputHarmonyPaymentRef.current.state.value);
        const creditPayment = formatNumberFromCurrency(this.inputCreditPaymentRef.current.state.value);
        const cashPayment = formatNumberFromCurrency(this.inputCashPaymentRef.current.state.value);
        const otherPayment = formatNumberFromCurrency(this.inputOtherPaymentRef.current.state.value);
        const total = formatMoney(parseFloat(harmonyPayment) + parseFloat(creditPayment) + parseFloat(cashPayment) + parseFloat(otherPayment));
        this.totalCustomRef.current.setStateFromParent(total);
    }

    onRefreshSettle = () => {
        this.props.actions.invoice.getSettlementWating(false);
        this.handleReportTabFirst();
    }

    setStateFromParent = () => {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { isGettingSettlement, settleWaiting } = this.props;
        if (prevProps.isGettingSettlement === "loading" && isGettingSettlement === "success" && !_.isEmpty(settleWaiting)) {
            await this.setState({
                editPaymentByHarmony: settleWaiting.paymentByHarmony ? settleWaiting.paymentByHarmony : 0.00,
                editPaymentByCreditCard: settleWaiting.paymentByCreditCard ? settleWaiting.paymentByCreditCard : 0.00,
                editPaymentByCash: settleWaiting.paymentByCash ? settleWaiting.paymentByCash : 0.00,
                editOtherPayment: settleWaiting.otherPayment ? settleWaiting.otherPayment : 0.00,
                total: settleWaiting.total ? settleWaiting.total : 0.00,
            });
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
    isGettingSettlement: state.invoice.isGettingSettlement
})



export default connectRedux(mapStateToProps, TabFirstSettle);