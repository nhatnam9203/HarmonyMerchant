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


    onDidFocus = () => {
        this.tabFirstSettleRef.current.handleReportTabFirst();
    }

    gotoTabSecondSettle = (settlement,creditCount) => {
        this.scrollTabRef.current.goToPage(1);
        if(this.tabsecondSettleRef.current){
            this.tabsecondSettleRef.current.setStateFromParent(settlement,creditCount);
        }else{
            setTimeout(() => {
                this.tabsecondSettleRef.current.setStateFromParent(settlement,creditCount);
            }, 500);
        }
        

    }

    backTabFirstSettle = () => {
        this.scrollTabRef.current.goToPage(0);
    }

    finishBatch = () => {
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