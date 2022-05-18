import { NativeModules, Alert, Platform, NativeEventEmitter } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    REMOTE_APP_ID,
    APP_NAME,
    POS_SERIAL,
    localize,
    PaymentTerminalType,
    requestSettlementDejavoo,
    roundFloatNumber,
    requestAPI,
    formatNumberFromCurrency,
  } from '@utils';
  import Configs from "@configs";
import * as l from "lodash";
import { parseString } from "react-native-xml2js";

const PosLink = NativeModules.batch;
const PosLinkReport = NativeModules.report;
const PoslinkAndroid = NativeModules.PoslinkModule;
const { clover } = NativeModules;

const INIT_STATE = {
    numberFooter: 1,
    progress: 0,
    creditCount: 0,
    creditAmount: 0,
    settleTotal: {
        paymentByHarmony: 0.00,
        paymentByCreditCard: 0.00,
        paymentByCash: 0.00,
        otherPayment: 0.00,
        discount: 0.00,
        total: 0.00,
        note: ``,
        paymentByCashStatistic: 0.00,
        otherPaymentStatistic: 0.00,
        paymentByGiftcard: 0.00,
        depositedAmount: 0.00,
        terminalID: null

    },
    errorMessage: '',
    paxErrorMessage: '',
}

class TabSecondSettle extends Layout {

    constructor(props) {
        super(props);
        this.state = INIT_STATE;

        //ADD LISTENER FROM CLOVER MODULE
        this.eventEmitter = new NativeEventEmitter(clover);
        this.subscriptions = []
        this.isProcessCloseBatchClover = false
    }

    registerEvents () {
        const { language } = this.props;
        clover.changeListenerStatus(true)
        this.subscriptions = [
          this.eventEmitter.addListener('closeoutSuccess', data => {
            if (this.isProcessCloseBatchClover) {
                this.isProcessCloseBatchClover = false
                this.props.actions.app.stopLoadingApp();
                this.proccessingSettlement("[]");
            }

          }),
          this.eventEmitter.addListener('closeoutFail', data => {
              if (this.isProcessCloseBatchClover) {
                this.props.actions.app.stopLoadingApp();
                this.isProcessCloseBatchClover = false
                this.setState({
                    numberFooter: 1,
                    progress: 0,
                })

                this.props.actions.app.connectPaxMachineError(
                    l.get(data, 'errorMessage')
                );

                this.confirmSettleWithoutTerminalPayment()
              }

           }),
          this.eventEmitter.addListener('pairingCode', data => {
            if(data){
              const text = `Pairing code: ${l.get(data, 'pairingCode')}`
              if(this.isProcessCloseBatchClover) {
                this.props.actions.app.stopLoadingApp();

              }
            }
          }),
          this.eventEmitter.addListener('pairingSuccess', data => {
            this.props.actions.hardware.setCloverToken(
              l.get(data, 'token')
            );
            if(this.isProcessCloseBatchClover) {
                this.props.actions.app.loadingApp();
            }
          }),

          this.eventEmitter.addListener('deviceDisconnected', () => {
            if(this.isProcessCloseBatchClover) {
                this.props.actions.app.stopLoadingApp();
                this.isProcessCloseBatchClover = false
                this.setState({
                    numberFooter: 1,
                    progress: 0,
                })
                this.props.actions.app.connectPaxMachineError(
                    localize("No connected device", language)
                  );
                this.confirmSettleWithoutTerminalPayment()
                clover.cancelTransaction();
            }
          }),
        ]
      }

      unregisterEvents () {
        this.subscriptions.forEach(e => e.remove())
        this.subscriptions = []
      }

      componentDidMount() {

        this.registerEvents()
      }

      componentWillUnmount() {
        this.unregisterEvents()
      }

    resetStateFromParent = () => {
        this.setState(INIT_STATE)
    }

    setStateFromParent = async (settleTotal, creditCount) => {
        await this.setState({
            settleTotal,
            creditCount
        })
    }

    async handleResponseReportTransactions(message) {
        try {
            const result = JSON.parse(message);
            if (result.status == 0) {
                this.props.actions.app.connectPaxMachineError(result.message);
                this.setState({
                    paxErrorMessage: result.message,
                    errorMessage: `-${result.message}`,
                })
            } else {
                this.props.actions.app.ConnectPaxMachineSuccess();
                this.setState({
                    creditCount: result.CreditCount,
                    creditAmount: result.CreditAmount,
                    paxErrorMessage: '',
                    errorMessage: ''
                })
            }
        } catch (error) {
        }
    }

    backTabFirstSettle = () => {
        this.props.backTabFirstSettle();
        this.setState({
            errorMessage: '',
            paxErrorMessage: ''
        })
    }

    reviewBatchHistory = () => {
        this.props.reviewBatchHistory();
    }

    finishBatch = () => {
        this.props.actions.invoice.resetSettle();
        this.props.backTabFirstSettle();
        this.props.finishBatch();
        this.setState({
            numberFooter: 1,
            progress: 0,
            creditCount: 0,
            creditAmount: 0,
            errorMessage: '',
            paxErrorMessage: ''
        });
    }

    handleErrorBatchOnAndroid = async (errorMsg) => {
        this.setState({
            numberFooter: 1,
            progress: 0,
        })
        await this.setState({
            paxErrorMessage: errorMsg
        })
    }

    settle = async () => {
        const { paxMachineInfo,
                settleWaiting,
                cloverMachineInfo,
                dejavooMachineInfo,
                paymentMachineType,
                invoice,
             } = this.props;
        const { name, ip, port, timeout, commType, bluetoothAddr, isSetup } = paxMachineInfo;
        const { creditCount, settleTotal } = this.state;

        if (paymentMachineType == PaymentTerminalType.Clover
            && l.get(cloverMachineInfo, "isSetup")) {
            //Clover
            await this.setState({
                numberFooter: 2,
                errorMessage: '',
                paxErrorMessage: ''
            });
            setTimeout(() => {
                this.setState({
                    progress: 0.5,
                });
            }, 100);
            const port = l.get(cloverMachineInfo, 'port') ? l.get(cloverMachineInfo, 'port') : 80
            const url = `wss://${l.get(cloverMachineInfo, 'ip')}:${port}/remote_pay`
            this.isProcessCloseBatchClover = true
            this.props.actions.app.loadingApp();
            clover.closeout({
                url,
                remoteAppId: REMOTE_APP_ID,
                appName: APP_NAME,
                posSerial: POS_SERIAL,
                token: l.get(cloverMachineInfo, 'token') ? l.get(cloverMachineInfo, 'token', '') : "",
              })
        } else if(paymentMachineType == PaymentTerminalType.Dejavoo
            && l.get(dejavooMachineInfo, "isSetup")){
            this.props.actions.app.loadingApp();
            const responses = await requestSettlementDejavoo();

            this.handleResponseSettlementDejavoo(responses);

        } else if (isSetup && settleTotal?.terminalID) {
            //Pax
            await this.setState({
                numberFooter: 2,
                errorMessage: '',
                paxErrorMessage: ''
            });
            setTimeout(() => {
                this.setState({
                    progress: 0.5,
                });
            }, 100);
            if (Platform.OS === "android") {
                PoslinkAndroid.batchTransaction(ip, port, "", "BATCHCLOSE",
                    (err) => {
                        this.handleErrorBatchOnAndroid(err);
                    },
                    (data) => {
                        this.proccessingSettlement();
                    });
            } else {

                    const tempIpPax = commType == "TCP" ? ip : "";
                    const tempPortPax = commType == "TCP" ? port : "";
                    const idBluetooth = commType === "TCP" ? "" : bluetoothAddr;
                    const paymentTransaction = settleWaiting?.paymentTransaction?.length || 0;
                    const responseData = [];

                    //Close check duplicate transactions when close batch
                    // if (creditCount != paymentTransaction) {
                    //     this.props.actions.app.loadingApp();
                    //     try {
                    //         for (let i = 1; i <= creditCount; i++) {
                    //             let data = await PosLinkReport.reportTransaction({
                    //                 transType: "LOCALDETAILREPORT",
                    //                 edcType: "ALL",
                    //                 cardType: "",
                    //                 paymentType: "",
                    //                 commType: commType,
                    //                 destIp: tempIpPax,
                    //                 portDevice: tempPortPax,
                    //                 timeoutConnect: "90000",
                    //                 bluetoothAddr: idBluetooth,
                    //                 refNum: `${i}`
                    //             });
                    //             let result = JSON.parse(data);
                    //             responseData.push(result);
                    //         }
                    //     } catch (error) {
                    //         this.setState({errorMessage: "Get report error"})
                    //         this.props.actions.app.stopLoadingApp();
                    //         // console.log("---- error: ", error);
                    //     }
                    // };
                    this.props.actions.app.stopLoadingApp();
                    this.setState({errorMessage: "Begin close batch"})

                    PosLink.batchTransaction({
                        transType: "BATCHCLOSE",
                        edcType: "ALL",
                        commType: commType,
                        destIp: tempIpPax,
                        portDevice: tempPortPax,
                        timeoutConnect: "90000",
                        bluetoothAddr: idBluetooth
                    },
                        message => this.handleResponseBatchTransactions(message, responseData));
            }

        } else {
            this.confirmSettleWithoutTerminalPayment()
        }
    }

    handleResponseSettlementDejavoo = (responses) => {
        const { invoice } = this.props;
        parseString(responses, (err, result) => {
            const errorCode = l.get(result, 'xmp.response.0.ResultCode.0')
            if (err || errorCode != 0) {
              if(errorCode == "999") {
                
                  requestSettlementDejavoo().then((responseSettle) => {
                    this.handleResponseReportSettlement(responseSettle)
                })

              } else {
                const resultTxt = `${l.get(result, 'xmp.response.0.Message.0')}`
                                || "Error";
                this.props.actions.app.stopLoadingApp();
                this.setState({
                    numberFooter: 1,
                    progress: 0,
                    })

                this.props.actions.app.connectPaxMachineError(resultTxt);
                this.confirmSettleWithoutTerminalPayment()
              }
            } else {
                this.proccessingSettlement("[]");
            }
        })
    }

    handleResponseReportSettlement = (responses) => {
        parseString(responses, (err, result) => {
            const errorCode = l.get(result, 'xmp.response.0.ResultCode.0')
            const extraData = l.get(result, "xmp.response.0.ExtData.0").split(",");
            let resultLastSettle = -1
            if (extraData) {
              const findIndex = l.findIndex(extraData, item => {
                return item.includes("ResultCode")
              })
              resultLastSettle = findIndex > -1 ? extraData[findIndex].replace("ResultCode=", "") : -1;
            }
            if (errorCode == 0 && resultLastSettle == 0) {
                this.proccessingSettlement("[]");
            }else {
                alert("Settlement Error")
            }
        })
    }

    confirmSettleWithoutTerminalPayment = () => {
        const { paymentMachineType } = this.props;
        Alert.alert(
            'Unable to connect to payment terminal or not found any transaction on your payment terminal, Do you want to continue without payment terminal?',
            '',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel'
                },
                { text: 'OK', onPress: () => {
                    if (paymentMachineType != PaymentTerminalType.Pax) {
                        const { token, deviceId, deviceName } = this.props.dataLocal;
                        requestAPI({
                            type: "GET_SETTLEMENT_WAITING",
                            method: "GET",
                            api: `${Configs.API_URL}settlement/waiting?sn=${null}`,
                            token,
                            deviceName,
                            deviceId,
                        }).then((settleWaitingResponse) => {

                            if (l.get(settleWaitingResponse, 'codeNumber') == 200) {
                                const settleWaiting = l.get(settleWaitingResponse, "data");
                                const editPaymentByHarmony = settleWaiting?.paymentByHarmony || 0.0;
                                const editPaymentByCash = settleWaiting?.paymentByCash || 0.0;
                                const editOtherPayment = settleWaiting?.otherPayment || 0.0;
                                const discountSettlement = settleWaiting?.discount || 0.0;
                                const editPaymentByCreditCard = settleWaiting?.paymentByCreditCard || 0.0;
                                const paymentByGiftcard = settleWaiting?.paymentByGiftcard || 0.0;
                                const depositedAmount = settleWaiting?.depositedAmount || 0.0;
                                const settleTotal = {
                                    paymentByHarmony: editPaymentByHarmony,
                                    paymentByCreditCard: editPaymentByCreditCard,
                                    paymentByCash: editPaymentByCash,
                                    otherPayment: editOtherPayment,
                                    discount: discountSettlement,
                                    paymentByCashStatistic: editPaymentByCash,
                                    otherPaymentStatistic: editOtherPayment,
                                    paymentByGiftcard: paymentByGiftcard,
                                    depositedAmount: depositedAmount,
                                    total: roundFloatNumber(
                                    formatNumberFromCurrency(editPaymentByHarmony) +
                                        formatNumberFromCurrency(editPaymentByCreditCard) +
                                        formatNumberFromCurrency(editPaymentByCash) +
                                        formatNumberFromCurrency(editOtherPayment) +
                                        formatNumberFromCurrency(discountSettlement) +
                                        formatNumberFromCurrency(paymentByGiftcard)
                                    ),
                                    note: "",
                                    terminalID: null,
                                };
                                const body = { ...settleTotal, checkout: settleWaiting.checkout, isConnectPax: false, responseData: '[]' };

                                this.setState({
                                    numberFooter: 2,
                                    errorMessage: '',
                                    paxErrorMessage: ''
                                });
                                setTimeout(() => {
                                    this.setState({
                                        progress: 0.5,
                                    });
                                }, 100);

                                this.props.actions.invoice.settleBatch(body);
                            }

                        });
                    } else {
                        //Pax
                        this.proccessingSettlement("[]")
                    }
                } }
            ],
            { cancelable: false }
        );
    }

    proccessingSettlement = async (responseData) => {
        const {
            settleWaiting,
            connectPAXStatus,
            paymentMachineType
        } = this.props;
        const { settleTotal } = this.state;
        const { status, message } = connectPAXStatus;
        const isConnectPax = status && message && message == "( Payment terminal successfully connected! )" ? true : false;

        const body = { ...settleTotal, checkout: settleWaiting.checkout, isConnectPax, responseData };

        this.setState({
            numberFooter: 2,
            errorMessage: '',
            paxErrorMessage: ''
        });
        setTimeout(() => {
            this.setState({
                progress: 0.5,
            });
        }, 100);

        this.props.actions.invoice.settleBatch(body);
    }

    async handleResponseBatchTransactions(message, responseData) {

        try {
            const result = JSON.parse(message);
            this.setState({errorMessage: "Close batch response"})
            if (result.status == 0) {
                this.setState({
                    numberFooter: 1,
                    progress: 0,
                })
                await this.setState({
                    paxErrorMessage: result.message
                })
            } else {
                this.proccessingSettlement(responseData);
            }
        } catch (error) {
        }
    }

    settleSuccsess = async () => {
        await this.setState({
            progress: 1,
            creditCount: 0
        });

        setTimeout(() => {
            this.setState({
                numberFooter: 3
            })
        })
    }

    settleFail = async () => {
        await this.setState({
            progress: 0,
            numberFooter: 1
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { isSettleBatch } = this.props;
        if (prevProps.isSettleBatch !== isSettleBatch && isSettleBatch !== null) {
            this.props.actions.invoice.resetStateSettleBatch();
            if (isSettleBatch === "success") {
                this.settleSuccsess();
            } else if (isSettleBatch === "fail") {
                this.settleFail();
            }
        }
    }

}

const mapStateToProps = state => ({
    dataLocal: state.dataLocal,
    language: state.dataLocal.language,
    paxMachineInfo: state.hardware.paxMachineInfo,
    settleWaiting: state.invoice.settleWaiting,
    isSettleBatch: state.invoice.isSettleBatch,
    connectPAXStatus: state.app.connectPAXStatus,
    cloverMachineInfo: state.hardware.cloverMachineInfo,
    dejavooMachineInfo: state.hardware.dejavooMachineInfo,
    paymentMachineType: state.hardware.paymentMachineType,
    invoice: state.invoice,
})



export default connectRedux(mapStateToProps, TabSecondSettle);
