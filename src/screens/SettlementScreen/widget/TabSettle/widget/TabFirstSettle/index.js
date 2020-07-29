import React from 'react';
import { NativeModules, Alert, Keyboard } from 'react-native';
import _ from "ramda";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { formatNumberFromCurrency, formatMoney, scaleSzie, roundFloatNumber, requestAPI } from '@utils';
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
            isShowKeyboard: false
        };
        this.arrayStaffRef = [];
        this.inputHarmonyPaymentRef = React.createRef();
        this.inputCreditPaymentRef = React.createRef();
        this.inputCashPaymentRef = React.createRef();
        this.inputOtherPaymentRef = React.createRef();
        this.totalCustomRef = React.createRef();
        this.scrollRef = React.createRef();
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
    }

    keyboardDidShow = async () => {
        if(this.scrollRef.current){
            this.scrollRef.current.scrollToEnd();
        }
    }

    keyboardDidHide = async () => {
        this.scrollTo(0);
    }

    scrollTo = (number) => {
        if( this.scrollRef.current){
            this.scrollRef.current.scrollTo({ x: 0, y: scaleSzie(number), animated: true });
        }
        
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

    continueSettlement = () => {
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
                        "You have some appointments need completing before submit settlement. Do you want continue?",
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

    onRefreshSettle = () => {
        this.props.actions.invoice.getSettlementWating(false);
        this.handleReportTabFirst();
    }

    setStateFromParent = () => {

    }

    // ----------- New code -----------
    onPressStaff = (staffId) => {
        this.props.onPressStaff(staffId);
    }

    onPressGiftCardTotal = () => {
        this.props.onPressGiftCardTotal();
    }


    editCashAmount =() =>{

    }

    editOtherAmount =() =>{
        
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { isGettingSettlement, settleWaiting } = this.props;
        if (prevProps.isGettingSettlement === "loading" && isGettingSettlement === "success" && !_.isEmpty(settleWaiting)) {
            await this.setState({
                editPaymentByHarmony: settleWaiting.paymentByHarmony ? settleWaiting.paymentByHarmony : 0.00,
                editPaymentByCash: settleWaiting.paymentByCash ? settleWaiting.paymentByCash : 0.00,
                editOtherPayment: settleWaiting.otherPayment ? settleWaiting.otherPayment : 0.00,
                total: settleWaiting.total ? settleWaiting.total : 0.00,
                discountSettlement: settleWaiting.discount ? settleWaiting.discount : 0.00
            });
            this.props.actions.invoice.resetStateIsGettingSettlement();
        }
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
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