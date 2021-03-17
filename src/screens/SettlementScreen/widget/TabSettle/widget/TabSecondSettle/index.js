import { NativeModules, Alert, Platform } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

const PosLink = NativeModules.batch;
const PoslinkAndroid = NativeModules.PoslinkModule;

class TabSecondSettle extends Layout {

    constructor(props) {
        super(props);
        this.state = {
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

            },
            errorMessage: '',
            paxErrorMessage: ''
        };
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
        const { paxMachineInfo } = this.props;
        const { name, ip, port, timeout, commType, bluetoothAddr, isSetup } = paxMachineInfo;

        if (isSetup) {
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

                PosLink.batchTransaction({
                    transType: "BATCHCLOSE",
                    edcType: "ALL",
                    commType: commType,
                    destIp: tempIpPax,
                    portDevice: tempPortPax,
                    timeoutConnect: "90000",
                    bluetoothAddr: idBluetooth
                },
                    message => this.handleResponseBatchTransactions(message));
            }

        } else {
            Alert.alert(
                'Unable to connect to PAX, Do you want to continue without PAX?',
                '',
                [

                    {
                        text: 'Cancel',
                        onPress: () => { },
                        style: 'cancel'
                    },
                    { text: 'OK', onPress: () => this.proccessingSettlement() }
                ],
                { cancelable: false }
            );
        }
    }

    proccessingSettlement = async () => {
        const { settleWaiting, connectPAXStatus } = this.props;
        const { settleTotal } = this.state;
        const { status, message } = connectPAXStatus;
        const isConnectPax = status && message && message == "( Pax terminal successfully connected! )" ? true : false;
        const body = { ...settleTotal, checkout: settleWaiting.checkout, isConnectPax };

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


    async handleResponseBatchTransactions(message) {
        try {
            const result = JSON.parse(message);
            if (result.status == 0) {
                this.setState({
                    numberFooter: 1,
                    progress: 0,
                })
                await this.setState({
                    paxErrorMessage: result.message
                })
            } else {
                this.proccessingSettlement();
            }
        } catch (error) {
        }
    }

    settleSuccsess = async () => {
        await this.setState({
            progress: 1
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
    language: state.dataLocal.language,
    paxMachineInfo: state.hardware.paxMachineInfo,
    settleWaiting: state.invoice.settleWaiting,
    isSettleBatch: state.invoice.isSettleBatch,
    connectPAXStatus: state.app.connectPAXStatus,
})



export default connectRedux(mapStateToProps, TabSecondSettle);