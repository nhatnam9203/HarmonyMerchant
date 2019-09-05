import React from 'react';
import { NativeModules } from 'react-native';

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
            creditAmount: 0
        };
    }

    componentDidMount() {
        this.handleReport();
    }

    onDidFocus = (payload) => {
        this.handleReport();
    }

    handleReport() {
        const { paxMachineInfo } = this.props;
        const { ip, port, timeout, isSetup } = paxMachineInfo;
        if (isSetup) {
            PosLink.setupPax(ip, port, timeout);
            PosLink.reportTransaction(message => this.handleResponseReportTransactions(message));
        } else {
            alert('Please setup your pax machine in setting');
        }
    }

    async handleResponseReportTransactions(message) {
        try {
            const result = JSON.parse(message);
            if (result.status == 0) {
                alert(result.message);
            } else {
                this.setState({
                    creditCount: result.CreditCount,
                    creditAmount: result.CreditAmount
                })
            }
        } catch (error) {
            console.log('error : ', error)
        }
    }

    backTabFirstSettle = () => {
        this.props.backTabFirstSettle();
    }

    reviewBatchHistory = () =>{
        this.props.reviewBatchHistory();
    }

    settle = async () => {
        const { paxMachineInfo } = this.props;
        const { ip, port, timeout, isSetup } = paxMachineInfo;
        if (isSetup) {
            await this.setState({
                numberFooter: 2,
            });
            setTimeout(() => {
                this.setState({
                    progress: 0.5,
                });
            }, 100);
            PosLink.setupPax(ip, port, timeout);
            PosLink.batchTransaction(message => this.handleResponseBatchTransactions(message));
        } else {
            alert('Please setup your pax machine in setting');
        }
    }

    async handleResponseBatchTransactions(message) {
        try {
            const result = JSON.parse(message);
            if (result.status == 0) {
                this.setState({
                    numberFooter: 1,
                    progress: 0,
                })
                alert(result.message);
            } else {
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
            console.log('message : ', result);
        } catch (error) {
            console.log('error : ', error)
        }
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    paxMachineInfo: state.dataLocal.paxMachineInfo,
})



export default connectRedux(mapStateToProps, TabSecondSettle);