import React from 'react';
import { NativeModules } from 'react-native';
import _, { values } from "ramda";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { formatNumberFromCurrency, formatMoney, scaleSzie, roundFloatNumber } from '@utils';


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
        // this.props.actions.invoice.getSettlementWating(false);
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
                const moneyInPax = formatMoney(roundFloatNumber(result.CreditAmount / 100))
                await this.setState({
                    creditCount: result.CreditCount,
                    creditAmount: result.CreditAmount,
                    editPaymentByCreditCard: moneyInPax
                });

            }
        } catch (error) {
            //console.log('error : ', error)
        }
    }

    gotoTabSecondSettle = async () => {
        const { creditCount, editPaymentByHarmony, editPaymentByCreditCard, editPaymentByCash, editOtherPayment, note } = this.state;
        this.props.gotoTabSecondSettle({
            paymentByHarmony: editPaymentByHarmony,
            paymentByCreditCard: editPaymentByCreditCard,
            paymentByCash: editPaymentByCash,
            otherPayment: editOtherPayment,
            total: roundFloatNumber(
                formatNumberFromCurrency(editPaymentByHarmony) +
                formatNumberFromCurrency(editPaymentByCreditCard) +
                formatNumberFromCurrency(editPaymentByCash) +
                formatNumberFromCurrency(editOtherPayment)
            ),
            note
        },creditCount);
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
                // editPaymentByCreditCard: settleWaiting.paymentByCreditCard ? settleWaiting.paymentByCreditCard : 0.00,
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