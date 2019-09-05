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
            progress: 0
        };
    }

    backTabFirstSettle = () => {
        this.props.backTabFirstSettle();
    }

    settle = async () => {
        await this.setState({
            numberFooter: 2,
        });
        setTimeout(() => {
            this.setState({
                progress: 0.5,
            });
        }, 100);
        //  ----- Hanle -----
        const { paxMachineInfo } = this.props;
        const { ip, port, timeout } = paxMachineInfo;

        PosLink.setupPax(ip, port, timeout);
        PosLink.batchTransaction(message => alert(message))
    }

    settle1 = () => {
        const { paxMachineInfo } = this.props;
        const { ip, port, timeout } = paxMachineInfo;

        PosLink.setupPax(ip, port, timeout);
        PosLink.reportTransaction((message) => console.log('message : ', message));
        PosLink.batchTransaction(message => console.log('message : ', message))

        // {
        //     CreditCount:3
        //     CreditAmount: 7726
        // }
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    paxMachineInfo: state.dataLocal.paxMachineInfo,
})



export default connectRedux(mapStateToProps, TabSecondSettle);