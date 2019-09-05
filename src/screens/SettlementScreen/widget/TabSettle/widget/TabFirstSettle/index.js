import React from 'react';
import { NativeModules } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

const PosLink = NativeModules.MyApp;

class TabFirstSettle extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            creditCount: 0,
            creditAmount: 0
        };
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

    gotoTabSecondSettle = () => {
        this.props.gotoTabSecondSettle();
    }
}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    paxMachineInfo: state.dataLocal.paxMachineInfo,
})



export default connectRedux(mapStateToProps, TabFirstSettle);