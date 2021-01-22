import React from 'react';
import { NativeModules, Alert, Platform } from 'react-native';
import _ from "ramda";
import env from 'react-native-config';
import SendSMS from 'react-native-sms';
import { parseString } from "react-native-xml2js";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    formatNumberFromCurrency, formatMoney, scaleSzie, roundFloatNumber, requestAPI, formatWithMoment
} from '@utils';
import apiConfigs from '@configs/api';

const PosLink = NativeModules.report;
const SettingPayment = NativeModules.setting;
const PoslinkAndroid = NativeModules.PoslinkModule;

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
            paymentByGiftcard: 0.00,
            total: 0.00,
            note: '',
            isShowKeyboard: false,
            isEditOtherAmount: false,
            isEditCashAmount: false,
            visible: false,
            isGetReportFromPax: true,
            terminalID: null,
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

    handleErrorPaxOnAndroid = (msgError) => {
        this.setState({
            visible: false,
            creditCount: 0,
            editPaymentByCreditCard: 0.00
        });
        this.props.actions.app.connectPaxMachineError(`${msgError}`);
    }

    handlePAXReport = () => {
        if (Platform.OS === "android") {
            this.handlePAXReport_Android();
        } else {
            this.handlePAXReport_IOS();
        }
    }

    handlePAXReport_Android = async () => {
        const { paxMachineInfo } = this.props;
        const { ip, port, timeout, isSetup } = paxMachineInfo;
        if (isSetup) {
            await this.setState({
                visible: true
            });
            let totalReport = 0;
            let totalRecord = 0;
            let isError = false;
            const tempEnv = env.IS_PRODUCTION;

            setTimeout(() => {
                PoslinkAndroid.startReport(ip, port, "", "LOCALDETAILREPORT", "ALL", "UNKNOWN", "UNKNOWN",
                    (err) => {
                        const errorDetailReport = JSON.parse(err);
                        this.handleErrorPaxOnAndroid(errorDetailReport?.Msg);
                    },
                    (data) => {
                        this.setState({
                            visible: false
                        });
                        const result = JSON.parse(data);
                        if (result?.ResultTxt && result?.ResultTxt == "OK") {
                            if (tempEnv == "Production" && result?.Message === "DEMO APPROVED") {
                                this.setState({
                                    visible: false,
                                    isGetReportFromPax: false
                                });

                                setTimeout(() => {
                                    alert("You're running your Pax on DEMO MODE!")
                                }, 500);
                                this.props.actions.app.connectPaxMachineError(`You're running your Pax on DEMO MODE!`);
                            } else {
                                totalRecord = result.TotalRecord ? parseInt(result.TotalRecord) : 0;
                                // ----------- Total Report --------
                                PoslinkAndroid.startReport(ip, port, "", "LOCALTOTALREPORT", "ALL", "UNKNOWN", "",
                                    (error) => {
                                        const errorTotalReport = JSON.parse(error);
                                        this.handleErrorPaxOnAndroid(errorTotalReport?.Msg);
                                    },
                                    (amountData) => {
                                        let amountResult = JSON.parse(amountData);
                                        totalReport = amountResult.CreditAmount ? parseFloat(amountResult.CreditAmount) : 0;
                                        this.props.actions.app.ConnectPaxMachineSuccess();
                                        const moneyInPax = formatMoney(roundFloatNumber(totalReport / 100));
                                        this.setState({
                                            creditCount: totalRecord,
                                            // editPaymentByCreditCard: moneyInPax
                                        });
                                        this.setState({
                                            visible: false,
                                            isGetReportFromPax: false
                                        });

                                        if (totalRecord = 0) {
                                            this.setState({
                                                editPaymentByCreditCard: 0.00
                                            });
                                        }
                                    });
                            }
                        }
                    }
                )
            }, 100);

        } else {
            this.props.actions.app.connectPaxMachineError("Don't have setup in Hardware Tab!");
            await this.setState({
                editPaymentByCreditCard: 0.00
            });
        }
    }

    handlePAXReport_IOS = async () => {
        const { paxMachineInfo } = this.props;
        const { name, ip, port, timeout, commType, bluetoothAddr, isSetup } = paxMachineInfo;

        if (isSetup) {
            await this.setState({
                visible: true
            });
            let totalReport = 0;
            let totalRecord = 0;
            let isError = false;

            try {
                const tempEnv = env.IS_PRODUCTION;
                SettingPayment.setupPax(commType, ip, port, "90000", bluetoothAddr);
                // ----------- Total Amount --------
                let data = await PosLink.reportTransaction("LOCALDETAILREPORT", "ALL", "UNKNOWN", "UNKNOWN");
                let result = JSON.parse(data);
                const ExtData = result?.ExtData || "";
                const xmlExtData = "<xml>" + ExtData.replace("\\n", "").replace("\\/", "/") + "</xml>";

                if (result?.ResultCode && result?.ResultCode == "000000") {
                    if (tempEnv == "Production" && result?.Message === "DEMO APPROVED") {
                        await this.setState({
                            visible: false,
                            isGetReportFromPax: false
                        });

                        setTimeout(() => {
                            alert("You're running your Pax on DEMO MODE!")
                        }, 500);

                        throw "You're running your Pax on DEMO MODE!"

                    } else {
                        totalRecord = parseInt(result?.TotalRecord || 0);

                        // ----------- Total Report --------
                        let amountData = await PosLink.reportTransaction("LOCALTOTALREPORT", "ALL", "UNKNOWN", "");
                        let amountResult = JSON.parse(amountData);
                        totalReport = parseFloat(amountResult?.CreditAmount || 0);

                        parseString(xmlExtData, (err, result) => {
                            if (err) {
                                this.handleRequestAPIByTerminalID(null);
                            } else {
                                const terminalID = `${result?.xml?.SN || null}`;
                                this.handleRequestAPIByTerminalID(terminalID);
                            }
                        });
                    }
                } else {
                    throw `${result.ResultTxt}`
                }

            } catch (error) {
                console.log("---- error: ", error);
                isError = true;
                this.handleRequestAPIByTerminalID(null);
                this.props.actions.app.connectPaxMachineError(`${error}`);
            }

            if (!isError) {
                this.props.actions.app.ConnectPaxMachineSuccess();
                // this.props.actions.app.updatePaxTerminalID("");
                const moneyInPax = formatMoney(roundFloatNumber(totalReport / 100));
                await this.setState({
                    creditCount: totalRecord,
                    // editPaymentByCreditCard: moneyInPax
                });
            }

            await this.setState({
                visible: false,
                isGetReportFromPax: false
            });

            if (totalRecord = 0) {
                await this.setState({
                    editPaymentByCreditCard: 0.00
                });
            };

        } else {
            this.handleRequestAPIByTerminalID(null);
            this.props.actions.app.connectPaxMachineError("Don't have setup in Hardware Tab!");
            await this.setState({
                editPaymentByCreditCard: 0.00
            });
        }
    }

    continueSettlement = () => {
        const { settleWaiting } = this.props;
        const { creditCount, editPaymentByHarmony, editPaymentByCreditCard,
            editPaymentByCash, editOtherPayment, note, discountSettlement, paymentByGiftcard
        } = this.state;
        this.props.gotoTabSecondSettle({
            paymentByHarmony: editPaymentByHarmony,
            paymentByCreditCard: editPaymentByCreditCard,
            paymentByCash: editPaymentByCash,
            otherPayment: editOtherPayment,
            discount: discountSettlement,
            paymentByCashStatistic: settleWaiting.paymentByCash ? settleWaiting.paymentByCash : 0.00,
            otherPaymentStatistic: settleWaiting.otherPayment ? settleWaiting.otherPayment : 0.00,
            paymentByGiftcard: paymentByGiftcard,
            total: roundFloatNumber(
                formatNumberFromCurrency(editPaymentByHarmony) +
                formatNumberFromCurrency(editPaymentByCreditCard) +
                formatNumberFromCurrency(editPaymentByCash) +
                formatNumberFromCurrency(editOtherPayment) +
                formatNumberFromCurrency(discountSettlement) +
                formatNumberFromCurrency(paymentByGiftcard)
            ),
            note,
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
        this.handlePAXReport();
    }

    handleRequestAPIByTerminalID = (terminalID) => {
        this.setState({
            terminalID
        });
        this.props.actions.app.updatePaxTerminalID(terminalID ? terminalID : "");
        this.props.actions.invoice.getSettlementWating(terminalID);
        this.props.actions.invoice.getListStaffsSales(terminalID);
        this.props.actions.invoice.getListGiftCardSales(terminalID);
        if (terminalID) {
            this.props.actions.app.ConnectPaxMachineSuccess();
        }
    }

    sendTotalViaSMS = async (data) => {
        try {
            const { listStaffByMerchant } = this.props;
            const staffInfo = listStaffByMerchant.find(staff => staff.staffId === data.staffId);
            if (staffInfo) {
                const displayName = staffInfo.displayName ? staffInfo.displayName : "";
                const total = data.total ? data.total : 0.00;
                const phone = staffInfo.phone ? staffInfo.phone : "";
                const today = formatWithMoment(new Date(), "MM/DD/YYYY");

                SendSMS.send({
                    body: `Hello ${displayName}, your total today ${today} is $${total}. Thank you :)`,
                    recipients: [`${phone}`],
                    successTypes: ['sent', 'queued'],
                    allowAndroidSendWithoutReadPermission: true,
                    // attachment: attachment,
                }, (completed, cancelled, error) => {
                    // console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
                });
            }

        } catch (error) {
            // alert(error)
        }
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { isGettingSettlement, settleWaiting, isHandleInternalFirstSettlemetTab } = this.props;

        if (isHandleInternalFirstSettlemetTab && prevProps.isHandleInternalFirstSettlemetTab !== isHandleInternalFirstSettlemetTab) {
            this.props.actions.invoice.resetInternalFirstSettlementState(false);
            this.handlePAXReport();
        }

        if (prevProps.isGettingSettlement === "loading" && isGettingSettlement === "success" && !_.isEmpty(settleWaiting) && !isHandleInternalFirstSettlemetTab) {
            this.props.actions.app.changeFlagVisibleEnteerPinCode(false);
            this.props.actions.invoice.resetStateIsGettingSettlement();
            await this.setState({
                editPaymentByHarmony: settleWaiting?.paymentByHarmony || 0.00,
                editPaymentByCash: settleWaiting?.paymentByCash || 0.00,
                editOtherPayment: settleWaiting?.otherPayment || 0.00,
                total: settleWaiting?.total || 0.00,
                discountSettlement: settleWaiting?.discount || 0.00,
                editPaymentByCreditCard: settleWaiting?.paymentByCreditCard || 0.00,
                paymentByGiftcard: settleWaiting?.paymentByGiftcard || 0.00,
            });
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
    gitfCardSales: state.invoice.gitfCardSales,
    listStaffByMerchant: state.staff.listStaffByMerchant,
    isHandleInternalFirstSettlemetTab: state.invoice.isHandleInternalFirstSettlemetTab
})



export default connectRedux(mapStateToProps, TabFirstSettle);