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
            creditAmount: 0,
        };
        this.arrayStaffRef = [];
    }

    onDidFocus = (payload) => {
        this.handleReport();
    }

    pushStaffIntoArrayStaff = ref => {
        if (ref) {
            this.arrayStaffRef.push(ref);
        }
    }

    handleReport() {
        const { paxMachineInfo } = this.props;
        const { ip, port, timeout, isSetup } = paxMachineInfo;
        if (isSetup) {
            // PosLink.setupPax(ip, port, timeout);
            // PosLink.reportTransaction(message => this.handleResponseReportTransactions(message));
        } else {
            // alert('Please setup your pax machine in setting');
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
            // console.log('error : ', error)
        }
    }

    gotoTabSecondSettle = () => {
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

    componentDidUpdate(prevProps, prevState) {
        const { loading, isGetSettleWaiting } = this.props;
        if (!loading && loading !== prevProps.loading && isGetSettleWaiting) {

        }

    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    paxMachineInfo: state.dataLocal.paxMachineInfo,
    settleWaiting: state.invoice.settleWaiting,
    invoicesOfStaff: state.invoice.invoicesOfStaff,
    isGetSettleWaiting: state.invoice.isGetSettleWaiting,
    loading: state.app.loading
})



export default connectRedux(mapStateToProps, TabFirstSettle);