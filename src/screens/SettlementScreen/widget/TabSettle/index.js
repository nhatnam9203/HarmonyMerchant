import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TabSettle extends Layout {

    constructor(props) {
        super(props);
        this.state = {

        };
        this.scrollTabRef = React.createRef();
        this.tabFirstSettleRef = React.createRef();
        this.tabsecondSettleRef = React.createRef();
    }

    componentDidMount() {
        this.scrollTabRef.current.goToPage(0);
        this.props.actions.invoice.getSettlementWating();
    }

    gotoTabSecondSettle = () => {
        const settleTotal = this.tabFirstSettleRef.current.state.settleTotal;
        this.tabsecondSettleRef.current.setStateFromParent(settleTotal);
        this.scrollTabRef.current.goToPage(1);
    }

    backTabFirstSettle = () => {
        this.scrollTabRef.current.goToPage(0);
    }

    finishBatch =() =>{
        this.tabFirstSettleRef.current.resetNoteFromParent();
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