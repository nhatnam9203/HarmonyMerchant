import React from 'react';
import { NativeModules, Alert } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

const PosLink = NativeModules.MyApp;

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
                total: 0.00,
                note: ''
            },
            errorMessage: '',
            paxErrorMessage: ''
        };
    }

    setStateFromParent = (settleTotal, creditCount) => {
        this.setState({
            settleTotal,
            creditCount
        })
    }

    handleReport() {
        const { paxMachineInfo } = this.props;
        const { ip, port, timeout, isSetup } = paxMachineInfo;
        if (isSetup) {
            PosLink.setupPax(ip, port, timeout);
            PosLink.reportTransaction(message => this.handleResponseReportTransactions(message));
        } else {
            // alert('Please connect your Pax to take payment.');
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

    proccessingSettlement =async  () =>{
        const { settleWaiting } = this.props;
        const { settleTotal } = this.state;
        const body = { ...settleTotal, checkout: settleWaiting.checkout };
        this.props.actions.invoice.settleBatch(body);
        await this.setState({
            progress: 1
        })
        setTimeout(() => {
            this.setState({
                numberFooter: 3,
            });
        }, 400)
        setTimeout(() => {
            this.setState({
                progress: 0,
            });
        }, 700)
    }


    async handleResponseReportTransactions(message) {
        // console.log('Second : ', message);
        try {
            const result = JSON.parse(message);
            if (result.status == 0) {
                //console.log('error Second : ',messageee);
                this.setState({
                    paxErrorMessage: result.message,
                    errorMessage: `-${result.message}`,
                })
            } else {
                this.setState({
                    creditCount: result.CreditCount,
                    creditAmount: result.CreditAmount,
                    paxErrorMessage: '',
                    errorMessage: ''
                })
            }
        } catch (error) {
            //console.log('error : ', error)
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
        })
    }

    settle = async () => {
        const { paxMachineInfo } = this.props;
        const { ip, port, timeout, isSetup } = paxMachineInfo;
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
            PosLink.setupPax(ip, port, timeout);
            PosLink.batchTransaction(message => this.handleResponseBatchTransactions(message));
        } else {
            // alert('Please connect your Pax to take payment.');
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
        const { settleWaiting } = this.props;
        const { settleTotal } = this.state;
        const body = { ...settleTotal, checkout: settleWaiting.checkout };
        this.props.actions.invoice.settleBatch(body);
        await this.setState({
            progress: 1
        })
        setTimeout(() => {
            this.setState({
                numberFooter: 3,
            });
        }, 400)
        setTimeout(() => {
            this.setState({
                progress: 0,
            });
        }, 700)
    }

    async handleResponseBatchTransactions(message) {
        try {
            const result = JSON.parse(message);
            if (result.status == 0) {
                this.setState({
                    numberFooter: 1,
                    progress: 0,
                })
                // alert(result.message);
                await this.setState({
                    paxErrorMessage: result.message
                })
            } else {
                const { settleWaiting } = this.props;
                const { settleTotal } = this.state;
                const body = { ...settleTotal, checkout: settleWaiting.checkout };
                this.props.actions.invoice.settleBatch(body);
                await this.setState({
                    progress: 1
                })
                setTimeout(() => {
                    this.setState({
                        numberFooter: 3,
                    });
                }, 400)
                setTimeout(() => {
                    this.setState({
                        progress: 0,
                    });
                }, 700)
            }
        } catch (error) {
        }
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    paxMachineInfo: state.dataLocal.paxMachineInfo,
    settleWaiting: state.invoice.settleWaiting,
})



export default connectRedux(mapStateToProps, TabSecondSettle);