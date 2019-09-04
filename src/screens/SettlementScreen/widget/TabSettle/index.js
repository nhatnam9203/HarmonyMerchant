import React from 'react';
import { Alert, NativeModules } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

const PosLink = NativeModules.MyApp;

class TabSettle extends Layout {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    settle = () => {
        const { paxMachineInfo } = this.props;
        const { ip, port, timeout } = paxMachineInfo;

        // 1. Check setup pax 
        PosLink.setupPax(ip, port, timeout);

        PosLink.reportTransaction((message) => console.log('message : ', message));
        // PosLink.batchTransaction(message => console.log('message : ', message))

        // {
        //     CreditCount:3
        //     CreditAmount: 7726
        // }
    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    servicesByMerchant: state.service.servicesByMerchant,
    categoriesByMerchant: state.category.categoriesByMerchant,
    listServicesSearch: state.service.listServicesSearch,
    isShowSearchService: state.service.isShowSearchService,
    refreshListServices: state.service.refreshListServices,
    isGetListSearchService: state.service.isGetListSearchService,
    paxMachineInfo: state.dataLocal.paxMachineInfo,
})



export default connectRedux(mapStateToProps, TabSettle);